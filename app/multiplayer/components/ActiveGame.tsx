"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MathComponent from "../../components/MathComponent";
import type { GameState } from "../page";

interface ActiveGameProps {
  gameState: GameState;
  questionsSolved: number;
  userAns: string;
  elapsedTime: number;
  trick: string;
  onBack: () => void;
  onAnswerChange: (value: string) => void;
  formatTime: (time: number) => string;
}

export default function ActiveGame({
  gameState,
  questionsSolved,
  userAns,
  elapsedTime,
  trick,
  onBack,
  onAnswerChange,
  formatTime,
}: ActiveGameProps) {
  return (
    <div>
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="glass-button rounded-full h-10 w-10 text-orange-700 absolute top-4 left-4">
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Player progress bars */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-4 space-y-2">
        {gameState && Object.keys(gameState.players).map((playerId, index) => (
          <div key={index} className="flex items-center gap-3">
            <label className="font-bold text-sm text-white drop-shadow-sm w-24 truncate">{playerId}</label>
            <Progress value={((gameState.players[playerId]?.questionsSolved - 1) / 5) * 100} className="flex-1 h-3 bg-white/30" />
          </div>
        ))}
      </div>

      {/* Timer */}
      <div className="w-full text-center text-white drop-shadow-lg font-extrabold text-5xl md:text-7xl mt-4">
        {formatTime(elapsedTime)}
      </div>

      {/* Problem display and answer input */}
      <div
        className={`font-semibold ${
          trick === "26" || trick === "27" || trick === "35" || trick === "42" || trick === "43"
            ? "text-[2.0rem] md:text-[2.3rem]"
            : "text-[3.0rem] md:text-6xl"
        } flex-1 flex flex-col md:flex-row items-center justify-center gap-4 px-4 text-white overflow-wrap break-words whitespace-pre-wrap`}
      >
        <div className="text-center md:text-left">
          <MathComponent
            math={gameState.questions ? gameState.questions[questionsSolved].body : ""}
          />
        </div>
        <div className="text-center md:text-left">=</div>
        <input
          autoFocus={true}
          className="glass-input text-center font-mono text-3xl md:text-5xl text-white w-2/3 md:w-1/4"
          type="text"
          value={userAns}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
      </div>
    </div>
  );
}
