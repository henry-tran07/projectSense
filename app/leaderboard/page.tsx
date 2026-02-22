"use client";
import { db } from "@/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import { problemSet } from "@/app/utils/problemGenerator";
import { FaTrophy, FaCrown } from "react-icons/fa";
import MathComponent from "../components/MathComponent";
import { PageHeader } from "@/app/components/PageHeader";
import { PageShell } from "@/app/components/PageShell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ScoreEntry {
  time: string;
  email: string;
}

const Home = () => {
  const [currentBoard, setCurrentBoard] = useState(1);
  const keys = useMemo(() => Object.keys(problemSet).map(Number), []);
  const [sortedScores, setSortedScores] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const compareTimes = (time1: string, time2: string): number => {
    const [min1, secMs1] = time1.split(":");
    const [sec1, ms1] = secMs1.split(".").map(parseFloat);
    const [min2, secMs2] = time2.split(":");
    const [sec2, ms2] = secMs2.split(".").map(parseFloat);

    const totalMs1 = parseFloat(min1) * 60000 + sec1 * 1000 + ms1;
    const totalMs2 = parseFloat(min2) * 60000 + sec2 * 1000 + ms2;

    return totalMs1 - totalMs2;
  };

  useEffect(() => {
    const sortScoresByTime = (scores: string[]): string[] => {
      const scoreEntries: ScoreEntry[] = scores.map((score) => {
        const [time, email] = score.split(" ");
        return { time, email };
      });

      scoreEntries.sort((a, b) => compareTimes(a.time, b.time));

      const sortedScores = scoreEntries.map((entry) => `${entry.time} ${entry.email}`);

      return sortedScores;
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(collection(db, "leaderboard"), String(currentBoard));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const map = data.scores;
          const resultArray = Object.entries(map).map(([key, value]) => `${value} ${key}`);
          const performSort = sortScoresByTime(resultArray);
          setSortedScores(performSort);
        } else {
          setSortedScores([]);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setSortedScores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentBoard]);

  return (
    <PageShell className="flex flex-col">
      {/* Header */}
      <PageHeader title="Leaderboards" backHref="/home" />

      {/* Trick Selector */}
      <div className="max-w-2xl mx-auto px-4 mt-3 flex justify-center">
        <Select value={String(currentBoard)} onValueChange={(val) => setCurrentBoard(Number(val))}>
          <SelectTrigger className="w-fit min-w-[12rem] mx-auto glass-card text-orange-700 py-2 px-4 md:py-4 md:px-6 text-sm md:text-base h-auto">
            <SelectValue>
              <MathComponent math={problemSet[currentBoard]} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {keys.map((value) => (
              <SelectItem key={value} value={String(value)}>
                <MathComponent math={problemSet[value]} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Score List */}
      <div className="max-w-2xl mx-auto w-full px-4 flex flex-col gap-3 pb-6 mt-4">
        {loading ? (
          /* Loading skeleton state */
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-row items-center gap-x-2 md:gap-x-4">
                <Skeleton className="h-12 w-14 rounded-2xl bg-white/30" />
                <Skeleton className="h-12 flex-grow rounded-2xl bg-white/30" />
                <Skeleton className="h-12 w-24 rounded-2xl bg-white/30" />
              </div>
            ))}
          </div>
        ) : sortedScores.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-3 py-8">
            <FaTrophy className="text-6xl text-orange-300/40" />
            <p className="text-orange-700 text-lg font-medium">No scores yet for this trick. Be the first!</p>
          </div>
        ) : (
          /* Score rows */
          sortedScores.map((score, index) => {
            const [time, email] = score.split(" ");
            const rank = index + 1;
            const cardClass = rank === 1
              ? "glass-card-elevated border-2 border-amber-400/40 animate-pulse-glow"
              : rank === 2
              ? "glass-card border border-gray-300/30"
              : rank === 3
              ? "glass-card border border-orange-700/20"
              : "glass-card";
            return (
              <Card key={index} className={`${cardClass} animate-slide-in-right`} style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}>
                <CardContent className="p-0">
                  <div className="gap-x-2 md:gap-x-4 text-lg md:text-2xl flex flex-row items-center justify-between">
                    <p className="bg-orange-500/20 px-4 text-orange-700 py-2 md:py-3 rounded-2xl font-bold text-center md:w-[4.1rem] flex items-center gap-1">
                      {rank === 1 && <FaCrown className="text-amber-400" />}
                      {rank}
                    </p>
                    <p className="text-gray-800 py-2 md:py-3 font-bold text-center flex-grow">
                      {email.substring(0, email.indexOf("@"))}
                    </p>
                    <p className="bg-orange-500/20 px-2 md:px-4 text-orange-700 py-2 md:py-3 rounded-2xl font-bold text-center w-fit font-mono">
                      {time}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </PageShell>
  );
};

export default Home;
