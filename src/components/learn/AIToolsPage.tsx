import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, ArrowRight, Wrench } from "lucide-react";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { TryIt, MiniQuiz } from "./shared/TryIt";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnCourseModules, learnHubCourseKey } from "./courseMap";
import { useLanguage } from "../LanguageProvider";

interface AIToolsPageProps {
  onBackToLearn: () => void;
}

export function AIToolsPage({ onBackToLearn }: AIToolsPageProps) {
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
                  AI Tools
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Essential tools for AI development and deployment
                </p>
                <Button
                  onClick={() => markModuleComplete(learnHubCourseKey, 'learn-ai-tools')}
                  className="bg-primary text-white px-6 py-3 rounded-lg"
                >
                  Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <LearningModuleTracker moduleKey="learn-ai-tools" />
          </div>
        </div>
      </section>
    </main>
  );
}