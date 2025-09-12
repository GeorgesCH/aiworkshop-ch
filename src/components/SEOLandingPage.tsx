import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
// Use optimized images from public folder
import generativeAiTrainingImage from "@/assets/optimized/aiworkshop-generative-ai-training-optimized.webp";
const designThinkingImage = "/@optimized/aiworkshop-design-thinking-lausanne-optimized.webp";
import { 
  MapPin, 
  Users, 
  CheckCircle, 
  Brain, 
  BookOpen, 
  Target, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Award,
  Building,
  Briefcase,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Rocket,
  Lightbulb,
  BarChart3,
  Calendar,
  MessageCircle
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { useState } from "react";
import { 
  generateSEOPageData, 
  generateLocalizedFAQs, 
  generateLocalizedBenefits,
  generateLocalBusinessSchema 
} from "./seo-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useScrollToTop } from "../utils/useScrollToTop";

interface SEOLandingPageProps {
  city?: string;
  service?: string;
  industry?: string;
  onPageChange?: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function SEOLandingPage({ 
  city = "Zurich", 
  service = "AI Training", 
  industry = "Business",
  onPageChange 
}: SEOLandingPageProps) {
  const { t } = useLanguage();
  useScrollToTop();
  
  // Generate SEO-optimized content using utilities
  const pageData = generateSEOPageData({ city, service, industry });
  const dynamicBenefits = generateLocalizedBenefits(city, service, industry);
  const dynamicFAQs = generateLocalizedFAQs(city, service);
  const localBusinessSchema = generateLocalBusinessSchema(city, service);

  // Use dynamically generated benefits with appropriate icons
  const benefits = dynamicBenefits.map((benefit, index) => ({
    icon: [Target, Users, TrendingUp, Shield][index] || Target,
    ...benefit
  }));

  const stats = [
    { number: "500+", label: "Professionals Trained", icon: Users },
    { number: "50+", label: `${city} Companies`, icon: Building },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "98%", label: "Completion Rate", icon: Award }
  ];

  const industries = [
    "Financial Services", "Healthcare", "Manufacturing", "Technology", 
    "Consulting", "Retail", "Insurance", "Government"
  ];

  const nearbyLocations = {
    "Zurich": ["Winterthur", "St. Gallen", "Lucerne", "Zug"],
    "Geneva": ["Lausanne", "Montreux", "Nyon", "Vevey"],
    "Basel": ["Bern", "Solothurn", "Aarau", "Olten"],
    "Bern": ["Thun", "Interlaken", "Fribourg", "Neuchâtel"]
  };

  // Use dynamically generated FAQs
  const faqs: FAQItem[] = dynamicFAQs;

  return (
    <div className="min-h-screen">
      {/* SEO Meta Tags - In a real app, these would be set in the document head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      {/* Modern Hero Section with Enhanced Design */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10"></div>
        <div className="absolute inset-0 bg-[url('/@optimized/hero-dots-optimized.webp')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
              <button 
                onClick={() => onPageChange?.("home")}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                {t("common.home")}
              </button>
              <ChevronRight className="w-4 h-4" />
              <button 
                onClick={() => onPageChange?.("about")}
                className="hover:text-primary transition-colors"
              >
                {t("seo.breadcrumb_about")}
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-medium">{city} {t("seo.breadcrumb_training")}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <Badge variant="outline" className="mb-6 gap-2 px-4 py-2 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    {city}, Switzerland
                  </Badge>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-primary to-gray-700 bg-clip-text text-transparent">
                    {pageData.h1}
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                    {pageData.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    <Badge variant="secondary" className="gap-2 px-3 py-1">
                      <Sparkles className="w-3 h-3" />
                      {t("seo.badge_swiss_quality")}
                    </Badge>
                    <Badge variant="secondary" className="gap-2 px-3 py-1">
                      <Award className="w-3 h-3" />
                      {t("seo.badge_expert_led")}
                    </Badge>
                    <Badge variant="secondary" className="gap-2 px-3 py-1">
                      <Target className="w-3 h-3" />
                      {t("seo.badge_hands_on")}
                    </Badge>
                    <Badge variant="secondary" className="gap-2 px-3 py-1">
                      <CheckCircle className="w-3 h-3" />
                      {t("seo.badge_certificate")}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="gap-2 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}>
                    <Calendar className="w-5 h-5" />
                    {t("seo.cta_book_consultation")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2 px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/5">
                    <Phone className="w-5 h-5" />
                    {t("seo.cta_call")}
                  </Button>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t("seo.trust_rating")}</div>
                      <div className="text-sm text-gray-600">{t("seo.trust_google_reviews")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t("seo.trust_trained")}</div>
                      <div className="text-sm text-gray-600">{t("seo.trust_professionals")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t("seo.trust_certified")}</div>
                      <div className="text-sm text-gray-600">{t("seo.trust_quality_assured")}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <ImageWithFallback
                    src={generativeAiTrainingImage}
                    alt={`AI training session in ${city} - professional team learning artificial intelligence`}
                    className="w-full h-[400px] lg:h-[500px] object-cover rounded-3xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>
                  
                  {/* Floating Stats Cards */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">{t("seo.stats_success_rate")}</div>
                        <div className="text-sm text-gray-600">{t("seo.stats_success_label")}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">{t("seo.stats_companies")}</div>
                        <div className="text-sm text-gray-600">{t("seo.stats_companies_label")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 gap-2">
                <TrendingUp className="w-4 h-4" />
                {t("seo.section_proven_results")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t("seo.section_leading_provider")} {city}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("seo.section_trusted_by")} {city} {t("seo.section_and_switzerland")}
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-3">{stat.number}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 gap-2">
                <Lightbulb className="w-4 h-4" />
                {t("seo.section_why_choose")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t("seo.section_why_choose_title")} {service} {t("seo.section_why_choose_in")} {city}?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("seo.section_why_choose_subtitle")} {city} {t("seo.section_why_choose_businesses")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-gray-900">{benefit.title}</h3>
                          <p className="text-gray-600 leading-relaxed text-lg">
                            {benefit.description}
                          </p>
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

      {/* Enhanced Learning Resources & Industries */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Learning Resources */}
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-4 gap-2">
                <BookOpen className="w-4 h-4" />
                {t("seo.section_free_resources")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t("seo.section_learning_resources")}
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                {t("seo.section_learning_subtitle")}
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg" onClick={() => onPageChange?.("learn")}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-bold text-lg mb-3">{t("seo.section_learning_hub")}</div>
                    <p className="text-gray-600">{t("seo.section_learning_hub_desc")}</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg" onClick={() => onPageChange?.("learn-ai-tools-directory")}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-bold text-lg mb-3">{t("seo.section_ai_tools")}</div>
                    <p className="text-gray-600">{t("seo.section_ai_tools_desc")}</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg" onClick={() => onPageChange?.("learn-interactive-exercises")}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-bold text-lg mb-3">{t("seo.section_interactive")}</div>
                    <p className="text-gray-600">{t("seo.section_interactive_desc")}</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg" onClick={() => onPageChange?.("learn-ai-overview")}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-bold text-lg mb-3">{t("seo.section_ai_overview")}</div>
                    <p className="text-gray-600">{t("seo.section_ai_overview_desc")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Industries Served */}
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 gap-2">
                <Building className="w-4 h-4" />
                {t("seo.section_industries")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t("seo.section_industries_title")} {city}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("seo.section_industries_subtitle")} {city} {t("seo.section_industries_region")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-bold text-lg">{industry}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Training Programs Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 gap-2">
                <Rocket className="w-4 h-4" />
                {t("seo.section_training_programs")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {service} {t("seo.section_programs_title")} {city}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("seo.section_programs_subtitle")}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <Badge className="mb-4 gap-2">
                        <Star className="w-3 h-3" />
                        {t("seo.course_most_popular")}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-3">{t("seo.course_ai_fundamentals")}</h3>
                      <div className="text-3xl font-bold text-primary mb-3">{t("seo.course_price_chf")} 350</div>
                      <p className="text-gray-600">{t("seo.course_duration")}</p>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_ai_basics")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_hands_on")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_practical")}</span>
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full font-semibold" 
                      size="lg"
                      onClick={() => onPageChange?.("ai-fundamentals")}
                    >
                      {t("seo.course_view_details")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <Badge variant="secondary" className="mb-4 gap-2">
                        <Building className="w-3 h-3" />
                        {t("seo.course_business_focus")}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-3">{t("seo.course_ai_business")}</h3>
                      <div className="text-3xl font-bold text-primary mb-3">{t("seo.course_price_chf")} 470</div>
                      <p className="text-gray-600">{t("seo.course_duration_specialized")}</p>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_dashboards")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_analytics")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_reporting")}</span>
                      </li>
                    </ul>
                    
                    <Button 
                      variant="outline" 
                      className="w-full font-semibold" 
                      size="lg"
                      onClick={() => onPageChange?.("ai-business-intelligence")}
                    >
                      {t("seo.course_view_details")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <Badge variant="secondary" className="mb-4 gap-2">
                        <Zap className="w-3 h-3" />
                        {t("seo.course_advanced")}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-3">{t("seo.course_generative_ai")}</h3>
                      <div className="text-3xl font-bold text-primary mb-3">{t("seo.course_price_chf")} 850</div>
                      <p className="text-gray-600">{t("seo.course_duration_comprehensive")}</p>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_content")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_brand")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_marketing")}</span>
                      </li>
                    </ul>
                    
                    <Button 
                      variant="outline" 
                      className="w-full font-semibold" 
                      size="lg"
                      onClick={() => onPageChange?.("generative-ai")}
                    >
                      {t("seo.course_view_details")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <Badge className="mb-4 gap-2">
                        <Sparkles className="w-3 h-3" />
                        {t("seo.course_new")}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-3">{t("seo.course_agentic_ai")}</h3>
                      <div className="text-3xl font-bold text-primary mb-3">{t("seo.course_price_chf")} 980</div>
                      <p className="text-gray-600">{t("seo.course_duration_cutting_edge")}</p>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_agent")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_workflow")}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t("seo.course_feature_brain")}</span>
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full font-semibold" 
                      size="lg"
                      onClick={() => onPageChange?.("agentic-ai")}
                    >
                      {t("seo.course_view_details")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Additional Services */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold mb-8">{t("seo.additional_services")}</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <Button 
                  variant="outline" 
                  className="gap-3 px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/5"
                  onClick={() => onPageChange?.("coaching")}
                >
                  <Users className="w-5 h-5" />
                  {t("seo.coaching_1on1")}
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-3 px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/5"
                  onClick={() => onPageChange?.("contact")}
                >
                  <Building className="w-5 h-5" />
                  {t("seo.custom_training")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 gap-2">
                <MessageCircle className="w-4 h-4" />
                {t("seo.faq_title")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t("seo.faq_main_title")}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t("seo.faq_subtitle")} {service.toLowerCase()} {t("seo.faq_in")} {city}
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-0 shadow-lg rounded-2xl overflow-hidden"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-8 px-8 bg-white">
                    <span className="font-semibold text-lg">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 px-8 text-gray-600 leading-relaxed text-lg bg-gray-50">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Location & Coverage */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Serving {city} and Surrounding Areas
              </h2>
              <p className="text-gray-600">
                We provide AI training across the greater {city} region
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Primary Service Area: {city}</h3>
                  <p className="text-gray-600 mb-6">
                    Our main training facility serves businesses throughout {city} and the surrounding region. 
                    We offer both on-site and centrally located training options.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">We Also Serve:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(nearbyLocations[city as keyof typeof nearbyLocations] || []).map((location, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span>{location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="gap-2">
                    <Phone className="w-4 h-4" />
                    Schedule Site Visit
                  </Button>
                </div>
              </div>

              <div className="relative">
                <ImageWithFallback
                  src={designThinkingImage}
                  alt={`${city} Switzerland cityscape - AI training location`}
                  className="w-full h-[300px] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{city}, Switzerland</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation - Internal Links */}
      <section className="py-16 bg-gradient-to-br from-secondary/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Explore Our Complete AI Learning Platform
              </h2>
              <p className="text-gray-600">
                Access all our courses, resources, and tools in one place
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Courses Column */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Training Courses
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => onPageChange?.("ai-fundamentals")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → AI Fundamentals (CHF 350)
                  </button>
                  <button 
                    onClick={() => onPageChange?.("ai-business-intelligence")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → AI for Business (CHF 470)
                  </button>
                  <button 
                    onClick={() => onPageChange?.("generative-ai")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → Generative AI (CHF 850)
                  </button>
                  <button 
                    onClick={() => onPageChange?.("agentic-ai")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → Agentic AI (CHF 980) <Badge variant="secondary" className="text-xs ml-1">NEW</Badge>
                  </button>
                  <button 
                    onClick={() => onPageChange?.("coaching")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → 1:1 AI Coaching
                  </button>
                </div>
              </Card>

              {/* Learning Resources Column */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Learning Resources
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => onPageChange?.("learn")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → Learning Hub
                  </button>
                  <button 
                    onClick={() => onPageChange?.("learn-ai-overview")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → AI Overview Guide
                  </button>
                  <button 
                    onClick={() => onPageChange?.("learn-intelligence")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → Intelligence (IQ, EQ, AI)
                  </button>
                  <button 
                    onClick={() => onPageChange?.("learn-ai-tools-directory")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → AI Tools Directory
                  </button>
                  <button 
                    onClick={() => onPageChange?.("learn-interactive-exercises")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → Interactive Exercises
                  </button>
                </div>
              </Card>

              {/* Company Info Column */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Company Info
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => onPageChange?.("about")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → About AI Workshop
                  </button>
                  <button 
                    onClick={() => onPageChange?.("contact")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    → Contact Us
                  </button>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>Based in Lausanne</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>+41 76 818 46 77</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>hello@aiworkshop.ch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/@optimized/hero-dots-optimized.webp')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center text-primary-foreground">
            <Badge variant="secondary" className="mb-6 gap-2 text-primary">
              <Rocket className="w-4 h-4" />
              {t("seo.final_cta_badge")}
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              {t("seo.final_cta_title")} {city}?
            </h2>
            <p className="text-xl lg:text-2xl mb-12 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              {t("seo.final_cta_subtitle")} {city} {t("seo.final_cta_professionals")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                variant="secondary" 
                className="gap-3 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
              >
                <Calendar className="w-5 h-5" />
                {t("seo.cta_book_consultation")}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="gap-3 px-10 py-6 text-lg font-semibold border-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="w-5 h-5" />
                {t("seo.cta_call")}
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="font-semibold text-primary-foreground">{t("seo.final_cta_email")}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="font-semibold text-primary-foreground">{t("seo.final_cta_website")}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="font-semibold text-primary-foreground">{t("seo.final_cta_hours")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
