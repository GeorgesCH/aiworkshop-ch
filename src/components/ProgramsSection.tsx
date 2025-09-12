import React from "react";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Target, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  Zap, 
  Users,
  Download 
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { BrochureDownloadModal } from "./BrochureDownloadModal";

const programs = [
  { titleKey: 'programs.cards.ai_training.title',       descKey: 'programs.cards.ai_training.desc',       tags: ["AI training Switzerland", "corporate AI training"], icon: Brain },
  { titleKey: 'programs.cards.genai.title',             descKey: 'programs.cards.genai.desc',             tags: ["generative AI", "ChatGPT training"],         icon: Sparkles },
  { titleKey: 'programs.cards.chatgpt.title',           descKey: 'programs.cards.chatgpt.desc',           tags: ["ChatGPT workshop", "AI workshop"],          icon: MessageSquare },
  { titleKey: 'programs.cards.strategy.title',          descKey: 'programs.cards.strategy.desc',          tags: ["corporate AI strategy", "AI roadmap"],      icon: BarChart3 },
  { titleKey: 'programs.cards.prompt_engineering.title',descKey: 'programs.cards.prompt_engineering.desc',tags: ["prompt engineering", "AI automation"],       icon: Zap },
  { titleKey: 'programs.cards.enablement.title',        descKey: 'programs.cards.enablement.desc',        tags: ["AI enablement", "AI playbooks"],            icon: Users }
];

const cities = ["Lausanne", "Zurich", "Geneva", "Basel", "Bern"];

interface ProgramsSectionProps {
  onPageChange?: (page: string) => void;
}

export function ProgramsSection({ onPageChange }: ProgramsSectionProps) {
  const { t } = useLanguage();
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  return (
    <section id="programs" className="py-apple-20 lg:py-apple-24">
      <div className="container mx-auto px-apple-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-apple-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">{t("programs.badge")}</span>
          </div>
          <h2 className="heading-2 mb-4">
            {t("programs.title")}
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("programs.subtitle")}
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-apple-8 lg:gap-apple-12 mb-20">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <Card key={index} className="group hover:border-primary/50 transition-all duration-300 border border-border/60 bg-background/80 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-[2px]">
                <CardContent className="p-8 lg:p-10">
                  {/* Icon Container */}
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-6">
                    <h3 className="text-xl lg:text-2xl font-medium leading-tight">
                      {t(program.titleKey)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(program.descKey)}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-apple-3 pt-2">
                      {program.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary" 
                          className="text-xs px-3 py-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cities Section */}
        <div className="max-w-5xl mx-auto">
                  <Card className="bg-white/80 backdrop-blur-sm border border-border/60">
            <CardContent className="p-12 lg:p-16 text-center">
              <div className="space-y-8">
                <div>
                  <h3 className="heading-3 mb-4">{t("programs.cities_title")}</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("programs.cities_subtitle")}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-apple-4 mb-8">
                  {cities.map((city, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-6 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 cursor-pointer"
                    >
                      {city}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-apple-4 justify-center pt-4">
                  <Button 
                    onClick={() => setIsBrochureModalOpen(true)}
                    variant="outline"
                    className="gap-apple-2 px-6 py-3 rounded-xl"
                  >
                    <Download className="w-4 h-4" />
                    {t('programs.cta_brochure')}
                  </Button>
                  <Button 
                    onClick={() => onPageChange && onPageChange("learn-interactive-exercises")}
                    className="gap-apple-2 px-6 py-3 rounded-xl"
                  >
                    <Users className="w-4 h-4" />
                    {t('programs.cta_exercises')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Brochure Download Modal */}
      <BrochureDownloadModal 
        isOpen={isBrochureModalOpen} 
        onClose={() => setIsBrochureModalOpen(false)} 
      />
    </section>
  );
}
