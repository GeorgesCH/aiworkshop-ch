import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle, Clock, Shield, Trophy, Users, Zap } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import React from 'react';

const benefits = [
  { icon: Shield, color: "text-blue-600" },
  { icon: Users, color: "text-green-600" },
  { icon: Clock, color: "text-orange-600" },
  { icon: Trophy, color: "text-purple-600" },
  { icon: Zap, color: "text-yellow-600" },
  { icon: CheckCircle, color: "text-red-600" }
];

const testimonialHighlight = {
  quote: "The best AI training investment we've made. Our team's productivity increased by 40% within 2 months.",
  author: "Marketing Director",
  company: "Swiss Tech Startup",
  rating: 5
};

interface WhyChooseUsSectionProps {
  onPageChange?: (page: string) => void;
}

export function WhyChooseUsSection({ onPageChange }: WhyChooseUsSectionProps = {}) {
  const { t } = useLanguage();
  return (
    <section className="section-apple">
      <div className="container-apple">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t('why.badge')}
          </Badge>
          <h2 className="heading-2 mb-4">
            {t('why.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('why.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-apple-16 items-start">
          {/* Benefits Grid */}
          <div className="flex flex-col gap-apple-8">
            <div className="grid sm:grid-cols-2 gap-apple-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className={`group hover:shadow-apple-lg transition-apple border border-border/60 bg-background/80 backdrop-blur fade-in-up ${index===0?'stagger-1':index===1?'stagger-2':index===2?'stagger-3':index===3?'stagger-4':index===4?'stagger-5':'stagger-6'}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-apple-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                          <IconComponent className={`w-6 h-6 ${benefit.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-foreground">{t(`why.benefits.${index + 1}.title`)}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {t(`why.benefits.${index + 1}.desc`)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Call to Action Card */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-2">{t('why.cta_title')}</h3>
                <p className="text-primary-foreground/90 mb-4">
                  {t('why.cta_desc')}
                </p>
                <Badge 
                  variant="secondary" 
                  className="bg-white text-primary cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onPageChange?.("assessment")}
                >
                  {t('why.cta_button')}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Visual Content */}
          <div className="flex flex-col gap-apple-8">
            {/* Main Image with Overlay */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="/@optimized/aiworkshop-team-collaboration-optimized.webp"
                  fallbackSrc="/@optimized/aiworkshop-team-collaboration-optimized.jpg"
                  alt={t('why.image_alt')}
                  className="w-full h-[400px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <Card className="bg-white/95 backdrop-blur border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-apple-4">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{t('why.stats.success_rate')}</div>
                          <div className="text-2xl font-bold text-primary">95%</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{t('why.stats.satisfaction')}</div>
                          <div className="text-2xl font-bold text-primary">5.0★</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{t('why.stats.completion')}</div>
                          <div className="text-2xl font-bold text-primary">98%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Floating testimonial */}
              <div className="absolute -top-6 -right-6 hidden lg:block max-w-xs">
                <Card className="shadow-xl bg-white border-0">
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {[...Array(testimonialHighlight.rating)].map((_, i) => (
                        <CheckCircle key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 italic">
                      "{t('why.testimonial.quote')}"
                    </p>
                    <div className="text-xs">
                      <div className="font-medium">{t('why.testimonial.author')}</div>
                      <div className="text-gray-600">{t('why.testimonial.company')}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Secondary Visual Elements */}
            <div className="grid grid-cols-2 gap-apple-4">
              <Card className="bg-gray-100/20 border-0">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">500+</div>
                  <div className="text-sm text-blue-700">{t('why.visual.trained')}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-100/20 border-0">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">8+</div>
                  <div className="text-sm text-green-700">{t('why.visual.years')}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
