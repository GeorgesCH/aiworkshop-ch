import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Alert, AlertDescription } from "../../ui/alert";
import { Info, ArrowRight, Timer } from "lucide-react";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [start, setStart] = useState<number>(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!show) {
      const t = setInterval(() => setElapsed(Date.now() - start), 1000);
      return () => clearInterval(t);
    }
  }, [start, show]);

  const next = () => {
    if (sel === questions[i].correct) setScore((s) => s + 1);
    if (i < questions.length - 1) {
      setI(i + 1);
      setSel(null);
      setShow(false);
      setStart(Date.now());
    } else {
      setShow(true);
    }
  };

  const q = questions[i];
  const done = i === questions.length - 1 && show;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-muted/30 rounded-lg">
        <div>
          <h4 className="text-lg font-semibold mb-1">Knowledge Check Quiz</h4>
          <p className="text-sm text-gray-600">Test your understanding with these quick questions</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Timer className="w-4 h-4" /> {Math.floor(elapsed / 1000)}s
          <Progress value={(i / questions.length) * 100} className="w-24 sm:w-32" />
          <span className="text-xs">{i + 1}/{questions.length}</span>
        </div>
      </div>
      
      <Card className="border-gray-200/50">
        <CardContent className="p-6">
        {!done ? (
          <div>
            <div className="mb-4 font-medium">{q.question}</div>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <Button
                  key={idx}
                  variant={sel === idx ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setSel(idx)}
                >
                  {opt}
                </Button>
              ))}
            </div>
            {sel !== null && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShow(true)}>
                  Check <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
            {show && sel !== null && (
              <div className="mt-4 space-y-3">
                <Alert className={`${sel === q.correct ? "border-green-500" : "border-red-500"}`}>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{sel === q.correct ? "Correct! " : "Incorrect. "}</strong>
                    {q.explanation}
                  </AlertDescription>
                </Alert>
                <div className="flex justify-end">
                  <Button onClick={next}>{i < questions.length - 1 ? "Next" : "Finish"}</Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="text-2xl font-semibold mb-2">Quiz Completed!</div>
            <div className="text-4xl font-bold text-primary mb-2">
              {score} / {questions.length}
            </div>
            <p className="text-gray-600 mb-6">
              {score === questions.length ? "Perfect score! Excellent work!" : 
               score >= questions.length * 0.7 ? "Great job! You understand the concepts well." :
               "Good effort! Consider reviewing the material and trying again."}
            </p>
            <Button onClick={() => { setI(0); setSel(null); setShow(false); setScore(0); setStart(Date.now()); }} size="lg">
              Retake Quiz
            </Button>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Quiz;
