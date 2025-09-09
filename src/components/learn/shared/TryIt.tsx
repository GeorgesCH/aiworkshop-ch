import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../LanguageProvider';

interface TryItProps {
  titleKey?: string;
  promptKey?: string;
  checklist?: string[];
  onComplete?: () => void;
}

export function TryIt({ titleKey = 'learn.try_it_title', promptKey = 'learn.try_it_prompt', checklist = [], onComplete }: TryItProps) {
  const { t } = useLanguage();
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const allDone = checklist.length > 0 && checklist.every((_, i) => done[i]);

  return (
    <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" aria-hidden="true" />
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{t(titleKey, 'Try it: Practical Exercise')}</CardTitle>
          {(completed || allDone) && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 ml-2">{t('learn.completed', 'Completed')}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="text-gray-700">
          {t(promptKey, 'Open your favorite LLM. Ask it to generate three business use-cases for this topic, then refine one to a concrete SOP with steps and tools.')}
        </div>
        {checklist.length > 0 && (
          <div className="space-y-2">
            {checklist.map((item, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <Checkbox checked={!!done[i]} onCheckedChange={(v: any) => setDone(d => ({ ...d, [i]: !!v }))} />
                <span className="text-gray-600">{item}</span>
              </label>
            ))}
          </div>
        )}
        <div className="space-y-2">
          {justCompleted && (
            <div className="text-sm text-green-600 font-medium animate-in fade-in duration-300">
              ✓ {t('learn.progress_saved', 'Progress saved!')}
            </div>
          )}
          <Button
            variant={completed ? 'default' : (allDone ? 'default' : 'outline')}
            className="gap-2"
            onClick={() => {
              if (onComplete) {
                onComplete();
                setCompleted(true);
                setJustCompleted(true);
                // Reset the "just completed" state after a brief moment
                setTimeout(() => setJustCompleted(false), 2000);
              }
            }}
            disabled={completed}
          >
            <CheckCircle2 className="w-4 h-4" /> 
            {completed 
              ? t('learn.completed', 'Completed') 
              : (allDone ? t('learn.mark_completed', 'Mark as completed') : t('learn.mark_progress', 'Save progress'))
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface MiniQuizQ {
  q: string;
  a: string[];
  correct: number;
}

export function MiniQuiz({ questions, onPass }: { questions: MiniQuizQ[]; onPass?: () => void }) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const correctCount = answers.reduce((acc, a, i) => acc + (a === questions[i].correct ? 1 : 0), 0);

  return (
    <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" aria-hidden="true" />
      <CardHeader className="relative pb-3">
        <CardTitle className="text-lg">{t('learn.quick_quiz', 'Quick Quiz')}</CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <div className="font-medium text-sm">{q.q}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.a.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setAnswers(ans => ans.map((v, ii) => ii === i ? idx : v))}
                  className={`text-left p-2 rounded border ${answers[i] === idx ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button onClick={() => { setSubmitted(true); if (correctCount === questions.length && onPass) onPass(); }}>
            {t('learn.submit_quiz', 'Submit quiz')}
          </Button>
          {submitted && (
            <div className="text-sm text-gray-600">{t('learn.score', 'Score')}: {correctCount}/{questions.length}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

