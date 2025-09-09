import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { ArrowLeft, Cpu } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";

interface NeuralNetworksHeroProps {
  onBackToLearn: () => void;
}

export function NeuralNetworksHero({ onBackToLearn }: NeuralNetworksHeroProps) {
  const { t } = useLanguage();

  return (
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
                {t("neural_networks.back_to_learn")}
              </Button>

              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Cpu className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge variant="outline" className="border-orange-500/20 text-orange-600 bg-transparent">{t("neural_networks.badge")}</Badge>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("neural_networks.title")}
                  </span>
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block lg:inline"> {t("neural_networks.title_highlight")}</span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-light">
                  {t("neural_networks.subtitle")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

