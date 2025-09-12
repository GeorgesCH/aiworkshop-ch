import React, { useState } from "react";
import { Button, Badge, Card } from "./design-system";
import { ArrowRight, Play, Star, Users, CheckCircle, Phone, Calendar, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { BrochureDownloadModal as BrochureModal } from "./BrochureDownloadModal";
import { AssessmentCTA } from "./AssessmentCTA";
import { useAnalytics } from "../hooks/useAnalytics";
// Use optimized public images
import { CircuitBackground, DiagonalPill } from "./BrandMotif";
// Hero image path - using optimized WebP version
const heroImagePath = "/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp";

interface HeroSectionProps {
  onPageChange?: (page: string) => void;
}

export function HeroSection({ onPageChange }: HeroSectionProps = {}) {
  const { t } = useLanguage();
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const { trackClick, trackConversion } = useAnalytics({ page: 'home' });
  
  const trustIndicators = [
    { icon: Users, label: t("hero.trust_1") },
    { icon: Star, label: t("hero.trust_2") },
    { icon: CheckCircle, label: t("hero.trust_3") }
  ];
  return (
    <section className="relative overflow-hidden py-apple-20 lg:py-apple-32">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-100/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-apple-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-apple-12 lg:gap-apple-20 items-center min-h-[80vh]">
          {/* Text Content - Enhanced */}
          <div className="space-y-apple-10 text-center lg:text-left">
            <div className="space-y-apple-8">
              <div className="inline-flex items-center gap-apple-3 bg-white/80 backdrop-blur-xl border border-white/20 text-foreground shadow-apple-sm rounded-apple-xl px-4 py-2 mx-auto lg:mx-0">
                <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
                  {t("hero.title")}
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:max-w-none lg:mx-0 font-light">
                {t("hero.description")}
              </p>
            </div>

            {/* Hero Image - Mobile Optimized - Shows after text on mobile */}
            <div className="relative lg:hidden mt-8">
              <div className="relative max-w-sm mx-auto">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/40 shadow-xl">
                  <img
                    src={heroImagePath}
                    alt={t("hero.image_alt")}
                    className="w-full h-auto object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-apple-4 w-full max-w-lg mx-auto lg:max-w-none lg:mx-0">
                <Button 
                  variant="gradient"
                  size="lg"
                  className="text-lg px-apple-8 py-apple-4 rounded-apple-xl"
                  onClick={() => {
                    trackClick('book-consultation', 'hero-section');
                    trackConversion('discovery_call');
                    window.open('https://calendly.com/georgeraymond/30min', '_blank');
                  }}
                  leftIcon={<Phone className="h-5 w-5" />}
                >
                  {t("hero.cta_primary")}
                </Button>
                <Button 
                  variant="glass"
                  size="lg"
                  className="text-lg px-apple-8 py-apple-4 rounded-apple-xl"
                  onClick={() => {
                    trackClick('download-brochure', 'hero-section');
                    setIsBrochureModalOpen(true);
                  }}
                  leftIcon={<Download className="h-5 w-5" />}
                >
                  {t("hero.download_brochure")}
                </Button>
            </div>

            {/* Trust Indicators - Enhanced */}
            <div className="pt-apple-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-apple-4">
                {trustIndicators.map((indicator, index) => {
                  const IconComponent = indicator.icon;
                  return (
                    <Card key={index} variant="apple" className="group p-apple-4 rounded-apple-xl">
                      <div className="w-10 h-10 rounded-apple-lg bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 flex items-center justify-center transition-apple">
                        <IconComponent className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-apple" />
                      </div>
                      <span className="font-semibold text-sm text-center group-hover:text-primary transition-colors duration-apple">{indicator.label}</span>
                    </Card>
                  );
                })}
              </div>
              
              {/* Swiss Feature - Enhanced */}
              <div className="flex justify-center lg:justify-start items-center gap-apple-4 text-base text-muted-foreground pt-apple-6">
                <div className="w-8 h-8 rounded-apple-xl bg-gradient-to-br from-red-500/20 to-white/60 flex items-center justify-center text-lg shadow-apple-sm">
                  🇨🇭
                </div>
                <span className="font-semibold">{t("hero.feature_1")}</span>
              </div>
            </div>
            </div>

          {/* Hero Image - Enhanced */}
          <div className="relative hidden lg:block">
            <div className="relative max-w-none group h-[600px]">
              <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/40 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <img
                  src={heroImagePath}
                  alt={t("hero.image_alt")}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Enhanced Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-secondary/40 to-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>
        
        {/* Brochure Modal */}
        <BrochureModal 
          isOpen={isBrochureModalOpen} 
          onClose={() => setIsBrochureModalOpen(false)} 
        />
      </div>
    </section>
  );
}
