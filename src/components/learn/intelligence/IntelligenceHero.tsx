import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { Brain } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";
import intelligenceImage from 'figma:asset/ba5af1c8c808cdc8975a80d645c78562f58c8983.png';

export function IntelligenceHero() {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/95 backdrop-blur-sm">
            {/* Hero dotted background pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: "url('/@optimized/hero-dots-optimized.webp')",
              backgroundRepeat: 'repeat',
              backgroundPosition: '0 0',
              backgroundAttachment: 'fixed'
            }} aria-hidden="true" />
            
            <CardContent className="relative p-8 lg:p-12">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-transparent">
                  <Brain className="w-4 h-4 mr-2" />
                  {t("intelligence.hero.badge")}
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("intelligence.hero.title")}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed font-light">
                  {t("intelligence.hero.subtitle")}
                </p>
                
                <div className="relative max-w-3xl mx-auto">
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200/60 shadow-xl">
                    <img 
                      src={intelligenceImage} 
                      alt={t("intelligence.hero.image_alt")} 
                      className="w-full h-auto"
                      width="600"
                      height="400"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent"></div>
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