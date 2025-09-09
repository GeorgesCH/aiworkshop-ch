import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mail, Phone, MapPin, Calendar, Send, MessageCircle, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { submitContactForm, ContactFormData } from "../utils/supabaseApi";
import React from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const { t } = useLanguage();

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
        message: formData.message.trim(),
        form_type: 'contact_section'
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
        setFormData({ name: "", email: "", company: "", message: "" });
        setErrors({});
        
        console.log('Contact form submitted successfully:', {
          email: contactData.email,
          form_type: contactData.form_type,
          has_company: !!contactData.company
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return (
    <section id="contact" className="section-apple">
      <div className="panel-container">
        <div className="panel-block p-8 lg:p-12">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4 leading-tight">
            {t("contact.section_title")}
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("contact.section_subtitle")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-apple-12 lg:gap-apple-16 xl:gap-apple-20">
            {/* Contact Information */}
            <div className="flex flex-col gap-apple-12">
              <div className="flex flex-col gap-apple-8">
                <Card className="glass-effect border-border/30">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-apple-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-lg">{t("contact.email_label")}</h4>
                        <a href="mailto:hello@aiworkshop.ch" className="text-primary hover:opacity-70 transition-opacity text-base">
                          hello@aiworkshop.ch
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/30">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-apple-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-lg">{t("contact.phone_label")}</h4>
                        <a href="tel:+41768184677" className="text-primary hover:opacity-70 transition-opacity text-base">
                          +41 76 818 46 77
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-border/30">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-apple-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-lg">{t("contact.location_label")}</h4>
                        <p className="text-base text-gray-600">
                          {t("footer.location")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="panel-block p-8">
                <div className="flex items-center gap-apple-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">{t("nav.book_consultation")}</Badge>
                </div>
                <h4 className="font-medium mb-3 text-lg">{t("contact.consultation_title")}</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t("contact.consultation_desc")}
                </p>
                <Button className="w-full gap-apple-3 py-3 rounded-xl" onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}>
                  <Calendar className="w-4 h-4" />
                  {t("contact.consultation_cta")}
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="glass-effect border-gray-200/30">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-2xl font-medium">{t("contact.form_title")}</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Submit Status Message */}
                {submitMessage && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-apple-3 ${
                    submitStatus === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    {submitStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{submitMessage}</span>
                  </div>
                )}

                <Card className="bg-white/50 backdrop-blur-sm border-gray-200/30 shadow-sm">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900/90">
                          {t("contact.form_name_label")} <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full bg-white/80 border-gray-200/50 focus:border-primary/70 ${errors.name ? 'border-destructive' : ''}`}
                            placeholder={t("contact.form_name_placeholder")}
                          />
                          {errors.name && (
                            <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                          )}
                        </div>
                        {errors.name && (
                          <p className="mt-2 text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900/90">
                          {t("contact.form_email_label")} <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-white/80 border-gray-200/50 focus:border-primary/70 ${errors.email ? 'border-destructive' : ''}`}
                            placeholder={t("contact.form_email_placeholder")}
                          />
                          {errors.email && (
                            <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                          )}
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-900/90">
                          {t("contact.form_company_label")}
                        </label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          className={`w-full bg-white/80 border-gray-200/50 focus:border-primary/70 ${errors.company ? 'border-destructive' : ''}`}
                          placeholder={t("contact.form_company_placeholder")}
                        />
                        {errors.company && (
                          <p className="mt-2 text-sm text-destructive">{errors.company}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-900/90">
                          {t("contact.form_message_label")} <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className={`w-full bg-white/80 border-gray-200/50 focus:border-primary/70 ${errors.message ? 'border-destructive' : ''}`}
                          placeholder={t("contact.form_message_placeholder")}
                          rows={6}
                        />
                        {errors.message && (
                          <p className="mt-2 text-sm text-destructive">{errors.message}</p>
                        )}
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full group gap-apple-3 py-3 rounded-xl">
                        <MessageCircle className="w-4 h-4" />
                        {isSubmitting ? (t("contact.form_sending") || "Sending...") : t("contact.form_submit")}
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                {/* End inner form card */}
                
              </CardContent>{/* outer CardContent */}
            </Card>{/* outer Card */}
        </div>{/* grid end */}
      </div>{/* max-w container end */}
    </div>{/* panel-block end */}
  </div>{/* panel-container end */}
  </section>
  );
}
