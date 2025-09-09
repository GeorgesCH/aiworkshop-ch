import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, ArrowRight, Database } from "lucide-react";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { TryIt, MiniQuiz } from "./shared/TryIt";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnCourseModules, learnHubCourseKey } from "./courseMap";
import { useLanguage } from "../LanguageProvider";

interface FoundationModelsPageProps {
  onBackToLearn: () => void;
  onNavigateToTopic: (topic: string) => void;
}

export function FoundationModelsPage({ onBackToLearn, onNavigateToTopic }: FoundationModelsPageProps) {
  const { t } = useLanguage();
  const lpModules = React.useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId })), []);
  const { setModuleProgress, markComplete } = useLearningProgress(learnHubCourseKey, lpModules as any);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                  Foundation Models
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  The backbone of modern AI systems
                </p>
                <Button
                  onClick={() => markModuleComplete(learnHubCourseKey, 'learn-foundation-models')}
                  className="bg-primary text-white px-6 py-3 rounded-lg"
                >
                  Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <LearningModuleTracker moduleKey="learn-foundation-models" />
          </div>
        </div>
      </section>
    </main>
  );
}