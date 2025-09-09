import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Image, Grid3X3, Layers2, Share2 } from "lucide-react";
import { useLanguage } from "../../LanguageProvider";

export function NeuralNetworksCNNDeepDive() {
  const { t } = useLanguage();

  return (
    <Card className="mb-12 relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-50" aria-hidden="true" />
      <CardContent className="relative p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20">
            <Image className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.cnn_deep_title")}</h2>
            <p className="text-sm text-gray-600">{t("neural_networks.cnn_deep_subtitle")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            {t("neural_networks.cnn_deep_description") + " Learn-by-doing idea: start with a small 3×3 filter that detects edges; imagine sliding it over an image and watching high responses where edges appear."}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60">
              <div className="flex items-center gap-3 mb-4">
                <Grid3X3 className="w-5 h-5 text-pink-600" />
                <h4 className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.cnn_conv_title")}</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t("neural_networks.cnn_conv_description") + " Example: Edge/texture filters that activate on stripes or corners."}
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60">
              <div className="flex items-center gap-3 mb-4">
                <Layers2 className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.cnn_pool_title")}</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t("neural_networks.cnn_pool_description") + " Example: Max-pooling reduces noise by keeping only strong activations."}
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200/60">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <h4 className="font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.cnn_fc_title")}</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t("neural_networks.cnn_fc_description") + " Example: After feature extraction, classify into cats vs. dogs."}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.cnn_success_title")}</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.cnn_success1")}</Badge>
              <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.cnn_success2")}</Badge>
              <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.cnn_success3")}</Badge>
              <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.cnn_success4")}</Badge>
              <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.cnn_success5")}</Badge>
              <Badge variant="outline" className="border-gray-200/60 bg-transparent">{t("neural_networks.cnn_success6")}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

