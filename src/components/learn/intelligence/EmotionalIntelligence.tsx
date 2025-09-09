import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { Heart, Lightbulb } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";
import { eqPrinciples } from "../../data/intelligenceData";
import eqImage from 'figma:asset/7cac56392bea021c8a910f4bd070b505a79bf287.png';

export function EmotionalIntelligence() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
            <CardContent className="relative p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative lg:order-2">
                  <img 
                    src={eqImage} 
                    alt={t("intelligence.emotional.image_alt")} 
                    className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200/60"
                  />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/60">
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-center">
                          {t("intelligence.emotional.quote")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="lg:order-1">
                  <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    {t("intelligence.emotional.badge")}
                  </Badge>
                  
                  <h2 className="text-3xl lg:text-4xl font-medium mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("intelligence.emotional.title")}
                  </h2>
              
                  <div className="mb-8">
                    <p className="text-lg text-gray-600 mb-4">
                      {t("intelligence.emotional.author")}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {eqPrinciples.map((principle, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-3 shrink-0 border border-primary/20"></div>
                        <p className={`leading-relaxed ${
                          t(`intelligence.eq_principles.${principle.key}`).includes(t("intelligence.eq_principles.combine_highlight")) 
                            ? 'text-primary font-medium bg-primary/10 px-3 py-2 rounded-lg border border-primary/20' 
                            : ''
                        }`}>
                          {t(`intelligence.eq_principles.${principle.key}`)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12">
                    <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/60">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 border border-primary/20">
                            <Lightbulb className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("intelligence.emotional.key_insight_title")}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {t("intelligence.emotional.key_insight_description")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}