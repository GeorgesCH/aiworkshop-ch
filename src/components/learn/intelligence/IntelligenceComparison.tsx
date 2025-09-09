import { Card, CardContent, CardHeader } from "../../ui/card";
import { Brain, Computer, Zap } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";
import { intelligenceComparison, capabilityMatrix } from "../../data/intelligenceData";

export function IntelligenceComparison() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("intelligence.comparison.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("intelligence.comparison.subtitle")}
            </p>
          </div>

          {/* Intelligence Comparison Grid */}
          <div className="space-y-8">
            {/* Header Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="hidden lg:block"></div>
              <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/10 opacity-50" aria-hidden="true" />
                <CardHeader className="relative text-center pb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5 text-pink-600" />
                    <span className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("intelligence.comparison.humans")}</span>
                  </div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/10 opacity-50" aria-hidden="true" />
                <CardHeader className="relative text-center pb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Computer className="w-5 h-5 text-gray-600" />
                    <span className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("intelligence.comparison.machines")}</span>
                  </div>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-50" aria-hidden="true" />
                <CardHeader className="relative text-center pb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("intelligence.comparison.augmented")}</span>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Comparison Rows */}
            {intelligenceComparison.map((comparison, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="flex items-center">
                  <h3 className="font-medium text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t(`intelligence.comparison_aspects.${comparison.aspectKey}`)}</h3>
                </div>
                
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/10 opacity-50" aria-hidden="true" />
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-3">
                      <comparison.humanIcon className="w-5 h-5 text-pink-600 mt-0.5 shrink-0" />
                      <p className="text-sm leading-relaxed">{t(`intelligence.comparison_data.${comparison.humanKey}`)}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/10 opacity-50" aria-hidden="true" />
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-3">
                      <comparison.machineIcon className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
                      <p className="text-sm leading-relaxed">{t(`intelligence.comparison_data.${comparison.machineKey}`)}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-50" aria-hidden="true" />
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-3">
                      <comparison.augmentedIcon className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                      <p className="text-sm leading-relaxed">{t(`intelligence.comparison_data.${comparison.augmentedKey}`)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Capability Matrix */}
          <div className="mt-20">
            <h3 className="text-2xl font-medium text-center mb-12 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("intelligence.capability_matrix.title")}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="hidden lg:block"></div>
              <div className="text-center font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("intelligence.capability_matrix.human")}</div>
              <div className="text-center font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("intelligence.capability_matrix.artificial")}</div>
              <div className="text-center font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("intelligence.capability_matrix.augmented")}</div>
              
              {capabilityMatrix.map((capability, index) => [
                <div key={`label-${index}`} className="flex items-center font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {t(`intelligence.capability_matrix.${capability.categoryKey}`)}
                </div>,
                <div key={`human-${index}`} className="flex justify-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${
                    capability.human.status === 'positive' 
                      ? 'bg-green-100 text-green-700 border-green-500/20' 
                      : 'bg-red-100 text-red-700 border-red-500/20'
                  }`}>
                    <Computer className="w-4 h-4" />
                    <capability.human.icon className="w-4 h-4" />
                  </div>
                </div>,
                <div key={`artificial-${index}`} className="flex justify-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${
                    capability.artificial.status === 'positive' 
                      ? 'bg-green-100 text-green-700 border-green-500/20' 
                      : 'bg-red-100 text-red-700 border-red-500/20'
                  }`}>
                    <Computer className="w-4 h-4" />
                    <capability.artificial.icon className="w-4 h-4" />
                  </div>
                </div>,
                <div key={`augmented-${index}`} className="flex justify-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${
                    capability.augmented.status === 'positive' 
                      ? 'bg-green-100 text-green-700 border-green-500/20' 
                      : 'bg-red-100 text-red-700 border-red-500/20'
                  }`}>
                    <Computer className="w-4 h-4" />
                    <capability.augmented.icon className="w-4 h-4" />
                  </div>
                </div>
              ]).flat()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}