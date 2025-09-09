import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mail, Phone, MapPin, Calendar, Send, MessageCircle, ArrowLeft, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { useScrollToTop } from "../utils/useScrollToTop";
import { submitContactForm, ContactFormData } from "../utils/supabaseApi";

interface ContactPageProps {
  onBackToHome: () => void;
}

export function ContactPage({ onBackToHome }: ContactPageProps) {
  const { t } = useLanguage();
  useScrollToTop();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    service: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Client-side validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("contact.error_name_required") || "Name is required";
    } else if (formData.name.trim().length > 255) {
      newErrors.name = t("contact.error_name_too_long") || "Name must be less than 255 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("contact.error_email_required") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.error_email_invalid") || "Please enter a valid email address";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t("contact.error_message_required") || "Message is required";
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = t("contact.error_message_too_long") || "Message must be less than 5000 characters";
    }

    // Optional field length validations
    if (formData.company && formData.company.length > 255) {
      newErrors.company = t("contact.error_company_too_long") || "Company name must be less than 255 characters";
    }
    if (formData.phone && formData.phone.length > 50) {
      newErrors.phone = t("contact.error_phone_too_long") || "Phone number must be less than 50 characters";
    }
    if (formData.service && formData.service.length > 255) {
      newErrors.service = t("contact.error_service_too_long") || "Service selection is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize and prepare data for API call
      const contactData: ContactFormData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        message: formData.message.trim(),
        service: formData.service?.trim() || undefined,
        form_type: 'contact_page'
      };

      // Submit contact form using Supabase API
      const response = await submitContactForm(contactData);
      
      if (response.success) {
        // Success handling
        toast.success(t("contact.form_success_alert") || "Thank you for your message! We'll get back to you within 24 hours.", {
          description: "We'll respond to your inquiry as quickly as possible.",
          duration: 6000,
        });
        
        setSubmitStatus('success');
        setSubmitMessage(t("contact.form_success_alert") || "Thank you for your message! We'll get back to you within 24 hours.");
        setFormData({ name: "", email: "", company: "", phone: "", message: "", service: "" });
        setErrors({});
        
        console.log('Contact form submitted successfully:', {
          email: contactData.email,
          form_type: contactData.form_type,
          has_company: !!contactData.company,
          has_phone: !!contactData.phone,
          service: contactData.service
        });
      } else {
        // Handle API errors
        const errorMsg = response.error || response.message || "An error occurred while submitting your message.";
        toast.error(errorMsg);
        setSubmitMessage(errorMsg);
        setSubmitStatus('error');
      }
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      
      // Fallback for unexpected errors
      const fallbackMsg = "An unexpected error occurred. Please try again or contact us directly.";
      toast.error(fallbackMsg);
      setSubmitMessage(fallbackMsg);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Clear submit message when user makes changes
    if (submitMessage) {
      setSubmitMessage('');
      setSubmitStatus('idle');
    }
  };

  const services = [
    "AI Fundamentals (CHF 350)",
    "AI for Business Intelligence (CHF 470)", 
    "Generative AI for Business (CHF 850)",
    "Custom Training Program",
    "Consultation Only"
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={onBackToHome}
              className="gap-2 mb-8 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("contact.back_to_home")}
            </Button>
          </div>

          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
                {t("contact.page_title")}
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              {t("contact.page_subtitle")}
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <Card className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 rounded-2xl flex items-center justify-center transition-all duration-300">
                          <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-base lg:text-lg">{t("contact.email_label")}</h3>
                          <a href="mailto:hello@aiworkshop.ch" className="text-primary hover:opacity-70 transition-opacity text-sm lg:text-base font-medium">
                            hello@aiworkshop.ch
                          </a>
                          <p className="text-xs lg:text-sm text-gray-600 mt-2">
                            {t("contact.response_hours")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 rounded-2xl flex items-center justify-center transition-all duration-300">
                          <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-base lg:text-lg">{t("contact.phone_label")}</h3>
                          <a href="tel:+41768184677" className="text-primary hover:opacity-70 transition-opacity text-sm lg:text-base font-medium">
                            +41 76 818 46 77
                          </a>
                          <p className="text-xs lg:text-sm text-gray-600 mt-2">
                            {t("contact.available_hours")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 rounded-2xl flex items-center justify-center transition-all duration-300">
                          <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-base lg:text-lg">{t("contact.location_label")}</h3>
                          <p className="text-sm lg:text-base text-gray-600">
                            {t("contact.location_desc")}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-600 mt-2">
                            {t("contact.location_coverage")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 rounded-2xl flex items-center justify-center transition-all duration-300">
                          <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-base lg:text-lg">{t("contact.response_time_label")}</h3>
                          <p className="text-sm lg:text-base text-gray-600">
                            {t("contact.response_time_value")}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-600 mt-2">
                            {t("contact.response_time_desc")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 rounded-xl flex items-center justify-center transition-all duration-300">
                        <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">{t("contact.consultation_badge")}</Badge>
                    </div>
                    <h3 className="font-semibold mb-3 text-base lg:text-lg">{t("contact.consultation_full_title")}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                      {t("contact.consultation_full_desc")}
                    </p>
                    <Button 
                      className="w-full gap-3 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                      onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
                    >
                      <Calendar className="w-4 h-4" />
                      {t("contact.consultation_schedule_btn")}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="p-6 lg:p-8 pb-0">
                  <CardTitle className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">{t("contact.form_title")}</CardTitle>
                  <p className="text-gray-600 mt-2 text-sm lg:text-base">
                    {t("contact.form_description")}
                  </p>
                </CardHeader>
                <CardContent className="p-6 lg:p-8">
                  {/* Submit Status Message */}
                  {submitMessage && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border transition-all duration-300 ${
                      submitStatus === 'success' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-600' 
                        : 'bg-red-500/10 border-red-500/20 text-red-600'
                    }`}>
                      {submitStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">{submitMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold mb-3 text-gray-900">
                          {t("contact.form_name_label")} *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t("contact.form_name_placeholder")}
                          className={`py-3 px-4 rounded-2xl border border-gray-200/60 focus:border-primary transition-all duration-300 ${
                            errors.name ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                          required
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-3 text-gray-900">
                          {t("contact.form_email_label")} *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t("contact.form_email_placeholder")}
                          className={`py-3 px-4 rounded-2xl border border-gray-200/60 focus:border-primary transition-all duration-300 ${
                            errors.email ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                          required
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label htmlFor="company" className="block text-sm font-semibold mb-3 text-gray-900">
                          {t("contact.form_company_label")}
                        </label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder={t("contact.form_company_placeholder")}
                          className={`py-3 px-4 rounded-2xl border border-gray-200/60 focus:border-primary transition-all duration-300 ${
                            errors.company ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                        {errors.company && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {errors.company}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold mb-3 text-gray-900">
                          {t("contact.form_phone_label")}
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t("contact.form_phone_placeholder")}
                          className={`py-3 px-4 rounded-2xl border border-gray-200/60 focus:border-primary transition-all duration-300 ${
                            errors.phone ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-semibold mb-3 text-gray-900">
                        {t("contact.form_service_label")}
                      </label>
                      <Select value={formData.service} onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, service: value }));
                        if (errors.service) {
                          setErrors(prev => ({ ...prev, service: '' }));
                        }
                      }}>
                        <SelectTrigger className={`py-3 px-4 rounded-2xl border border-gray-200/60 focus:border-primary transition-all duration-300 ${
                          errors.service ? 'border-red-500 focus:border-red-500' : ''
                        }`}>
                          <SelectValue placeholder={t("contact.form_service_placeholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.service && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.service}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold mb-3 text-gray-900">
                        {t("contact.form_message_label")} *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("contact.form_message_placeholder")}
                        rows={6}
                        className={`py-3 px-4 rounded-2xl border border-gray-200/60 focus:border-primary transition-all duration-300 ${
                          errors.message ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full group gap-3 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        {isSubmitting ? (t("contact.form_sending") || "Sending...") : t("contact.form_submit")}
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                      
                      <p className="text-xs text-gray-600 text-center">
                        {t("contact.form_privacy_notice")}
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
                {t("contact.quick_contact_title")}
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
              {t("contact.quick_contact_desc")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="group gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <a href="tel:+41768184677" aria-label="Call us at +41 76 818 46 77">
                  <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {t("contact.call_now")}
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="group gap-3 px-8 py-4 border border-gray-200/60 hover:border-primary/30 transition-all duration-300 hover:scale-105"
              >
                <a href="mailto:hello@aiworkshop.ch" aria-label="Email us at hello@aiworkshop.ch">
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {t("contact.email_direct")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
