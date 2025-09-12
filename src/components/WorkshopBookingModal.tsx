import React from "react";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Calendar, Mail, Clock, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { useFormAnalytics } from "../hooks/useAnalytics";
import { trackWorkshopBooking, trackConversion } from "../utils/analytics";
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

interface WorkshopBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: string;
}

export function WorkshopBookingModal({ isOpen, onClose, selectedCourse }: WorkshopBookingModalProps) {
  const { t, language } = useLanguage();
  const { trackFormStart, trackFormComplete, trackFormAbandon, trackFieldFocus, trackFieldBlur } = useFormAnalytics('workshop-booking', 'workshop-booking-modal');
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
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmitError, setLastSubmitError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);

  const selectedCourseData = courses.find(course => course.id === formData.courseId);
  const totalPrice = selectedCourseData ? selectedCourseData.price * parseInt(formData.numberOfParticipants || "1") : 0;

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
      case 'specialRequirements':
        return !value ? 'Please provide special requirements' : '';
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
          console.log('Step 1 progress saved locally');
          toast.success("Progress saved locally! You can continue or come back later.");
        } catch (error) {
          console.error('Error saving step 1 progress:', error);
          // Continue anyway, don't block the user
        } finally {
          setIsSavingStep(false);
        }
      }
      
      setStep(prev => Math.min(prev + 1, 2));
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = useCallback(async (e: any) => {
    e.preventDefault();
    
    // Check network status first
    if (!isOnline) {
      toast.error("No internet connection. Please check your network and try again.");
      return;
    }
    
    // Track form submission
    trackFormComplete();
    trackWorkshopBooking('started', formData.courseId);
    
    // Increment submit attempts for analytics/debugging
    setSubmitAttempts(prev => prev + 1);
    setLastSubmitError(null);
    
    // Frontend validation with enhanced security
    const errors: string[] = [];
    const newErrors: {[key: string]: string} = {};
    
    // Validate all required fields
    const allFields = ['firstName', 'lastName', 'email', 'phone', 'courseId', 'preferredDate', 'numberOfParticipants'];
    
    allFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field] = error;
        errors.push(error);
      }
    });
    
    // Validate optional fields
    if (formData.specialRequirements) {
      const specialReqError = validateField('specialRequirements', formData.specialRequirements);
      if (specialReqError) {
        newErrors.specialRequirements = specialReqError;
        errors.push(specialReqError);
      }
    }
    
    setFieldErrors(newErrors);
    
    if (errors.length > 0) {
      toast.error(`Please fix ${errors.length} error${errors.length > 1 ? 's' : ''} before submitting`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize and prepare data for API call
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

      // Submit booking using Firebase API
      let response;
      
      if (currentBookingId) {
        // Update existing booking from step 1
        console.log('Updating existing booking:', currentBookingId);
        response = await updateWorkshopBooking(currentBookingId, bookingData);
      } else {
        // Create new booking (fallback)
        console.log('Creating new booking');
        response = await submitWorkshopBooking(bookingData);
      }
      
      console.log('API Response received:', response);
      
      if (response.success) {
        // Success handling
        console.log('Showing success toast...');
        
        toast.success(t("booking.success_submitted"), {
          description: "We'll contact you within 24 hours to confirm your workshop details.",
          duration: 6000,
        });
        
        // Track successful booking conversion
        trackWorkshopBooking('completed', formData.courseId);
        trackConversion('workshop_booking', selectedCourseData?.price);
        console.log('Booking submitted successfully:', {
          workshop: bookingData.workshopType,
          participants: bookingData.numberOfParticipants,
          language: bookingData.language,
          attempt: submitAttempts
        });
        
        // Reset form and close modal
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
        setSubmitAttempts(0);
        setStep(1);
        setCurrentBookingId(null); // Reset booking ID
        
        // Delay closing to allow toast to be seen
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // Handle API errors
        const errorMsg = response.error || response.message || "An error occurred while submitting your booking.";
        toast.error(errorMsg);
        setLastSubmitError(errorMsg);
      }
      
    } catch (error) {
      console.error('Booking submission error:', error);
      
      // Fallback for unexpected errors
      const fallbackMsg = "An unexpected error occurred. Please try again or contact support.";
      toast.error(fallbackMsg);
      setLastSubmitError(fallbackMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [isOnline, formData, validateField, language, t, selectedCourse, submitAttempts, onClose]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            stepNumber <= step 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-gray-600"
          }`}>
            {stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
          </div>
          {stepNumber < 2 && (
            <div className={`w-12 h-1 mx-2 ${
              stepNumber < step ? "bg-primary" : "bg-muted"
            }`} />
          )}
        </div>
      ))}
      {isSavingStep && (
        <div className="ml-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          Saving progress...
        </div>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <Mail className="w-4 h-4" />
        {t("booking.step1_title")}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("booking.first_name_label")} *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder={t("booking.first_name_placeholder")}
            required
            className={fieldErrors.firstName ? "border-red-500" : ""}
          />
          {fieldErrors.firstName && (
            <p className="text-sm text-red-500">{fieldErrors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("booking.last_name_label")} *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder={t("booking.last_name_placeholder")}
            required
            className={fieldErrors.lastName ? "border-red-500" : ""}
          />
          {fieldErrors.lastName && (
            <p className="text-sm text-red-500">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("booking.email_label")} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder={t("booking.email_placeholder")}
          required
          className={fieldErrors.email ? "border-red-500" : ""}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t("booking.phone_label")} *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder={t("booking.phone_placeholder")}
          required
          className={fieldErrors.phone ? "border-red-500" : ""}
        />
        {fieldErrors.phone && (
          <p className="text-sm text-red-500">{fieldErrors.phone}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Your company name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => handleInputChange("position", e.target.value)}
            placeholder="Your job title"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {t("booking.step2_title")}
      </h3>
      
                       <div className="space-y-2">
                   <Label htmlFor="courseId">{t("booking.select_workshop_label")} *</Label>
                   <Select value={formData.courseId} onValueChange={(value) => handleInputChange("courseId", value)}>
                     <SelectTrigger className={fieldErrors.courseId ? "border-red-500" : ""}>
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
         <Label htmlFor="preferredDate">{t("booking.preferred_date_label")} *</Label>
         <Input
           id="preferredDate"
           type="date"
           value={formData.preferredDate}
           onChange={(e) => handleInputChange("preferredDate", e.target.value)}
           placeholder={t("booking.preferred_date_placeholder")}
           min={new Date().toISOString().split('T')[0]}
           required
           className={fieldErrors.preferredDate ? "border-red-500" : ""}
         />
         {fieldErrors.preferredDate && (
           <p className="text-sm text-red-500">{fieldErrors.preferredDate}</p>
         )}
       </div>

       <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="preferredTime">Preferred Time</Label>
           <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
             <SelectTrigger>
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
           <Label htmlFor="locationPreference">Location Preference</Label>
           <Select value={formData.locationPreference} onValueChange={(value) => handleInputChange("locationPreference", value)}>
             <SelectTrigger>
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
         <Label htmlFor="budgetRange">Budget Range</Label>
         <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange("budgetRange", value)}>
           <SelectTrigger>
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
         <Label htmlFor="numberOfParticipants">{t("booking.participants_label")} *</Label>
         <Select value={formData.numberOfParticipants} onValueChange={(value) => handleInputChange("numberOfParticipants", value)}>
           <SelectTrigger className={fieldErrors.numberOfParticipants ? "border-red-500" : ""}>
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
        <Label htmlFor="specialRequirements">{t("booking.special_requirements_label")}</Label>
        <Textarea
          id="specialRequirements"
          value={formData.specialRequirements}
          onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
          placeholder={t("booking.special_requirements_placeholder")}
          rows={3}
        />
      </div>

      {selectedCourseData && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t("booking.total_price_label")}</span>
            <span className="text-lg font-bold">CHF {totalPrice.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {t("booking.price_includes_note")}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("booking.modal_title")}</DialogTitle>
          <DialogDescription>
            {t("booking.modal_desc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepIndicator()}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex-1"
              >
                {t("booking.previous")}
              </Button>
            )}
            
            {step < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1"
                disabled={!validateStep(step) || isSavingStep}
              >
                {isSavingStep ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  t("booking.next")
                )}
              </Button>
            ) : (
              <div className="flex-1 space-y-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !validateStep(2)}
                  className="w-full gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      {t("booking.processing")}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {t("booking.book_workshop")}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-600 text-center">
                  {t("booking.no_credit_card_required")}
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t("booking.cancel")}
            </Button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="text-xs text-gray-600 text-center pt-4 border-t">
          {t("booking.footer_note")}
        </div>
        

      </DialogContent>
    </Dialog>
  );
}