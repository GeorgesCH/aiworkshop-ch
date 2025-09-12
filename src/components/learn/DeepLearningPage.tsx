import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Layers, Brain, Zap, Target, Camera, Volume2, Car, Stethoscope, ArrowRight } from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { TryIt, MiniQuiz } from "./shared/TryIt";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnCourseModules, learnHubCourseKey } from "./courseMap";

interface DeepLearningPageProps {
  onBackToLearn: () => void;
  onNavigateToTopic: (topic: string) => void;
}

export function DeepLearningPage({ onBackToLearn, onNavigateToTopic }: DeepLearningPageProps) {
  const { t } = useLanguage();
  const lpModules = React.useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId })), []);
  const { setModuleProgress, markComplete } = useLearningProgress(learnHubCourseKey, lpModules as any);
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
                  {t("deep_learning.back_to_learn")}
                </Button>

                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <Layers className="w-6 h-6 text-purple-600" />
                      </div>
                      <Badge variant="outline" className="border-purple-500/20 text-purple-600 bg-transparent">{t("deep_learning.advanced_concept")}</Badge>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {t("deep_learning.title")}
                      </span>
                      <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block lg:inline"> {t("deep_learning.title_highlight")}</span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
                      {t("deep_learning.subtitle")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Module tracker */}
            <LearningModuleTracker moduleKey="learn-deep-learning" />

            {/* Definition */}
            <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardContent className="relative p-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Layers className="w-6 h-6 text-primary" />
                  {t("deep_learning.definition_title")}
                </h2>
                <p className="text-lg leading-relaxed">
                  {t("deep_learning.definition_content")}
                </p>
              </CardContent>
            </Card>

            {/* DL vs ML Comparison */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("deep_learning.comparison_title")}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/10"></div>
                  <CardHeader className="relative pb-4">
                    <CardTitle className="text-xl font-semibold text-red-600">{t("deep_learning.traditional_ml_title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-sm">{t("deep_learning.manual_feature_title")}</p>
                          <p className="text-xs text-gray-600">{t("deep_learning.manual_feature_desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-sm">{t("deep_learning.performance_plateaus_title")}</p>
                          <p className="text-xs text-gray-600">{t("deep_learning.performance_plateaus_desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-sm">{t("deep_learning.structured_data_title")}</p>
                          <p className="text-xs text-gray-600">{t("deep_learning.structured_data_desc")}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-500/10"></div>
                  <CardHeader className="relative pb-4">
                    <CardTitle className="text-xl font-semibold text-purple-600">{t("deep_learning.dl_title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-sm">{t("deep_learning.automatic_feature_title")}</p>
                          <p className="text-xs text-gray-600">{t("deep_learning.automatic_feature_desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-sm">{t("deep_learning.scales_data_title")}</p>
                          <p className="text-xs text-gray-600">{t("deep_learning.scales_data_desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold text-sm">{t("deep_learning.unstructured_mastery_title")}</p>
                          <p className="text-xs text-gray-600">{t("deep_learning.unstructured_mastery_desc")}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Key Advantages */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("deep_learning.advantages_title")}</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold">{t("deep_learning.no_plateaus_title")}</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.no_plateaus_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold">{t("deep_learning.end_to_end_title")}</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.end_to_end_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <Brain className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold">{t("deep_learning.hierarchical_title")}</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.hierarchical_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                        <Layers className="w-5 h-5 text-orange-600" />
                      </div>
                      <h4 className="font-semibold">{t("deep_learning.multimodal_title")}</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.multimodal_desc")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Cognitive Computing */}
            <Card className="mb-12 border-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium">{t("deep_learning.cognitive_title")}</h2>
                    <p className="text-sm text-gray-600">{t("deep_learning.cognitive_subtitle")}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">{t("deep_learning.cognitive_definition_title")}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {t("deep_learning.cognitive_definition_desc")}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/60 rounded-lg p-4 border">
                      <h4 className="font-medium mb-2">{t("deep_learning.thinking_reasoning_title")}</h4>
                      <p className="text-sm text-gray-600">
                        {t("deep_learning.thinking_reasoning_desc")}
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 border">
                      <h4 className="font-medium mb-2">{t("deep_learning.problem_solving_title")}</h4>
                      <p className="text-sm text-gray-600">
                        {t("deep_learning.problem_solving_desc")}
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 border">
                      <h4 className="font-medium mb-2">{t("deep_learning.active_partnership_title")}</h4>
                      <p className="text-sm text-gray-600">
                        {t("deep_learning.active_partnership_desc")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">{t("deep_learning.real_world_apps_title")}</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{t("deep_learning.fraud_detection")}</Badge>
                      <Badge variant="outline">{t("deep_learning.customer_support")}</Badge>
                      <Badge variant="outline">{t("deep_learning.intelligent_decisions")}</Badge>
                      <Badge variant="outline">{t("deep_learning.predictive_analytics")}</Badge>
                      <Badge variant="outline">{t("deep_learning.natural_language")}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <div className="mb-12">
              <h2 className="text-3xl font-medium mb-8">{t("deep_learning.applications_title")}</h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium mb-2">{t("deep_learning.computer_vision_title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.computer_vision_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-green-500/5 hover:bg-green-500/10 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Volume2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium mb-2">{t("deep_learning.speech_audio_title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.speech_audio_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Car className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium mb-2">{t("deep_learning.autonomous_title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.autonomous_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-orange-500/5 hover:bg-orange-500/10 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Stethoscope className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-medium mb-2">{t("deep_learning.healthcare_title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.healthcare_desc")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Architecture Visualization */}
            <Card className="mb-12 border-0 bg-gray-100/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-medium mb-6 text-center">{t("deep_learning.architecture_title")}</h2>
                
                <div className="bg-white rounded-2xl p-8 border">
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
                      
                      {/* Input Layer */}
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-2 mb-2">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-4 h-4 bg-blue-500/20 rounded-full border-2 border-blue-500"></div>
                          ))}
                        </div>
                        <span className="text-xs font-medium text-blue-600">{t("deep_learning.input_layer")}</span>
                        <span className="text-xs text-gray-600">{t("deep_learning.raw_data")}</span>
                      </div>

                      <div className="w-px h-8 bg-border"></div>

                      {/* Hidden Layers */}
                      <div className="flex flex-col items-center space-y-4">
                        {[1,2,3].map(layer => (
                          <div key={layer} className="flex flex-col items-center">
                            <div className="flex space-x-2 mb-1">
                              {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="w-3 h-3 bg-purple-500/20 rounded-full border border-purple-500"></div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">{t("deep_learning.hidden_layer")} {layer}</span>
                          </div>
                        ))}
                        <span className="text-xs font-medium text-purple-600">{t("deep_learning.deep_layers")}</span>
                        <span className="text-xs text-gray-600">{t("deep_learning.feature_learning")}</span>
                      </div>

                      <div className="w-px h-8 bg-border"></div>

                      {/* Output Layer */}
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-2 mb-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-4 h-4 bg-green-500/20 rounded-full border-2 border-green-500"></div>
                          ))}
                        </div>
                        <span className="text-xs font-medium text-green-600">{t("deep_learning.output_layer")}</span>
                        <span className="text-xs text-gray-600">{t("deep_learning.predictions")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      {t("deep_learning.architecture_desc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Process */}
            <Card className="mb-12 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-medium mb-6">{t("deep_learning.how_it_works_title")}</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📥</span>
                    </div>
                    <h4 className="font-medium mb-3">{t("deep_learning.data_ingestion_title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.data_ingestion_desc")}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <h4 className="font-medium mb-3">{t("deep_learning.hierarchical_learning_title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.hierarchical_learning_desc")}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-medium mb-3">{t("deep_learning.pattern_recognition_title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("deep_learning.pattern_recognition_desc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Try It */}
            <div className="mb-12">
              <TryIt
                titleKey="deep_learning.try_it_title"
                promptKey="deep_learning.try_it_prompt"
                checklist={[
                  t('deep_learning.try_check_1', 'Sketch an input→hidden→output diagram for a use case'),
                  t('deep_learning.try_check_2', 'List potential features and outputs'),
                  t('deep_learning.try_check_3', 'Write a prompt to simulate the model’s decision steps'),
                ]}
                onComplete={() => setModuleProgress('learn-deep-learning', { percentage: 60 })}
              />
            </div>

            {/* Quick Quiz */}
            <div className="mb-12">
              <MiniQuiz
                questions={[
                  { q: t('deep_learning.quiz_q1','Deep learning relies on?'), a: ['Manual features','Hierarchical features','No training','Only rules'], correct: 1 },
                  { q: t('deep_learning.quiz_q2','CNNs are effective for?'), a: ['Time series only','Images & vision','Only text','Audio only'], correct: 1 },
                  { q: t('deep_learning.quiz_q3','Pooling layers do what?'), a: ['Add parameters','Increase size','Reduce spatial dims','Train loss'], correct: 2 },
                ]}
                onPass={() => markComplete('learn-deep-learning')}
              />
            </div>

            {/* Next Steps */}
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardContent className="relative text-center p-12">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("deep_learning.next_steps_title")}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {t("deep_learning.next_steps_desc")}
                </p>
                <Button 
                  onClick={() => onNavigateToTopic("learn-neural-networks")} 
                  className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden mx-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">{t("deep_learning.continue_neural")}</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
