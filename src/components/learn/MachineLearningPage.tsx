import React, { useEffect, useMemo, useState } from "react";
import { motion } from "../../utils/safe-motion";
import { useLanguage } from "../LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { ArrowLeft, Target, Brain, BarChart3, Award, Download } from "lucide-react";

import RegressionLab from "./ml/RegressionLab";
import ClassificationLab from "./ml/ClassificationLab";
import Quiz, { QuizQuestion } from "./ml/Quiz";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnCourseModules, learnHubCourseKey } from "./courseMap";

type Module = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  duration: string;
  content: React.ReactNode;
};

export function MachineLearningPage({ onBackToLearn }: { onBackToLearn: () => void }) {
  const { t } = useLanguage();
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("ml-progress") || "{}");
    } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem("ml-progress", JSON.stringify(completed)); } catch {}
  }, [completed]);

  const questions: QuizQuestion[] = [
    {
      id: "q1",
      question: "What does supervised learning require?",
      options: ["Unlabeled data", "Reward signals", "Labeled examples", "Clustering"],
      correct: 2,
      explanation: "Supervised learning uses labeled input-output pairs to learn a mapping."
    },
    {
      id: "q2",
      question: "Which metric is better for imbalanced classes?",
      options: ["Accuracy", "Precision/Recall", "R²", "MSE"],
      correct: 1,
      explanation: "Precision and recall are more informative for imbalanced classification problems."
    },
    {
      id: "q3",
      question: "What is overfitting?",
      options: [
        "Model generalizes well",
        "Model is too simple",
        "Model memorizes noise and performs poorly on new data",
        "Model uses fewer features"
      ],
      correct: 2,
      explanation: "Overfitting occurs when a model captures noise in the training data and fails to generalize."
    }
  ];

  const modules: Module[] = useMemo(() => [
    {
      id: "intro",
      title: "Machine Learning Fundamentals",
      icon: Brain,
      description: "Understand what ML is and where it’s used.",
      duration: "10 min",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Machine Learning (ML) builds systems that learn from data. Rather than using fixed rules, ML discovers
            patterns that help make predictions or decisions.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
              <CardContent className="relative p-4">
                <div className="font-medium mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Supervised</div>
                <div className="text-sm text-gray-600">Learn from labeled examples</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
              <CardContent className="relative p-4">
                <div className="font-medium mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Unsupervised</div>
                <div className="text-sm text-gray-600">Discover structure in unlabeled data</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
              <CardContent className="relative p-4">
                <div className="font-medium mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Reinforcement</div>
                <div className="text-sm text-gray-600">Learn by rewards and penalties</div>
              </CardContent>
            </Card>
          </div>
          <Alert className="border border-gray-200/60 bg-white/60 backdrop-blur-sm">
            <AlertDescription>
              Tip: Focus on the problem and the data first; the right algorithm follows from them.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: "regression",
      title: "Hands-on: Regression",
      icon: Target,
      description: "Fit a line to predict numeric values.",
      duration: "15 min",
      content: <RegressionLab />
    },
    {
      id: "classification",
      title: "Hands-on: Classification",
      icon: Brain,
      description: "Separate classes with a boundary.",
      duration: "15 min",
      content: <ClassificationLab />
    },
    {
      id: "evaluation",
      title: "Quick Quiz",
      icon: BarChart3,
      description: "Check your understanding.",
      duration: "10 min",
      content: <Quiz questions={questions} />
    },
  ], [questions]);

  // When all sections are marked complete locally, mark global module complete
  const lpModules = useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId })), []);
  const { markComplete } = useLearningProgress(learnHubCourseKey, lpModules as any);
  useEffect(() => {
    const keys = modules.map(m => m.id);
    const allDone = keys.length > 0 && keys.every(k => completed[k]);
    if (allDone) markComplete('learn-machine-learning');
  }, [completed, modules, markComplete]);

  // Progress UI removed in this layout; keep state for completion badges only

  return (
    <main className="min-h-screen">
      {/* Hero Section with White Container and Dotted Background */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/95 backdrop-blur-sm">
              {/* Hero dotted background pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "url('/@optimized/hero-dots-optimized.webp')",
                backgroundRepeat: 'repeat',
                backgroundPosition: '0 0',
                backgroundAttachment: 'fixed'
              }} aria-hidden="true" />
              
              <CardContent className="relative p-8 lg:p-12">
                <Button 
                  variant="ghost" 
                  onClick={onBackToLearn}
                  className="gap-2 mb-8 hover:bg-muted/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("ml.back_to_learn")}
                </Button>

                <div className="text-center mb-16">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="border-primary/20 text-primary bg-transparent">Hands-on Learning</Badge>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("ml.title_part1")}
                    </span>
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> {t("ml.title_part2")}</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-light">
                    {t("ml.subtitle")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Module progress tracker */}
            <LearningModuleTracker moduleKey="learn-machine-learning" />

            {/* Sections */}
            <div className="space-y-12 lg:space-y-16">
              {/* Intro copy */}
              <section className="text-center py-8 lg:py-12 px-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="sr-only">Learn by Doing</h2>
                  <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Work through short, interactive labs that build intuition. Add points, see boundaries form,
                    and test yourself with a quick quiz.
                  </p>
                </motion.div>
              </section>

            {modules.map((m, index) => (
              <section id={m.id} key={m.id} className="scroll-mt-24">
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
                  <CardHeader className="relative pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 border border-primary/20">
                          <m.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold leading-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{m.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{m.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="text-xs border-gray-200/60 bg-transparent">{m.duration}</Badge>
                            {completed[m.id] && <Badge variant="outline" className="text-xs border-green-500/20 text-green-600 bg-transparent">✓ Completed</Badge>}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={completed[m.id] ? "outline" : "default"} 
                        onClick={() => setCompleted((c) => ({ ...c, [m.id]: !c[m.id] }))} 
                        className="self-start sm:self-center flex-shrink-0 min-w-[120px] border-gray-200/60 bg-transparent hover:bg-muted/50"
                      >
                        {completed[m.id] ? "✓ Completed" : "Mark Complete"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="relative pt-0">
                    <div className="mt-4">
                      {m.content}
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}

              <section className="text-center py-8 lg:py-12">
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50" aria-hidden="true" />
                  <CardContent className="relative p-8 lg:p-12">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6 border border-primary/20">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-semibold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Great Work!</h3>
                    <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                      You completed the hands-on Machine Learning intro. Keep practicing with more topics to deepen your understanding.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button 
                        onClick={onBackToLearn} 
                        className="gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                        size="lg"
                      >
                        <ArrowLeft className="w-4 h-4" /> Explore More Topics
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 px-6 py-3 border-gray-200/60 bg-transparent hover:bg-muted/50" 
                        size="lg"
                      >
                        <Download className="w-4 h-4" /> Download Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MachineLearningPage;
