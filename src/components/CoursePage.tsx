import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Remove WorkshopBookingModal import as we now use routing
import { CourseAssessmentCTA } from "./CourseAssessmentCTA";
// Use optimized images from public folder
const fundamentalsCourseImage = "/optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp";
const participantsLearningImage = "/optimized/aiworkshop-participants-learning-optimized.webp";
const generativeAiTrainingImage = "/optimized/aiworkshop-generative-ai-training-optimized.webp";
const businessIntelligenceImage = "/optimized/aiworkshop-business-intelligence-training-optimized.webp";
const teamCollaborationImage = "/optimized/aiworkshop-team-collaboration-optimized.webp";
import { 
  Clock, 
  Users, 
  CheckCircle, 
  Brain, 
  BookOpen, 
  Target, 
  Lightbulb,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Calendar,
  MapPin,
  TrendingUp,
  Zap,
  Shield,
  Palette,
  Database,
  BarChart,
  Sparkles,
  ChevronRight,
  Play
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { useScrollToTop } from "../utils/useScrollToTop";


interface CoursePageProps {
  courseId: string;
  onBackToHome?: () => void;
  onPageChange?: (page: string) => void;
}

export function CoursePage({ courseId, onBackToHome, onPageChange }: CoursePageProps) {
  const { t } = useLanguage();
  // Removed booking modal state as we now use routing
  useScrollToTop();

  // Function to get course-specific image
  const getCourseImage = (courseId: string) => {
    switch (courseId) {
      case "ai-fundamentals":
        return fundamentalsCourseImage;
      case "generative-ai":
        return generativeAiTrainingImage;
      case "agentic-ai":
        return teamCollaborationImage; // Using team collaboration image for agentic AI
      case "ai-business-intelligence":
        return businessIntelligenceImage;
      default:
        return participantsLearningImage;
    }
  };

  // Course data - using translation system
  const courseData = {
    "ai-fundamentals": {
      title: t("course.ai_fundamentals.title"),
      subtitle: t("course.ai_fundamentals.subtitle"),
      price: t("course.price_fundamentals"),
      duration: t("course.ai_fundamentals.duration"),
      tagline: t("course.ai_fundamentals.tagline"),
      description: t("course.ai_fundamentals.description"),
      idealFor: t("course.ai_fundamentals.ideal_for"),
      modules: [
        {
          icon: Brain,
          title: t("course.ai_fundamentals.module_1.title"),
          description: t("course.ai_fundamentals.module_1.description")
        },
        {
          icon: BookOpen,
          title: t("course.ai_fundamentals.module_2.title"),
          description: t("course.ai_fundamentals.module_2.description")
        },
        {
          icon: Target,
          title: t("course.ai_fundamentals.module_3.title"),
          description: t("course.ai_fundamentals.module_3.description")
        },
        {
          icon: Lightbulb,
          title: t("course.ai_fundamentals.module_4.title"),
          description: t("course.ai_fundamentals.module_4.description"),
          bulletPoints: [
            t("course.ai_fundamentals.module_4.bullet_1"),
            t("course.ai_fundamentals.module_4.bullet_2"),
            t("course.ai_fundamentals.module_4.bullet_3")
          ]
        },
        {
          icon: CheckCircle,
          title: t("course.ai_fundamentals.module_5.title"),
          description: t("course.ai_fundamentals.module_5.description")
        },
        {
          icon: Database,
          title: t("course.ai_fundamentals.module_6.title"),
          description: t("course.ai_fundamentals.module_6.description"),
          bulletPoints: [
            t("course.ai_fundamentals.module_6.bullet_1"),
            t("course.ai_fundamentals.module_6.bullet_2"),
            t("course.ai_fundamentals.module_6.bullet_3"),
            t("course.ai_fundamentals.module_6.bullet_4")
          ]
        },
        {
          icon: TrendingUp,
          title: t("course.ai_fundamentals.module_7.title"),
          description: t("course.ai_fundamentals.module_7.description")
        }
      ]
    },
    "ai-business-intelligence": {
      title: t("course.ai_business_intelligence.title"),
      subtitle: t("course.ai_business_intelligence.subtitle"),
      price: t("course.price_bi"),
      duration: t("course.ai_business_intelligence.duration"),
      tagline: t("course.ai_business_intelligence.tagline"),
      description: t("course.ai_business_intelligence.description"),
      idealFor: t("course.ai_business_intelligence.ideal_for"),
      modules: [
        {
          icon: TrendingUp,
          title: t("course.ai_business_intelligence.module_1.title"),
          description: t("course.ai_business_intelligence.module_1.description")
        },
        {
          icon: Zap,
          title: t("course.ai_business_intelligence.module_2.title"),
          description: t("course.ai_business_intelligence.module_2.description")
        },
        {
          icon: BarChart,
          title: t("course.ai_business_intelligence.module_3.title"),
          description: t("course.ai_business_intelligence.module_3.description")
        },
        {
          icon: Brain,
          title: t("course.ai_business_intelligence.module_4.title"),
          description: t("course.ai_business_intelligence.module_4.description")
        },
        {
          icon: Target,
          title: t("course.ai_business_intelligence.module_5.title"),
          description: t("course.ai_business_intelligence.module_5.description")
        },
        {
          icon: BookOpen,
          title: t("course.ai_business_intelligence.module_6.title"),
          description: t("course.ai_business_intelligence.module_6.description")
        },
        {
          icon: Shield,
          title: t("course.ai_business_intelligence.module_7.title"),
          description: t("course.ai_business_intelligence.module_7.description")
        },
        {
          icon: Lightbulb,
          title: t("course.ai_business_intelligence.module_8.title"),
          description: t("course.ai_business_intelligence.module_8.description")
        }
      ]
    },
    "generative-ai": {
      title: t("course.generative_ai.title"),
      subtitle: t("course.generative_ai.subtitle"),
      price: t("course.price_genai"),
      duration: t("course.generative_ai.duration"),
      tagline: t("course.generative_ai.tagline"),
      description: t("course.generative_ai.description"),
      idealFor: t("course.generative_ai.ideal_for"),
      modules: [
        {
          icon: Sparkles,
          title: "What Is Generative AI",
          description: "Understand how generative AI works and how it differs from traditional automation. Discover how large models can create new content from scratch in the form of text, visuals, audio, and even video."
        },
        {
          icon: Target,
          title: "Tool Landscape for Marketers",
          description: "Get to know the right tools for your team and use cases",
          bulletPoints: [
            "Text: ChatGPT, Claude, Gemini",
            "Images: Midjourney, DALL·E, Adobe Firefly",
            "Video and audio: Runway, ElevenLabs, Pika",
            "Integrated platforms: Canva Magic, Gamma, Notion AI, Adobe Express"
          ]
        },
        {
          icon: Palette,
          title: "Prompt Writing for Marketing and Design",
          description: "Learn how to craft effective prompts that reflect your brand voice, values, and visual identity. Practice role-based prompts, campaign briefs, and visual storytelling in real time."
        },
        {
          icon: TrendingUp,
          title: "Use Cases for Retail and Consumer Experience",
          description: "Explore hands-on examples tailored to brand retail",
          bulletPoints: [
            "Concept development for campaigns and retail activations",
            "Visual storyboards and moodboards for store layouts",
            "Product storytelling and packaging exploration",
            "Personalized content generation for client segments",
            "AI-generated scripts, headlines, and branded copy"
          ]
        },
        {
          icon: Shield,
          title: "Copyright, Brand Safety, and Ethics",
          description: "Understand how to use generative AI responsibly in a marketing context. Learn about copyright concerns, usage rights, brand consistency, and content validation."
        },
        {
          icon: Lightbulb,
          title: "Creative Sprint",
          description: "Each participant generates a branded asset pack based on a retail or campaign scenario. This includes visuals, marketing copy, optional voice-over, and presentation layout. Final outputs are discussed and reviewed for implementation potential."
        }
      ]
    },
    "agentic-ai": {
      title: t("course.agentic_ai.title"),
      subtitle: t("course.agentic_ai.subtitle"),
      price: t("course.agentic_ai.price"),
      duration: t("course.agentic_ai.duration"),
      tagline: t("course.agentic_ai.tagline"),
      description: t("course.agentic_ai.description"),
      idealFor: t("course.agentic_ai.ideal_for"),
      modules: [
        {
          icon: Brain,
          title: t("course.agentic_ai.module_1.title"),
          description: t("course.agentic_ai.module_1.description"),
          bulletPoints: [
            t("course.agentic_ai.module_1.bullet_1"),
            t("course.agentic_ai.module_1.bullet_2"),
            t("course.agentic_ai.module_1.bullet_3"),
            t("course.agentic_ai.module_1.bullet_4")
          ]
        },
        {
          icon: Zap,
          title: t("course.agentic_ai.module_2.title"),
          description: t("course.agentic_ai.module_2.description"),
          bulletPoints: [
            t("course.agentic_ai.module_2.bullet_1"),
            t("course.agentic_ai.module_2.bullet_2"),
            t("course.agentic_ai.module_2.bullet_3"),
            t("course.agentic_ai.module_2.bullet_4"),
            t("course.agentic_ai.module_2.bullet_5")
          ]
        },
        {
          icon: Target,
          title: t("course.agentic_ai.module_3.title"),
          description: t("course.agentic_ai.module_3.description"),
          bulletPoints: [
            t("course.agentic_ai.module_3.bullet_1"),
            t("course.agentic_ai.module_3.bullet_2"),
            t("course.agentic_ai.module_3.bullet_3"),
            t("course.agentic_ai.module_3.bullet_4"),
            t("course.agentic_ai.module_3.bullet_5")
          ]
        },
        {
          icon: Database,
          title: t("course.agentic_ai.module_4.title"),
          description: t("course.agentic_ai.module_4.description"),
          bulletPoints: [
            t("course.agentic_ai.module_4.bullet_1"),
            t("course.agentic_ai.module_4.bullet_2"),
            t("course.agentic_ai.module_4.bullet_3"),
            t("course.agentic_ai.module_4.bullet_4"),
            t("course.agentic_ai.module_4.bullet_5")
          ]
        },
        {
          icon: Lightbulb,
          title: t("course.agentic_ai.module_5.title"),
          description: t("course.agentic_ai.module_5.description"),
          bulletPoints: [
            t("course.agentic_ai.module_5.bullet_1"),
            t("course.agentic_ai.module_5.bullet_2"),
            t("course.agentic_ai.module_5.bullet_3"),
            t("course.agentic_ai.module_5.bullet_4"),
            t("course.agentic_ai.module_5.bullet_5")
          ]
        },
        {
          icon: Shield,
          title: t("course.agentic_ai.module_6.title"),
          description: t("course.agentic_ai.module_6.description"),
          bulletPoints: [
            t("course.agentic_ai.module_6.bullet_1"),
            t("course.agentic_ai.module_6.bullet_2"),
            t("course.agentic_ai.module_6.bullet_3"),
            t("course.agentic_ai.module_6.bullet_4"),
            t("course.agentic_ai.module_6.bullet_5")
          ]
        },
        {
          icon: TrendingUp,
          title: t("course.agentic_ai.module_7.title"),
          description: t("course.agentic_ai.module_7.description"),
          bulletPoints: [
            t("course.agentic_ai.module_7.bullet_1"),
            t("course.agentic_ai.module_7.bullet_2"),
            t("course.agentic_ai.module_7.bullet_3"),
            t("course.agentic_ai.module_7.bullet_4"),
            t("course.agentic_ai.module_7.bullet_5")
          ]
        },
        {
          icon: Sparkles,
          title: t("course.agentic_ai.module_8.title"),
          description: t("course.agentic_ai.module_8.description"),
          bulletPoints: [
            t("course.agentic_ai.module_8.bullet_1"),
            t("course.agentic_ai.module_8.bullet_2"),
            t("course.agentic_ai.module_8.bullet_3"),
            t("course.agentic_ai.module_8.bullet_4"),
            t("course.agentic_ai.module_8.bullet_5")
          ]
        }
      ]
    }
  };

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <>
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
                  <div className="text-center mb-16">
                    <div className="flex flex-col items-center gap-3 mb-6">
                      <Badge variant="outline" className="px-6 py-3 bg-transparent border-gray-200/60 rounded-full transition-all duration-300">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Workshop Switzerland
                      </Badge>
                      {courseId === 'agentic-ai' && (
                        <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg">
                          🚀 ADVANCED PROGRAM
                        </Badge>
                      )}
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {course.title}
                      </span>
                    </h1>
                    
                    <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                      {course.subtitle}
                    </h2>
                    
                    <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                      {t('course.co_designed')}
                    </p>

                    {/* Enhanced Pricing and Info Cards */}
                    <div className="grid lg:grid-cols-2 gap-8 items-start mb-16">
                      {/* Pricing Card */}
                      <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                        <CardContent className="relative p-8 text-center">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                              <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">{course.duration}</span>
                          </div>
                          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                            {course.price}
                          </div>
                          <div className="text-sm text-gray-600 mb-6">
                            {t("course.per_person")}
                          </div>
                          <button 
                            className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 w-full overflow-hidden"
                            onClick={() => onPageChange?.("workshop-booking")}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <Calendar className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">{t("course.book_workshop")}</span>
                          </button>
                          <p className="text-xs text-gray-600 text-center mt-4">
                            No credit card required
                          </p>
                        </CardContent>
                      </Card>

                      {/* Course Info Card */}
                      <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5"></div>
                        <CardContent className="relative p-8">
                          <h3 className="text-xl font-semibold mb-4">{course.tagline}</h3>
                          <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
                          
                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/30 transition-all duration-300 hover:bg-white/80 hover:border-primary/20">
                              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">4h</div>
                              <div className="text-xs text-gray-600">{t("course.duration")}</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/30 transition-all duration-300 hover:bg-white/80 hover:border-primary/20">
                              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">{t("course.live")}</div>
                              <div className="text-xs text-gray-600">{t("course.interactive")}</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/30 transition-all duration-300 hover:bg-white/80 hover:border-primary/20">
                              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">CH</div>
                              <div className="text-xs text-gray-600">{t("course.swiss_based")}</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/30 transition-all duration-300 hover:bg-white/80 hover:border-primary/20">
                              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">{t("course.all_skill_levels").split(' ')[0]}</div>
                              <div className="text-xs text-gray-600">{t("course.all_skill_levels").split(' ').slice(1).join(' ')}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Course Image Section */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ImageWithFallback
                    src={getCourseImage(courseId)}
                    alt={`${course.title} - Interactive Learning Experience`}
                    className="relative w-full h-auto object-cover rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-6">
                  <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Interactive Learning
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Hands-on AI Training Experience
                    </span>
                  </h2>
                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                    Join hundreds of professionals who have transformed their AI skills through our practical, hands-on training approach.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-gray-900 font-medium">Real-world AI tools and use cases</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-gray-900 font-medium">Interactive exercises and group work</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-gray-900 font-medium">Immediate feedback and guidance</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/40 transition-all duration-300 hover:bg-white/90 hover:border-primary/20">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-gray-900 font-medium">Take-home resources and templates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Modules */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("course.comprehensive_curriculum")}
                  </span>
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t("course.curriculum_description")}
                </p>
              </div>
              
              <div className="space-y-8">
                {course.modules.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <Card key={index} className="group relative overflow-hidden border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="relative p-8">
                        <div className="flex items-start gap-6">
                          <div className="relative">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
                              <IconComponent className="w-8 h-8 text-primary" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-lg">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {module.title}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              {module.description}
                            </p>
                            {module.bulletPoints && (
                              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mt-4 border border-gray-200/30">
                                <ul className="space-y-3">
                                  {module.bulletPoints.map((point, pointIndex) => (
                                    <li key={pointIndex} className="flex items-start gap-3 text-sm">
                                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                                      <span className="text-gray-600">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Learning Outcomes & Target Audience */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Who Should Attend */}
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("course.who_should_attend")}
                    </span>
                  </h2>
                  <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <CardContent className="relative p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                          <Users className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{t("course.perfect_for")}</h3>
                          <p className="text-sm text-gray-600">{t("course.teams_professionals")}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {course.idealFor}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Learning Outcomes */}
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("course.learning_outcomes")}
                    </span>
                  </h2>
                  <div className="space-y-6">
                    <Card className="group relative overflow-hidden border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/70"></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-gray-900">{t("course.practical_understanding")}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{t("course.practical_understanding_desc")}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="group relative overflow-hidden border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/70"></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-gray-900">{t("course.hands_on_experience")}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{t("course.hands_on_experience_desc")}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="group relative overflow-hidden border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/70"></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Brain className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-gray-900">{t("course.strategic_mindset")}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{t("course.strategic_mindset_desc")}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="group relative overflow-hidden border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/70"></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Lightbulb className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-gray-900">{t("course.innovation_ready")}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{t("course.innovation_ready_desc")}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CourseAssessmentCTA courseId={courseId} onPageChange={onPageChange} />
      </div>

      {/* Removed Workshop Booking Modal - now uses routing */}
    </>
  );
}
