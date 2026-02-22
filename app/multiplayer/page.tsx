"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  database,
  createGameSession,
  joinGameSession,
  getAvailableGames,
  endGameSession,
  startGameSession,
  setQuestions,
} from "@/firebase/config";
import { onValue, ref, remove, update } from "firebase/database";
import { useAuth } from "../hooks/useAuth";
import { problemSet } from "../utils/problemGenerator";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import MultiplayerMenu from "./components/MultiplayerMenu";
import LobbySelect from "./components/LobbySelect";
import GameLobby from "./components/GameLobby";
import ActiveGame from "./components/ActiveGame";
import GameOver from "./components/GameOver";

export interface Player {
  questionsSolved: number;
}

export interface GameState {
  players: {
    [key: string]: Player;
  };
  state: string;
  startTime: string;
  questions?: {
    body: string;
    ans: string;
  }[];
}

export interface Matchmaking {
  games: {
    [key: string]: GameState;
  };
}

export default function Multiplayer() {
  const [availableGames, setAvailableGames] = useState<[string, GameState][]>([]);
  const [currentBoard, setCurrentBoard] = useState(1);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const playerData = { questionsSolved: 1 };
  const [questionsSolved, setQuestionsSolved] = useState<number>(1);
  const { user, loading } = useAuth("/");
  const [playerId, setEmail] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [trick, setTrick] = useState("1");
  const [index, setIndex] = useState(0);
  const [userAns, setUserAns] = useState("");
  const [winner, setWinner] = useState("");
  const keys = useMemo(() => Object.keys(problemSet).map(Number), []);
  const [stopTimer, setStopTimer] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Set player ID from user email
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email.substring(0, user.email.indexOf("@")));
    }
  }, [user]);

  // Check answers
  useEffect(() => {
    if (gameState && gameState.questions && userAns === gameState.questions[questionsSolved].ans) {
      setQuestionsSolved(questionsSolved + 1);
      const playerPositionRef = ref(database, `games/${gameId}/players/${playerId}`);
      update(playerPositionRef, { questionsSolved: questionsSolved + 1 });
      setUserAns("");
    }
  }, [userAns]);

  // Fetch available games
  useEffect(() => {
    const fetchAvailableGames = async () => {
      try {
        const games = await getAvailableGames();
        setAvailableGames(games);
      } catch (error) {
        console.error("Failed to fetch available games:", error);
        setAvailableGames([]);
      }
    };

    fetchAvailableGames();
  }, [refresh]);

  // Firebase game handlers
  const handleCreateGame = async () => {
    setError(null);
    try {
      const newGameId = await createGameSession();
      await joinGameSession(newGameId, playerId, playerData);
      setGameId(newGameId);
      listenToGameUpdates(newGameId);
    } catch (error) {
      console.error("Failed to create game:", error);
      setError("Failed to create game. Please try again.");
    }
  };

  const handleJoinGame = async (gameId: string) => {
    setError(null);
    try {
      await joinGameSession(gameId, playerId, { questionsSolved: 1 });
      setQuestionsSolved(1);
      setGameId(gameId);
      listenToGameUpdates(gameId);
    } catch (error) {
      console.error("Failed to join game:", error);
      setError("Failed to join game. It may no longer be available.");
    }
  };

  const handleEndGame = async () => {
    if (gameId) {
      try {
        await endGameSession(gameId);
        setGameState(null);
        setGameId(null);
      } catch (error) {
        console.error("Failed to end game:", error);
        setError("Failed to end game. Please try again.");
      }
    }
  };

  const handleStartGame = async () => {
    if (gameId) {
      try {
        await startGameSession(gameId);
        await setQuestions(gameId, String(currentBoard));
      } catch (error) {
        console.error("Failed to start game:", error);
        setError("Failed to start game. Please try again.");
      }
    }
  };

  const listenToGameUpdates = (gameId: string) => {
    // Clean up any previous listener before creating a new one
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    const gameRef = ref(database, `games/${gameId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data as GameState);
      }
    });
    unsubscribeRef.current = unsubscribe;
  };

  // Clean up Firebase listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  // Handle game state changes
  useEffect(() => {
    if (gameState && gameState.state === "in_progress") {
      setStopTimer(false);
      setStartTime(Date.now());
      setElapsedTime(0);
    } else if (gameState && gameState.state === "ended") {
      setStopTimer(true);
      setStartTime(Date.now());
      setElapsedTime(0);
      setUserAns("");
      const gameRef = ref(database, `games/${gameId}`);
      update(gameRef, { state: "ended" });
      if (gameState) {
        Object.keys(gameState.players).forEach((playerIdd) => {
          if (gameState.players[playerIdd]?.questionsSolved === 6) {
            setWinner(playerIdd);
          }
        });
      }
      remove(gameRef);
    } else if (gameState && gameState.state === "end_clicked") {
      setIndex(0);
    }
  }, [gameState?.state]);

  // Timer logic
  useEffect(() => {
    let animationFrameId: number;

    const updateElapsedTime = () => {
      if (!stopTimer) {
        setElapsedTime(Date.now() - startTime);
        animationFrameId = requestAnimationFrame(updateElapsedTime);
      }
    };

    animationFrameId = requestAnimationFrame(updateElapsedTime);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [startTime, stopTimer]);

  // Handle game completion
  useEffect(() => {
    if (questionsSolved === 6) {
      const gameRef = ref(database, `games/${gameId}`);
      update(gameRef, { state: "ended" });
      if (gameState) {
        Object.keys(gameState.players).forEach((playerId) => {
          if (gameState.players[playerId]?.questionsSolved === 6) {
            setWinner(playerId);
          }
        });
      }
      setTimeout(() => {
        remove(gameRef);
        setIndex(0);
      }, 7500);
    }
  }, [questionsSolved]);

  const formatTime = (time: number) => {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  // Leave game helper
  const handleLeaveGame = () => {
    if (gameId) {
      const playerRef = ref(database, `games/${gameId}/players/${playerId}`);
      remove(playerRef);
      setGameState(null);
      setGameId(null);
      setQuestionsSolved(1);
    }
    setIndex(0);
  };

  // Leave game from active game (uses sanitized player ID)
  const handleLeaveActiveGame = () => {
    if (gameId) {
      const playerRef = ref(
        database,
        `games/${gameId}/players/${playerId.replace(/[.#$[\]]/g, "_")}`
      );
      remove(playerRef);
      setGameState(null);
      setGameId(null);
      setQuestionsSolved(1);
    }
    setIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full bg-white/40" />
          <Skeleton className="h-8 w-3/4 bg-white/40" />
          <Skeleton className="h-8 w-1/2 bg-white/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-300 flex flex-col items-center font-mono">
      <Button
        variant="ghost"
        onClick={() => router.push("/home")}
        className="absolute top-2 md:top-4 left-2 md:left-4 font-extrabold text-orange-300 text-3xl md:text-5xl underline bg-white px-2 md:px-4 py-1 md:py-2 border border-gray-300 rounded h-auto hover:bg-gray-100"
      >
        Project Sense
      </Button>

      {error && (
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-md text-sm font-sans max-w-sm text-center">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold hover:text-red-900">
            x
          </button>
        </div>
      )}

      {index === 0 ? (
        <MultiplayerMenu
          onFindGame={() => {
            setIndex(1);
            setRefresh(refresh + 1);
          }}
          onCreateGame={() => {
            setIndex(2);
            handleCreateGame();
            setQuestionsSolved(1);
          }}
        />
      ) : index === 1 ? (
        <LobbySelect
          availableGames={availableGames}
          onRefresh={() => setRefresh(refresh + 1)}
          onBack={handleLeaveGame}
          onJoinGame={(id) => {
            handleJoinGame(id);
            setIndex(2);
          }}
        />
      ) : (
        <div className="w-screen">
          {gameState && gameState.state === "in_progress" ? (
            <ActiveGame
              gameState={gameState}
              questionsSolved={questionsSolved}
              userAns={userAns}
              elapsedTime={elapsedTime}
              trick={trick}
              onBack={handleLeaveActiveGame}
              onAnswerChange={setUserAns}
              formatTime={formatTime}
            />
          ) : gameState && gameState.state === "ended" ? (
            <GameOver winner={winner} onBack={handleLeaveGame} />
          ) : (
            <GameLobby
              gameId={gameId}
              gameState={gameState}
              currentBoard={currentBoard}
              keys={keys}
              onBack={handleLeaveGame}
              onStartGame={() => {
                handleStartGame();
                setStopTimer(false);
                setStartTime(Date.now());
                setElapsedTime(0);
              }}
              onEndGame={() => {
                if (gameId) {
                  const gameRef = ref(database, `games/${gameId}`);
                  update(gameRef, { state: "end_clicked" });
                  remove(gameRef);
                }
              }}
              onBoardChange={setCurrentBoard}
            />
          )}
        </div>
      )}
    </div>
  );
}
