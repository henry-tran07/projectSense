"use client";

import { ArrowLeft } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface GameOverProps {
  winner: string;
  onBack: () => void;
}

export default function GameOver({ winner, onBack }: GameOverProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-screen">
      <Button variant="ghost" onClick={onBack} className="glass-button rounded-full h-10 w-10 text-orange-700 absolute top-4 left-4">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="glass-card-elevated p-8 flex flex-col items-center gap-4 animate-scale-in">
        <FaCrown className="text-6xl text-amber-400 animate-count-up" />
        <p className="font-display text-4xl md:text-6xl font-extrabold text-orange-700">Winner: {winner}</p>
        <Button onClick={onBack} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 py-3 text-lg font-bold mt-4">
          Back to Menu
        </Button>
      </div>
    </div>
  );
}
