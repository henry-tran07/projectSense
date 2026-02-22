"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MathComponent from "../../components/MathComponent";
import { problemSet } from "../../utils/problemGenerator";
import type { GameState } from "../page";

interface GameLobbyProps {
  gameId: string | null;
  gameState: GameState | null;
  currentBoard: number;
  keys: number[];
  onBack: () => void;
  onStartGame: () => void;
  onEndGame: () => void;
  onBoardChange: (value: number) => void;
}

export default function GameLobby({
  gameId,
  gameState,
  currentBoard,
  keys,
  onBack,
  onStartGame,
  onEndGame,
  onBoardChange,
}: GameLobbyProps) {
  return (
    <>
      <Button
        variant="ghost"
        onClick={onBack}
        className="mt-16 md:mt-24 glass-button w-fit text-2xl md:text-4xl font-extrabold text-orange-700 text-left ml-3 md:ml-8 rounded-2xl p-2 px-4 h-auto"
      >
        {"<"}
      </Button>
      <div className="mt-0 md:-mt-20 w-screen text-center text-white drop-shadow-lg font-extrabold text-4xl md:text-7xl">
        LOBBY {gameId}
        <Card className="mx-auto h-[60vh] overflow-y-auto overflow-x-hidden w-3/4 md:w-1/2 mt-2 md:mt-0 glass-card border-2 border-white/30 text-gray-800 text-2xl md:text-4xl">
          <CardContent className="p-4">
            <p className="text-left underline">Players:</p>
            <div className="text-left mr-auto mt-3">
              {gameState
                ? Object.keys(gameState.players).map((playerId) => (
                    <div key={playerId} className="text-left ml-4">
                      <p>{playerId}</p>
                    </div>
                  ))
                : "Empty"}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-x-4 flex-row justify-center items-center w-screen">
        <Button
          variant="ghost"
          className="mt-4 glass-button block font-extrabold px-6 py-3 text-orange-700 text-2xl rounded-xl h-auto"
          onClick={onStartGame}
        >
          Start Game
        </Button>
        <Button
          variant="ghost"
          className="mt-4 glass-button block font-extrabold px-6 py-3 text-orange-700 text-2xl rounded-xl h-auto"
          onClick={onEndGame}
        >
          End Game
        </Button>
      </div>
      <div className="flex justify-center mt-4">
        <Select value={String(currentBoard)} onValueChange={(val) => onBoardChange(Number(val))}>
          <SelectTrigger className="w-auto min-w-[12rem] max-w-[20rem] glass-card text-orange-700 font-semibold text-lg h-auto py-2 px-4">
            <SelectValue>
              <MathComponent math={problemSet[currentBoard]} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[10rem] overflow-y-auto">
            {keys.map((value) =>
              currentBoard !== value ? (
                <SelectItem key={value} value={String(value)}>
                  <MathComponent math={problemSet[value]} />
                </SelectItem>
              ) : null
            )}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
