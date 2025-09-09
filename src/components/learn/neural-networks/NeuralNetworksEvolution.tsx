import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../LanguageProvider";

export function NeuralNetworksEvolution() {
  const { t } = useLanguage();

  return (
    <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50" aria-hidden="true" />
      <CardContent className="relative p-8">
        <h2 className="text-2xl font-medium mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.evolution_title")}</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🟢</span>
              <div>
                <h4 className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.perceptron_era")}</h4>
                <p className="text-sm text-gray-600">{t("neural_networks.perceptron_era_desc")}</p>
              </div>
            </div>
            <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.era_historical")}</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">➡️</span>
              <div>
                <h4 className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.multilayer_era")}</h4>
                <p className="text-sm text-gray-600">{t("neural_networks.multilayer_era_desc")}</p>
              </div>
            </div>
            <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.era_foundation")}</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h4 className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.cnn_era")}</h4>
                <p className="text-sm text-gray-600">{t("neural_networks.cnn_era_desc")}</p>
              </div>
            </div>
            <Badge variant="outline" className="border-green-500/20 text-green-600 bg-transparent">{t("neural_networks.era_revolutionary")}</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.transformer_era")}</h4>
                <p className="text-sm text-gray-600">{t("neural_networks.transformer_era_desc")}</p>
              </div>
            </div>
            <Badge variant="outline" className="border-purple-500/20 text-purple-600 bg-transparent">{t("neural_networks.era_modern")}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

