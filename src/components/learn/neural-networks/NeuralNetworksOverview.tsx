import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Cpu } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";

export function NeuralNetworksOverview() {
  const { t } = useLanguage();

  return (
    <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
      <CardContent className="relative p-8">
        <h2 className="text-2xl font-medium mb-4 flex items-center gap-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          <Cpu className="w-6 h-6 text-primary" />
          {t("neural_networks.overview_title")}
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          {t("neural_networks.overview_description")}
        </p>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60">
          <h4 className="font-medium mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.key_components")}</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-blue-500/20"></div>
              <span className="text-sm">{t("neural_networks.component_neurons")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-green-500/20"></div>
              <span className="text-sm">{t("neural_networks.component_connections")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full border border-purple-500/20"></div>
              <span className="text-sm">{t("neural_networks.component_activation")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full border border-orange-500/20"></div>
              <span className="text-sm">{t("neural_networks.component_layers")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

