"use client";

import { Search, Plus } from "lucide-react";

interface MultiplayerMenuProps {
  onFindGame: () => void;
  onCreateGame: () => void;
}

export default function MultiplayerMenu({ onFindGame, onCreateGame }: MultiplayerMenuProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full px-4 max-w-md">
      <button className="glass-card px-8 py-6 text-orange-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full flex flex-col items-center gap-3 animate-fade-in-up" onClick={onFindGame}>
        <Search className="h-8 w-8 text-orange-500" />
        <span className="font-display text-3xl md:text-5xl font-extrabold">FIND GAME</span>
        <span className="text-sm text-orange-600/60 font-normal">Join an existing lobby</span>
      </button>
      <button className="glass-card px-8 py-6 text-orange-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full flex flex-col items-center gap-3 animate-fade-in-up" onClick={onCreateGame} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Plus className="h-8 w-8 text-orange-500" />
        <span className="font-display text-3xl md:text-5xl font-extrabold">CREATE GAME</span>
        <span className="text-sm text-orange-600/60 font-normal">Start a new match</span>
      </button>
    </div>
  );
}
