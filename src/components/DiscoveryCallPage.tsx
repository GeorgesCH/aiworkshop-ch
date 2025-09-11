import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Calendar, Mail, Clock, CheckCircle, ArrowLeft, Sparkles, Users, Building, Target, Phone } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { useScrollToTop } from "../utils/useScrollToTop";
import { useAnalytics, useFormAnalytics } from "../hooks/useAnalytics";
import { trackConversion } from "../utils/analytics";

interface DiscoveryCallPageProps {
  onBackToHome: () => void;
}

export function DiscoveryCallPage({ onBackToHome }: DiscoveryCallPageProps) {
  const { t, language } = useLanguage();
  useScrollToTop();
  const { trackClick } = useAnalytics({ page: 'discovery-call' });
  const { trackFormStart, trackFormComplete, trackFormAbandon, trackFieldFocus, trackFieldBlur } = useFormAnalytics('discovery-call', 'discovery-call-page');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    
    // Discovery Call Details
    preferredDate: "",
    preferredTime: "",
    callDuration: "30",
    callType: "video",
    timezone: "Europe/Zurich",
    
    // Business Context
    companySize: "",
    industry: "",
    currentAIUsage: "",
    challenges: "",
    goals: "",
    budgetRange: "",
    
    // Additional Information
    howDidYouHear: "",
    specialRequirements: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const progressPercentage = (step / 3) * 100;

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const timezones = [
    { value: "Europe/Zurich", label: "Central European Time (CET/CEST)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT/BST)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" }
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees", 
    "51-200 employees",
    "201-1000 employees",
    "1000+ employees"
  ];

  const industries = [
    "Financial Services",
    "Healthcare",
    "Manufacturing",
    "Technology",
    "Consulting",
    "Retail",
    "Insurance",
    "Government",
    "Education",
    "Other"
  ];

  const currentAIUsage = [
    t("discovery.no_ai_yet"),
    t("discovery.basic_ai"),
    t("discovery.some_ai"),
    t("discovery.advanced_ai"),
    t("discovery.leading_ai")
  ];

  const budgetRanges = [
    "Under CHF 5,000",
    "CHF 5,000 - 15,000",
    "CHF 15,000 - 50,000",
    "CHF 50,000 - 100,000",
    "Over CHF 100,000"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value ? t('discovery.email_required') : !emailRegex.test(value) ? t('discovery.valid_email') : '';
      case 'phone':
        return !value ? t('discovery.phone_required') : '';
      case 'firstName':
        return !value ? t('discovery.first_name_required') : '';
      case 'lastName':
        return !value ? t('discovery.last_name_required') : '';
      case 'company':
        return !value ? t('discovery.company_required') : '';
      case 'preferredDate':
        if (!value) return t('discovery.select_date');
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today ? t('discovery.future_date') : '';
      case 'preferredTime':
        return !value ? t('discovery.select_time') : '';
      case 'callDuration':
        return !value ? t('discovery.select_duration') : '';
      case 'timezone':
        return !value ? t('discovery.select_timezone') : '';
      default:
        return '';
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (stepNumber === 1) {
      ['firstName', 'lastName', 'email', 'phone', 'company'].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) errors[field] = error;
      });
    } else if (stepNumber === 2) {
      ['preferredDate', 'preferredTime', 'callDuration', 'timezone'].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) errors[field] = error;
      });
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    trackFormComplete();
    trackConversion('discovery_call');
    
    try {
      const { submitDiscoveryCall } = await import('../utils/supabaseApi');
      
      const result = await submitDiscoveryCall({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        callDuration: formData.callDuration as '15' | '30' | '45' | '60',
        callType: formData.callType as 'video' | 'phone' | 'in-person',
        timezone: formData.timezone,
        companySize: formData.companySize,
        industry: formData.industry,
        currentAIUsage: formData.currentAIUsage,
        challenges: formData.challenges,
        goals: formData.goals,
        budgetRange: formData.budgetRange,
        howDidYouHear: formData.howDidYouHear,
        specialRequirements: formData.specialRequirements
      });
      
      if (result.success) {
        toast.success(t("discovery.success_message"));
        setStep(1);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          position: "",
          preferredDate: "",
          preferredTime: "",
          callDuration: "30",
          callType: "video",
          timezone: "Europe/Zurich",
          companySize: "",
          industry: "",
          currentAIUsage: "",
          challenges: "",
          goals: "",
          budgetRange: "",
          howDidYouHear: "",
          specialRequirements: ""
        });
      } else {
        toast.error(result.error || t("discovery.error_message"));
      }
    } catch (error) {
      console.error('Discovery call submission error:', error);
      toast.error(t("discovery.error_message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("discovery.back_to_home")}
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{t("discovery.title")}</h1>
              <p className="text-gray-600">{t("discovery.subtitle")}</p>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{t("discovery.step_of").replace("{step}", step.toString())}</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% {t("discovery.complete")}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {t("discovery.personal_info")}
                </CardTitle>
                <p className="text-gray-600">{t("discovery.personal_info_desc")}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("discovery.first_name")} *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={fieldErrors.firstName ? 'border-red-500' : ''}
                    />
                    {fieldErrors.firstName && <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("discovery.last_name")} *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={fieldErrors.lastName ? 'border-red-500' : ''}
                    />
                    {fieldErrors.lastName && <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t("discovery.email")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={fieldErrors.email ? 'border-red-500' : ''}
                    />
                    {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("discovery.phone")} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={fieldErrors.phone ? 'border-red-500' : ''}
                    />
                    {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">{t("discovery.company")} *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={fieldErrors.company ? 'border-red-500' : ''}
                    />
                    {fieldErrors.company && <p className="text-red-500 text-sm mt-1">{fieldErrors.company}</p>}
                  </div>
                  <div>
                    <Label htmlFor="position">{t("discovery.job_title")}</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companySize">{t("discovery.company_size")}</Label>
                    <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("discovery.select_company_size")} />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="industry">{t("discovery.industry")}</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("discovery.select_industry")} />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Scheduling */}
          {step === 2 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t("discovery.schedule_call")}
                </CardTitle>
                <p className="text-gray-600">{t("discovery.schedule_desc")}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredDate">{t("discovery.preferred_date")} *</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      min={getMinDate()}
                      max={getMaxDate()}
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className={fieldErrors.preferredDate ? 'border-red-500' : ''}
                    />
                    {fieldErrors.preferredDate && <p className="text-red-500 text-sm mt-1">{fieldErrors.preferredDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="preferredTime">{t("discovery.preferred_time")} *</Label>
                    <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                      <SelectTrigger className={fieldErrors.preferredTime ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t("discovery.select_time_slot")} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.preferredTime && <p className="text-red-500 text-sm mt-1">{fieldErrors.preferredTime}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="callDuration">{t("discovery.call_duration")} *</Label>
                    <Select value={formData.callDuration} onValueChange={(value) => handleInputChange('callDuration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">{t("discovery.your_timezone")} *</Label>
                    <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="callType">{t("discovery.call_type")}</Label>
                  <Select value={formData.callType} onValueChange={(value) => handleInputChange('callType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">{t("discovery.video_call")}</SelectItem>
                      <SelectItem value="phone">{t("discovery.phone_call")}</SelectItem>
                      <SelectItem value="in-person">{t("discovery.in_person")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Business Context */}
          {step === 3 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  {t("discovery.business_context")}
                </CardTitle>
                <p className="text-gray-600">{t("discovery.business_desc")}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="currentAIUsage">{t("discovery.current_ai_usage")}</Label>
                  <Select value={formData.currentAIUsage} onValueChange={(value) => handleInputChange('currentAIUsage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("discovery.select_ai_usage")} />
                    </SelectTrigger>
                    <SelectContent>
                      {currentAIUsage.map((usage) => (
                        <SelectItem key={usage} value={usage}>{usage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="challenges">{t("discovery.main_challenges")}</Label>
                  <Textarea
                    id="challenges"
                    placeholder={t("discovery.challenges_placeholder")}
                    value={formData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="goals">{t("discovery.goals_objectives")}</Label>
                  <Textarea
                    id="goals"
                    placeholder={t("discovery.goals_placeholder")}
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="budgetRange">{t("discovery.budget_range")}</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("discovery.select_budget")} />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="howDidYouHear">{t("discovery.how_hear")}</Label>
                  <Select value={formData.howDidYouHear} onValueChange={(value) => handleInputChange('howDidYouHear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("discovery.select_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">{t("discovery.google_search")}</SelectItem>
                      <SelectItem value="linkedin">{t("discovery.linkedin")}</SelectItem>
                      <SelectItem value="referral">{t("discovery.referral")}</SelectItem>
                      <SelectItem value="social-media">{t("discovery.social_media")}</SelectItem>
                      <SelectItem value="other">{t("discovery.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialRequirements">{t("discovery.special_requirements")}</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder={t("discovery.requirements_placeholder")}
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("discovery.previous")}
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="ml-auto flex items-center gap-2"
              >
                {t("discovery.next")}
                <CheckCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t("discovery.submitting")}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t("discovery.schedule_call_btn")}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Benefits Section */}
          <Card className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("discovery.why_schedule")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t("discovery.personalized_assessment")}</h4>
                    <p className="text-sm text-gray-600">{t("discovery.assessment_desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t("discovery.expert_guidance")}</h4>
                    <p className="text-sm text-gray-600">{t("discovery.guidance_desc")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t("discovery.no_obligation")}</h4>
                    <p className="text-sm text-gray-600">{t("discovery.obligation_desc")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
