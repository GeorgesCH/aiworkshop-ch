import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Brain, Layers2, Network, ArrowRight } from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { TryIt, MiniQuiz } from "./shared/TryIt";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnHubCourseKey, learnCourseModules } from "./courseMap";


interface AIOverviewPageProps {
  onBackToLearn: () => void;
  onNavigateToTopic: (topic: string) => void;
}

export function AIOverviewPage({ onBackToLearn, onNavigateToTopic }: AIOverviewPageProps) {
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
                backgroundImage: "url('/hero-dots.png')",
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
                  {t("ai_overview.back_to_learn")}
                </Button>

                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Brain className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge variant="outline" className="border-blue-500/20 text-blue-600 bg-transparent">{t("ai_overview.foundation_concept")}</Badge>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {t("ai_overview.title")}
                      </span>
                    </h1>

                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
                      {t("ai_overview.subtitle")}
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
            <div className="mb-8">
              <LearningModuleTracker moduleKey="learn-ai-overview" />
            </div>

            {/* Definition */}
            <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardContent className="relative p-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Brain className="w-6 h-6 text-primary" />
                  {t("ai_overview.definition_title")}
                </h2>
                <p className="text-lg leading-relaxed">
                  {t("ai_overview.definition_content")}
                </p>
              </CardContent>
            </Card>

            {/* Hierarchy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("ai_overview.hierarchy_title")}</h2>
              
              <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-primary/5"></div>
                <CardContent className="relative p-8">
                  <div className="flex flex-col items-center space-y-6">
                    {/* AI */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-3 border border-primary/20">
                        <Brain className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{t("ai_overview.hierarchy_ai_title")}</h3>
                      <p className="text-sm text-gray-600 text-center max-w-xs">
                        {t("ai_overview.hierarchy_ai_desc")}
                      </p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />

                    {/* ML */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-3 border border-green-500/20">
                        <Network className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold">{t("ai_overview.hierarchy_ml_title")}</h3>
                      <p className="text-sm text-gray-600 text-center max-w-xs">
                        {t("ai_overview.hierarchy_ml_desc")}
                      </p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />

                    {/* NN */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-3 border border-purple-500/20">
                        <Layers2 className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold">{t("ai_overview.hierarchy_nn_title")}</h3>
                      <p className="text-sm text-gray-600 text-center max-w-xs">
                        {t("ai_overview.hierarchy_nn_desc")}
                      </p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />

                    {/* DL */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-3 border border-orange-500/20">
                        <Layers2 className="w-10 h-10 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold">{t("ai_overview.hierarchy_dl_title")}</h3>
                      <p className="text-sm text-gray-600 text-center max-w-xs">
                        {t("ai_overview.hierarchy_dl_desc")}
                      </p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-600 rotate-90" />

                    {/* Foundation Models */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-3 border border-indigo-500/20">
                        <Layers2 className="w-10 h-10 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold">{t("ai_overview.hierarchy_fm_title")}</h3>
                      <p className="text-sm text-gray-600 text-center max-w-xs">
                        {t("ai_overview.hierarchy_fm_desc")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Characteristics */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("ai_overview.characteristics_title")}</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardHeader className="relative pb-4">
                    <CardTitle className="text-lg font-semibold">{t("ai_overview.decision_making_title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-600 leading-relaxed">
                      {t("ai_overview.decision_making_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardHeader className="relative pb-4">
                    <CardTitle className="text-lg font-semibold">{t("ai_overview.reasoning_title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-600 leading-relaxed">
                      {t("ai_overview.reasoning_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardHeader className="relative pb-4">
                    <CardTitle className="text-lg font-semibold">{t("ai_overview.learning_title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-600 leading-relaxed">
                      {t("ai_overview.learning_desc")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardHeader className="relative pb-4">
                    <CardTitle className="text-lg font-semibold">{t("ai_overview.creativity_title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-gray-600 leading-relaxed">
                      {t("ai_overview.creativity_desc")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Applications */}
            <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-primary/5"></div>
              <CardContent className="relative p-8">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("ai_overview.applications_title")}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 hover:bg-white/80 transition-all duration-300">
                    <h4 className="font-semibold mb-2">{t("ai_overview.healthcare_title")}</h4>
                    <p className="text-sm text-gray-600">{t("ai_overview.healthcare_desc")}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 hover:bg-white/80 transition-all duration-300">
                    <h4 className="font-semibold mb-2">{t("ai_overview.finance_title")}</h4>
                    <p className="text-sm text-gray-600">{t("ai_overview.finance_desc")}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 hover:bg-white/80 transition-all duration-300">
                    <h4 className="font-semibold mb-2">{t("ai_overview.transportation_title")}</h4>
                    <p className="text-sm text-gray-600">{t("ai_overview.transportation_desc")}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 hover:bg-white/80 transition-all duration-300">
                    <h4 className="font-semibold mb-2">{t("ai_overview.business_title")}</h4>
                    <p className="text-sm text-gray-600">{t("ai_overview.business_desc")}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 hover:bg-white/80 transition-all duration-300">
                    <h4 className="font-semibold mb-2">{t("ai_overview.entertainment_title")}</h4>
                    <p className="text-sm text-gray-600">{t("ai_overview.entertainment_desc")}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 hover:bg-white/80 transition-all duration-300">
                    <h4 className="font-semibold mb-2">{t("ai_overview.education_title")}</h4>
                    <p className="text-sm text-gray-600">{t("ai_overview.education_desc")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Try it: Mini-exercise */}
            <div className="mb-12">
              <TryIt
                titleKey="ai_overview.try_it_title"
                promptKey="ai_overview.try_it_prompt"
                checklist={[
                  t('ai_overview.try_check_1', 'List 3 AI use-cases in your work'),
                  t('ai_overview.try_check_2', 'Pick 1 and outline desired outcome'),
                  t('ai_overview.try_check_3', 'Draft a prompt to achieve it with an LLM'),
                ]}
                onComplete={() => setModuleProgress('learn-ai-overview', { percentage: 60 })}
              />
            </div>

            {/* Try It + Quick Quiz */}
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              <TryIt
                titleKey="ai_overview.try_it_title"
                promptKey="ai_overview.try_it_prompt"
                checklist={[
                  t('ai_overview.try_check_1', 'List 3 AI use-cases in your work'),
                  t('ai_overview.try_check_2', 'Pick 1 and outline desired outcome'),
                  t('ai_overview.try_check_3', 'Draft a prompt to achieve it with an LLM'),
                ]}
                onComplete={() => setModuleProgress('learn-ai-overview', { percentage: 60 })}
              />
              <MiniQuiz
                questions={[
                  { q: t('ai_overview.quiz_q1', 'AI is best described as?'), a: [t('ai_overview.quiz_q1_a1','Fixed rules'), t('ai_overview.quiz_q1_a2','Learning systems'), t('ai_overview.quiz_q1_a3','Random outputs'), t('ai_overview.quiz_q1_a4','Only robots')], correct: 1 },
                  { q: t('ai_overview.quiz_q2', 'A core ability shared by many AI systems is?'), a: [t('ai_overview.quiz_q2_a1','Ignoring data'), t('ai_overview.quiz_q2_a2','Pattern recognition'), t('ai_overview.quiz_q2_a3','Manual features only'), t('ai_overview.quiz_q2_a4','No generalization')], correct: 1 },
                  { q: t('ai_overview.quiz_q3', 'Good AI practice includes?'), a: [t('ai_overview.quiz_q3_a1','No constraints'), t('ai_overview.quiz_q3_a2','Clear goals & evaluation'), t('ai_overview.quiz_q3_a3','No testing'), t('ai_overview.quiz_q3_a4','Vague prompts')], correct: 1 },
                ]}
                onPass={() => markComplete('learn-ai-overview')}
              />
            </div>

            {/* Next Steps */}
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardContent className="relative text-center p-12">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("ai_overview.continue_title")}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {t("ai_overview.continue_desc")}
                </p>
                <Button 
                  onClick={() => onNavigateToTopic("learn-machine-learning")} 
                  className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden mx-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">{t("ai_overview.explore_more")}</span>
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
