"use client";

interface MultiplayerMenuProps {
  onFindGame: () => void;
  onCreateGame: () => void;
}

export default function MultiplayerMenu({ onFindGame, onCreateGame }: MultiplayerMenuProps) {
  return (
    <div className="gap-y-8 md:gap-y-4 -mt-8 md:mt-0 font-mono text-white text-[3.25rem] md:text-8xl font-extrabold items-start justify-center flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-auto">
      <button className="relative group" onClick={onFindGame}>
        FIND GAME
        <span className="absolute -bottom-1 left-0 w-0 h-2 bg-white transition-all group-hover:w-full duration-700" />
      </button>
      <button className="relative group" onClick={onCreateGame}>
        CREATE GAME
        <span className="absolute -bottom-1 left-0 w-0 h-2 bg-white transition-all group-hover:w-full duration-700" />
      </button>
    </div>
  );
}
