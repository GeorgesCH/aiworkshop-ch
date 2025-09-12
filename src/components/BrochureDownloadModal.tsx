import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Download, Mail, Building, Users, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { submitBrochureRequest, BrochureRequestData } from "../utils/firebaseApi";

interface BrochureDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrochureDownloadModal({ isOpen, onClose }: BrochureDownloadModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    teamSize: "",
    city: "",
    industry: "",
    specificInterests: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for Firebase API
      const brochureData: BrochureRequestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        position: formData.position,
        teamSize: formData.teamSize,
        city: formData.city,
        industry: formData.industry,
        specificInterests: formData.specificInterests
      };

      const response = await submitBrochureRequest(brochureData);

      if (response.success) {
        toast.success("Brochure sent successfully! Check your email in a few minutes.");
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          position: "",
          teamSize: "",
          city: "",
          industry: "",
          specificInterests: ""
        });
        
        onClose();
      } else {
        const errorMsg = response.error || response.message || 'Failed to request brochure';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Brochure request error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[calc(100vw-2rem)] max-w-none sm:max-w-lg md:max-w-2xl lg:max-w-3xl 
                   max-h-[calc(100vh-2rem)] sm:max-h-[90vh] 
                   overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border
                   mx-auto my-auto p-4 sm:p-6"
        aria-labelledby="brochure-modal-title"
        aria-describedby="brochure-modal-description"
      >
        <DialogHeader className="space-y-3 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle 
                id="brochure-modal-title" 
                className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight"
              >
                {t("brochure.modal_title")}
              </DialogTitle>
              <DialogDescription 
                id="brochure-modal-description"
                className="text-sm text-gray-600 mt-1 leading-relaxed"
              >
                {t("brochure.modal_desc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Personal Information */}
          <fieldset className="space-y-4">
            <legend className="sr-only">Personal Information</legend>
            <h3 className="text-base font-medium flex items-center gap-2 text-gray-900">
              <Mail className="w-4 h-4 text-gray-600" aria-hidden="true" />
              {t("brochure.personal_info_title")}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="firstName" 
                  className="text-sm font-medium text-gray-900 required-field"
                >
                  First Name <span className="text-destructive" aria-label="required">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder={t("brochure.first_name_placeholder")}
                  required
                  aria-required="true"
                  aria-invalid={!formData.firstName ? "true" : "false"}
                  className="h-11 px-3 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="lastName" 
                  className="text-sm font-medium text-gray-900 required-field"
                >
                  Last Name <span className="text-destructive" aria-label="required">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder={t("brochure.last_name_placeholder")}
                  required
                  aria-required="true"
                  aria-invalid={!formData.lastName ? "true" : "false"}
                  className="h-11 px-3 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-900 required-field"
              >
                Email Address <span className="text-destructive" aria-label="required">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t("brochure.email_placeholder")}
                required
                aria-required="true"
                aria-invalid={!formData.email ? "true" : "false"}
                className="h-11 px-3 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                autoComplete="email"
              />
            </div>
          </fieldset>

          {/* Company Information */}
          <fieldset className="space-y-4">
            <legend className="sr-only">Company Information</legend>
            <h3 className="text-base font-medium flex items-center gap-2 text-gray-900">
              <Building className="w-4 h-4 text-gray-600" aria-hidden="true" />
              {t("brochure.company_info_title")}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="company" 
                  className="text-sm font-medium text-gray-900 required-field"
                >
                  Company Name <span className="text-destructive" aria-label="required">*</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder={t("brochure.company_name_placeholder")}
                  required
                  aria-required="true"
                  aria-invalid={!formData.company ? "true" : "false"}
                  className="h-11 px-3 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                  autoComplete="organization"
                />
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="position" 
                  className="text-sm font-medium text-gray-900"
                >
                  Your Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder={t("brochure.job_title_placeholder")}
                  className="h-11 px-3 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                  autoComplete="organization-title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="teamSize" 
                  className="text-sm font-medium text-gray-900"
                >
                  Team Size
                </Label>
                <Select 
                  value={formData.teamSize} 
                  onValueChange={(value) => handleInputChange("teamSize", value)}
                  name="teamSize"
                >
                  <SelectTrigger 
                    id="teamSize"
                    className="h-11 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                    aria-label="Select team size"
                  >
                    <SelectValue placeholder={t("brochure.team_size_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 people</SelectItem>
                    <SelectItem value="6-15">6-15 people</SelectItem>
                    <SelectItem value="16-50">16-50 people</SelectItem>
                    <SelectItem value="51-100">51-100 people</SelectItem>
                    <SelectItem value="100+">100+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="city" 
                  className="text-sm font-medium text-gray-900"
                >
                  <MapPin className="w-3 h-3 inline mr-1" aria-hidden="true" />
                  City/Location
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder={t("brochure.location_placeholder")}
                  className="h-11 px-3 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                  autoComplete="address-level2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="industry" 
                className="text-sm font-medium text-gray-900"
              >
                Industry
              </Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => handleInputChange("industry", value)}
                name="industry"
              >
                <SelectTrigger 
                  id="industry"
                  className="h-11 text-base focus:ring-2 focus:ring-primary focus:border-primary"
                  aria-label="Select industry"
                >
                  <SelectValue placeholder={t("brochure.industry_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finance">Finance & Banking</SelectItem>
                  <SelectItem value="healthcare">Healthcare & Pharmaceuticals</SelectItem>
                  <SelectItem value="technology">Technology & Software</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail & E-commerce</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="government">Government & Public Sector</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </fieldset>

          {/* Training Interests */}
          <fieldset className="space-y-4">
            <legend className="sr-only">Training Interests</legend>
            <h3 className="text-base font-medium flex items-center gap-2 text-gray-900">
              <Users className="w-4 h-4 text-gray-600" aria-hidden="true" />
              {t("brochure.training_interests_title")}
            </h3>
            
            <div className="space-y-2">
              <Label 
                htmlFor="specificInterests" 
                className="text-sm font-medium text-gray-900"
              >
                Specific Areas of Interest <span className="text-gray-600">(Optional)</span>
              </Label>
              <Textarea
                id="specificInterests"
                name="specificInterests"
                value={formData.specificInterests}
                onChange={(e) => handleInputChange("specificInterests", e.target.value)}
                placeholder={t("brochure.interests_placeholder")}
                rows={3}
                className="min-h-[5rem] px-3 py-2 text-base resize-y focus:ring-2 focus:ring-primary focus:border-primary"
                aria-describedby="interests-help"
              />
              <p id="interests-help" className="text-xs text-gray-600">
                Help us tailor the brochure content to your team's specific needs and challenges.
              </p>
            </div>
          </fieldset>

          {/* Submit Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 text-base font-medium focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Cancel and close modal"
            >
              {t("brochure.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 text-base font-medium gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-describedby={isSubmitting ? "submit-status" : undefined}
            >
              {isSubmitting ? (
                <>
                  <div 
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" 
                    aria-hidden="true"
                  />
                  <span id="submit-status">Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Send Brochure
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="text-xs text-gray-600 text-center pt-4 border-t border-gray-200 leading-relaxed">
          <p className="max-w-prose mx-auto">
            By submitting this form, you agree to receive communications from AI Workshop Switzerland. 
            We respect your privacy and will never share your information with third parties.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}