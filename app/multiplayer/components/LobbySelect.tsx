"use client";

import { HiRefresh } from "react-icons/hi";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GameState } from "../page";

interface LobbySelectProps {
  availableGames: [string, GameState][];
  onRefresh: () => void;
  onBack: () => void;
  onJoinGame: (gameId: string) => void;
}

export default function LobbySelect({
  availableGames,
  onRefresh,
  onBack,
  onJoinGame,
}: LobbySelectProps) {
  return (
    <div className="flex flex-col items-center w-full px-4 mt-4">
      <Button variant="ghost" onClick={onBack} className="glass-button rounded-full h-10 w-10 text-orange-700 absolute top-4 left-4">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h2 className="font-display text-2xl md:text-4xl text-white font-extrabold drop-shadow-lg mb-4">LOBBY SELECT</h2>
      <Card className="w-full max-w-2xl glass-card border-2 border-white/30">
        <CardContent className="p-4">
          <Button variant="ghost" className="flex items-center gap-2 mb-4 ml-auto text-lg font-semibold text-orange-700 h-auto" onClick={onRefresh}>
            REFRESH <HiRefresh />
          </Button>
          <Separator className="mb-4" />
          {availableGames.length > 0 ? (
            <div className="flex flex-col gap-3">
              {availableGames.map(([id]) => (
                <button key={id} onClick={() => onJoinGame(id)} className="glass-card p-3 flex items-center justify-between cursor-pointer hover:-translate-y-0.5 transition-all text-orange-700 font-semibold text-lg">
                  <span>Lobby {id}</span>
                  <span className="text-sm text-orange-600/60">Join &rarr;</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8">
              <Trophy className="h-12 w-12 text-orange-300/40" />
              <p className="text-center font-semibold text-gray-600 text-lg">No available games. Create a new one or try Refreshing!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
