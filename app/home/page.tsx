"use client";

import { useRouter } from "next/navigation";
import { FaTrophy, FaRandom } from "react-icons/fa";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { problemSet } from "../utils/problemGenerator";
import MathComponent from "../components/MathComponent";
import { loadMore } from "../components/loadMore";
import { useInView } from "react-intersection-observer";
import { SettingsModal } from "../components/SettingsModal";
import { VideoModal } from "../components/VideoModal";
import { GameModal } from "../components/GameModal";
import { GiRetroController } from "react-icons/gi";
import { SiVitest } from "react-icons/si";
import { MdOutlineMail, MdOutlineHelpOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth("/");
  const colRef = collection(db, "users");
  const [rightLeft, setRightLeft] = useState(false);
  const [questionLimited, setQuestionLimited] = useState(true);
  const [autoEnter, setAutoEnter] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();
  const [keys, setKeys] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const newData = await loadMore(page);
        setKeys(newData);
      } catch (error) {
        console.error("Error loading trick data:", error);
      }
    };
    loadData();
  }, [page]);

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  const updateUser = async (userId: string, newData: Record<string, boolean>) => {
    const userRef = doc(db, "users", userId);
    try {
      await updateDoc(userRef, newData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (user?.email) {
          const docRef = doc(colRef, user.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setQuestionLimited(data.questionLimited);
            setRightLeft(data.rightLeft);
            setAutoEnter(data.autoEnter);
          }
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
      } finally {
        setSettingsLoading(false);
      }
    };
    if (!authLoading) {
      loadSettings();
    }
  }, [user, authLoading, colRef]);

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <div className="grid grid-cols-1 gap-4 mt-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="absolute bg-orange-50 min-h-screen w-full flex flex-col items-center overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/leaderboard")}
            className="h-10 w-10 rounded-full bg-orange-400 text-white hover:bg-orange-500 hover:text-white"
          >
            <FaTrophy className="h-5 w-5" />
          </Button>

          <h1 className="text-xl md:text-2xl font-bold text-orange-400 tracking-tight">
            Project Sense
          </h1>

          <div className="flex items-center">
            <GameModal />
            <SettingsModal
              loading={authLoading || settingsLoading}
              rightLeft={rightLeft}
              updateUser={updateUser}
              user={user}
              setRightLeft={setRightLeft}
              questionLimited={questionLimited}
              logout={logout}
              setQuestionLimited={setQuestionLimited}
            />
          </div>
        </div>
      </header>

      {/* Info note */}
      <p className="text-orange-600/80 font-medium text-sm md:text-base text-center px-4 py-3">
        Note: Timer starts once a bubble is pressed. Solve 5 questions as fast as you can.
      </p>

      {/* Navigation buttons */}
      <div className="flex flex-row justify-center gap-x-2 px-2">
        <Button
          variant="outline"
          onClick={() => router.push("/home/practice/randomizer")}
          className="gap-2 rounded-xl border-orange-300 text-orange-500 font-semibold text-base md:text-lg px-4 md:px-8 py-2 md:py-5 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-400 transition-all duration-200"
        >
          <FaRandom className="h-4 w-4" /> Random
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/multiplayer")}
          className="gap-2 rounded-xl border-orange-300 text-orange-500 font-semibold text-base md:text-lg px-4 md:px-8 py-2 md:py-5 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-400 transition-all duration-200"
        >
          <GiRetroController className="h-4 w-4" /> Multiplayer
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/testGen")}
          className="gap-2 rounded-xl border-orange-300 text-orange-500 font-semibold text-base md:text-lg px-4 md:px-8 py-2 md:py-5 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-400 transition-all duration-200"
        >
          <SiVitest className="h-4 w-4" /> AI Test
        </Button>
      </div>

      {/* Trick card grid */}
      <div className="w-full max-w-6xl px-4 mt-6 mb-24 md:mb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {keys.map((value) => (
          <div key={value} className="animate-slideUp">
            <Card className="group overflow-hidden border-orange-100 bg-white hover:shadow-lg hover:border-orange-300 transition-all duration-200">
              <CardContent className="p-0 flex items-stretch">
                <button
                  onClick={() => router.push(`/home/practice/${value}`)}
                  className="flex-1 flex items-center justify-center p-4 md:p-5 text-lg md:text-xl font-semibold text-gray-800 hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
                >
                  <MathComponent math={problemSet[value]} />
                </button>
                <VideoModal trick={value} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <hr ref={ref} className="my-4 border-transparent" />

      {/* Footer */}
      <footer className="fixed bottom-0 z-10 w-full bg-white/95 backdrop-blur-sm border-t border-orange-100 shadow-sm">
        <div className="flex items-center justify-center gap-2 px-4 py-2 md:py-3 text-orange-400 text-xs md:text-base font-medium">
          <p>
            Built for <b>UIL Number Sense</b> by <b>Townview TAG&apos;s UIL Team 2025</b>
          </p>
          <span className="text-orange-200">|</span>
          <a
            href="https://forms.gle/yneT5vZaBSaLX1vf8"
            className="text-orange-400 hover:text-orange-500 transition-colors"
          >
            <MdOutlineHelpOutline className="h-4 w-4 md:h-5 md:w-5" />
          </a>
          <span className="text-orange-200">|</span>
          <a
            href="mailto:projectsense.ns@gmail.com"
            className="text-orange-400 hover:text-orange-500 transition-colors"
          >
            <MdOutlineMail className="h-4 w-4 md:h-5 md:w-5" />
          </a>
        </div>
      </footer>
    </main>
  );
}
