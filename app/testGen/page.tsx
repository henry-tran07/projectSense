"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { test2 } from "./data";
import { updateGeneratedQuestions } from "../components/QuestionCount";

interface TestQuestion {
  [key: string]: string;
}

interface FeedbackItem {
  question: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface GradeResult {
  number_correct: number;
  score: number;
  feedback: FeedbackItem[];
}

function TestGenerator() {
  const router = useRouter();
  const [text, setText] = useState<Record<string, string> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<GradeResult | null>(null);
  const [answers, setAnswers] = useState<string[]>(new Array(40).fill(""));
  const [answerKey, setAnswerKey] = useState<Record<string, string> | null>(null);
  const [lastQuestion, setLastQuestion] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const prompt1 = `You are tasked with generating an answer key for a UIL Number Sense test. For each problem in the JSON object provided, compute the correct answer and return the answer key as a JSON object with the same keys but with the computed answers. Make sure to:
      1. Format fractions as "a/b" or "a b/c" for mixed numbers
      2. Round decimal answers to 2 decimal places
      3. Include units where specified
      4. For base conversions, write the answer in the target base
      5. For word problems, provide the exact numerical answer

      Here is the list of math problems: ${JSON.stringify(text)}`;

      const answerKeyResponse = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt1 }),
      });
      if (!answerKeyResponse.ok) throw new Error("Failed to generate answer key");
      const json = await answerKeyResponse.json();
      setAnswerKey(json);

      // Convert user answers to a more comparable format
      const userJson: Record<string, string> = answers.reduce(
        (obj: Record<string, string>, item: string, index: number) => {
          if (item.trim() !== "") {
            obj[index + 1] = item.trim();
            setLastQuestion(index + 1);
          }
          return obj;
        },
        {}
      );

      // Use AI to compare answers and calculate score
      const prompt2 = `You are grading a UIL Number Sense test. Compare the user's answers to the correct answers and return a JSON object with:
      1. number_correct: the number of questions answered correctly
      2. score: calculate using UIL rules (5 points per question up to last answered, -4 for each wrong answer)
      3. feedback: an array of objects with:
         - question: the question number
         - userAnswer: the user's answer
         - correctAnswer: the correct answer
         - isCorrect: boolean indicating if the answer is correct

      Consider answers correct if they match exactly or are equivalent (e.g., "1/2" and "0.5" are equivalent).

      Answer key: ${JSON.stringify(json)}
      User's Answers: ${JSON.stringify(userJson)}
      Last Question Answered: ${lastQuestion}`;

      const gradeResponse = await fetch("/api/grade-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt2 }),
      });
      if (!gradeResponse.ok) throw new Error("Failed to grade test");
      const gradeResult = await gradeResponse.json();
      setResults(gradeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while grading");
      setSubmitting(false);
    }
  };

  async function run() {
    updateGeneratedQuestions(40);
    try {
      setGenerating(true);
      setError(null);
      const prompt = `Create a UIL Number Sense test with 40 questions. Follow these guidelines:
      1. Questions should be solvable mentally without calculators
      2. Include a mix of:
         - Basic arithmetic (addition, subtraction, multiplication, division)
         - Fractions and mixed numbers
         - Percentages
         - Square roots and exponents
         - Base conversions
         - Word problems
         - Number theory (GCD, LCM, prime factors)
         - Algebra (simple equations, inequalities)
         - Geometry (area, perimeter, conversions)
         - Sequences and patterns
      3. Format each question with "_________" for the answer
      4. Specify answer format in parentheses when needed (e.g., "fraction", "mixed number", "base 8")
      5. Include units where appropriate
      6. Progress from easier to harder questions
      7. Use the following example format but with different numbers and variations:
      ${JSON.stringify(test2)}
      8. DO NOT COPY THE EXAMPLE NUMBERS, MAKE UP YOUR OWN QUESTIONS
      Return the test as a JSON object where keys are question numbers and values are the questions.`;

      const response = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Failed to generate test");
      const json = await response.json();
      setText(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating the test");
      setGenerating(false);
    } finally {
      setGenerating(false);
    }
  }

  // Error display component
  const ErrorDisplay = ({ onRetry }: { onRetry: () => void }) => (
    <Card className="border-red-300 bg-red-50 max-w-md">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-center text-red-700 font-medium">{error}</p>
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );

  // Initial view: generate button or loading spinner
  if (text === null) {
    return (
      <main className="w-full page-gradient flex flex-col items-center justify-center gap-6 p-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/home")}
          className="absolute top-4 left-4 glass-button text-orange-700 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Button>

        {error ? (
          <ErrorDisplay
            onRetry={() => {
              setError(null);
              setGenerating(true);
              run();
            }}
          />
        ) : generating ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <Loader2 className="h-16 w-16 animate-spin text-orange-600" />
              <p className="text-orange-700 text-xl font-medium">Generating UIL Number Sense Test...</p>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => {
              setGenerating(true);
              run();
            }}
            size="lg"
            className="glass-card text-orange-700 hover:shadow-2xl text-2xl md:text-4xl font-bold py-6 px-8 md:py-8 md:px-12 h-auto transition-all duration-300 hover:-translate-y-1"
          >
            Generate UIL Number Sense Test
            <Send className="h-6 w-6 md:h-8 md:w-8 ml-3" />
          </Button>
        )}
      </main>
    );
  }

  // Grading view: spinner while grading
  if (submitting && results === null) {
    return (
      <main className="w-full page-gradient flex items-center justify-center p-4">
        {error ? (
          <ErrorDisplay
            onRetry={() => {
              setError(null);
              handleSubmit();
            }}
          />
        ) : (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <Loader2 className="h-16 w-16 animate-spin text-orange-600" />
              <p className="text-orange-700 text-xl font-medium">Grading your test...</p>
            </CardContent>
          </Card>
        )}
      </main>
    );
  }

  // Results view: answer key, feedback, score
  if (submitting && results !== null) {
    return (
      <main className="w-full page-gradient font-mono">
        <div className="glass-header flex items-center justify-between p-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/home")}
            className="glass-button text-orange-700 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Home
          </Button>
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md text-center flex-1">
            Answer Key
          </h1>
          <div className="w-20" />
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-4 p-4">
          {/* Score panel */}
          <Card className="lg:w-[30%] glass-card bg-orange-500/30 lg:order-last">
            <CardHeader className="text-center">
              <CardTitle className="text-orange-700 text-2xl">Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <p className="text-5xl md:text-7xl font-bold text-orange-700">{results?.score || 0}</p>
              <p className="text-lg md:text-xl text-gray-800 text-center">
                Questions Correct: {results?.number_correct || 0}
              </p>
              <p className="text-sm md:text-base text-gray-500 text-center mt-2">
                Make sure to check yourself! AI could be wrong.
              </p>
            </CardContent>
          </Card>

          {/* Answers comparison */}
          <div className="lg:w-[70%] flex flex-col md:flex-row gap-4">
            {/* Your Answers */}
            <Card className="flex-1 glass-card max-h-[70vh] overflow-y-auto">
              <CardHeader className="sticky top-0 bg-white/70 backdrop-blur-xl z-10">
                <CardTitle className="text-orange-700 text-xl md:text-2xl text-center">
                  Your Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results?.feedback?.map((item: FeedbackItem, index: number) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50 border">
                    <p className="text-sm text-gray-600 mb-1">
                      {item.question}. {text[item.question]}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.isCorrect ? "default" : "destructive"}>
                        {item.isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                      <span
                        className={`text-sm font-medium ${item.isCorrect ? "text-green-600" : "text-red-600"}`}
                      >
                        {item.userAnswer}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Correct Answers */}
            <Card className="flex-1 glass-card max-h-[70vh] overflow-y-auto">
              <CardHeader className="sticky top-0 bg-white/70 backdrop-blur-xl z-10">
                <CardTitle className="text-orange-700 text-xl md:text-2xl text-center">
                  Correct Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {answerKey &&
                  Object.entries(answerKey).map(([_key, item], index: number) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50 border">
                      <p className="text-sm text-gray-600 mb-1">
                        {index + 1}. {text[index + 1]}
                      </p>
                      <span className="text-sm font-medium text-green-600">Answer: {item}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Test view: 40 questions with answer inputs
  return (
    <main className="w-full page-gradient font-mono">
      <div className="sticky top-0 z-20 glass-header p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/home")}
            className="glass-button text-orange-700 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Home
          </Button>
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">UIL Number Sense Practice</h1>
            <p className="text-sm md:text-base text-white/70">
              Press Tab to go to the next question faster
            </p>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <Card className="border-red-300 bg-red-50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto border-red-300 text-red-700 hover:bg-red-100"
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        {text &&
          Object.entries(text).map(([_key, item], index: number) =>
            item ? (
              <Card
                key={index}
                className="glass-card hover:shadow-2xl transition-all duration-200"
              >
                <CardContent className="flex items-center gap-3 p-3 md:p-4">
                  <span className="text-orange-400 font-bold text-lg md:text-xl min-w-[3rem] text-center shrink-0">
                    ({index + 1})
                  </span>
                  <p className="text-orange-500 font-bold text-sm md:text-lg flex-1">{item}</p>
                  <Input
                    type="text"
                    value={answers[index] || ""}
                    onChange={handleInputChange(index)}
                    className="w-24 md:w-32 text-center font-medium border-orange-200 focus-visible:ring-orange-400"
                    placeholder="Answer"
                  />
                </CardContent>
              </Card>
            ) : null
          )}
      </div>

      <div className="sticky bottom-0 glass-header border-t border-b-0 p-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="glass-card text-orange-700 hover:shadow-2xl text-xl md:text-2xl font-bold py-4 px-10 h-auto transition-all duration-200 hover:-translate-y-0.5"
          >
            Submit Test
            <Send className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </main>
  );
}

export default TestGenerator;
