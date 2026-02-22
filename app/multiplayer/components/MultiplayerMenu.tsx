"use client";

interface MultiplayerMenuProps {
  onFindGame: () => void;
  onCreateGame: () => void;
}

export default function MultiplayerMenu({ onFindGame, onCreateGame }: MultiplayerMenuProps) {
  return (
    <div className="gap-y-6 font-mono items-center justify-center flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-auto">
      <button className="glass-card px-8 py-6 text-orange-700 text-4xl md:text-7xl font-extrabold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full text-center" onClick={onFindGame}>
        FIND GAME
      </button>
      <button className="glass-card px-8 py-6 text-orange-700 text-4xl md:text-7xl font-extrabold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full text-center" onClick={onCreateGame}>
        CREATE GAME
      </button>
    </div>
  );
}
