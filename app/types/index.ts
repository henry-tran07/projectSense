export interface UserSettings {
  questionLimited: boolean;
  rightLeft: boolean;
  autoEnter: boolean;
}

export interface LeaderboardEntry {
  email: string;
  time: string;
}

export interface LeaderboardScores {
  [email: string]: string;
}

export interface GameSession {
  state: "waiting" | "in_progress" | "ended";
  createdAt: number;
  hostId: string;
  players: Record<string, { questionsSolved: number }>;
  questions: string;
  startTime?: number;
}

export interface ProblemPair {
  body: string;
  ans: string;
}

export interface TrickConfig {
  function: () => ProblemPair;
  probability: number;
  column: number;
  type: string;
}

export interface GradingResult {
  questionNumber: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface GeneratedTest {
  questions: string[];
  answers: string[];
}
