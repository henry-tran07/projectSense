import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, update, get, remove } from "firebase/database";
import { problemFunction } from "@/app/utils/problemGenerator";

// --- Local types ---

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  databaseURL: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
}

interface PlayerData {
  questionsSolved: number;
}

interface PlayerPosition {
  [key: string]: unknown;
}

interface GameData {
  state: string;
  startTime: string;
  players: Record<string, PlayerData>;
  questions?: { body: string; ans: string }[];
}

interface GameSessionPlayer {
  playerId: string;
  questionsSolved: number;
}

// --- Helper functions ---

function generateRandomNumbers(): string {
  let result = "";
  for (let i = 0; i < 5; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit.toString();
  }
  return result;
}

// --- Firebase config ---

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// --- Firebase instances ---

export const Firebase = initializeApp(firebaseConfig);
export const database = getDatabase(Firebase);
export const auth = getAuth(Firebase);
export const db = getFirestore(Firebase);
export default Firebase;

// --- Game session functions ---

function setQuestions(gameId: string, trick: string): Promise<void> {
  const questionRef = ref(database, `games/${gameId}/questions`);
  const questionJson: Record<number, { body: string; ans: string | number }> = {
    1: problemFunction[trick].function(),
    2: problemFunction[trick].function(),
    3: problemFunction[trick].function(),
    4: problemFunction[trick].function(),
    5: problemFunction[trick].function(),
    6: problemFunction[trick].function(),
  };
  return update(questionRef, questionJson);
}

function createGameSession(): Promise<string> {
  const gameId = generateRandomNumbers();
  const gameData = {
    state: "waiting",
    startTime: new Date().toISOString(),
    players: {},
  };
  const gameRef = ref(database, `games/${gameId}`);
  return set(gameRef, gameData).then(() => gameId);
}

function joinGameSession(gameId: string, playerId: string, playerData: PlayerData): Promise<void> {
  const playerRef = ref(database, `games/${gameId}/players/${playerId.replace(/[.#$[\]]/g, "_")}`);
  return set(playerRef, playerData);
}

function updatePlayerPosition(
  gameId: string,
  playerId: string,
  position: PlayerPosition
): Promise<void> {
  const playerPositionRef = ref(
    database,
    `games/${gameId}/players/${playerId.replace(/[.#$[\]]/g, "_")}/position`
  );
  return update(playerPositionRef, position);
}

async function getAvailableGames(): Promise<[string, GameData][]> {
  const gamesRef = ref(database, `games`);
  const snapshot = await get(gamesRef);
  const games = snapshot.val() as Record<string, GameData> | null;
  return games
    ? (Object.entries(games).filter(([, game]) => game.state === "waiting") as [string, GameData][])
    : [];
}

function endGameSession(gameId: string): Promise<void> {
  const gameRef = ref(database, `games/${gameId}`);
  return update(gameRef, { state: "ended" });
}

function startGameSession(gameId: string): Promise<void> {
  const gameRef = ref(database, `games/${gameId}`);
  return update(gameRef, { state: "in_progress" });
}

async function getGameSession(gameId: string): Promise<GameSessionPlayer[] | null> {
  const gameRef = ref(database, `games/${gameId}`);

  try {
    const snapshot = await get(gameRef);
    if (snapshot.exists()) {
      const gameData = snapshot.val() as GameData | null;
      const players: GameSessionPlayer[] = [];

      if (gameData && gameData.players) {
        Object.entries(gameData.players).forEach(([playerId, playerData]: [string, PlayerData]) => {
          players.push({
            playerId,
            questionsSolved: playerData.questionsSolved,
          });
        });
      }

      return players;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching game session:", error);
    return null;
  }
}

export {
  getGameSession,
  createGameSession,
  joinGameSession,
  updatePlayerPosition,
  getAvailableGames,
  endGameSession,
  startGameSession,
  setQuestions,
};
