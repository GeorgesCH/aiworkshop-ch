import { useState } from "react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Minus, Plus } from "lucide-react";
// Remove WorkshopBookingModal import as we now use routing
import { useLanguage } from "./LanguageProvider";
import { CircuitBackground } from "./BrandMotif";

const workshops = [
  { id: "ai-fundamentals", price: 350, advanced: false, featureCount: 6 },
  { id: "ai-for-business", price: 470, advanced: false, featureCount: 7 },
  { id: "generative-ai", price: 850, advanced: false, featureCount: 6 },
  { id: "agentic-ai", price: 980, advanced: true, featureCount: 8, badgeNew: true }
];

interface WorkshopsSectionProps {
  onPageChange?: (page: string) => void;
}

export function WorkshopsSection({ onPageChange }: WorkshopsSectionProps = {}) {
  const [participants, setParticipants] = useState([4, 4, 4, 4]);
  const setupCost = 300;
  const { t } = useLanguage();

  const updateParticipants = (index: number, change: number) => {
    const newParticipants = [...participants];
    newParticipants[index] = Math.max(1, newParticipants[index] + change);
    setParticipants(newParticipants);
  };

  const handleBookNow = (workshopId: string) => {
    if (onPageChange) {
      onPageChange("workshop-booking");
    }
  };

  return (
    <section id="pricing" className="py-16 lg:py-24">
      <div className="panel-container">
        <div className="panel-block p-8 lg:p-12 relative overflow-hidden brand-diagonal-mask">
          {/* Requested dotted background pattern */}
          <div className="hero-dotted-bg" aria-hidden />
          {/* Brand circuit motif background */}
          <CircuitBackground className="text-primary" opacity={0.10} />
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="font-sigum text-3xl lg:text-4xl font-semibold mb-6 tracking-tight">
            {t('workshops.section_title')}
          </h2>
          <p className="subheading max-w-3xl mx-auto">
            {t('workshops.section_subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {workshops.map((workshop, index) => {
            const subtotal = participants[index] * workshop.price;
            const total = subtotal + setupCost;

            return (
              <Card key={index} className={`card-apple apple-hover fade-in-up relative overflow-hidden ${workshop.advanced ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10' : ''} ${index === 0 ? 'stagger-1' : index === 1 ? 'stagger-2' : index === 2 ? 'stagger-3' : 'stagger-4'}`}>
                {workshop.badgeNew && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-apple-sm">
                      {t('header.new')}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className={`text-xl font-semibold tracking-tight ${workshop.advanced ? 'text-primary' : ''}`}>
                    {t(`workshops.${workshop.id.replace(/-/g, '_')}.title`)}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-2xl font-semibold ${workshop.advanced ? 'text-primary' : ''}`}>
                        CHF {workshop.price}
                      </span>
                      <span className="text-muted-foreground text-sm">{t('workshops.per_person')}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(workshop.advanced ? 'workshops.duration_4h_advanced' : 'workshops.duration_4h')}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Participants Calculator */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">{t('workshops.number_of_participants')}</div>
                    <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateParticipants(index, -1)}
                        disabled={participants[index] <= 1}
                        className="apple-transition hover:bg-white/50"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold text-lg">{participants[index]}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateParticipants(index, 1)}
                        className="apple-transition hover:bg-white/50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Cost Breakdown */}
                    <div className="space-y-2 text-sm bg-secondary/20 rounded-xl p-4">
                      <div className="flex justify-between">
                        <span>{participants[index]} {participants[index] === 1 ? t('workshops.participant') : t('workshops.participants')} × CHF {workshop.price}</span>
                        <span className="font-medium">CHF {subtotal.toLocaleString('en-US')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('workshops.setup_costs')}</span>
                        <span>CHF {setupCost}</span>
                      </div>
                      <div className="border-t border-border/30 pt-2 flex justify-between font-semibold">
                        <span>{t('workshops.total')}</span>
                        <span>CHF {total.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`workshops.${workshop.id.replace(/-/g, '_')}.description`)}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 text-sm">
                    {Array.from({ length: workshop.featureCount }).map((_, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed">{t(`workshops.${workshop.id.replace(/-/g, '_')}.feature_${featureIndex + 1}`)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2">
                    <Button 
                      className="w-full btn-apple"
                      onClick={() => handleBookNow(workshop.id)}
                    >
                      {t('workshops.book_now')}
                    </Button>
                    <p className="text-xs text-gray-600 text-center">
                      {t('booking.no_credit_card_required')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 space-y-6 fade-in-up">
          <p className="text-gray-600 text-base">
            {t('workshops.footer_note')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-gray-600">{t('workshops.questions')}</span>
            <Button 
              variant="outline" 
              className="btn-apple-secondary"
              onClick={() => {
                if (onPageChange) {
                  onPageChange('contact');
                } else {
                  // Fallback for when onPageChange is not available
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/contact';
                  }
                }
              }}
            >
              {t('nav.contact')}
            </Button>
            <span className="text-gray-600">•</span>
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors" 
              onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
            >
              {t('common.free_consultation')}
            </Badge>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
