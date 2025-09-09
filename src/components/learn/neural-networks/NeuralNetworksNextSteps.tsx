import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";

interface NeuralNetworksNextStepsProps {
  onNavigateToTopic: (topic: string) => void;
}

export function NeuralNetworksNextSteps({ onNavigateToTopic }: NeuralNetworksNextStepsProps) {
  const { t } = useLanguage();

  return (
    <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50" aria-hidden="true" />
      <CardContent className="relative p-8 text-center">
        <h2 className="text-2xl font-medium mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.next_steps_title")}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {t("neural_networks.next_steps_description") + " Practice ideas: implement a tiny perceptron in a notebook; try a 2-layer MLP on a small dataset; visualize a 3×3 edge filter on a sample image."}
        </p>
        <Button 
          onClick={() => onNavigateToTopic("learn-foundation-models")} 
          className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {t("neural_networks.continue_button")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

