import React from "react";
import { IntelligenceHero } from "./intelligence/IntelligenceHero";
import { IntelligenceComparison } from "./intelligence/IntelligenceComparison";
import { AIDeepDive } from "./intelligence/AIDeepDive";
import { EmotionalIntelligence } from "./intelligence/EmotionalIntelligence";
import { IntelligenceCTA } from "./intelligence/IntelligenceCTA";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { TryIt } from "./shared/TryIt";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnCourseModules, learnHubCourseKey } from "./courseMap";
import { useLanguage } from "../LanguageProvider";

interface IntelligencePageProps {
  onPageChange?: (page: string) => void;
}

export function IntelligencePage({ onPageChange }: IntelligencePageProps = {}) {
  const { t } = useLanguage();
  
  // Memoize modules to prevent unnecessary re-renders
  const lpModules = React.useMemo(() => {
    return learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId }));
  }, []);
  
  const { setModuleProgress, markComplete } = useLearningProgress(learnHubCourseKey, lpModules as any);
  return (
    <div className="min-h-screen">
      <IntelligenceHero />
      <div className="container mx-auto px-4 mt-6">
        <div className="max-w-6xl mx-auto">
          <LearningModuleTracker moduleKey="learn-intelligence" />
        </div>
      </div>
      <IntelligenceComparison />
      <AIDeepDive />
      <EmotionalIntelligence />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto my-8">
          <TryIt
            titleKey="intelligence.try_it_title"
            promptKey="intelligence.try_it_prompt"
            checklist={[
              t('intelligence.try_check_1', 'Write down how IQ, EQ, and AI differ in your role'),
              t('intelligence.try_check_2', 'Identify a decision where AI could assist'),
              t('intelligence.try_check_3', 'Draft a prompt to improve that decision'),
            ]}
            onComplete={() => markComplete('learn-intelligence')}
          />
        </div>
      </div>
      <IntelligenceCTA onPageChange={onPageChange} />
    </div>
  );
}
