import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Linkedin, GraduationCap, Award, Users, Briefcase, Star } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import georgeImage from "../assets/george-raymond-alshoufi-AI-educator-AI-expert-Switzerland.webp";

const credentials = [
  {
    title: "Postgraduate Certificate",
    subtitle: "Computer Science, University of Essex",
    icon: GraduationCap,
    color: "text-blue-600"
  },
  {
    title: "Master en Innovation & Entrepreneurship",
    subtitle: "HEC Paris",
    icon: GraduationCap,
    color: "text-blue-600"
  },
  {
    title: "Artificial Intelligence: Implications for Business Strategy",
    subtitle: "MIT Sloan Executive Education (2025)",
    icon: Award,
    color: "text-green-600"
  },
  {
    title: "Professional Scrum Product Owner II (PSPO II)",
    subtitle: "Scrum.org (2025)",
    icon: Award,
    color: "text-green-600"
  },
  {
    title: "Coach certifié ICF (team coaching)",
    subtitle: "International Coaching Institute, Genève, Suisse (2024)",
    icon: Briefcase,
    color: "text-purple-600"
  }
];

const achievements = [
  {
    icon: Users,
    value: "500+",
    label: "Professionals Trained",
    color: "text-blue-600"
  },
  {
    icon: Briefcase, 
    value: "8+",
    label: "Years Experience",
    color: "text-green-600"
  },
  {
    icon: Star,
    value: "5.0",
    label: "Client Rating",
    color: "text-yellow-600"
  }
];

export function FacilitatorSection() {
  const { t } = useLanguage();
  return (
    <section id="facilitator" className="section-apple">
      <div className="container-apple">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Badge variant="outline" className="mb-3 sm:mb-4">{t('facilitator.badge')}</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4">{t('facilitator.title')}</h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">{t('facilitator.subtitle')}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Profile Image Section */}
                <div className="relative bg-white p-4 sm:p-6 lg:p-8 xl:p-12">
                  <div className="relative">
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto mb-6 sm:mb-8">
                      <ImageWithFallback
                        src={georgeImage}
                        alt="George Raymond-Alshoufi, AI Educator and Expert Switzerland"
                        className="w-full h-full object-cover rounded-2xl shadow-xl"
                      />
                      
                      {/* Floating Badge */}
                      <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4">
                        <Badge className="bg-primary text-primary-foreground px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">{t('facilitator.ai_expert_badge')}</Badge>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2 sm:space-y-3">
                      <h3 className="text-xl sm:text-2xl font-bold">{t('facilitator.profile_name')}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{t('facilitator.profile_role')}</p>
                      
                      {/* Achievement Stats */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6">
                        {achievements.map((achievement, index) => {
                          const IconComponent = achievement.icon;
                          return (
                            <div key={index} className="text-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${achievement.color}`} />
                              </div>
                              <div className="text-sm sm:text-lg font-bold">{achievement.value}</div>
                              <div className="text-xs text-muted-foreground leading-tight">{t(`facilitator.stats.${index+1}`)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6 lg:p-8 xl:p-12 space-y-6 sm:space-y-8">
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('facilitator.paragraph_1')}</p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{t('facilitator.paragraph_2')}</p>
                  </div>

                  {/* Credentials */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-semibold">{t('facilitator.qualifications_title')}</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {credentials.map((credential, index) => {
                        const IconComponent = credential.icon;
                        return (
                          <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-100/20 rounded-lg">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${credential.color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm sm:text-base font-medium">{credential.title}</div>
                              <div className="text-xs sm:text-sm text-gray-600 leading-tight">{credential.subtitle}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <Button className="gap-2 flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base" onClick={() => window.open('https://www.linkedin.com/in/george-a-ch/', '_blank')}>
                      <Linkedin className="w-4 h-4" />
                      {t('facilitator.cta_linkedin')}
                    </Button>
                    <Button variant="outline" className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base" onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}>
                      {t('facilitator.cta_consult')}
                    </Button>
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-gray-100/20 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500 text-yellow-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm sm:text-base font-medium">{t('facilitator.trust_title')}</div>
                        <div className="text-xs sm:text-sm text-gray-600 leading-tight">{t('facilitator.trust_subtitle')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
