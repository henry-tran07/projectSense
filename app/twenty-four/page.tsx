"use client";
import { useEffect, useState } from "react";
import MathComponent from "../components/MathComponent";
import { MdOutlineRestartAlt } from "react-icons/md";
import { combs } from "./dict";
import { evaluate } from "mathjs";
import TimerComponent from "./TimerComponent";
import { PageShell } from "../components/PageShell";
import { PageHeader } from "../components/PageHeader";

export default function Home() {
  const [selectedNums, setSelectedNums] = useState<number[]>([]);
  const [currentComb, setCurrentComb] = useState<string[]>([]);
  const [symbol, setSymbol] = useState<string>("");
  const [save, setSave] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize currentComb with a random combination from combs
    const temp = combs[Math.floor(Math.random() * combs.length)].split(" ");
    setCurrentComb(temp);
    setSave(temp);
  }, []);

  useEffect(() => {
    if (currentComb.length === 1 && currentComb[0] === "24") {
      const temp = combs[Math.floor(Math.random() * combs.length)].split(" ");
      setCurrentComb(temp);
      setSave(temp);
      setSecondsLeft(secondsLeft + 5);
      setScore(score + 5);
    }
  }, [currentComb]);

  useEffect(() => {
    if (selectedNums.length === 2 && symbol !== "") {
      try {
        // Evaluate the expression in ans
        const evalResult = evaluate(
          currentComb[selectedNums[0]] + symbol + currentComb[selectedNums[1]]
        );

        // Update currentComb by filtering out selected indices
        const newComb = currentComb.filter((_, index) => !selectedNums.includes(index));
        setCurrentComb([...newComb, String(evalResult)]);

        // Clear selectedNums and ans after evaluation
        setSelectedNums([]);
        setSymbol(""); // Reset ans to an empty string after evaluation
      } catch (error) {
        console.error("Evaluation error:", error);
      }
    }
  }, [selectedNums, symbol]);

  return (
    <PageShell className="h-screen flex flex-col">
      <PageHeader title="24" backHref="/home" rightSlot={<TimerComponent secondsLeft={secondsLeft} setSecondsLeft={setSecondsLeft} score={score} setScore={setScore} />} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 px-4">
        {/* Number tiles 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {currentComb.map((value: string, index: number) => (
            <button
              key={index}
              onClick={() => {
                if (selectedNums.includes(index)) {
                  // Remove the value from the array if it is included
                  const newSelectedNums = selectedNums.filter((num) => num !== index);
                  setSelectedNums(newSelectedNums);
                } else if (selectedNums.length < 2) {
                  setSelectedNums([...selectedNums, index]);
                }
              }}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl text-3xl md:text-5xl font-extrabold active:scale-95 transition-all duration-150 ${
                selectedNums.includes(index)
                  ? "bg-orange-500/80 text-white backdrop-blur-xl shadow-2xl ring-4 ring-white/50 animate-pulse-glow"
                  : "glass-card text-gray-800 hover:shadow-2xl hover:-translate-y-0.5"
              }`}
            >
              <MathComponent math={value} />
            </button>
          ))}
        </div>
        {/* Operator buttons row */}
        <div className="flex gap-3 md:gap-6">
          {["+", "-", "x", "÷"].map((value: string, index: number) => (
            <button
              key={index}
              onClick={() => {
                setSymbol(value === "x" ? "*" : value === "÷" ? "/" : value);
              }}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl text-xl md:text-3xl font-extrabold active:scale-95 transition-all duration-150 ${
                value === symbol || (value === "x" && symbol === "*") || (value === "÷" && symbol === "/")
                  ? "bg-orange-500/80 text-white ring-4 ring-white/50"
                  : "glass-card text-gray-800 hover:shadow-2xl"
              }`}
            >
              <MathComponent math={value} />
            </button>
          ))}
        </div>
        {/* Action buttons row */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentComb(save);
              setSelectedNums([]);
              setSymbol(""); // Reset ans to an empty string after evaluation
            }}
            className="glass-button rounded-xl px-6 py-3 text-orange-700 font-bold flex items-center gap-2 active:scale-95 transition-all duration-150"
          >
            <MdOutlineRestartAlt className="text-xl" /> Reset
          </button>
          <button
            onClick={() => {
              const temp = combs[Math.floor(Math.random() * combs.length)].split(" ");
              setCurrentComb(temp);
              setSave(temp);
              setSelectedNums([]);
              setSymbol(""); // Reset ans to an empty string after evaluation
            }}
            className="glass-button rounded-xl px-6 py-3 text-orange-700 font-bold active:scale-95 transition-all duration-150"
          >
            Skip
          </button>
        </div>
      </div>
    </PageShell>
  );
}
