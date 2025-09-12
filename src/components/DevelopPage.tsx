import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  Code, 
  Smartphone, 
  Database, 
  Brain, 
  Zap, 
  Shield, 
  Cloud, 
  BarChart3, 
  Users, 
  Globe, 
  MessageSquare, 
  Camera,
  CheckCircle,
  Calendar,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Lock,
  Cpu,
  PlayCircle,
  ExternalLink,
  Clock,
  Star,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion } from "../utils/safe-motion";
import { useLanguage } from "./LanguageProvider";
import { db, COLLECTIONS, DevelopmentEstimate, getClientInfo } from "../config/firebase";

interface EstimateData {
  projectName: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  projectType: string;
  features: string[];
  complexity: number;
  timeline: string;
  budget: string;
  description: string;
  aiFeatures: string[];
  platformRequirements: string[];
}

export function DevelopPage() {
  const { t } = useLanguage();
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showEstimator, setShowEstimator] = useState(false);
  const [estimateStep, setEstimateStep] = useState(1);
  const [estimateData, setEstimateData] = useState<EstimateData>({
    projectName: "",
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    projectType: "",
    features: [],
    complexity: 5,
    timeline: "",
    budget: "",
    description: "",
    aiFeatures: [],
    platformRequirements: []
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const services = [
    {
      id: "web-app",
      name: t("develop.service_web_app"),
      description: t("develop.service_web_app_desc"),
      icon: Globe,
      basePrice: 20000,
      features: ["React/Next.js", "AI Integration", "Real-time Analytics", "User Management", "API Development"],
      timeline: "12-16 weeks",
      complexity: "Medium"
    },
    {
      id: "mobile-app",
      name: t("develop.service_mobile_app"),
      description: t("develop.service_mobile_app_desc"),
      icon: Smartphone,
      basePrice: 28000,
      features: ["Native Development", "ML Integration", "Push Notifications", "Offline Sync", "App Store Ready"],
      timeline: "14-18 weeks",
      complexity: "High"
    },
    {
      id: "admin-dashboard",
      name: t("develop.service_analytics"),
      description: t("develop.service_analytics_desc"),
      icon: BarChart3,
      basePrice: 16000,
      features: ["Real-time Data", "AI Insights", "Custom Reports", "User Roles", "Export Tools"],
      timeline: "10-14 weeks",
      complexity: "Low"
    },
    {
      id: "ai-platform",
      name: t("develop.service_enterprise"),
      description: t("develop.service_enterprise_desc"),
      icon: Brain,
      basePrice: 40000,
      features: ["Multi-tenant", "Custom Models", "API Gateway", "Microservices", "Enterprise Security"],
      timeline: "16-20 weeks",
      complexity: "Very High"
    }
  ];

  const aiFeatures = [
    { id: "ai_chat_agent", name: "AI Chat Agent", price: 4800, description: "Intelligent conversational interface" },
    { id: "rag_search", name: "RAG Search", price: 6400, description: "Retrieval-augmented generation for knowledge search" },
    { id: "analytics_dashboard", name: "Analytics Dashboard", price: 4000, description: "AI-powered insights and reporting" },
    { id: "machine-learning", name: "Custom ML Models", price: 12000, description: "Tailored machine learning solutions" },
    { id: "computer-vision", name: "Computer Vision", price: 9600, description: "Image and video analysis" },
    { id: "predictive-analytics", name: "Predictive Analytics", price: 9600, description: "Future trend predictions" }
  ];

  const platformFeatures = [
    { id: "firebase_auth", name: "User Authentication", price: 2400, description: "Secure login system with Firebase" },
    { id: "payments", name: "Payment Integration", price: 3200, description: "Stripe, PayPal integration" },
    { id: "file_storage", name: "File Storage", price: 2000, description: "Secure file upload and management" },
    { id: "api_integrations", name: "API Integrations", price: 3200, description: "Third-party service connections" },
    { id: "cloud", name: "Cloud Infrastructure", price: 4800, description: "Scalable hosting setup" }
  ];

  const milestones = [
    { week: 1, title: t("develop.milestone_kickoff"), description: t("develop.milestone_kickoff_desc"), icon: Target },
    { week: 4, title: t("develop.milestone_prototype"), description: t("develop.milestone_prototype_desc"), icon: PlayCircle },
    { week: 8, title: t("develop.milestone_development"), description: t("develop.milestone_development_desc"), icon: Code },
    { week: 12, title: t("develop.milestone_review"), description: t("develop.milestone_review_desc"), icon: CheckCircle },
    { week: 16, title: t("develop.milestone_launch"), description: t("develop.milestone_launch_desc"), icon: Sparkles }
  ];

  useEffect(() => {
    calculateEstimate();
  }, [estimateData, activeService]);

  const calculateEstimate = () => {
    if (!estimateData.projectType) return;
    
    const service = services.find(s => s.id === estimateData.projectType);
    if (!service) return;

    let total = service.basePrice;
    
    // Add AI features
    estimateData.aiFeatures.forEach(featureId => {
      const feature = aiFeatures.find(f => f.id === featureId);
      if (feature) total += feature.price;
    });

    // Add platform features
    estimateData.platformRequirements.forEach(featureId => {
      const feature = platformFeatures.find(f => f.id === featureId);
      if (feature) total += feature.price;
    });

    // Complexity multiplier
    const complexityMultiplier = 0.8 + (estimateData.complexity / 10) * 0.4;
    total *= complexityMultiplier;

    setEstimatedPrice(Math.round(total));
  };

  const handleFeatureToggle = (featureId: string, type: 'ai' | 'platform') => {
    if (type === 'ai') {
      setEstimateData(prev => ({
        ...prev,
        aiFeatures: prev.aiFeatures.includes(featureId)
          ? prev.aiFeatures.filter(id => id !== featureId)
          : [...prev.aiFeatures, featureId]
      }));
    } else {
      setEstimateData(prev => ({
        ...prev,
        platformRequirements: prev.platformRequirements.includes(featureId)
          ? prev.platformRequirements.filter(id => id !== featureId)
          : [...prev.platformRequirements, featureId]
      }));
    }
  };

  const submitEstimate = async () => {
    if (!estimateData.email || !estimateData.projectType) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const clientInfo = getClientInfo();
      
      // Map the form data to the database schema
      const estimateRecord: DevelopmentEstimate = {
        project_name: estimateData.projectName || null,
        company: estimateData.companyName || null,
        contact_name: estimateData.contactName || null,
        email: estimateData.email,
        phone: estimateData.phone || null,
        
        // Map project type to scope fields
        web_app: estimateData.projectType === 'web-app' || estimateData.projectType === 'ai-platform',
        admin_dashboard: estimateData.projectType === 'admin-dashboard',
        mobile_ios: estimateData.projectType === 'mobile-app',
        mobile_android: estimateData.projectType === 'mobile-app',
        
        // Map AI features
        ai_chat_agent: estimateData.aiFeatures.includes('ai_chat_agent'),
        rag_search: estimateData.aiFeatures.includes('rag_search'),
        analytics_dashboard: estimateData.aiFeatures.includes('analytics_dashboard'),
        firebaseAuth: estimateData.platformRequirements.includes('firebase_auth'),
        payments: estimateData.platformRequirements.includes('payments'),
        file_storage: estimateData.platformRequirements.includes('file_storage'),
        api_integrations: estimateData.platformRequirements.includes('api_integrations') ? ['standard'] : [],
        
        // Map complexity and timeline
        complexity: estimateData.complexity <= 3 ? 'starter' : estimateData.complexity <= 7 ? 'standard' : 'advanced',
        timeline_weeks: parseInt(estimateData.timeline) || 16,
        languages: ['en'], // Default to English
        
        // Pricing
        price_chf: estimatedPrice,
        price_breakdown: {
          base_service: services.find(s => s.id === estimateData.projectType)?.basePrice || 0,
          ai_features: estimateData.aiFeatures.reduce((sum, id) => {
            const feature = aiFeatures.find(f => f.id === id);
            return sum + (feature?.price || 0);
          }, 0),
          platform_features: estimateData.platformRequirements.reduce((sum, id) => {
            const feature = platformFeatures.find(f => f.id === id);
            return sum + (feature?.price || 0);
          }, 0),
          complexity_multiplier: 0.8 + (estimateData.complexity / 10) * 0.4
        },
        
        notes: estimateData.description || null,
        ip_address: clientInfo.user_agent, // Using user_agent as proxy since we can't get IP client-side
        user_agent: clientInfo.user_agent,
        status: 'new'
      };

      const { submitDevelopmentEstimate } = await import('../utils/firebaseApi');
      const response = await submitDevelopmentEstimate(estimateRecord);

      if (!response.success) {
        console.error('Error submitting estimate:', response.error);
        setSubmitError('Failed to submit estimate. Please try again or contact us directly.');
        return;
      }

      console.log('Estimate submitted successfully:', response.data);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowEstimator(false);
        setEstimateStep(1);
        setEstimateData({
          projectName: "",
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          projectType: "",
          features: [],
          complexity: 5,
          timeline: "",
          budget: "",
          description: "",
          aiFeatures: [],
          platformRequirements: []
        });
        setEstimatedPrice(0);
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Unexpected error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (estimateStep < 4) {
      setEstimateStep(estimateStep + 1);
    }
  };

  const prevStep = () => {
    if (estimateStep > 1) {
      setEstimateStep(estimateStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary/.06)_0%,transparent_50%)]"></div>
        
        <div className="container-apple relative section-apple">
          <motion.div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-medium text-primary">{t("develop.badge")}</span>
            </div>
            
            <h1 className="mb-6 max-w-3xl mx-auto">
              {t("develop.title")}
            </h1>
            
            <p className="text-large text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("develop.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="px-8 py-3"
                onClick={() => setShowEstimator(true)}
              >
                <Target className="h-5 w-5 mr-2" />
                {t("develop.cta_estimate")}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-3"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                {t("develop.cta_services")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-apple">
        <div className="container-apple">
          <motion.div className="text-center mb-16">
            <h2 className="mb-4">{t("develop.services_title")}</h2>
            <p className="text-large text-muted-foreground max-w-2xl mx-auto">
              {t("develop.services_subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeService === service.id;
              
              return (
                <motion.div
                  key={service.id}
                  className="group"
                >
                  <Card 
                    className={`card-apple cursor-pointer transition-all duration-300 h-full ${
                      isActive ? 'ring-2 ring-primary border-primary/50' : ''
                    }`}
                    onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                  >
                    <CardHeader className="text-center pb-6">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-primary p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-base mb-2">{service.name}</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">{service.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-primary mb-1">
                            CHF {service.basePrice.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">{t("develop.starting_from")}</div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{t("develop.timeline")}</span>
                          <span className="font-medium">{service.timeline}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{t("develop.complexity")}</span>
                          <Badge variant="outline" className="text-xs px-2 py-0.5">{service.complexity}</Badge>
                        </div>

                        {isActive && (
                          <motion.div className="overflow-hidden">
                            <Separator className="my-4" />
                            <div className="space-y-2">
                              {service.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full mt-4 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEstimateData(prev => ({ ...prev, projectType: service.id }));
                                setShowEstimator(true);
                              }}
                            >
                              Configure Project
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-apple bg-muted/30">
        <div className="container-apple">
          <motion.div className="text-center mb-16">
            <h2 className="mb-4">{t("develop.process_title")}</h2>
            <p className="text-large text-muted-foreground max-w-2xl mx-auto">
              {t("develop.process_subtitle")}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex gap-6 items-center group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-base font-medium">{milestone.title}</h4>
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          Week {milestone.week}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section-apple">
        <div className="container-apple">
          <motion.div className="text-center mb-16">
            <h2 className="mb-4">{t("develop.tech_title")}</h2>
            <p className="text-large text-muted-foreground max-w-2xl mx-auto">
              {t("develop.tech_subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: t("develop.tech_frontend"),
                icon: Globe,
                technologies: ["React/Next.js", "TypeScript", "Tailwind CSS", "Motion/React"]
              },
              {
                category: t("develop.tech_ai_backend"),
                icon: Brain,
                technologies: ["Python/FastAPI", "TensorFlow", "OpenAI GPT", "Custom ML Models"]
              },
              {
                category: t("develop.tech_infrastructure"),
                icon: Cloud,
                technologies: ["AWS/Azure", "Docker", "PostgreSQL", "Monitoring"]
              }
            ].map((stack, index) => {
              const Icon = stack.icon;
              return (
                <motion.div
                  key={index}
                >
                  <Card className="card-apple h-full text-center">
                    <CardHeader>
                      <div className="w-12 h-12 mx-auto rounded-xl bg-primary p-3 mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-base">{stack.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stack.technologies.map((tech, i) => (
                          <div key={i} className="text-sm text-muted-foreground">
                            {tech}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-apple bg-primary text-primary-foreground">
        <div className="container-apple">
          <motion.div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-white">{t("develop.cta_ready_title")}</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              {t("develop.cta_ready_subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-3 bg-white text-primary hover:bg-white/90"
                onClick={() => setShowEstimator(true)}
              >
                <Target className="h-5 w-5 mr-2" />
                {t("develop.cta_estimate")}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-3 border-white text-white hover:bg-white hover:text-primary"
                onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
              >
                <Calendar className="h-5 w-5 mr-2" />
                {t("develop.cta_book_consultation")}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">24hrs</div>
                <div className="text-sm text-primary-foreground/60">{t("develop.stats_response")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-primary-foreground/60">{t("develop.stats_quality")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">16wks</div>
                <div className="text-sm text-primary-foreground/60">{t("develop.stats_timeline")}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Estimate Calculator Modal */}
      {showEstimator && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowEstimator(false)}
        >
            <motion.div
              className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-border">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Project Configurator</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Let's build your custom AI solution together. Answer a few questions to get an accurate estimate.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Progress Indicator */}
                  <div className="relative">
                    <Progress value={(estimateStep / 4) * 100} className="h-2 bg-muted" />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          {estimateStep}
                        </div>
                        <span className="text-sm font-medium">
                          {estimateStep === 1 && 'Project Details'}
                          {estimateStep === 2 && 'AI Features'}
                          {estimateStep === 3 && 'Platform Setup'}
                          {estimateStep === 4 && 'Review & Submit'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {estimateStep} of 4
                      </div>
                    </div>
                  </div>

                  {/* Price Display */}
                  <motion.div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Current Estimate</div>
                        <div className="text-xs text-muted-foreground">
                          {estimatedPrice > 0 ? 'Based on your selections' : 'Select project type to begin'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.div 
                        className="text-xl font-semibold text-primary"
                        key={estimatedPrice}
                      >
                        {estimatedPrice > 0 ? `CHF ${estimatedPrice.toLocaleString()}` : 'CHF —'}
                      </motion.div>
                      {estimatedPrice > 0 && (
                        <motion.div className="text-xs text-muted-foreground">
                          Swiss market rate
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Success/Error Messages */}
                  {submitSuccess && (
                    <motion.div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Estimate submitted successfully!</span>
                      </div>
                      <p className="text-xs mt-1">We'll contact you within 24 hours with a detailed proposal.</p>
                    </motion.div>
                  )}
                  
                  {submitError && (
                    <motion.div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Error</span>
                      </div>
                      <p className="text-xs mt-1">{submitError}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 min-h-0">
                {estimateStep === 1 && (
                  <motion.div
                    key="step1"
                    className="space-y-6"
                  >
                      <div>
                        <h4 className="font-medium mb-4">Project Information</h4>
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="projectName" className="text-sm">Project Name</Label>
                            <Input
                              id="projectName"
                              placeholder="My AI Application"
                              value={estimateData.projectName}
                              onChange={(e) => setEstimateData(prev => ({ ...prev, projectName: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="companyName" className="text-sm">Company</Label>
                              <Input
                                id="companyName"
                                placeholder="Your Company AG"
                                value={estimateData.companyName}
                                onChange={(e) => setEstimateData(prev => ({ ...prev, companyName: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactName" className="text-sm">Contact Name</Label>
                              <Input
                                id="contactName"
                                placeholder="John Doe"
                                value={estimateData.contactName}
                                onChange={(e) => setEstimateData(prev => ({ ...prev, contactName: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email" className="text-sm">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="contact@company.ch"
                                value={estimateData.email}
                                onChange={(e) => setEstimateData(prev => ({ ...prev, email: e.target.value }))}
                                className="mt-1"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-sm">Phone</Label>
                              <Input
                                id="phone"
                                placeholder="+41 44 123 45 67"
                                value={estimateData.phone}
                                onChange={(e) => setEstimateData(prev => ({ ...prev, phone: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="projectType" className="text-sm">Project Type *</Label>
                            <Select value={estimateData.projectType} onValueChange={(value) => setEstimateData(prev => ({ ...prev, projectType: value }))}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map(service => (
                                  <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                {estimateStep === 2 && (
                  <motion.div
                    key="step2"
                    className="space-y-6"
                  >
                      <div>
                        <h4 className="font-medium mb-2">AI Features</h4>
                        <p className="text-sm text-muted-foreground mb-4">Select the AI capabilities you need</p>
                        <div className="space-y-3">
                          {aiFeatures.map((feature) => (
                            <div key={feature.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                              <Checkbox
                                id={feature.id}
                                checked={estimateData.aiFeatures.includes(feature.id)}
                                onCheckedChange={() => handleFeatureToggle(feature.id, 'ai')}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <Label htmlFor={feature.id} className="font-medium cursor-pointer text-sm">{feature.name}</Label>
                                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                                <div className="text-xs font-medium text-primary mt-1">+CHF {feature.price.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                {estimateStep === 3 && (
                  <motion.div
                    key="step3"
                    className="space-y-6"
                  >
                      <div>
                        <h4 className="font-medium mb-2">Platform Features</h4>
                        <p className="text-sm text-muted-foreground mb-4">Choose additional platform capabilities</p>
                        <div className="space-y-3">
                          {platformFeatures.map((feature) => (
                            <div key={feature.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                              <Checkbox
                                id={feature.id}
                                checked={estimateData.platformRequirements.includes(feature.id)}
                                onCheckedChange={() => handleFeatureToggle(feature.id, 'platform')}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <Label htmlFor={feature.id} className="font-medium cursor-pointer text-sm">{feature.name}</Label>
                                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                                <div className="text-xs font-medium text-primary mt-1">+CHF {feature.price.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6">
                          <Label className="text-sm font-medium">Project Complexity: {estimateData.complexity}/10</Label>
                          <Slider
                            value={[estimateData.complexity]}
                            onValueChange={(value) => setEstimateData(prev => ({ ...prev, complexity: value[0] }))}
                            max={10}
                            min={1}
                            step={1}
                            className="mt-3"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>Simple</span>
                            <span>Complex</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                {estimateStep === 4 && (
                  <motion.div
                    key="step4"
                    className="space-y-6"
                  >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-medium mb-2">Project Summary</h4>
                        <div className="text-3xl font-bold text-primary mb-4">CHF {estimatedPrice.toLocaleString()}</div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <div className="font-medium">Project Type</div>
                            <div className="text-muted-foreground text-xs mt-1">
                              {services.find(s => s.id === estimateData.projectType)?.name || 'Not selected'}
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <div className="font-medium">Timeline</div>
                            <div className="text-muted-foreground text-xs mt-1">16 weeks</div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-sm">Project Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Tell us more about your project goals and requirements..."
                            rows={3}
                            value={estimateData.description}
                            onChange={(e) => setEstimateData(prev => ({ ...prev, description: e.target.value }))}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
              </div>

              <div className="p-6 border-t border-border flex-shrink-0">
                <div className="flex justify-between gap-4">
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={estimateStep === 1}
                    className="px-6"
                  >
                    Previous
                  </Button>
                  
                  {estimateStep < 4 ? (
                    <Button 
                      onClick={nextStep}
                      className="px-6"
                      disabled={estimateStep === 1 && (!estimateData.projectType || !estimateData.email)}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={submitEstimate}
                      disabled={isSubmitting || !estimateData.email || !estimateData.projectType}
                      className="px-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Estimate
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}
