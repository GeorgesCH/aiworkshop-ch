import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Image, MessageSquare, Grid3X3 } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";

export function NeuralNetworksSelectionGuide() {
  const { t } = useLanguage();

  return (
    <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
      <CardContent className="relative p-8">
        <h2 className="text-2xl font-medium mb-6 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.selection_title")}</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200/60">
              <Image className="w-8 h-8 text-pink-600" />
            </div>
            <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.visual_data_title")}</h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t("neural_networks.visual_data_description") + " Quick test: if rotating or shifting the image shouldn't change the label, CNNs are strong candidates."}
            </p>
            <Badge variant="outline" className="border-pink-500/20 text-pink-600 bg-transparent">{t("neural_networks.visual_data_recommendation")}</Badge>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200/60">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
            </div>
            <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.sequential_data_title")}</h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t("neural_networks.sequential_data_description") + " Rule of thumb: if order and timing matter, consider RNNs/Transformers."}
            </p>
            <Badge variant="outline" className="border-indigo-500/20 text-indigo-600 bg-transparent">{t("neural_networks.sequential_data_recommendation")}</Badge>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200/60">
              <Grid3X3 className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.structured_data_title")}</h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t("neural_networks.structured_data_description") + " Tip: Start with simpler MLPs/Gradient Boosting; add depth once you hit a ceiling."}
            </p>
            <Badge variant="outline" className="border-blue-500/20 text-blue-600 bg-transparent">{t("neural_networks.structured_data_recommendation")}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

