import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Network,
  Cpu,
  Layers,
  Sparkles,
  Target,
  Settings,
  Users,
  ArrowRight,
  Search as SearchIcon,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { AssessmentCTA } from "./AssessmentCTA";
import { useScrollToTop } from "../utils/useScrollToTop";
import { LearnCourseFlow } from "./learn/LearnCourseFlow";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { learnHubCourseKey } from "./learn/courseMap";

// Topics (unchanged ids to preserve deep links), with light categorisation
const learningTopics = [
  {
    id: "learn-intelligence",
    titleKey: "learn.intelligence_title",
    descriptionKey: "learn.intelligence_description",
    icon: Brain,
    badgeKey: "learn.badge_fundamentals",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-100/60 text-slate-700 border-slate-200",
    category: "foundations",
    level: 1,
  },
  {
    id: "learn-ai-overview",
    titleKey: "learn.ai_overview_title",
    descriptionKey: "learn.ai_overview_description",
    icon: Brain,
    badgeKey: "learn.badge_foundation",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-100/60 text-slate-700 border-slate-200",
    category: "foundations",
    level: 1,
  },
  {
    id: "learn-machine-learning",
    titleKey: "learn.machine_learning_title",
    descriptionKey: "learn.machine_learning_description",
    icon: Network,
    badgeKey: "learn.badge_core_concept",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-200/60 text-slate-700 border-slate-200",
    category: "ml",
    level: 2,
  },
  {
    id: "learn-deep-learning",
    titleKey: "learn.deep_learning_title",
    descriptionKey: "learn.deep_learning_description",
    icon: Layers,
    badgeKey: "learn.badge_advanced",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-200/60 text-slate-700 border-slate-200",
    category: "dl",
    level: 3,
  },
  {
    id: "learn-neural-networks",
    titleKey: "learn.neural_networks_title",
    descriptionKey: "learn.neural_networks_description",
    icon: Cpu,
    badgeKey: "learn.badge_technical",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-100/60 text-slate-700 border-slate-200",
    category: "dl",
    level: 2,
  },
  {
    id: "learn-foundation-models",
    titleKey: "learn.foundation_models_title",
    descriptionKey: "learn.foundation_models_description",
    icon: Layers,
    badgeKey: "learn.badge_modern_ai",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-100/60 text-slate-700 border-slate-200",
    category: "genai",
    level: 2,
  },
  {
    id: "learn-generative-ai",
    titleKey: "learn.generative_ai_title",
    descriptionKey: "learn.generative_ai_description",
    icon: Sparkles,
    badgeKey: "learn.badge_creative_ai",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-100/60 text-slate-700 border-slate-200",
    category: "genai",
    level: 1,
  },
  {
    id: "learn-llm-players",
    titleKey: "learn.llm_players_title",
    descriptionKey: "learn.llm_players_description",
    icon: Users,
    badgeKey: "learn.badge_industry",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-100/60 text-slate-700 border-slate-200",
    category: "industry",
    level: 1,
  },
  {
    id: "learn-ai-tools",
    titleKey: "learn.ai_tools_title",
    descriptionKey: "learn.ai_tools_description",
    icon: Settings,
    badgeKey: "learn.badge_practical",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-200/60 text-slate-700 border-slate-200",
    category: "practice",
    level: 1,
  },
  {
    id: "learn-ai-tools-directory",
    titleKey: "learn.ai_tools_directory_title",
    descriptionKey: "learn.ai_tools_directory_description",
    icon: BookOpen,
    badgeKey: "learn.badge_resources",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-100/60 text-slate-700 border-slate-200",
    category: "resources",
    level: 1,
  },
  {
    id: "learn-interactive-exercises",
    titleKey: "learn.interactive_exercises_title",
    descriptionKey: "learn.interactive_exercises_description",
    icon: Target,
    badgeKey: "learn.badge_practice",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-200/60 text-slate-700 border-slate-200",
    category: "practice",
    level: 1,
  },
] as const;

type Topic = (typeof learningTopics)[number];

