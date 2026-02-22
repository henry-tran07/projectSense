"use client";

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
      {/* Player progress bars */}
      <div className="absolute flex flex-col right-0 text-right p-4 justify-between">
        {gameState &&
          Object.keys(gameState.players).map((playerId, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between text-right gap-x-2"
            >
              <label className="mr-2 font-semibold text-lg text-slate-100">{playerId}</label>
              <Progress
                value={((gameState.players[playerId]?.questionsSolved - 1) / 5) * 100}
                className="w-72 h-4 bg-orange-100"
              />
            </div>
          ))}
      </div>

      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mt-16 md:mt-24 bg-white hover:bg-gray-300 w-fit text-2xl md:text-4xl font-extrabold text-orange-300 text-left ml-3 md:ml-8 rounded-3xl p-2 px-4 h-auto"
      >
        {"<"}
      </Button>

      {/* Timer */}
      <div className="w-screen text-center text-white font-extrabold text-5xl md:text-7xl">
        {formatTime(elapsedTime)}
      </div>

      {/* Problem display and answer input */}
      <div
        className={`font-semibold ${
          trick === "26" || trick === "27" || trick === "35" || trick === "42" || trick === "43"
            ? "text-[2.0rem] md:text-[2.3rem]"
            : "text-[3.0rem] md:text-6xl"
        } w-screen flex flex-col md:flex-row text-white justify-center items-center gap-x-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-wrap break-words whitespace-pre-wrap`}
      >
        <div className="text-center md:text-left ml-[0px]">
          <MathComponent
            math={gameState.questions ? gameState.questions[questionsSolved].body : ""}
          />
        </div>
        <div className="text-center md:text-left">=</div>
        <input
          autoFocus={true}
          className="pb-2 w-2/3 md:w-1/5 focus:outline-none border-b-2 text-center bg-orange-300"
          type="text"
          value={userAns}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
      </div>
    </div>
  );
}
