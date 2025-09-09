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
    "No AI implementation yet",
    "Basic AI tools (ChatGPT, etc.)",
    "Some AI integration in workflows",
    "Advanced AI systems in place",
    "Leading AI innovation"
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
        return !value ? 'Email is required' : !emailRegex.test(value) ? 'Please enter a valid email' : '';
      case 'phone':
        return !value ? 'Phone is required' : '';
      case 'firstName':
        return !value ? 'First name is required' : '';
      case 'lastName':
        return !value ? 'Last name is required' : '';
      case 'company':
        return !value ? 'Company name is required' : '';
      case 'preferredDate':
        if (!value) return 'Please select a date';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today ? 'Please select a future date' : '';
      case 'preferredTime':
        return !value ? 'Please select a time slot' : '';
      case 'callDuration':
        return !value ? 'Please select call duration' : '';
      case 'timezone':
        return !value ? 'Please select your timezone' : '';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Discovery call request submitted successfully! We'll contact you within 24 hours to confirm your appointment.");
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
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
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
                Back to Home
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Discovery Call Booking</h1>
              <p className="text-gray-600">Schedule a free consultation with our AI experts</p>
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
              <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
                <p className="text-gray-600">Tell us about yourself and your company</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={fieldErrors.firstName ? 'border-red-500' : ''}
                    />
                    {fieldErrors.firstName && <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
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
                    <Label htmlFor="email">Email Address *</Label>
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
                    <Label htmlFor="phone">Phone Number *</Label>
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
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={fieldErrors.company ? 'border-red-500' : ''}
                    />
                    {fieldErrors.company && <p className="text-red-500 text-sm mt-1">{fieldErrors.company}</p>}
                  </div>
                  <div>
                    <Label htmlFor="position">Job Title</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
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
                  Schedule Your Call
                </CardTitle>
                <p className="text-gray-600">Choose a convenient time for your discovery call</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredDate">Preferred Date *</Label>
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
                    <Label htmlFor="preferredTime">Preferred Time *</Label>
                    <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                      <SelectTrigger className={fieldErrors.preferredTime ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select time slot" />
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
                    <Label htmlFor="callDuration">Call Duration *</Label>
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
                    <Label htmlFor="timezone">Your Timezone *</Label>
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
                  <Label htmlFor="callType">Call Type</Label>
                  <Select value={formData.callType} onValueChange={(value) => handleInputChange('callType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call (Zoom/Teams)</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In-Person (Switzerland)</SelectItem>
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
                  Business Context & Goals
                </CardTitle>
                <p className="text-gray-600">Help us understand your AI needs and objectives</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="currentAIUsage">Current AI Usage</Label>
                  <Select value={formData.currentAIUsage} onValueChange={(value) => handleInputChange('currentAIUsage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current AI usage level" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentAIUsage.map((usage) => (
                        <SelectItem key={usage} value={usage}>{usage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="challenges">Main Challenges</Label>
                  <Textarea
                    id="challenges"
                    placeholder="What are the main challenges you're facing with AI implementation?"
                    value={formData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="goals">Goals & Objectives</Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you hope to achieve with AI in your organization?"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                  <Select value={formData.howDidYouHear} onValueChange={(value) => handleInputChange('howDidYouHear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Any special requirements or questions for our team?"
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
                Previous
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="ml-auto flex items-center gap-2"
              >
                Next
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Schedule Discovery Call
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Benefits Section */}
          <Card className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Schedule a Discovery Call?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Personalized Assessment</h4>
                    <p className="text-sm text-gray-600">Get a customized AI strategy tailored to your business needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Expert Guidance</h4>
                    <p className="text-sm text-gray-600">Consult with certified AI professionals with Swiss expertise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">No Obligation</h4>
                    <p className="text-sm text-gray-600">Free consultation to explore AI opportunities for your business</p>
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
