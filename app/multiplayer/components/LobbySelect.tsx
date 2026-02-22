"use client";

import { HiRefresh } from "react-icons/hi";
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
    <div>
      <Button
        variant="ghost"
        onClick={onBack}
        className="mt-16 md:mt-24 glass-button w-fit text-2xl md:text-4xl font-extrabold text-orange-700 text-left ml-3 md:ml-8 rounded-2xl p-2 px-4 h-auto"
      >
        {"<"}
      </Button>
      <div className="w-screen mt-1 md:-mt-24 text-center text-white drop-shadow-lg font-extrabold text-3xl md:text-7xl">
        LOBBY SELECT
        <Card className="absolute w-3/4 md:w-3/5 glass-card border-2 border-white/30 bottom-4 h-[calc(80vh-2rem)] left-1/2 transform -translate-x-1/2 text-gray-800 text-4xl overflow-auto">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="items-center gap-x-2 flex flex-row justify-center mb-4 ml-auto text-3xl font-semibold text-orange-700 h-auto"
              onClick={onRefresh}
            >
              REFRESH <HiRefresh />
            </Button>
            <Separator className="mt-4 mb-4" />
            {availableGames.length > 0 ? (
              <ul className="flex flex-wrap gap-x-8">
                {availableGames.map(([id]) => (
                  <li key={id}>
                    <button
                      className="text-orange-700 hover:text-orange-800 underline underline-offset-2 decoration-[2px] hover:decoration-[3px]"
                      onClick={() => onJoinGame(id)}
                    >
                      {id}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center font-semibold text-gray-600 text-3xl mt-4 mb-4">
                No available games. Create a new one or try Refreshing!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
