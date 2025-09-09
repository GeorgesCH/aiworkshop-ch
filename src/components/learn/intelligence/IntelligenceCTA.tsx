import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Brain, Users, ArrowRight } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";

interface IntelligenceCTAProps {
  onPageChange?: (page: string) => void;
}

export function IntelligenceCTA({ onPageChange }: IntelligenceCTAProps = {}) {
  const { t, language } = useLanguage();
  
  const navigateToPage = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50" aria-hidden="true" />
            <CardContent className="relative p-8 lg:p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-medium mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t("intelligence.cta.title")}
              </h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                {t("intelligence.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigateToPage("ai-fundamentals")}
                >
                  <Brain className="w-5 h-5" />
                  {t("intelligence.cta.explore_fundamentals")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="gap-2 px-8 py-3 border-gray-200/60 bg-transparent hover:bg-muted/50"
                  onClick={() => navigateToPage("home")}
                >
                  <Users className="w-5 h-5" />
                  {t("intelligence.cta.view_programs")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}