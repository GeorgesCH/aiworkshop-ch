import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
// Use optimized images from public folder
const coachingSessionImage = "/optimized/aiworkshop-fundamentals-course-optimized.webp";
const facilitatorExpertImage = "/optimized/aiworkshop-facilitator-expert-optimized.webp";
import { 
  CheckCircle, 
  Users, 
  Building, 
  ArrowRight, 
  Clock, 
  Target, 
  Zap, 
  Brain,
  Phone,
  Calendar,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Shield,
  Lightbulb,
  Workflow,
  FileText,
  BarChart3,
  Settings,
  RefreshCw,
  Award
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function CoachingPage() {
  const { t } = useLanguage();
  const [selectedUseCase, setSelectedUseCase] = useState<'corporate' | 'public'>('corporate');

  const benefits = [
    {
      icon: TrendingUp,
      title: t("coaching.benefit_efficiency"),
      description: t("coaching.benefit_efficiency_desc")
    },
    {
      icon: Clock,
      title: t("coaching.benefit_time"), 
      description: t("coaching.benefit_time_desc")
    },
    {
      icon: Brain,
      title: t("coaching.benefit_wellbeing"),
      description: t("coaching.benefit_wellbeing_desc")
    }
  ];

  const publicSectorBenefits = [
    {
      icon: Zap,
      title: t("coaching.public_benefit_processing"),
      description: t("coaching.public_benefit_processing_desc")
    },
    {
      icon: Shield,
      title: t("coaching.public_benefit_cognitive"),
      description: t("coaching.public_benefit_cognitive_desc")
    },
    {
      icon: FileText,
      title: t("coaching.public_benefit_traceability"),
      description: t("coaching.public_benefit_traceability_desc")
    }
  ];

  const coachingSteps = [
    {
      icon: Users,
      title: t("coaching.step_observation"),
      description: t("coaching.step_observation_desc")
    },
    {
      icon: Workflow,
      title: t("coaching.step_mapping"),
      description: t("coaching.step_mapping_desc")
    },
    {
      icon: Brain,
      title: t("coaching.step_design"),
      description: t("coaching.step_design_desc")
    },
    {
      icon: Settings,
      title: t("coaching.step_setup"),
      description: t("coaching.step_setup_desc")
    },
    {
      icon: RefreshCw,
      title: t("coaching.step_transfer"),
      description: t("coaching.step_transfer_desc")
    }
  ];

  const useCases = [
    {
      id: 'corporate' as const,
      title: t("coaching.corporate_title"),
      icon: Building,
      description: t("coaching.corporate_desc")
    },
    {
      id: 'public' as const,
      title: t("coaching.public_title"),
      icon: Shield,
      description: t("coaching.public_desc")
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with White Container and Dotted Background */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/95 backdrop-blur-sm">
              {/* Hero dotted background pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "url('/hero-dots.png')",
                backgroundRepeat: 'repeat',
                backgroundPosition: '0 0',
                backgroundAttachment: 'fixed'
              }} aria-hidden="true" />
              
              <CardContent className="relative p-8 lg:p-12">
                <div className="max-w-4xl mx-auto text-center">
                  <Badge variant="outline" className="mb-8 px-6 py-3 bg-transparent border-gray-200/60 rounded-full transition-all duration-300">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {t("coaching.badge")}
                  </Badge>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("coaching.title")}
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                    {t("coaching.subtitle")}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button 
                      className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
                      onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <MessageCircle className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">{t("coaching.talk_expert")}</span>
                    </button>
                    <button 
                      className="group bg-transparent border border-gray-200/60 hover:border-primary/30 text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                      onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
                    >
                      <Calendar className="h-5 w-5" />
                      {t("coaching.book_call")}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <h2 className="heading-2">Professional AI Coaching Experience</h2>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Get personalized AI coaching sessions with our expert facilitators to accelerate your AI transformation journey.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-900 font-medium">One-on-one AI coaching sessions</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-900 font-medium">Customized learning paths</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-900 font-medium">Real-world AI implementation guidance</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ImageWithFallback
                  src={coachingSessionImage}
                  alt="AI Coaching Session in Progress - Personal AI Training"
                  className="relative w-full h-auto object-cover rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-6">
                {t("coaching.section_title")}
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("coaching.section_subtitle")}
              </p>
            </div>

            {/* Use Case Selector */}
            <div className="flex justify-center mb-16">
              <div className="inline-flex rounded-2xl border border-gray-200/60 p-2 bg-white/80 backdrop-blur-sm shadow-lg">
                {useCases.map((useCase) => {
                  const Icon = useCase.icon;
                  return (
                    <button
                      key={useCase.id}
                      onClick={() => setSelectedUseCase(useCase.id)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                        selectedUseCase === useCase.id
                          ? 'bg-primary text-white shadow-md scale-105'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {useCase.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Use Case Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div>
                {selectedUseCase === 'corporate' ? (
                  <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <CardHeader className="relative space-y-6 p-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                          <Building className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold">{t("coaching.corporate_card_title")}</CardTitle>
                          <CardDescription className="text-base mt-2 text-gray-600">
                            {t("coaching.corporate_card_desc")}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative space-y-8 p-8 pt-0">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {t("coaching.corporate_content")}
                      </p>
                      
                      <div className="space-y-6">
                        {benefits.map((benefit, index) => {
                          const Icon = benefit.icon;
                          return (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/30 transition-all duration-300 hover:bg-white/80 hover:border-primary/20 hover:shadow-md">
                              <div className="flex-shrink-0 p-2 rounded-xl bg-primary/10 mt-1">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 text-gray-900">{benefit.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5"></div>
                    <CardHeader className="relative space-y-6 p-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                          <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold">{t("coaching.public_card_title")}</CardTitle>
                          <CardDescription className="text-base mt-2 text-gray-600">
                            {t("coaching.public_card_desc")}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative space-y-8 p-8 pt-0">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {t("coaching.public_content")}
                      </p>
                      
                      <div className="space-y-6">
                        {publicSectorBenefits.map((benefit, index) => {
                          const Icon = benefit.icon;
                          return (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/30 transition-all duration-300 hover:bg-white/80 hover:border-primary/20 hover:shadow-md">
                              <div className="flex-shrink-0 p-2 rounded-xl bg-primary/10 mt-1">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 text-gray-900">{benefit.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-8 rounded-3xl border border-gray-200/60 bg-white/90 backdrop-blur-sm shadow-xl">
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
                        <BarChart3 className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="heading-3">{t("coaching.measurable_results")}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {t("coaching.measurable_desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative group p-6 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-center transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:scale-105">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">60%</div>
                    <div className="text-sm font-medium text-gray-600">{t("coaching.time_savings")}</div>
                  </div>
                  <div className="relative group p-6 rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm text-center transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:scale-105">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">40%</div>
                    <div className="text-sm font-medium text-gray-600">{t("coaching.error_reduction")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Approach Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-6">
                {t("coaching.approach_title")}
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("coaching.approach_subtitle")}
              </p>
            </div>

            <div className="grid gap-8">
              {coachingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="group relative overflow-hidden border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="relative p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium bg-primary/5 border-primary/20">
                              Step {index + 1}
                            </Badge>
                            <h3 className="heading-3 text-xl">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-gray-600 flex-shrink-0 group-hover:text-primary transition-colors duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Process Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-6">
                {t("coaching.investment_title")}
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("coaching.investment_subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="group relative overflow-hidden border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{t("coaching.small_teams")}</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">{t("coaching.small_teams_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6 p-8 pt-0">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("coaching.small_teams_price")}
                    <span className="text-lg font-normal text-gray-600 ml-2">{t("coaching.small_teams_period")}</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_workflow")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_agents")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_training")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_followup")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{t("coaching.large_teams")}</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600">{t("coaching.large_teams_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6 p-8 pt-0">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("coaching.large_teams_price")}
                    <span className="text-lg font-normal text-gray-600 ml-2">{t("coaching.large_teams_period")}</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_transformation")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_automation")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_trainer")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-900">{t("coaching.feature_ongoing")}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <button 
                className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-12 py-5 rounded-2xl text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-4 mx-auto overflow-hidden"
                onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Phone className="h-6 w-6 relative z-10" />
                <span className="relative z-10">{t("coaching.start_transformation")}</span>
              </button>
              <p className="text-gray-600 mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
                {t("coaching.consultation_note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Facilitator Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative order-2 lg:order-1 group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ImageWithFallback
                  src={facilitatorExpertImage}
                  alt="AI Workshop Facilitator Expert - Professional AI Training"
                  className="relative w-full h-auto object-cover rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <Badge variant="outline" className="px-4 py-2 bg-transparent border-gray-200/60 rounded-full">
                  <Award className="h-4 w-4 mr-2" />
                  Expert Facilitator
                </Badge>
                <h2 className="heading-2">Learn from AI Industry Experts</h2>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Our certified AI facilitators bring real-world experience from leading tech companies and have trained thousands of professionals across Switzerland.
                </p>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20 hover:shadow-md">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="heading-3 text-xl mb-3">AI Strategy & Implementation</h3>
                      <p className="text-gray-600 leading-relaxed">Expert guidance on AI strategy, tool selection, and implementation roadmaps.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20 hover:shadow-md">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="heading-3 text-xl mb-3">Team Transformation</h3>
                      <p className="text-gray-600 leading-relaxed">Proven methodologies for scaling AI adoption across teams and organizations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20 hover:shadow-md">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="heading-3 text-xl mb-3">Measurable Results</h3>
                      <p className="text-gray-600 leading-relaxed">Track progress with clear metrics and KPIs for AI implementation success.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-6">{t("coaching.faq_title")}</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: t("coaching.faq_duration_q"),
                  answer: t("coaching.faq_duration_a")
                },
                {
                  question: t("coaching.faq_remote_q"),
                  answer: t("coaching.faq_remote_a")
                },
                {
                  question: t("coaching.faq_tools_q"),
                  answer: t("coaching.faq_tools_a")
                },
                {
                  question: t("coaching.faq_success_q"),
                  answer: t("coaching.faq_success_a")
                }
              ].map((faq, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}