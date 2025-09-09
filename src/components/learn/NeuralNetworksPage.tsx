import React from "react";
import { useLanguage } from "../LanguageProvider";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { TryIt } from "./shared/TryIt";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnCourseModules, learnHubCourseKey } from "./courseMap";
import { NeuralNetworksHero } from "./neural-networks/NeuralNetworksHero";
import { NeuralNetworksOverview } from "./neural-networks/NeuralNetworksOverview";
import { NeuralNetworksCourse } from "./neural-networks/NeuralNetworksCourse";
import { NeuralNetworksTypes } from "./neural-networks/NeuralNetworksTypes";
import { NeuralNetworksCNNDeepDive } from "./neural-networks/NeuralNetworksCNNDeepDive";
import { NeuralNetworksRNNDeepDive } from "./neural-networks/NeuralNetworksRNNDeepDive";
import { NeuralNetworksSelectionGuide } from "./neural-networks/NeuralNetworksSelectionGuide";
import { NeuralNetworksEvolution } from "./neural-networks/NeuralNetworksEvolution";
import { NeuralNetworksNextSteps } from "./neural-networks/NeuralNetworksNextSteps";

interface NeuralNetworksPageProps {
  onBackToLearn: () => void;
  onNavigateToTopic: (topic: string) => void;
}



export function NeuralNetworksPage({ onBackToLearn, onNavigateToTopic }: NeuralNetworksPageProps) {
  const { t, language } = useLanguage();
  const lpModules = React.useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId })), []);
  const { setModuleProgress, markComplete } = useLearningProgress(learnHubCourseKey, lpModules as any);

  return (
    <>
      <main className="min-h-screen">
        <NeuralNetworksHero onBackToLearn={onBackToLearn} />

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Module progress tracker */}
              <LearningModuleTracker moduleKey="learn-neural-networks" />

              {/* Overview */}
              <NeuralNetworksOverview />

              {/* Interactive Course */}
              <NeuralNetworksCourse 
                language={language} 
                onComplete={() => markComplete('learn-neural-networks')} 
              />

              {/* Network Types */}
              <NeuralNetworksTypes />
          </div>
        </div>
      </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Try It */}
              <div className="mb-12">
                <TryIt
                  titleKey="neural_networks.try_it_title"
                  promptKey="neural_networks.try_it_prompt"
                  checklist={[
                    t('neural_networks.try_check_1', 'Tune w1, w2, b to solve AND and OR'),
                    t('neural_networks.try_check_2', 'Write a perceptron decision boundary equation'),
                    t('neural_networks.try_check_3', 'Explain why XOR needs a hidden layer'),
                  ]}
                  onComplete={() => setModuleProgress('learn-neural-networks', { percentage: 60 })}
                />
              </div>

              {/* Deep Dive: CNNs */}
              <NeuralNetworksCNNDeepDive />

              {/* Deep Dive: RNNs */}
              <NeuralNetworksRNNDeepDive />

              {/* Selection Guide */}
              <NeuralNetworksSelectionGuide />

              {/* Performance Comparison */}
              <NeuralNetworksEvolution />

              {/* Next Steps */}
              <NeuralNetworksNextSteps onNavigateToTopic={onNavigateToTopic} />
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