const CATEGORY_TABS: { key: Topic["category"] | "all"; i18nKey: string }[] = [
  { key: "all", i18nKey: "learn.tabs.all" },
  { key: "foundations", i18nKey: "learn.tabs.foundations" },
  { key: "ml", i18nKey: "learn.tabs.ml" },
  { key: "dl", i18nKey: "learn.tabs.dl" },
  { key: "genai", i18nKey: "learn.tabs.genai" },
  { key: "practice", i18nKey: "learn.tabs.practice" },
  { key: "resources", i18nKey: "learn.tabs.resources" },
];

interface LearnPageProps {
  onBackToHome: () => void;
  onNavigateToTopic: (topicId: string) => void;
  onPageChange?: (page: string) => void;
}

export function LearnPage({ onBackToHome, onNavigateToTopic, onPageChange }: LearnPageProps) {
  const { t } = useLanguage();
  useScrollToTop();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_TABS)[number]["key"]>("all");
  const [sort, setSort] = useState<"recommended" | "az" | "level">("recommended");

  const filtered = useMemo(() => {
    let topics = [...learningTopics];

    // search by translated title/description
    if (q.trim()) {
      const qq = q.toLowerCase();
      topics = topics.filter((topic) => {
        const title = t(topic.titleKey).toLowerCase();
        const desc = t(topic.descriptionKey).toLowerCase();
        return title.includes(qq) || desc.includes(qq);
      });
    }

    // category
    if (category !== "all") {
      topics = topics.filter((tpc) => tpc.category === category);
    }

    // sort
    if (sort === "az") {
      topics.sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey)));
    } else if (sort === "level") {
      topics.sort((a, b) => a.level - b.level);
    } else {
      // recommended: slight manual ordering
      const order = [
        "learn-ai-overview",
        "learn-intelligence",
        "learn-machine-learning",
        "learn-generative-ai",
      ];
      topics.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    }

    return topics;
  }, [q, category, sort, t]);

  // Progress indicators on cards
  const modulesForProgress = useMemo(() => learningTopics.map((lt) => ({ moduleKey: lt.id, routeId: lt.id })), []);
  const { getModuleProgress } = useLearningProgress(learnHubCourseKey, modulesForProgress as any);

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
                  onClick={onBackToHome}
                  className="gap-2 mb-6 hover:bg-muted/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("learn.back_to_home")}
                </Button>

                <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 lg:gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="px-3 py-1.5 border-primary/20 text-primary bg-transparent">
                        {t("learn.badge")}
                      </Badge>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {t("learn.title")}
                      </span>
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed mb-8 max-w-2xl font-light">
                      {t("learn.subtitle")}
                    </p>

                    {/* Quick actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => onNavigateToTopic("learn-ai-overview")} 
                        className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10">{t("learn.cta_explore", "Explore AI Topics")}</span>
                        <ArrowRight className="w-5 h-5 relative z-10" />
                      </button>
                      <button
                        onClick={() => onPageChange?.("learn-interactive-exercises")}
                        className="group bg-transparent border border-gray-200/60 hover:border-primary/30 text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                      >
                        <Target className="h-5 w-5" />
                        {t("learn.cta_practice", "Practice Exercises")}
                      </button>
                    </div>
                  </div>

                  {/* Search + Tabs + Sort */}
                  <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <CardHeader className="relative pb-4">
                      <CardTitle className="text-lg font-semibold">{t("learn.find_topic", "Find a topic")}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-6">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600/70" />
                        <Input
                          aria-label={t("learn.search", "Search topics")}
                          placeholder={t("learn.search_placeholder", "Search topics (e.g., LLM, prompts)")}
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                          className="pl-10 h-11 text-sm border-gray-200/60"
                        />
                      </div>

                      <Tabs value={category} onValueChange={(v) => setCategory(v as any)} className="w-full">
                        <TabsList className="flex w-full h-auto p-1 bg-white/60 backdrop-blur-sm border border-gray-200/30">
                          {CATEGORY_TABS.map((tab) => (
                            <TabsTrigger key={tab.key} value={tab.key} className="text-xs whitespace-nowrap px-2 py-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                              {t(tab.i18nKey)}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>

                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-gray-600">{t("learn.sort", "Sort")}</span>
                        <Select value={sort} onValueChange={(v) => setSort(v as any)}>
                          <SelectTrigger className="w-[170px] border-gray-200/60">
                            <SelectValue placeholder="Recommended" />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="recommended">{t("learn.sort_recommended", "Recommended")}</SelectItem>
                            <SelectItem value="az">{t("learn.sort_az", "A → Z")}</SelectItem>
                            <SelectItem value="level">{t("learn.sort_level", "Level (easy → hard)")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guided Course Flow */}
      <section className="py-4 lg:py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <LearnCourseFlow onNavigate={onNavigateToTopic} />
          </div>
        </div>
      </section>

      {/* Results (browse all topics) */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filtered.length === 0 ? (
              <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                <CardContent className="relative text-center py-20">
                  <p className="text-lg mb-2">{t("learn.no_results", "No topics match your search.")}</p>
                  <p className="text-sm text-gray-600 mb-6">
                    {t("learn.try_adjust_search", "Try different keywords or switch category.")}
                  </p>
                  <button 
                    onClick={() => { setQ(""); setCategory("all"); setSort("recommended"); }}
                    className="group bg-transparent border border-gray-200/60 hover:border-primary/30 text-gray-900 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                  >
                    {t("learn.reset_filters", "Reset filters")}
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-20" role="list">
                {filtered.map((topic) => {
                  const IconComponent = topic.icon as any;
                  const tp = getModuleProgress(topic.id);
                  return (
                    <Card
                      key={topic.id}
                      role="listitem"
                      tabIndex={0}
                      aria-label={t(topic.titleKey)}
                      className="relative overflow-hidden border border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm hover:scale-105"
                      onClick={() => onNavigateToTopic(topic.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onNavigateToTopic(topic.id);
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                      <CardHeader className="relative p-6 lg:p-8 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-200/30">
                            <IconComponent className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                          </div>
                          <div className="flex items-center gap-2">
                            {tp.status === 'completed' && (
                              <span className="text-xs text-green-600">✓ {t('learn.completed', 'Completed')}</span>
                            )}
                            <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-transparent">
                              {t(topic.badgeKey)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">{t(`learn.level_${topic.level}`, `Level ${topic.level}`)}</Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg lg:text-xl group-hover:text-primary transition-colors font-semibold">
                          {t(topic.titleKey)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative p-6 lg:p-8 pt-0">
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {t(topic.descriptionKey)}
                        </p>
                        <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                          {t("learn.learn_more")}
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Assessment CTA */}
            <div className="mb-16">
              <AssessmentCTA
                title={t("learn.quiz_title", "Test Your AI Knowledge")}
                description={t(
                  "learn.quiz_description",
                  "Take our comprehensive AI terminology quiz to test your understanding of these concepts."
                )}
                exerciseId="ai-terminology"
                variant="banner"
                onTakeAssessment={() => onPageChange?.("learn-interactive-exercises")}
                className="max-w-4xl mx-auto"
              />
            </div>

            {/* Next Steps */}
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardContent className="relative text-center p-12">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {t("learn.next_title", "Continue Your AI Journey")}
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto text-lg">
                  {t(
                    "learn.next_subtitle",
                    "Now that you've mastered AI terminology, dive deeper into specific topics and start applying these concepts in real-world scenarios."
                  )}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => onNavigateToTopic("learn-ai-overview")} 
                    className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10">{t("learn.cta_explore", "Explore AI Topics")}</span>
                    <ArrowRight className="w-5 h-5 relative z-10" />
                  </button>
                  <button
                    onClick={() => onPageChange?.("learn-interactive-exercises")}
                    className="group bg-transparent border border-gray-200/60 hover:border-primary/30 text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Target className="h-5 w-5" />
                    {t("learn.cta_practice", "Practice Exercises")}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
