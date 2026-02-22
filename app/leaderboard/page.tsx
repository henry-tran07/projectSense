"use client";
import { db } from "@/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { problemSet } from "@/app/utils/problemGenerator";
import { FaTrophy } from "react-icons/fa";
import MathComponent from "../components/MathComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ScoreEntry {
  time: string;
  email: string;
}

const Home = () => {
  const [currentBoard, setCurrentBoard] = useState(1);
  const keys = useMemo(() => Object.keys(problemSet).map(Number), []);
  const router = useRouter();
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

      const sortedScores = scoreEntries.map(
        (entry) => `${entry.time} ${entry.email}`
      );

      return sortedScores;
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(
          collection(db, "leaderboard"),
          String(currentBoard)
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const map = data.scores;
          const resultArray = Object.entries(map).map(
            ([key, value]) => `${value} ${key}`
          );
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
    <main className="w-full min-h-screen flex flex-col bg-orange-300">
      {/* Header */}
      <div className="bg-white text-3xl p-4 font-bold text-orange-300 w-full flex flex-row justify-center relative">
        <Button
          variant="ghost"
          onClick={() => router.push("/home")}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-orange-500 hover:text-gray-300 text-4xl px-3 rounded-2xl bg-orange-300"
        >
          {"⌂"}
        </Button>
        <p className="text-center w-full">Leaderboards</p>
      </div>

      {/* Trick Selector */}
      <div className="flex justify-center mt-3 md:mt-4">
        <Select
          value={String(currentBoard)}
          onValueChange={(val) => setCurrentBoard(Number(val))}
        >
          <SelectTrigger className="w-fit min-w-[12rem] mx-auto bg-white text-orange-300 border-orange-200 py-2 px-4 md:py-4 md:px-6 text-sm md:text-base h-auto">
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

      {/* Trophy */}
      <FaTrophy className="mx-auto text-[8rem] md:text-[12rem] text-white mt-2" />

      {/* Separator */}
      <Separator className="w-5/6 mx-auto mt-2 mb-3 bg-white/50" />

      {/* Score List */}
      <div className="w-full flex flex-col items-center pb-6">
        {loading ? (
          /* Loading skeleton state */
          <div className="w-[90%] md:w-[80%] flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-row items-center gap-x-2 md:gap-x-4">
                <Skeleton className="h-12 w-14 rounded-2xl bg-white/40" />
                <Skeleton className="h-12 flex-grow rounded-2xl bg-white/40" />
                <Skeleton className="h-12 w-24 rounded-2xl bg-white/40" />
              </div>
            ))}
          </div>
        ) : sortedScores.length === 0 ? (
          /* Empty state */
          <Card className="w-[90%] md:w-[80%] bg-white/80 border-none">
            <CardContent className="p-6 text-center">
              <p className="text-orange-400 text-lg font-medium">
                No scores yet for this trick. Be the first!
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Score rows */
          sortedScores.map((score, index) => {
            const [time, email] = score.split(" ");
            return (
              <Card
                key={index}
                className="my-1.5 w-[90%] md:w-[80%] border-none shadow-sm bg-transparent"
              >
                <CardContent className="p-0">
                  <div className="gap-x-2 md:gap-x-4 text-lg md:text-2xl flex flex-row items-center justify-between">
                    <p className="bg-white px-4 text-orange-300 py-2 md:py-3 rounded-2xl font-bold text-center md:w-[4.1rem]">
                      {index + 1}
                    </p>
                    <p className="bg-white text-orange-300 py-2 md:py-3 rounded-2xl font-bold text-center flex-grow">
                      {email.substring(0, email.indexOf("@"))}
                    </p>
                    <p className="bg-white px-2 md:px-4 text-orange-300 py-2 md:py-3 rounded-2xl font-bold text-center w-fit">
                      {time}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
};

export default Home;
