import { useEffect, useState } from "react";
import { problemFunction } from "../utils/problemGenerator";
import MathComponent from "./MathComponent";
import { updateAnsweredQuestions, updateGeneratedQuestions } from "@/app/components/QuestionCount";

type TrickProps = {
  trick: string;
  question: number;
  setQuestion: (value: React.SetStateAction<number>) => void;
  questionLimited: boolean;
  rightLeft: boolean;
  setQuestionTiming: (value: React.SetStateAction<string[]>) => void;
  setStoredQuestion: (value: React.SetStateAction<string[]>) => void;
};

const Trick: React.FC<TrickProps> = ({
  trick,
  setQuestion,
  question,
  questionLimited,
  rightLeft,
  setStoredQuestion,
  setQuestionTiming,
}) => {
  const [userAns, setUserAns] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pair, setPair] = useState({ body: "", ans: "temp" });
  const [type, setType] = useState("");
  const [trickId, setTrickId] = useState(trick);
  const [randomizer, setRandomizer] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);

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

  useEffect(() => {
    let currentTrickId = trick;
    if (trick === "randomizer") {
      setRandomizer(true);
      currentTrickId = String(Math.floor(Math.random() * 52) + 1);
      setTrickId(currentTrickId);
    } else {
      setTrickId(trick);
    }
    setPair(problemFunction[currentTrickId].function());
    setType(problemFunction[currentTrickId].type);
  }, [trick]);

  useEffect(() => {
    if (trickId === "13" || trickId === "44") {
      if (Math.abs(Number(userAns) - Number(pair["ans"])) <= Number(pair["ans"]) * 0.05) {
        let nextTrickId = trickId;
        if (randomizer) {
          nextTrickId = String(Math.floor(Math.random() * 52) + 1);
          setTrickId(nextTrickId);
        }
        setQuestionTiming((prevTimes: string[]) => [...prevTimes, formatTime(elapsedTime)]);
        setStartTime(Date.now());
        setStoredQuestion((prevTimes: string[]) => [
          ...prevTimes,
          pair["body"] + " = " + pair["ans"],
        ]);
        setPair(problemFunction[nextTrickId].function());
        setUserAns(""); // Reset user answer
        updateAnsweredQuestions();
        if (questionLimited && !randomizer) setQuestion(question + 1);
      }
    } else if (userAns === pair["ans"]) {
      let nextTrickId = trickId;
      if (randomizer) {
        nextTrickId = String(Math.floor(Math.random() * 52) + 1);
        setTrickId(nextTrickId);
      }
      setQuestionTiming((prevTimes: string[]) => [...prevTimes, formatTime(elapsedTime)]);
      setStartTime(Date.now());
      setStoredQuestion((prevTimes: string[]) => [
        ...prevTimes,
        pair["body"] + " = " + pair["ans"],
      ]);
      setPair(problemFunction[nextTrickId].function());
      setUserAns(""); // Reset user answer
      updateAnsweredQuestions();
      if (questionLimited && !randomizer) setQuestion(question + 1);
    }
  }, [userAns, pair, trickId, setQuestion, question, questionLimited]);

  const formatTime = (time: number) => {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`font-semibold ${
        trickId === "19" ||
        trickId === "26" ||
        trickId === "27" ||
        trickId === "35" ||
        trickId === "42" ||
        trickId === "43"
          ? "text-[1.7rem] md:text-[2.3rem]"
          : "text-[2.6rem] md:text-6xl"
      } w-full flex flex-col md:flex-row items-center justify-center gap-4 px-4 text-white`}
    >
      {question < 5 ? (
        <>
          <div className={`text-center md:text-left ml-[0px] w-full md:w-auto `}>
            <MathComponent math={pair["body"]} />
          </div>
          <div className="text-center md:text-left w-full md:w-auto">=</div>
          <input
            autoFocus={true}
            className="glass-input text-center font-mono text-3xl md:text-5xl text-white w-2/3 md:w-1/4"
            type="text"
            value={userAns}
            onChange={(e) => {
              if (rightLeft)
                if (e.target.value.length < userAns.length) {
                  setUserAns(userAns.substring(1));
                } else setUserAns(e.target.value.substring(e.target.value.length - 1) + userAns);
              else setUserAns(e.target.value);
            }}
          />
          <label className="text-[3.0rem] mt-2 md:mt-0 w-full md:w-auto text-center">{type}</label>
        </>
      ) : null}
    </div>
  );
};

export default Trick;
