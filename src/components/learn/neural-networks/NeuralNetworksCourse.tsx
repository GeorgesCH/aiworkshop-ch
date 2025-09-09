import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";
import { Progress } from "../../ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Slider } from "../../ui/slider";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

type Dataset = "AND" | "OR";
type QuizState = { q1?: string; q2?: string; q3?: string };
type CourseState = {
  activationDone: boolean;
  perceptronDone: boolean;
  quizSubmitted: boolean;
  quiz: QuizState;
  quizScore: number;
  activationX: number;
  w1: number;
  w2: number;
  b: number;
  dataset: Dataset;
};

interface NeuralNetworksCourseProps {
  language: string;
  onComplete: () => void;
}

export function NeuralNetworksCourse({ language, onComplete }: NeuralNetworksCourseProps) {
  const { t } = useLanguage();

  const storageKey = useMemo(() => `nn-course-v1-${language}`, [language]);
  const [state, setState] = useState<CourseState>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) return JSON.parse(raw) as CourseState;
      } catch {}
    }
    return {
      activationDone: false,
      perceptronDone: false,
      quizSubmitted: false,
      quiz: {},
      quizScore: 0,
      activationX: 0,
      w1: 1,
      w2: 1,
      b: -0.5,
      dataset: "OR",
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, storageKey]);

  const overallProgress = useMemo(() => {
    let completed = 0;
    if (state.activationDone) completed += 1;
    if (state.perceptronDone) completed += 1;
    if (state.quizSubmitted) completed += 1;
    return (completed / 3) * 100;
  }, [state.activationDone, state.perceptronDone, state.quizSubmitted]);

  // Sync completion with global learning progress
  useEffect(() => {
    if (state.activationDone && state.perceptronDone && state.quizSubmitted) {
      onComplete();
    }
  }, [state.activationDone, state.perceptronDone, state.quizSubmitted, onComplete]);

  // Activation functions
  const x = state.activationX;
  const sigmoid = 1 / (1 + Math.exp(-x));
  const tanh = Math.tanh(x);
  const relu = Math.max(0, x);

  // Perceptron exercise helpers
  const datasets: Record<Dataset, Array<{ x1: number; x2: number; y: number }>> = {
    AND: [
      { x1: 0, x2: 0, y: 0 },
      { x1: 0, x2: 1, y: 0 },
      { x1: 1, x2: 0, y: 0 },
      { x1: 1, x2: 1, y: 1 },
    ],
    OR: [
      { x1: 0, x2: 0, y: 0 },
      { x1: 0, x2: 1, y: 1 },
      { x1: 1, x2: 0, y: 1 },
      { x1: 1, x2: 1, y: 1 },
    ],
  };

  const points = datasets[state.dataset];
  const predictions = points.map((p) => {
    const s = state.w1 * p.x1 + state.w2 * p.x2 + state.b;
    return s > 0 ? 1 : 0;
  });
  const correct = predictions.filter((pred, i) => pred === points[i].y).length;
  const allCorrect = correct === points.length;

  useEffect(() => {
    if (allCorrect && !state.perceptronDone) {
      setState((prev) => ({ ...prev, perceptronDone: true }));
    }
  }, [allCorrect, state.perceptronDone]);

  // Helpful hints for learn-by-doing (no markup change outside existing containers)
  const perceptronHint = useMemo(() => {
    // Provide gentle guidance toward known good solutions
    if (state.dataset === "AND") {
      return "Tip: For AND, you need a stricter threshold. Try w1≈1.0, w2≈1.0, b≈-1.5. Decision: x1 + x2 - 1.5 > 0 ⇒ only (1,1) is 1.";
    }
    return "Tip: For OR, set a lower threshold. Try w1≈1.0, w2≈1.0, b≈-0.5. Decision: x1 + x2 - 0.5 > 0 ⇒ any input with a 1 becomes 1.";
  }, [state.dataset]);

  const boundaryEquation = useMemo(() => {
    if (Math.abs(state.w2) <= 1e-6) return "w2≈0 — adjust w2 to draw the boundary.";
    const m = -(state.w1 / state.w2);
    const c = -(state.b / state.w2);
    return `y = ${m.toFixed(2)}·x + ${c.toFixed(2)}`;
  }, [state.w1, state.w2, state.b]);

  return (
    <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
      <CardContent className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.course_title")}</h2>
          <div className="w-48">
            <div className="flex items-center justify-between text-xs mb-1 text-gray-600">
              <span>{t("neural_networks.progress_title")}</span>
              <span className="font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {state.activationDone && (
            <Badge variant="outline" className="gap-1 border-green-500/20 text-green-600 bg-transparent">
              <CheckCircle className="w-3 h-3" /> {t("neural_networks.activation_title")}
            </Badge>
          )}
          {state.perceptronDone && (
            <Badge variant="outline" className="gap-1 border-green-500/20 text-green-600 bg-transparent">
              <CheckCircle className="w-3 h-3" /> {t("neural_networks.perceptron_play_title")}
            </Badge>
          )}
          {state.quizSubmitted && (
            <Badge variant="outline" className="gap-1 border-green-500/20 text-green-600 bg-transparent">
              <CheckCircle className="w-3 h-3" /> {t("neural_networks.quiz_title")}
            </Badge>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full">
          {/* Activation Functions Playground */}
          <AccordionItem value="activation">
            <AccordionTrigger>
              <div className="text-left">
                <div className="text-base font-medium">{t("neural_networks.activation_title")}</div>
                <div className="text-xs text-gray-600">{t("neural_networks.activation_description")}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>{t("neural_networks.input_x")}</span>
                    <span className="font-medium">{x.toFixed(2)}</span>
                  </div>
                  <Slider
                    min={-6}
                    max={6}
                    step={0.1}
                    value={[x]}
                    onValueChange={(v) => setState((s) => ({ ...s, activationX: v[0] }))}
                  />
                </div>
                <div className="grid gap-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{t("neural_networks.sigmoid")}</span>
                      <span className="font-medium">{sigmoid.toFixed(3)}</span>
                    </div>
                    <Progress value={sigmoid * 100} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{t("neural_networks.tanh")}</span>
                      <span className="font-medium">{tanh.toFixed(3)}</span>
                    </div>
                    <Progress value={((tanh + 1) / 2) * 100} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{t("neural_networks.relu")}</span>
                      <span className="font-medium">{relu.toFixed(3)}</span>
                    </div>
                    <Progress value={(Math.min(relu, 6) / 6) * 100} />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant={state.activationDone ? "secondary" : "default"}
                  onClick={() => setState((s) => ({ ...s, activationDone: true }))}
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {state.activationDone ? t("neural_networks.completed_label") : t("neural_networks.mark_complete")}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Perceptron Boundary */}
          <AccordionItem value="perceptron">
            <AccordionTrigger>
              <div className="text-left">
                <div className="text-base font-medium">{t("neural_networks.perceptron_play_title")}</div>
                <div className="text-xs text-gray-600">{t("neural_networks.perceptron_play_description")}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">{t("neural_networks.dataset")}</Label>
                    <RadioGroup
                      value={state.dataset}
                      onValueChange={(v) => setState((s) => ({ ...s, dataset: v as Dataset }))}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="ds-and" value="AND" />
                        <Label htmlFor="ds-and">{t("neural_networks.dataset_and")}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="ds-or" value="OR" />
                        <Label htmlFor="ds-or">{t("neural_networks.dataset_or")}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm mb-1 block">{t("neural_networks.weight_w1")}: {state.w1.toFixed(2)}</Label>
                    <Slider min={-2} max={2} step={0.05} value={[state.w1]} onValueChange={(v) => setState((s) => ({ ...s, w1: v[0] }))} />
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t("neural_networks.weight_w2")}: {state.w2.toFixed(2)}</Label>
                    <Slider min={-2} max={2} step={0.05} value={[state.w2]} onValueChange={(v) => setState((s) => ({ ...s, w2: v[0] }))} />
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t("neural_networks.bias_b")}: {state.b.toFixed(2)}</Label>
                    <Slider min={-2} max={2} step={0.05} value={[state.b]} onValueChange={(v) => setState((s) => ({ ...s, b: v[0] }))} />
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline">
                      {t("neural_networks.points_classified")} {correct} {t("neural_networks.of")} {points.length}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setState((s) => ({ ...s, w1: 1, w2: 1, b: s.dataset === "OR" ? -0.5 : -1.5, perceptronDone: false }))
                      }
                    >
                      {t("neural_networks.reset")}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600">
                    {perceptronHint}
                  </div>
                  <div className="text-xs text-gray-600">
                    Decision boundary: {boundaryEquation}
                  </div>
                </div>

                {/* Tiny plot */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
                  <svg viewBox="0 0 200 200" className="w-full h-64">
                    {/* axes */}
                    <line x1="20" y1="180" x2="180" y2="180" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="20" y1="180" x2="20" y2="20" stroke="#94a3b8" strokeWidth="1" />
                    {/* points */}
                    {points.map((p, i) => {
                      const px = 20 + p.x1 * 160;
                      const py = 180 - p.x2 * 160;
                      const pred = predictions[i];
                      const fill = p.y === 1 ? "#3b82f6" : "#94a3b8";
                      const stroke = pred === p.y ? "#16a34a" : "#ef4444";
                      return <circle key={i} cx={px} cy={py} r={8} fill={fill} stroke={stroke} strokeWidth={2} />;
                    })}
                    {/* decision boundary: w1*x + w2*y + b = 0 => y = -(w1/w2)x - b/w2 */}
                    {Math.abs(state.w2) > 1e-6 && (
                      (() => {
                        const yAt0 = -state.b / state.w2; // at x=0
                        const yAt1 = -(state.w1 * 1 + state.b) / state.w2; // at x=1
                        const P = (x: number, y: number) => ({ X: 20 + x * 160, Y: 180 - y * 160 });
                        const p1 = P(0, yAt0);
                        const p2 = P(1, yAt1);
                        return <line x1={p1.X} y1={p1.Y} x2={p2.X} y2={p2.Y} stroke="#f59e0b" strokeWidth={2} />;
                      })()
                    )}
                  </svg>
                  {allCorrect && (
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> {t("neural_networks.completed_label")}
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Quiz */}
          <AccordionItem value="quiz">
            <AccordionTrigger>
              <div className="text-left">
                <div className="text-base font-medium">{t("neural_networks.quiz_title")}</div>
                <div className="text-xs text-gray-600">{t("neural_networks.quiz_description")}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {/* Q1 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">{t("neural_networks.quiz_q1")}</div>
                  <RadioGroup
                    value={state.quiz.q1}
                    onValueChange={(v) => setState((s) => ({ ...s, quiz: { ...s.quiz, q1: v } }))}
                  >
                    {[
                      { id: "q1a1", label: t("neural_networks.quiz_q1_a1"), value: "cnn" },
                      { id: "q1a2", label: t("neural_networks.quiz_q1_a2"), value: "rnn" },
                      { id: "q1a3", label: t("neural_networks.quiz_q1_a3"), value: "perceptron" },
                    ].map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <RadioGroupItem id={opt.id} value={opt.value} />
                        <Label htmlFor={opt.id}>{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q2 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">{t("neural_networks.quiz_q2")}</div>
                  <RadioGroup
                    value={state.quiz.q2}
                    onValueChange={(v) => setState((s) => ({ ...s, quiz: { ...s.quiz, q2: v } }))}
                  >
                    {[
                      { id: "q2a1", label: t("neural_networks.quiz_q2_a1"), value: "rnn" },
                      { id: "q2a2", label: t("neural_networks.quiz_q2_a2"), value: "cnn" },
                      { id: "q2a3", label: t("neural_networks.quiz_q2_a3"), value: "mlp" },
                    ].map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <RadioGroupItem id={opt.id} value={opt.value} />
                        <Label htmlFor={opt.id}>{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q3 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">{t("neural_networks.quiz_q3")}</div>
                  <RadioGroup
                    value={state.quiz.q3}
                    onValueChange={(v) => setState((s) => ({ ...s, quiz: { ...s.quiz, q3: v } }))}
                  >
                    {[
                      { id: "q3a1", label: t("neural_networks.quiz_q3_a1"), value: "mlp" },
                      { id: "q3a2", label: t("neural_networks.quiz_q3_a2"), value: "cnn" },
                      { id: "q3a3", label: t("neural_networks.quiz_q3_a3"), value: "rnn" },
                    ].map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <RadioGroupItem id={opt.id} value={opt.value} />
                        <Label htmlFor={opt.id}>{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => {
                      const correctMap = { q1: "cnn", q2: "rnn", q3: "mlp" } as const;
                      const score = (state.quiz.q1 === correctMap.q1 ? 1 : 0) +
                        (state.quiz.q2 === correctMap.q2 ? 1 : 0) +
                        (state.quiz.q3 === correctMap.q3 ? 1 : 0);
                      setState((s) => ({ ...s, quizSubmitted: true, quizScore: score }));
                    }}
                    className="gap-2"
                  >
                    {t("neural_networks.quiz_submit")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  {state.quizSubmitted && (
                    <Badge variant="outline">
                      {t("neural_networks.quiz_score")} {state.quizScore}/3
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.removeItem(storageKey);
              }
              setState({
                activationDone: false,
                perceptronDone: false,
                quizSubmitted: false,
                quiz: {},
                quizScore: 0,
                activationX: 0,
                w1: 1,
                w2: 1,
                b: -0.5,
                dataset: "OR",
              });
            }}
          >
            {t("neural_networks.reset_progress")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

