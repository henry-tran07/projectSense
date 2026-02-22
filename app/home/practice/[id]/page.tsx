"use client";
import React, { useState, useEffect } from "react";
import { FaInfinity } from "react-icons/fa";
import { ArrowLeft, RotateCcw, Timer, Trophy } from "lucide-react";
import Trick from "@/app/components/Trick";
import { db } from "@/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { problemSet } from "@/app/utils/problemGenerator";
import updateLeaderboard from "@/app/components/updateLeaderboard";
import MathComponent from "@/app/components/MathComponent";
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
  const colRef = collection(db, "users");
  const [questions, setQuestions] = useState(0);
  const [stopTimer, setStopTimer] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<string[]>([]);
  const [storedQuestions, setStoredQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (params.id === "randomizer") setRandomizer(true);
  }, [params.id]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (user?.email) {
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
  }, [user, loading, colRef]);

  useEffect(() => {
    let animationFrameId: number;

    const updateElapsedTime = () => {
      if (!stopTimer) {
        setElapsedTime(Date.now() - startTime);
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
        updateLeaderboard(email, db, Number(params.id), formatTime(elapsedTime));
      }
    }
  }, [questions, questionLimited, user?.email, params.id, elapsedTime, user, randomizer]);

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

      return (
        parseInt(minutes) * 60 +
        parseInt(wholeSeconds) +
        parseInt(milliseconds || "0") / 100
      );
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
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <main className="w-screen min-h-screen flex flex-col bg-orange-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto w-full">
          {/* Home button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/home")}
            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Trick name */}
          <div className="flex-1 text-center text-xl md:text-2xl font-bold text-orange-500">
            <MathComponent
              math={randomizer ? "Randomizer" : problemSet[Number(params.id)]}
            />
          </div>

          {/* Question counter & timer */}
          <div className="flex items-center gap-2">
            {randomizer ? null : !questionLimited ? (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-600 text-lg px-3 py-1"
              >
                <FaInfinity />
              </Badge>
            ) : (
              <>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-600 text-sm font-semibold px-2.5 py-1"
                >
                  {questions}/{MAX_QUESTION_COUNT}
                </Badge>
                <div className="flex items-center gap-1 bg-orange-100 text-orange-600 rounded-md px-2.5 py-1 text-sm font-mono font-semibold">
                  <Timer className="h-3.5 w-3.5" />
                  {formatTime(elapsedTime)}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

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
          <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Trophy className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-orange-500">
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
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-orange-50 transition-colors"
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
                  <span className="text-muted-foreground font-normal ml-1.5">
                    s per question
                  </span>
                </p>
              </div>

              <Separator className="my-4" />

              {/* Restart button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="gap-2 text-orange-500 border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
};

export default PracticePage;
