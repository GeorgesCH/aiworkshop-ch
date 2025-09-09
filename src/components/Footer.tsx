import { Button, Badge, Separator } from "./design-system";
import { Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Calendar } from "lucide-react";
import React from 'react';
// Use public assets
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";

interface FooterProps {
  onPageChange?: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps = {}) {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  // Always use light logo since we're forcing light mode
  const getCurrentLogo = () => {
    return '/optimized/AI-Workshop_Logo_light-optimized.webp';
  };

  const navigateToPage = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Fallback for when Footer is used without navigation context
      const path = page === "home" ? "/" : `/${page}`;
      window.location.href = `/${language}${path}`;
    }
  };
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-apple-4 py-apple-8 sm:py-apple-12 lg:py-apple-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-apple-6 sm:gap-apple-8 lg:gap-apple-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-apple-4 sm:space-y-apple-6 text-center sm:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={getCurrentLogo()} 
                      alt="AI Workshop Switzerland" 
                      className="h-6 w-auto object-contain"
                    />
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-30"></div>
                  </div>
                  <span className="font-sigum text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    AI-Workshop
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <Badge variant="apple-secondary" size="sm">
                  {t('footer.project_badge')}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mx-auto sm:mx-0">
                {t('footer.brand_tagline')}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-foreground">{t('footer.follow_us')}</h4>
              <div className="flex justify-center sm:justify-start space-x-3">
                <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-110 transition-all duration-300 rounded-xl border border-transparent hover:border-primary/20">
                  <a href="https://www.linkedin.com/company/ai-workshop-switzerland/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-110 transition-all duration-300 rounded-xl border border-transparent hover:border-primary/20">
                  <a href="https://www.instagram.com/aiworkshop.ch/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:scale-110 transition-all duration-300 rounded-xl border border-transparent hover:border-primary/20">
                  <a href="https://www.youtube.com/@ChatSwiss-ch" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-apple-4 sm:space-y-apple-6 text-center sm:text-left">
            <h4 className="font-bold text-foreground text-base relative inline-block">
              {t("footer.courses")}
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <nav className="space-y-3">
              <button onClick={() => navigateToPage('ai-fundamentals')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.ai_fundamentals')}
              </button>
              <button onClick={() => navigateToPage('ai-business-intelligence')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.ai_business_intelligence')}
              </button>
              <button onClick={() => navigateToPage('generative-ai')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.generative_ai_business')}
              </button>
              <button onClick={() => navigateToPage('agentic-ai')} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-apple hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full group-hover:bg-primary transition-colors"></div>
                {t('header.agentic_ai')}
                <Badge variant="warning" size="sm">{t('header.new')}</Badge>
              </button>
              <button onClick={() => navigateToPage('coaching')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.coaching')}
              </button>
              <button onClick={() => navigateToPage('contact')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('nav.contact')}
              </button>
            </nav>
          </div>

          {/* Learning Resources */}
          <div className="space-y-apple-4 sm:space-y-apple-6 text-center sm:text-left">
            <h4 className="font-bold text-foreground text-base relative inline-block">
              {t("footer.learning")}
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <nav className="space-y-3">
              <button onClick={() => navigateToPage('learn')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.learning_hub')}
              </button>
              <button onClick={() => navigateToPage('learn-interactive-exercises')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.interactive_exercises')}
              </button>
              <button onClick={() => navigateToPage('about')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('footer.workshop_methodology')}
              </button>
              <button onClick={() => navigateToPage('learn-ai-overview')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.ai_overview')}
              </button>
              <button onClick={() => navigateToPage('learn-ai-tools-directory')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.ai_tools_directory')}
              </button>
              <button onClick={() => navigateToPage('learn-foundation-models')} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors"></div>
                {t('header.foundation_models')}
              </button>
            </nav>
          </div>

          {/* Contact & CTA */}
          <div className="space-y-apple-4 sm:space-y-apple-6 text-center sm:text-left col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-foreground text-base relative inline-block">
              {t("footer.contact")}
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <div className="space-y-apple-3 sm:space-y-apple-4">
              <div className="space-y-4">
                <div className="group flex items-center justify-center sm:justify-start space-x-3 text-sm text-muted-foreground hover:text-primary transition-all duration-200">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <a 
                    href="mailto:info@aiworkshop.ch" 
                    className="hover:text-primary transition-colors min-h-[44px] flex items-center sm:min-h-auto font-medium"
                  >
                    info@aiworkshop.ch
                  </a>
                </div>
                <div className="group flex items-center justify-center sm:justify-start space-x-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="min-h-[44px] flex items-center sm:min-h-auto font-medium">{t("footer.location")}</span>
                </div>
                <div className="group flex items-center justify-center sm:justify-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <a href="tel:+41768184677" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    +41 76 818 46 77
                  </a>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="apple"
                  size="default"
                  className="w-full"
                  onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  {t('nav.book_consultation')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative my-8">
          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto sm:mx-0 text-center md:text-left">
              © 2024 AI Workshop Switzerland. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('footer.made_with')}</span>
            <span className="text-red-500 animate-pulse text-lg">♥</span>
            <span>{t('footer.in_switzerland')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}