"use client";

import { FaCrown } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface GameOverProps {
  winner: string;
  onBack: () => void;
}

export default function GameOver({ winner, onBack }: GameOverProps) {
  return (
    <div>
      <Button
        variant="ghost"
        onClick={onBack}
        className="mt-16 md:mt-24 bg-white hover:bg-gray-300 w-fit text-2xl md:text-4xl font-extrabold text-orange-300 text-left ml-3 md:ml-8 rounded-3xl p-2 px-4 h-auto"
      >
        {"<"}
      </Button>
      <div className="gap-y-4 font-mono text-white text-5xl md:text-8xl font-extrabold gap-x-4 items-center justify-center flex flex-row fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen">
        <FaCrown />
        Winner: {winner}
      </div>
    </div>
  );
}
