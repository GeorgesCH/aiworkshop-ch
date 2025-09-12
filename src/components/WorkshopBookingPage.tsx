import React from "react";
import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Calendar, Mail, Clock, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { submitWorkshopBooking, updateWorkshopBooking, WorkshopBookingData } from "../utils/firebaseApi";

interface Course {
  id: string;
  price: number;
  advanced?: boolean;
  featureCount: number;
}

// Minimal course metadata: derive all texts from translation keys in LanguageProvider
const courses: Course[] = [
  { id: "ai-fundamentals", price: 350, featureCount: 6 },
  { id: "ai-for-business", price: 470, featureCount: 7 },
  { id: "generative-ai", price: 850, featureCount: 6 },
  { id: "agentic-ai", price: 980, advanced: true, featureCount: 8 }
];

interface WorkshopBookingPageProps {
  selectedCourse?: string;
  onBackToHome: () => void;
}

export function WorkshopBookingPage({ selectedCourse, onBackToHome }: WorkshopBookingPageProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    
    // Workshop Details
    courseId: selectedCourse || "",
    preferredDate: "",
    preferredTime: "",
    numberOfParticipants: "1",
    locationPreference: "",
    budgetRange: "",
    specialRequirements: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);

  const selectedCourseData = courses.find(course => course.id === formData.courseId);
  const totalPrice = selectedCourseData ? selectedCourseData.price * parseInt(formData.numberOfParticipants || "1") : 0;
  const progressPercentage = (step / 2) * 100;

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
      case 'courseId':
        return !value ? 'Please select a workshop' : '';
      case 'preferredDate':
        if (!value) return 'Please select a date';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today ? 'Please select a future date' : '';
      case 'numberOfParticipants':
        return !value ? 'Please select number of participants' : '';
      default:
        return '';
    }
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.courseId && formData.preferredDate && formData.numberOfParticipants;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    // Validate current step fields
    const currentStepFields = step === 1 ? ['firstName', 'lastName', 'email', 'phone'] : ['courseId', 'preferredDate', 'numberOfParticipants'];
    const newErrors: {[key: string]: string} = {};
    
    currentStepFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setFieldErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Save progress after step 1
      if (step === 1) {
        setIsSavingStep(true);
        try {
          const partialData: Partial<WorkshopBookingData> = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            position: formData.position
          };

          // For Firebase, we'll save progress in localStorage for now
          // In a production app, you might want to implement a draft saving mechanism
          localStorage.setItem('workshopBookingDraft', JSON.stringify(partialData));
          toast.success("Progress saved locally! You can continue or come back later.");
        } catch (error) {
          console.error('Error saving step 1 progress:', error);
        } finally {
          setIsSavingStep(false);
        }
      }
      
      setStep(prev => Math.min(prev + 1, 2));
      // Scroll to top of form on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = useCallback(async (e: any) => {
    e.preventDefault();
    
    // Frontend validation
    const errors: string[] = [];
    const newErrors: {[key: string]: string} = {};
    
    const allFields = ['firstName', 'lastName', 'email', 'phone', 'courseId', 'preferredDate', 'numberOfParticipants'];
    
    allFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field] = error;
        errors.push(error);
      }
    });
    
    setFieldErrors(newErrors);
    
    if (errors.length > 0) {
      toast.error(`Please fix ${errors.length} error${errors.length > 1 ? 's' : ''} before submitting`);
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData: WorkshopBookingData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company?.trim() || undefined,
        position: formData.position?.trim() || undefined,
        workshopType: formData.courseId,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime?.trim() || undefined,
        numberOfParticipants: formData.numberOfParticipants === '10+' ? 10 : parseInt(formData.numberOfParticipants),
        locationPreference: formData.locationPreference?.trim() || undefined,
        budgetRange: formData.budgetRange?.trim() || undefined,
        specialRequirements: formData.specialRequirements?.trim() || undefined,
        language: language
      };

      let response;
      
      if (currentBookingId) {
        response = await updateWorkshopBooking(currentBookingId, bookingData);
      } else {
        response = await submitWorkshopBooking(bookingData);
      }
      
      if (response.success) {
        toast.success(t("booking.success_submitted"), {
          description: "We'll contact you within 24 hours to confirm your workshop details.",
          duration: 6000,
        });
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          position: "",
          courseId: selectedCourse || "",
          preferredDate: "",
          preferredTime: "",
          numberOfParticipants: "1",
          locationPreference: "",
          budgetRange: "",
          specialRequirements: ""
        });
        
        setFieldErrors({});
        setStep(1);
        setCurrentBookingId(null);
        
        // Return to homepage after successful submission
        setTimeout(() => {
          onBackToHome();
        }, 2000);
      } else {
        const errorMsg = response.error || response.message || "An error occurred while submitting your booking.";
        toast.error(errorMsg);
      }
      
    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error("An unexpected error occurred. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, language, currentBookingId, onBackToHome, selectedCourse, t]);

  const renderStepIndicator = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          Step {step} of 2
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <Mail className="w-10 h-10 text-primary mx-auto mb-2" />
        <h2 className="text-lg font-semibold mb-1">{t("booking.step1_title")}</h2>
        <p className="text-gray-600 text-sm">Tell us about yourself</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-base">{t("booking.first_name_label")} *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder={t("booking.first_name_placeholder")}
              required
              className={`h-12 text-base ${fieldErrors.firstName ? "border-red-500" : ""}`}
            />
            {fieldErrors.firstName && (
              <p className="text-sm text-red-500">{fieldErrors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-base">{t("booking.last_name_label")} *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder={t("booking.last_name_placeholder")}
              required
              className={`h-12 text-base ${fieldErrors.lastName ? "border-red-500" : ""}`}
            />
            {fieldErrors.lastName && (
              <p className="text-sm text-red-500">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">{t("booking.email_label")} *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("booking.email_placeholder")}
            required
            className={`h-12 text-base ${fieldErrors.email ? "border-red-500" : ""}`}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base">{t("booking.phone_label")} *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder={t("booking.phone_placeholder")}
            required
            className={`h-12 text-base ${fieldErrors.phone ? "border-red-500" : ""}`}
          />
          {fieldErrors.phone && (
            <p className="text-sm text-red-500">{fieldErrors.phone}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-base">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Your company name"
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position" className="text-base">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              placeholder="Your job title"
              className="h-12 text-base"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <Calendar className="w-10 h-10 text-primary mx-auto mb-2" />
        <h2 className="text-lg font-semibold mb-1">{t("booking.step2_title")}</h2>
        <p className="text-gray-600 text-sm">Choose your workshop details</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="courseId" className="text-base">{t("booking.select_workshop_label")} *</Label>
          <Select value={formData.courseId} onValueChange={(value) => handleInputChange("courseId", value)}>
            <SelectTrigger className={`h-12 text-base ${fieldErrors.courseId ? "border-red-500" : ""}`}>
              <SelectValue placeholder={t("booking.select_workshop_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-fundamentals">
                <div className="flex items-center justify-between w-full">
                  <span>AI Fundamentals</span>
                  <Badge variant="secondary" className="ml-2">CHF 350</Badge>
                </div>
              </SelectItem>
              <SelectItem value="ai-for-business">
                <div className="flex items-center justify-between w-full">
                  <span>AI for Business Intelligence</span>
                  <Badge variant="secondary" className="ml-2">CHF 470</Badge>
                </div>
              </SelectItem>
              <SelectItem value="generative-ai">
                <div className="flex items-center justify-between w-full">
                  <span>Generative AI for Business</span>
                  <Badge variant="secondary" className="ml-2">CHF 850</Badge>
                </div>
              </SelectItem>
              <SelectItem value="agentic-ai">
                <div className="flex items-center justify-between w-full">
                  <span>Agentic AI: Second Brain</span>
                  <Badge variant="secondary" className="ml-2">CHF 980</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.courseId && (
            <p className="text-sm text-red-500">{fieldErrors.courseId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredDate" className="text-base">{t("booking.preferred_date_label")} *</Label>
          <Input
            id="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange("preferredDate", e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            className={`h-12 text-base ${fieldErrors.preferredDate ? "border-red-500" : ""}`}
          />
          {fieldErrors.preferredDate && (
            <p className="text-sm text-red-500">{fieldErrors.preferredDate}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferredTime" className="text-base">Preferred Time</Label>
            <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (9:00 - 12:00)</SelectItem>
                <SelectItem value="afternoon">Afternoon (13:00 - 16:00)</SelectItem>
                <SelectItem value="evening">Evening (17:00 - 20:00)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationPreference" className="text-base">Location Preference</Label>
            <Select value={formData.locationPreference} onValueChange={(value) => handleInputChange("locationPreference", value)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online (Zoom/Teams)</SelectItem>
                <SelectItem value="onsite">On-site at your office</SelectItem>
                <SelectItem value="our-office">At our office</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetRange" className="text-base">Budget Range</Label>
          <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange("budgetRange", value)}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-1000">Under CHF 1,000</SelectItem>
              <SelectItem value="1000-2000">CHF 1,000 - 2,000</SelectItem>
              <SelectItem value="2000-5000">CHF 2,000 - 5,000</SelectItem>
              <SelectItem value="5000-8000">CHF 5,000 - 8,000</SelectItem>
              <SelectItem value="8000-12000">CHF 8,000 - 12,000</SelectItem>
              <SelectItem value="over-12000">Over CHF 12,000</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfParticipants" className="text-base">{t("booking.participants_label")} *</Label>
          <Select value={formData.numberOfParticipants} onValueChange={(value) => handleInputChange("numberOfParticipants", value)}>
            <SelectTrigger className={`h-12 text-base ${fieldErrors.numberOfParticipants ? "border-red-500" : ""}`}>
              <SelectValue placeholder={t("booking.participants_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {t("workshops.participants")}
                </SelectItem>
              ))}
              <SelectItem value="10+">{t("booking.participants_10_plus_option")}</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.numberOfParticipants && (
            <p className="text-sm text-red-500">{fieldErrors.numberOfParticipants}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequirements" className="text-base">{t("booking.special_requirements_label")}</Label>
          <Textarea
            id="specialRequirements"
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
            placeholder={t("booking.special_requirements_placeholder")}
            rows={4}
            className="text-base resize-none"
          />
        </div>

        {selectedCourseData && (
          <Card className="relative overflow-hidden border border-primary/20 shadow-lg bg-white/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-gray-900">{t("booking.total_price_label")}</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">CHF {totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600">
                {t("booking.price_includes_note")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToHome}
              className="gap-2 hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">{t("booking.modal_title")}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white/90 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
          <CardHeader className="relative pb-2">
            <CardTitle className="text-center text-lg font-semibold">{t("booking.modal_desc")}</CardTitle>
          </CardHeader>
          <CardContent className="relative px-6 pb-6">
            {renderStepIndicator()}
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}

              {/* Navigation Buttons */}
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-200/60">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="w-full h-12 text-base border-gray-200/60 hover:border-primary/30 hover:bg-muted/50"
                  >
                    {t("booking.previous")}
                  </Button>
                )}
                
                {step < 2 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    disabled={!validateStep(step) || isSavingStep}
                  >
                    {isSavingStep ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {t("booking.next")}
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !validateStep(2)}
                    className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        {t("booking.processing")}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t("booking.book_workshop")}
                      </>
                    )}
                  </Button>
                )}

                <p className="text-xs text-gray-600 text-center">
                  {t("booking.no_credit_card_required")}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-xs text-gray-600 text-center mt-6 pb-6">
          {t("booking.footer_note")}
        </div>
      </main>
    </div>
  );
}
