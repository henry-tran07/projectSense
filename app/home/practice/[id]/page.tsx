"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaInfinity } from "react-icons/fa";
import { RotateCcw, Timer, Trophy } from "lucide-react";
import Trick from "@/app/components/Trick";
import { db } from "@/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { problemSet } from "@/app/utils/problemGenerator";
import updateLeaderboard from "@/app/components/updateLeaderboard";
import MathComponent from "@/app/components/MathComponent";
import { PageHeader } from "@/app/components/PageHeader";
import { PageShell } from "@/app/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PracticePage = ({ params }: { params: { id: string } }) => {
  const MAX_QUESTION_COUNT = 5;
  const router = useRouter();
  const { user, loading } = useAuth("/");
  const [randomizer, setRandomizer] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rightLeft, setRightLeft] = useState(false);
  const [questionLimited, setQuestionLimited] = useState(true);
  const [autoEnter, setAutoEnter] = useState(true);
  const [questions, setQuestions] = useState(0);
  const [stopTimer, setStopTimer] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<string[]>([]);
  const [storedQuestions, setStoredQuestions] = useState<string[]>([]);
  const elapsedTimeRef = useRef(0);

  useEffect(() => {
    if (params.id === "randomizer") setRandomizer(true);
  }, [params.id]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (user?.email) {
          const colRef = collection(db, "users");
          const docRef = doc(colRef, user.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setQuestionLimited(data?.questionLimited ?? true);
            setRightLeft(data?.rightLeft ?? false);
            setAutoEnter(data?.autoEnter ?? true);
          }
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };
    if (!loading) {
      loadSettings();
    }
  }, [user, loading]);

  useEffect(() => {
    let animationFrameId: number;

    const updateElapsedTime = () => {
      if (!stopTimer) {
        const now = Date.now() - startTime;
        setElapsedTime(now);
        elapsedTimeRef.current = now;
        animationFrameId = requestAnimationFrame(updateElapsedTime);
      }
    };

    animationFrameId = requestAnimationFrame(updateElapsedTime);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [startTime, stopTimer]);

  useEffect(() => {
    if (questions === 5 && questionLimited && !randomizer) {
      setStopTimer(true);
      if (user) {
        const email: string = user.email ? user.email : "";
        updateLeaderboard(email, db, Number(params.id), formatTime(elapsedTimeRef.current));
      }
    }
  }, [questions, questionLimited, user?.email, params.id, user, randomizer]);

  const formatTime = (time: number) => {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  function getFirstNonZeroIndex(str: string) {
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== "0" && str[i] !== ":") {
        return i;
      }
    }
    return -1;
  }

  function averageTimeInSeconds(totalTime: string, numberOfItems: number) {
    function timeStringToSeconds(timeString: string) {
      const [minutes, seconds] = timeString.split(":");
      const [wholeSeconds, milliseconds] = seconds.split(".");

      return parseInt(minutes) * 60 + parseInt(wholeSeconds) + parseInt(milliseconds || "0") / 100;
    }

    const totalSeconds = timeStringToSeconds(totalTime);
    const averageSeconds = totalSeconds / numberOfItems;

    return Math.round(averageSeconds * 100) / 100;
  }

  const handleRestart = () => {
    setQuestionTimes([]);
    setStoredQuestions([]);
    setQuestions(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setStopTimer(false);
  };

  const isComplete = questions >= 5 && questionLimited && !randomizer;

  if (loading) {
    return (
      <PageShell className="flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="w-screen flex flex-col">
      <PageHeader
        title={<MathComponent math={randomizer ? "Randomizer" : problemSet[Number(params.id)]} />}
        backHref="/home"
        rightSlot={
          <div className="flex items-center gap-2">
            {randomizer ? null : !questionLimited ? (
              <Badge variant="secondary" className="glass-pill text-orange-700 text-lg"><FaInfinity /></Badge>
            ) : (
              <>
                <div className="flex items-center gap-1 glass-pill px-2 py-1">
                  {Array.from({ length: MAX_QUESTION_COUNT }, (_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < questions ? 'bg-orange-500' : 'bg-white/30'}`} />
                  ))}
                </div>
                <div className={`flex items-center gap-1 glass-pill text-orange-700 text-sm font-mono font-semibold ${!stopTimer ? 'animate-pulse-glow' : ''}`}>
                  <Timer className="h-3.5 w-3.5" />
                  {formatTime(elapsedTime)}
                </div>
              </>
            )}
          </div>
        }
      />

      {/* Practice area */}
      {!isComplete && (
        <div className="flex-1 flex items-center justify-center">
          <Trick
            rightLeft={rightLeft}
            trick={params.id}
            question={questions}
            setQuestion={setQuestions}
            questionLimited={questionLimited}
            setQuestionTiming={setQuestionTimes}
            setStoredQuestion={setStoredQuestions}
          />
        </div>
      )}

      {/* Results panel */}
      {isComplete && (
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-lg glass-card-elevated animate-scale-in">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <div className="bg-orange-100 rounded-full p-3">
                  <Trophy className="h-12 w-12 text-orange-600" />
                </div>
              </div>
              <CardTitle className="font-display text-4xl md:text-5xl text-orange-700">
                {formatTime(elapsedTime)}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Total Time</p>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4">
              {/* Per-question breakdown */}
              <div className="space-y-2">
                {questionTimes.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-orange-50 transition-colors animate-count-up"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center gap-2 text-sm md:text-base">
                      <span className="text-muted-foreground font-mono w-5 text-right">
                        {index + 1}.
                      </span>
                      <MathComponent math={storedQuestions[index]} />
                    </div>
                    <span className="text-sm md:text-base font-mono text-orange-600 font-medium">
                      {item.substring(getFirstNonZeroIndex(item))}s
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Average time */}
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  <span className="underline underline-offset-4 decoration-orange-400">
                    {averageTimeInSeconds(formatTime(elapsedTime), 5)}
                  </span>
                  <span className="text-muted-foreground font-normal ml-1.5">s per question</span>
                </p>
              </div>

              <Separator className="my-4" />

              {/* Restart button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleRestart}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  );
};

export default PracticePage;
