import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { RotateCcw, ArrowRight } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";

export function NeuralNetworksRNNDeepDive() {
  const { t } = useLanguage();

  return (
    <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-50" aria-hidden="true" />
      <CardContent className="relative p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
            <RotateCcw className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.rnn_deep_title")}</h2>
            <p className="text-sm text-gray-600">{t("neural_networks.rnn_deep_subtitle")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            {t("neural_networks.rnn_deep_description") + " Learn-by-doing idea: type a short sentence and guess the next word; RNNs maintain context to make that prediction."}
          </p>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60">
            <h4 className="font-medium mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.rnn_example_title")}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded text-sm border border-indigo-500/20">
                  {t("neural_networks.rnn_example_input")}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded text-sm border border-green-500/20">
                  {t("neural_networks.rnn_example_output")}
                </div>
              </div>
              <p className="text-xs text-gray-600">
                {t("neural_networks.rnn_example_explanation") + " Example: In \"I left my keys at the\", likely next word is \"office\" or \"home\"."}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.rnn_variants_title")}</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-gray-200/60 bg-transparent">LSTM</Badge>
                  <span className="text-sm text-gray-600">{t("neural_networks.rnn_lstm")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-gray-200/60 bg-transparent">GRU</Badge>
                  <span className="text-sm text-gray-600">{t("neural_networks.rnn_gru")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-gray-200/60 bg-transparent">BiRNN</Badge>
                  <span className="text-sm text-gray-600">{t("neural_networks.rnn_birnn")}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.rnn_key_apps_title")}</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.rnn_app_translation")}</Badge>
                <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.rnn_app_speech")}</Badge>
                <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.rnn_app_stock")}</Badge>
                <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.rnn_app_chatbots")}</Badge>
                <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.rnn_app_music")}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

