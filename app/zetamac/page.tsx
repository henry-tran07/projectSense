"use client";

import React, { useState, useEffect, useCallback } from "react";
import { evaluate } from "mathjs";
import { PageShell } from "../components/PageShell";
import { PageHeader } from "../components/PageHeader";

class MathGame {
  private question: string;
  private answer: number;
  private score: number;
  private operations: string[];

  constructor() {
    this.question = "";
    this.answer = 0;
    this.score = 0;
    this.operations = ["+", "-", "*", "/"];
    this.generateQuestion();
  }

  private generateQuestion() {
    const operation = this.operations[Math.floor(Math.random() * this.operations.length)];
    let num1 = Math.floor(Math.random() * 100) + 1;
    let num2 = Math.floor(Math.random() * 100) + 1;

    if (operation === "+") {
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
    } else if (operation === "-") {
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
    } else if (operation === "*") {
      num1 = Math.floor(Math.random() * 11 - 2 + 1) + 2;
      num2 = Math.floor(Math.random() * 99 - 2 + 1) + 2;
    } else if (operation === "/") {
      num2 = Math.floor(Math.random() * 11 - 2 + 1) + 2;
      num1 = num2 * (Math.floor(Math.random() * 10) + 2);
    } else {
      throw new Error("Unknown operation");
    }

    this.question = `${num1} ${operation} ${num2}`;
    this.answer = evaluate(this.question) as number;
  }

  public getQuestion() {
    return this.question;
  }

  public getScore() {
    return this.score;
  }

  public checkAnswer(userAnswer: string) {
    const parsedAnswer = parseFloat(userAnswer);
    if (!isNaN(parsedAnswer) && parsedAnswer === this.answer) {
      this.score += 1;
      this.generateQuestion();
      return true;
    }
    return false;
  }

  public resetGame() {
    this.score = 0;
    this.generateQuestion();
  }
}

const Highscore: React.FC<{ highscore: number }> = ({ highscore }) => (
  <div className="text-2xl font-bold text-orange-600 mt-4">
    <p>Highscore: {highscore}</p>
  </div>
);

const MathGameComponent: React.FC = () => {
  const [game, setGame] = useState(new MathGame());
  const [currentQuestion, setCurrentQuestion] = useState(game.getQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(game.getScore());
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [highscore, setHighscore] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighscore = parseInt(localStorage.getItem("highscore") || "0", 10);
      setHighscore(savedHighscore);
    }
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const startTime = Date.now();
    const endTime = startTime + timeLeft * 1000;

    const timer = setInterval(() => {
      const currentTime = Date.now();
      const remainingTime = Math.max(Math.floor((endTime - currentTime) / 1000), 0);
      setTimeLeft(remainingTime);
      if (remainingTime <= 0) {
        clearInterval(timer);
        setGameOver(true);
        if (score > highscore) {
          setHighscore(score);
          localStorage.setItem("highscore", score.toString());
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, highscore]);

  useEffect(() => {
    if (!gameOver) {
      setCurrentQuestion(game.getQuestion());
      setScore(game.getScore());
    }
  }, [game, gameOver]);

  const handleAnswerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (gameOver) return;

      const answer = e.target.value;
      setUserAnswer(answer);

      if (game.checkAnswer(answer)) {
        setScore(game.getScore());
        setCurrentQuestion(game.getQuestion());
        setUserAnswer("");
      }
    },
    [game, gameOver]
  );

  const handlePlayAgain = useCallback(() => {
    const newGame = new MathGame();
    setGame(newGame);
    setCurrentQuestion(newGame.getQuestion());
    setScore(newGame.getScore());
    setTimeLeft(120); // Reset timer immediately
    setGameOver(false);
  }, []);

  if (gameOver) {
    return (
      <PageShell className="flex flex-col">
        <PageHeader title="Zetamac" backHref="/home" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="glass-card-elevated p-8 flex flex-col items-center gap-4 animate-scale-in max-w-md w-full">
            <h2 className="font-display text-3xl font-bold text-orange-700">Game Over</h2>
            <p className="font-display text-6xl md:text-8xl font-bold text-orange-700">{score}</p>
            <p className="text-lg text-gray-600">points</p>
            {score > highscore && (
              <span className="text-amber-500 font-bold animate-count-up">New High Score!</span>
            )}
            <Highscore highscore={Math.max(score, highscore)} />
            <button onClick={handlePlayAgain} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-8 py-3 text-lg transition-all duration-200 active:scale-95">
              Play Again
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="flex flex-col">
      <PageHeader
        title="Zetamac"
        backHref="/home"
        rightSlot={
          <div className="flex items-center gap-2">
            <span className="glass-pill text-orange-700 text-sm font-semibold">Score: {score}</span>
            <span className={`glass-pill text-sm font-mono font-semibold ${timeLeft < 30 ? 'text-red-500' : 'text-orange-700'}`}>
              {timeLeft}s
            </span>
          </div>
        }
      />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <div className="glass-surface p-8 rounded-2xl flex items-center gap-4">
          <span className="font-display text-5xl md:text-7xl text-white font-semibold">{currentQuestion}</span>
          <span className="text-4xl md:text-5xl text-white/80 font-semibold">=</span>
          <input
            type="text"
            value={userAnswer}
            onChange={handleAnswerChange}
            className="glass-input font-mono text-4xl text-white text-center w-40 md:w-56"
            autoFocus
          />
        </div>
      </div>
    </PageShell>
  );
};

export default MathGameComponent;
