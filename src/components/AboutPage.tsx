import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Target, Users, Zap, ArrowLeft, Mail, Phone, CheckCircle, Calendar, Linkedin } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { AssessmentCTA } from "./AssessmentCTA";
// Use optimized images from @optimized folder
const designThinkingImage = "/@optimized/aiworkshop-design-thinking-lausanne-optimized.webp";
const georgeImage = "/@optimized/george-raymond-alshoufi-AI-educator-AI-expert-Switzerland-optimized.webp";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Swiss Professionals Trained",
    description: "From startups to Fortune 500"
  },
  {
    icon: Award,
    value: "98%",
    label: "Completion Rate",
    description: "Industry-leading success"
  },
  {
    icon: Target,
    value: "25+",
    label: "Swiss Cities",
    description: "Nationwide coverage"
  },
  {
    icon: Zap,
    value: "4.9★",
    label: "Average Rating",
    description: "Google Reviews"
  }
];

const team = [
  {
    name: "George Raymond-Alshoufi",
    role: "Lead AI Facilitator",
    background: "10+ years in AI consulting, Swiss market specialist",
    image: georgeImage
  }
];

interface AboutPageProps {
  onBackToHome: () => void;
  onPageChange?: (page: string) => void;
}

export function AboutPage({ onBackToHome, onPageChange }: AboutPageProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <CardContent className="relative p-8 lg:p-12">
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    onClick={onBackToHome}
                    className="gap-2 mb-8 hover:scale-105 transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("about.back_to_home")}
                  </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-20">
                  <div className="space-y-10">
                    <div className="space-y-8">
                      <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-transparent">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mr-2" />
                        {t("about.badge")}
                      </Badge>
                      
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {t("about.title")}
                        </span>
                        <span className="text-primary block lg:inline"> {t("about.title_highlight")}</span>
                      </h1>

                      <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
                        {t("about.subtitle")}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="group flex items-start space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 flex items-center justify-center transition-all duration-300 border border-primary/20">
                          <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("about.swiss_expertise")}</h4>
                          <p className="text-gray-600 leading-relaxed">
                            {t("about.swiss_expertise_desc")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="group flex items-start space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 flex items-center justify-center transition-all duration-300 border border-primary/20">
                          <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("about.practical_implementation")}</h4>
                          <p className="text-gray-600 leading-relaxed">
                            {t("about.practical_implementation_desc")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="group flex items-start space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 flex items-center justify-center transition-all duration-300 border border-primary/20">
                          <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t("about.ongoing_support")}</h4>
                          <p className="text-gray-600 leading-relaxed">
                            {t("about.ongoing_support_desc")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60">
                      <ImageWithFallback
                        src={designThinkingImage}
                        alt="AI Workshop Switzerland design thinking training session in Lausanne"
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Overlay Text */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <Badge variant="secondary" className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-white text-xs">
                          {t("about.live_workshop")}
                        </Badge>
                        <h3 className="text-white text-lg font-semibold leading-tight drop-shadow-lg">
                          {t("about.ai_swiss_business")}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Floating Achievement Card */}
                    <div className="absolute -bottom-6 -right-6 hidden xl:block z-20">
                      <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                        <CardContent className="relative p-6 text-center">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
                            <Award className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">100%</div>
                          <div className="text-sm text-gray-600">Swiss Focus</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Assessment CTA */}
                <div className="mb-20">
                  <AssessmentCTA
                    title={t("about.start_journey_title")}
                    description={t("about.start_journey_desc")}
                    variant="banner"
                    onTakeAssessment={() => window.open('/en/assessment', '_blank')}
                    className="max-w-4xl mx-auto"
                  />
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Visual Content */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60">
                  <div className="relative w-full">
                    <ImageWithFallback
                      src={designThinkingImage}
                      alt="AI Workshop Switzerland training impact"
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <Badge variant="secondary" className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-white text-xs">
                        {t("about.proven_results")}
                      </Badge>
                      <h3 className="text-white text-lg font-semibold leading-tight drop-shadow-lg">
                        {t("about.measurable_impact")}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Card */}
                <div className="absolute -bottom-6 -right-6 hidden lg:block z-20">
                  <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <CardContent className="relative p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">98%</div>
                      <div className="text-sm text-gray-600">{t("about.completion_rate")}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Stats Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-transparent">
                    {t("about.our_impact")}
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("about.trusted_by_professionals")}
                    </span>
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                    {t("about.track_record")}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={index} className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="relative p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{stat.value}</div>
                              <div className="font-medium text-sm text-gray-900">{stat.label}</div>
                              <div className="text-xs text-gray-600">{stat.description}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Additional CTA */}
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="group gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => window.open('/en/assessment', '_blank')}
                  >
                    <Users className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    {t("about.join_community")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12 lg:mb-16">
              <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-transparent text-xs sm:text-sm">
                {t("about.our_team")}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 leading-tight px-2">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {t("about.meet_facilitator")}
                </span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light px-4">
                {t("about.facilitator_desc")}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="group relative overflow-hidden border border-gray-200/60 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="relative p-4 sm:p-6 lg:p-8 xl:p-12 text-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mx-auto mb-4 sm:mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="relative w-full h-full object-cover rounded-full border-2 sm:border-4 border-white shadow-lg"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{member.name}</h3>
                    <Badge variant="secondary" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 text-xs sm:text-sm">{member.role}</Badge>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto px-2">
                      {member.background}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-center mt-6 sm:mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        className="group/btn gap-2 px-4 sm:px-6 py-2 border border-blue-500/60 hover:border-blue-500/80 bg-blue-50/50 hover:bg-blue-50/80 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                        onClick={() => window.open('https://www.linkedin.com/in/george-a-ch/', '_blank')}
                      >
                        <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                        Connect on LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" aria-hidden="true" />
              <CardContent className="relative p-8 lg:p-12 text-center">
                <div className="space-y-6 mb-12">
                  <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-transparent">
                    {t("about.our_purpose")}
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("about.our_mission")}
                    </span>
                  </h2>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
                    {t("about.mission_desc")}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="group gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => window.open('mailto:hello@aiworkshop.ch', '_blank')}
                  >
                    <Mail className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    {t("about.get_in_touch")}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="group gap-3 px-8 py-4 border border-gray-200/60 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                    onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
                  >
                    <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    {t("about.schedule_call")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}