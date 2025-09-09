import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { Cpu } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";
import { aiCapabilities, aiCharacteristics } from "../../data/intelligenceData";
import aiImage from 'figma:asset/48dec070b8118ab1abfec06ede3bc9d0f96e8592.png';

export function AIDeepDive() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
            <CardContent className="relative p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-transparent">
                    <Cpu className="w-4 h-4 mr-2" />
                    {t("intelligence.ai_deep_dive.badge")}
                  </Badge>
                  
                  <h2 className="text-3xl lg:text-4xl font-medium mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("intelligence.ai_deep_dive.title")}
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                    {t("intelligence.ai_deep_dive.description")}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                      <h3 className="font-medium mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t("intelligence.ai_deep_dive.capabilities_title")}</h3>
                      <div className="space-y-4">
                        {aiCapabilities.map((capability, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <capability.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t(`intelligence.ai_capabilities.${capability.titleKey}`)}</div>
                              <div className="text-sm text-gray-600">{t(`intelligence.ai_capabilities.${capability.descriptionKey}`)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t("intelligence.ai_deep_dive.characteristics_title")}</h3>
                      <div className="space-y-4">
                        {aiCharacteristics.map((characteristic, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <characteristic.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t(`intelligence.ai_characteristics.${characteristic.titleKey}`)}</div>
                              <div className="text-sm text-gray-600">{t(`intelligence.ai_characteristics.${characteristic.descriptionKey}`)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src={aiImage} 
                    alt={t("intelligence.ai_deep_dive.image_alt")} 
                    className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200/60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}