import React, { useEffect } from "react";

interface TimerProps {
  secondsLeft: number;
  setSecondsLeft: (value: React.SetStateAction<number>) => void; // Callback function when timer reaches 0
  score: number;
  setScore: (value: React.SetStateAction<number>) => void; // Callback function when timer reaches 0
}

const TimerComponent: React.FC<TimerProps> = ({ secondsLeft, setSecondsLeft, score, setScore }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (secondsLeft > 0) {
        // Decrease secondsLeft by 1 every second
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      } else {
        clearInterval(interval); // Stop the interval when secondsLeft reaches 0
      }
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [secondsLeft, setSecondsLeft]); // Add secondsLeft and onTimeUp to dependency array to ensure effect runs when they change

  // Format seconds to display as SS
  const formatTime = (seconds: number): string => {
    return seconds.toString().padStart(2, "0");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="glass-pill text-orange-700 text-sm font-mono font-semibold">
        {formatTime(secondsLeft)}
      </span>
      <span className="glass-pill text-orange-700 text-sm font-mono font-semibold">
        {score}pts
      </span>
    </div>
  );
};

export default TimerComponent;
