import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../LanguageProvider";

export function NeuralNetworksTypes() {
  const { t } = useLanguage();

  const networkTypes = [
    {
      name: t("neural_networks.perceptron_name"),
      icon: "🟢",
      description: t("neural_networks.perceptron_description") + " — Example: Spam vs. Not Spam using a handful of keyword counts.",
      characteristics: [
        t("neural_networks.perceptron_char1"),
        t("neural_networks.perceptron_char2"),
        t("neural_networks.perceptron_char3"),
        t("neural_networks.perceptron_char4"),
        "Single linear decision boundary (no hidden layers)",
        "Fast to train and easy to interpret"
      ],
      applications: [t("neural_networks.perceptron_app1"), t("neural_networks.perceptron_app2"), t("neural_networks.perceptron_app3"), "Simple filters (rule-like classifiers)", "Linearly separable problems"],
      color: "bg-green-500/10 text-green-600 border-green-200"
    },
    {
      name: t("neural_networks.feedforward_name"),
      icon: "➡️",
      description: t("neural_networks.feedforward_description") + " — Example: Predicting house prices from features (rooms, area).",
      characteristics: [
        t("neural_networks.feedforward_char1"),
        t("neural_networks.feedforward_char2"),
        t("neural_networks.feedforward_char3"),
        t("neural_networks.feedforward_char4"),
        "Can approximate complex nonlinear functions with hidden layers"
      ],
      applications: [t("neural_networks.feedforward_app1"), t("neural_networks.feedforward_app2"), t("neural_networks.feedforward_app3"), "Tabular regression/classification"],
      color: "bg-blue-500/10 text-blue-600 border-blue-200"
    },
    {
      name: t("neural_networks.deep_feedforward_name"),
      icon: "🌊",
      description: t("neural_networks.deep_feedforward_description") + " — Example: Recommendation ranking with multiple hidden layers.",
      characteristics: [
        t("neural_networks.deep_feedforward_char1"),
        t("neural_networks.deep_feedforward_char2"),
        t("neural_networks.deep_feedforward_char3"),
        t("neural_networks.deep_feedforward_char4"),
        "Multiple hidden layers capture hierarchical patterns"
      ],
      applications: [t("neural_networks.deep_feedforward_app1"), t("neural_networks.deep_feedforward_app2"), t("neural_networks.deep_feedforward_app3"), "Complex function approximation"],
      color: "bg-purple-500/10 text-purple-600 border-purple-200"
    },
    {
      name: t("neural_networks.modular_name"),
      icon: "🔗",
      description: t("neural_networks.modular_description") + " — Example: Routing tasks to specialized expert sub-networks.",
      characteristics: [
        t("neural_networks.modular_char1"),
        t("neural_networks.modular_char2"),
        t("neural_networks.modular_char3"),
        t("neural_networks.modular_char4"),
        "Mixture-of-Experts and routing improve efficiency on diverse tasks"
      ],
      applications: [t("neural_networks.modular_app1"), t("neural_networks.modular_app2"), t("neural_networks.modular_app3"), "Large-scale multi-task systems"],
      color: "bg-orange-500/10 text-orange-600 border-orange-200"
    },
    {
      name: t("neural_networks.cnn_name"),
      icon: "🖼️",
      description: t("neural_networks.cnn_description") + " — Example: Classifying handwritten digits (MNIST) or defects on factory lines.",
      characteristics: [
        t("neural_networks.cnn_char1"),
        t("neural_networks.cnn_char2"),
        t("neural_networks.cnn_char3"),
        t("neural_networks.cnn_char4"),
        "Translation invariance via convolution and pooling"
      ],
      applications: [t("neural_networks.cnn_app1"), t("neural_networks.cnn_app2"), t("neural_networks.cnn_app3"), t("neural_networks.cnn_app4"), "Medical imaging triage", "Quality inspection"],
      color: "bg-pink-500/10 text-pink-600 border-pink-200"
    },
    {
      name: t("neural_networks.rnn_name"),
      icon: "🔄",
      description: t("neural_networks.rnn_description") + " — Example: Predicting the next character/word in a sentence.",
      characteristics: [
        t("neural_networks.rnn_char1"),
        t("neural_networks.rnn_char2"),
        t("neural_networks.rnn_char3"),
        t("neural_networks.rnn_char4"),
        "Remembers context over time with hidden state"
      ],
      applications: [t("neural_networks.rnn_app1"), t("neural_networks.rnn_app2"), t("neural_networks.rnn_app3"), "Time-series forecasting", "Code autocompletion (pre-transformer era)"],
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200"
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-medium mb-8 text-center">{t("neural_networks.architectures_title")}</h2>
      
      <div className="space-y-8">
        {networkTypes.map((network, index) => (
          <Card key={index} className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
            <CardContent className="relative p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Header & Description */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{network.icon}</span>
                    <div>
                      <h3 className="text-xl font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{network.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {network.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="lg:col-span-1">
                  <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.key_characteristics")}</h4>
                  <ul className="space-y-2">
                    {network.characteristics.map((char, charIndex) => (
                      <li key={charIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0 border border-primary/20"></div>
                        <span className="text-gray-600">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Applications */}
                <div className="lg:col-span-1">
                  <h4 className="font-medium mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("neural_networks.common_applications")}</h4>
                  <div className="space-y-2">
                    {network.applications.map((app, appIndex) => (
                      <Badge key={appIndex} variant="outline" className="text-xs mr-2 mb-2 border-gray-200/60 bg-transparent">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

