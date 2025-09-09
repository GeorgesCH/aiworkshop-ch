import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Sparkles, ArrowRight, RotateCcw, Zap, Layers, Music, Palette, FileText } from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { LearningModuleTracker } from "./LearningModuleTracker";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { learnHubCourseKey, learnCourseModules } from "./courseMap";
import { TryIt, MiniQuiz } from "./shared/TryIt";

interface GenerativeAIPageProps {
  onBackToLearn: () => void;
  onNavigateToTopic: (topic: string) => void;
}

const buildGenerativeModels = (t: (key: string) => string) => [
  {
    name: t("generative_ai.models.vae.name"),
    icon: "🔄",
    description: t("generative_ai.models.vae.description"),
    howItWorks: t("generative_ai.models.vae.how_it_works"),
    strengths: [
      t("generative_ai.models.vae.strengths.0"),
      t("generative_ai.models.vae.strengths.1"),
      t("generative_ai.models.vae.strengths.2"),
    ],
    weaknesses: [
      t("generative_ai.models.vae.weaknesses.0"),
      t("generative_ai.models.vae.weaknesses.1"),
    ],
    applications: [
      t("generative_ai.models.vae.applications.0"),
      t("generative_ai.models.vae.applications.1"),
      t("generative_ai.models.vae.applications.2"),
    ],
    example: {
      title: t("generative_ai.models.vae.example.title"),
      description: t("generative_ai.models.vae.example.description"),
    },
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    name: t("generative_ai.models.gan.name"),
    icon: "⚔️",
    description: t("generative_ai.models.gan.description"),
    howItWorks: t("generative_ai.models.gan.how_it_works"),
    strengths: [
      t("generative_ai.models.gan.strengths.0"),
      t("generative_ai.models.gan.strengths.1"),
      t("generative_ai.models.gan.strengths.2"),
    ],
    weaknesses: [
      t("generative_ai.models.gan.weaknesses.0"),
      t("generative_ai.models.gan.weaknesses.1"),
      t("generative_ai.models.gan.weaknesses.2"),
    ],
    applications: [
      t("generative_ai.models.gan.applications.0"),
      t("generative_ai.models.gan.applications.1"),
      t("generative_ai.models.gan.applications.2"),
    ],
    example: {
      title: t("generative_ai.models.gan.example.title"),
      description: t("generative_ai.models.gan.example.description"),
    },
    color: "bg-red-500/10 text-red-600 border-red-200",
  },
  {
    name: t("generative_ai.models.autoregressive.name"),
    icon: "📈",
    description: t("generative_ai.models.autoregressive.description"),
    howItWorks: t("generative_ai.models.autoregressive.how_it_works"),
    strengths: [
      t("generative_ai.models.autoregressive.strengths.0"),
      t("generative_ai.models.autoregressive.strengths.1"),
      t("generative_ai.models.autoregressive.strengths.2"),
    ],
    weaknesses: [
      t("generative_ai.models.autoregressive.weaknesses.0"),
      t("generative_ai.models.autoregressive.weaknesses.1"),
    ],
    applications: [
      t("generative_ai.models.autoregressive.applications.0"),
      t("generative_ai.models.autoregressive.applications.1"),
      t("generative_ai.models.autoregressive.applications.2"),
    ],
    example: {
      title: t("generative_ai.models.autoregressive.example.title"),
      description: t("generative_ai.models.autoregressive.example.description"),
    },
    color: "bg-green-500/10 text-green-600 border-green-200",
  },
  {
    name: t("generative_ai.models.transformers.name"),
    icon: "🔄",
    description: t("generative_ai.models.transformers.description"),
    howItWorks: t("generative_ai.models.transformers.how_it_works"),
    strengths: [
      t("generative_ai.models.transformers.strengths.0"),
      t("generative_ai.models.transformers.strengths.1"),
      t("generative_ai.models.transformers.strengths.2"),
    ],
    weaknesses: [
      t("generative_ai.models.transformers.weaknesses.0"),
      t("generative_ai.models.transformers.weaknesses.1"),
    ],
    applications: [
      t("generative_ai.models.transformers.applications.0"),
      t("generative_ai.models.transformers.applications.1"),
      t("generative_ai.models.transformers.applications.2"),
      t("generative_ai.models.transformers.applications.3"),
    ],
    example: {
      title: t("generative_ai.models.transformers.example.title"),
      description: t("generative_ai.models.transformers.example.description"),
    },
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
];

const buildGenerativeApplications = (t: (key: string) => string) => [
  {
    category: t("generative_ai.app_categories.content_creation.name"),
    icon: Palette,
    description: t("generative_ai.app_categories.content_creation.description"),
    examples: [
      { name: t("generative_ai.app_categories.content_creation.examples.text_generation"), tools: ["ChatGPT", "Claude", "Jasper"] },
      { name: t("generative_ai.app_categories.content_creation.examples.image_creation"), tools: ["DALL-E", "Midjourney", "Stable Diffusion"] },
      { name: t("generative_ai.app_categories.content_creation.examples.video_production"), tools: ["Runway", "Synthesia", "Pictory"] },
      { name: t("generative_ai.app_categories.content_creation.examples.audio_generation"), tools: ["ElevenLabs", "Murf", "Descript"] },
    ],
    color: "bg-pink-500/10",
  },
  {
    category: t("generative_ai.app_categories.code_dev.name"),
    icon: FileText,
    description: t("generative_ai.app_categories.code_dev.description"),
    examples: [
      { name: t("generative_ai.app_categories.code_dev.examples.code_completion"), tools: ["GitHub Copilot", "Tabnine", "CodeT5"] },
      { name: t("generative_ai.app_categories.code_dev.examples.code_generation"), tools: ["GPT-4", "Claude", "CodeLlama"] },
      { name: t("generative_ai.app_categories.code_dev.examples.bug_detection"), tools: ["DeepCode", "SonarQube AI", "Snyk"] },
      { name: t("generative_ai.app_categories.code_dev.examples.documentation"), tools: ["Mintlify", "Swimm", "GitBook AI"] },
    ],
    color: "bg-blue-500/10",
  },
  {
    category: t("generative_ai.app_categories.creative_arts.name"),
    icon: Music,
    description: t("generative_ai.app_categories.creative_arts.description"),
    examples: [
      { name: t("generative_ai.app_categories.creative_arts.examples.music_composition"), tools: ["AIVA", "Amper", "Soundraw"] },
      { name: t("generative_ai.app_categories.creative_arts.examples.art_generation"), tools: ["Artbreeder", "DeepArt", "NightCafe"] },
      { name: t("generative_ai.app_categories.creative_arts.examples.writing_assistance"), tools: ["Grammarly", "Copy.ai", "Writesonic"] },
      { name: t("generative_ai.app_categories.creative_arts.examples.design_tools"), tools: ["Canva AI", "Adobe Firefly", "Figma AI"] },
    ],
    color: "bg-purple-500/10",
  },
  {
    category: t("generative_ai.app_categories.business.name"),
    icon: Zap,
    description: t("generative_ai.app_categories.business.description"),
    examples: [
      { name: t("generative_ai.app_categories.business.examples.marketing_content"), tools: ["Copy.ai", "Jasper", "Persado"] },
      { name: t("generative_ai.app_categories.business.examples.customer_service"), tools: ["ChatGPT plugins", "Claude", "Anthropic"] },
      { name: t("generative_ai.app_categories.business.examples.data_analysis"), tools: ["Julius AI", "DataGPT", "Insights AI"] },
      { name: t("generative_ai.app_categories.business.examples.presentations"), tools: ["Gamma", "Tome", "Beautiful.AI"] },
    ],
    color: "bg-green-500/10",
  },
];

export function GenerativeAIPage({ onBackToLearn, onNavigateToTopic }: GenerativeAIPageProps) {
  const { t } = useLanguage();
  const lpModules = React.useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId })), []);
  const { setModuleProgress, markComplete } = useLearningProgress(learnHubCourseKey, lpModules as any);
  const generativeModels = buildGenerativeModels(t);
  const generativeApplications = buildGenerativeApplications(t);
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
                  {t("ml.back_to_learn")}
                </Button>

                <div className="text-center mb-16">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                      <Sparkles className="w-6 h-6 text-pink-600" />
                    </div>
                    <Badge variant="outline" className="border-pink-500/20 text-pink-600 bg-transparent">{t("learn.badge_creative_ai")}</Badge>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("generative_ai.title_part1")}
                    </span>
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block lg:inline"> {t("generative_ai.title_part2")}</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-light">
                    {t("generative_ai.subtitle")}
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
            {/* Module tracker */}
            <div className="mb-8">
              <LearningModuleTracker moduleKey="learn-generative-ai" />
            </div>

            {/* Definition & Overview */}
            <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardContent className="relative p-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                  {t("generative_ai.definition_title")}
                </h2>
                <p className="text-lg leading-relaxed mb-6">
                  {t("generative_ai.definition_paragraph")}
                </p>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/30">
                  <h4 className="font-semibold mb-4">{t("generative_ai.what_makes_title")}</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-pink-500 mt-1" />
                      <div>
                        <p className="text-sm font-semibold">{t("generative_ai.feature_novelty_title")}</p>
                        <p className="text-xs text-gray-600">{t("generative_ai.feature_novelty_desc")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw className="w-4 h-4 text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm font-semibold">{t("generative_ai.feature_diversity_title")}</p>
                        <p className="text-xs text-gray-600">{t("generative_ai.feature_diversity_desc")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Layers className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="text-sm font-semibold">{t("generative_ai.feature_quality_title")}</p>
                        <p className="text-xs text-gray-600">{t("generative_ai.feature_quality_desc")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-purple-500 mt-1" />
                      <div>
                        <p className="text-sm font-semibold">{t("generative_ai.feature_control_title")}</p>
                        <p className="text-xs text-gray-600">{t("generative_ai.feature_control_desc")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Try It + Quick Quiz */}
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              <TryIt
                titleKey="generative_ai.try_it_title"
                promptKey="generative_ai.try_it_prompt"
                checklist={[
                  t('generative_ai.try_check_1', 'Draft a prompt to generate product names for a new feature'),
                  t('generative_ai.try_check_2', 'Refine with constraints: tone, audience, length'),
                  t('generative_ai.try_check_3', 'Select your favorite and justify why'),
                ]}
                onComplete={() => setModuleProgress('learn-generative-ai', { percentage: 50 })}
              />
              <MiniQuiz
                questions={[
                  { q: t('generative_ai.quiz_q1', 'Which model is best for image synthesis?'), a: ['VAE','GAN','RNN','AR'], correct: 1 },
                  { q: t('generative_ai.quiz_q2', 'Transformers rely chiefly on?'), a: ['Convolutions','Recurrence','Attention','Pooling'], correct: 2 },
                  { q: t('generative_ai.quiz_q3', 'Best practice for prompts includes?'), a: ['Be vague','No constraints','Clear examples','Avoid context'], correct: 2 },
                ]}
                onPass={() => markComplete('learn-generative-ai')}
              />
            </div>

            {/* Generative Model Architectures */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("generative_ai.architectures_title")}</h2>
              
              <div className="space-y-8">
                {generativeModels.map((model, index) => (
                  <Card key={index} className={`relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 ${model.color}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <CardContent className="relative p-8">
                      <div className="grid lg:grid-cols-4 gap-8">
                        {/* Header */}
                        <div className="lg:col-span-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{model.icon}</span>
                            <div>
                              <h3 className="text-xl font-semibold">{model.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {model.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* How it Works */}
                        <div className="lg:col-span-1">
                          <h4 className="font-semibold mb-3">{t("generative_ai.how_it_works_label")}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {model.howItWorks}
                          </p>
                          
                          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30">
                            <h5 className="text-xs font-semibold mb-2">{model.example.title}</h5>
                            <p className="text-xs text-gray-600">{model.example.description}</p>
                          </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="lg:col-span-1">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2 text-green-600">{t("generative_ai.strengths_label")}</h4>
                              <ul className="space-y-1">
                                {model.strengths.map((strength, sIndex) => (
                                  <li key={sIndex} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-600">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2 text-orange-600">{t("generative_ai.challenges_label")}</h4>
                              <ul className="space-y-1">
                                {model.weaknesses.map((weakness, wIndex) => (
                                  <li key={wIndex} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-600">{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Applications */}
                        <div className="lg:col-span-1">
                          <h4 className="font-semibold mb-3">{t("generative_ai.applications_label")}</h4>
                          <div className="space-y-2">
                            {model.applications.map((app, appIndex) => (
                              <Badge key={appIndex} variant="outline" className="text-xs mr-2 mb-2 border-primary/20 text-primary bg-transparent">
                                {app}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Real-World Applications */}
            <div className="mb-12">
              <h2 className="text-3xl font-medium mb-8 text-center">{t("generative_ai.applications_title")}</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {generativeApplications.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={index} className={`border-0 ${category.color} hover:opacity-80 transition-opacity`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/60 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{category.category}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {category.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="bg-white/60 rounded-lg p-4 border">
                            <h4 className="font-medium mb-3">{example.name}</h4>
                            <div className="flex flex-wrap gap-2">
                              {example.tools.map((tool, toolIndex) => (
                                <Badge key={toolIndex} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Technical Evolution */}
            <Card className="mb-12 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-medium mb-8 text-center">{t("generative_ai.evolution_title")}</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔄</span>
                      </div>
                      <h4 className="font-medium mb-2">{t("generative_ai.evolution.era1.years")}</h4>
                      <p className="text-sm text-gray-600">{t("generative_ai.evolution.era1.title")}</p>
                      <p className="text-xs text-gray-600 mt-1">{t("generative_ai.evolution.era1.desc")}</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <h4 className="font-medium mb-2">{t("generative_ai.evolution.era2.years")}</h4>
                      <p className="text-sm text-gray-600">{t("generative_ai.evolution.era2.title")}</p>
                      <p className="text-xs text-gray-600 mt-1">{t("generative_ai.evolution.era2.desc")}</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <h4 className="font-medium mb-2">{t("generative_ai.evolution.era3.years")}</h4>
                      <p className="text-sm text-gray-600">{t("generative_ai.evolution.era3.title")}</p>
                      <p className="text-xs text-gray-600 mt-1">{t("generative_ai.evolution.era3.desc")}</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h4 className="font-medium mb-2">{t("generative_ai.evolution.era4.years")}</h4>
                      <p className="text-sm text-gray-600">{t("generative_ai.evolution.era4.title")}</p>
                      <p className="text-xs text-gray-600 mt-1">{t("generative_ai.evolution.era4.desc")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Trends & Future */}
            <Card className="mb-12 border-0 bg-gray-100/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-medium mb-6 text-center">{t("generative_ai.trends_title")}</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-4 text-green-600">{t("generative_ai.current_breakthroughs_title")}</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">{t("generative_ai.breakthroughs.multimodal.title")}</p>
                          <p className="text-xs text-gray-600">{t("generative_ai.breakthroughs.multimodal.desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">{t("generative_ai.breakthroughs.realtime.title")}</p>
                          <p className="text-xs text-gray-600">{t("generative_ai.breakthroughs.realtime.desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">{t("generative_ai.breakthroughs.controllable.title")}</p>
                          <p className="text-xs text-gray-600">{t("generative_ai.breakthroughs.controllable.desc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4 text-orange-600">{t("generative_ai.future_title")}</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">{t("generative_ai.future.3d.title")}</p>
                          <p className="text-xs text-gray-600">{t("generative_ai.future.3d.desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">{t("generative_ai.future.personalized.title")}</p>
                          <p className="text-xs text-gray-600">{t("generative_ai.future.personalized.desc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">{t("generative_ai.future.science.title")}</p>
                          <p className="text-xs text-gray-600">{t("generative_ai.future.science.desc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ethical Considerations */}
            <Card className="mb-12 border-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
              <CardContent className="p-8">
                <h2 className="text-2xl font-medium mb-6 text-center">{t("generative_ai.ethics_title")}</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h4 className="font-medium mb-3">{t("generative_ai.ethics.misinformation.title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("generative_ai.ethics.misinformation.desc")}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h4 className="font-medium mb-3">{t("generative_ai.ethics.ownership.title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("generative_ai.ethics.ownership.desc")}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚖️</span>
                    </div>
                    <h4 className="font-medium mb-3">{t("generative_ai.ethics.bias.title")}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t("generative_ai.ethics.bias.desc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardContent className="relative text-center p-12">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("generative_ai.next_steps_title")}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {t("generative_ai.next_steps_desc")}
                </p>
                <Button 
                  onClick={() => onNavigateToTopic("learn-llm-players")} 
                  className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden mx-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10">{t("generative_ai.return_to_hub")}</span>
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
