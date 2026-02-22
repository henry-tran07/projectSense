"use client";

import { ArrowLeft } from "lucide-react";
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
    <div className="flex flex-col items-center w-full px-4 mt-4">
      <Button variant="ghost" onClick={onBack} className="glass-button rounded-full h-10 w-10 text-orange-700 self-start mb-4">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h2 className="font-display text-2xl md:text-4xl text-white font-extrabold drop-shadow-lg mb-4">LOBBY {gameId}</h2>
      <Card className="w-full max-w-lg glass-card border-2 border-white/30 mb-4">
        <CardContent className="p-4">
          <p className="text-left underline text-gray-800 text-xl font-bold mb-3">Players:</p>
          <div className="flex flex-col gap-2">
            {gameState ? Object.keys(gameState.players).map((playerId) => (
              <div key={playerId} className="glass-surface p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/30 flex items-center justify-center text-orange-700 font-bold text-sm">
                  {playerId.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800 font-semibold">{playerId}</span>
              </div>
            )) : <p className="text-gray-500">Empty</p>}
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4 mb-4">
        <Button onClick={onStartGame} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 py-3 h-auto text-lg">Start Game</Button>
        <Button variant="ghost" onClick={onEndGame} className="glass-button text-orange-700 font-bold rounded-xl px-6 py-3 h-auto text-lg">End Game</Button>
      </div>
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
  );
}
