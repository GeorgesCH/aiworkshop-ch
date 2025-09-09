import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, Clock, Star } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const showcaseStats = [
  {
    icon: Users,
    value: "500+",
    label: "Professionals Trained"
  },
  {
    icon: Star,
    value: "5/5",
    label: "Average Rating"
  },
  {
    icon: Clock,
    value: "8+",
    label: "Years Experience"
  }
];

export function VideoShowcaseSection() {
  const { t } = useLanguage();
  return (
    <section className="section-apple">
      <div className="container-apple">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t("video.badge")}
          </Badge>
          <h2 className="heading-2 mb-4">
            {t("video.title")}
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            {t("video.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-apple-12 items-center">
          {/* Video Player */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl border-0">
              <div className="relative aspect-video bg-white">
                <iframe
                  src="https://www.youtube.com/embed/Gew9LJRbf_g"
                  title="AI Workshop Switzerland - Professional Training"
                  className="w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-300"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
                
                {/* Subtle overlay for integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-primary/5 pointer-events-none opacity-30 hover:opacity-0 transition-opacity duration-300"></div>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary/20 rounded-full animate-pulse"></div>
              </div>
            </Card>

            {/* Floating Stats */}
            <div className="hidden lg:block absolute -bottom-6 -left-6">
              <Card className="p-4 shadow-lg border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{t('video.live_tag')}</span>
                </div>
              </Card>
            </div>

            <div className="hidden lg:block absolute -top-6 -right-6">
              <Card className="p-4 shadow-lg border-0">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">15+</div>
                  <div className="text-xs text-gray-600">{t('video.participants_label')}</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">{t('video.content_title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('video.content_body')}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">{t('video.list_title')}</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {([1,2,3,4] as const).map(i => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                      {t(`video.list_${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-apple-6">
              {showcaseStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto btn-apple kv-neon-hover"
              onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
            >
              {t("common.book_workshop")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
