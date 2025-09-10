import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, Check, ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const testimonials = [
  {
    name: "Laura Tintoré Vidal",
    role: "Medical Doctor",
    company: "Unisanté", 
    rating: 5,
    text: "Très didactique! J'ai beaucoup aimé ce workshop! La formation était claire et pratique.",
    verified: true
  },
  {
    name: "Sergio Guadamillas",
    role: "Planning Manager", 
    company: "BOBST",
    rating: 5,
    text: "Fait AI intro WS avec George. Bon overview et explications. Je recommande pour comprendre que est que c'est AI.",
    verified: true
  },
  {
    name: "Iulia Calota",
    role: "Teaching Assistant",
    company: "EHL Ecole Hôtelière Lausanne",
    rating: 5,
    text: "C'était un workshop très instructif ! Je comprends mieux le système qui sous-tend l'IA. Les explications étaient claires et précises.",
    verified: true
  },
  {
    name: "Fabiola Celletti",
    role: "Marketing Strategy",
    company: "Philip Morris International",
    rating: 5,
    text: "L'atelier sur l'IA était vraiment bien. Les sessions étaient claires et très utiles, avec de bons exemples pratiques.",
    verified: true
  },
  {
    name: "Christophe Tharin", 
    role: "Product Owner",
    company: "Otis Elevator Co.",
    rating: 5,
    text: "Bravo à George pour sa passion dans ce domaine! Formation très enrichissante et applicable immédiatement.",
    verified: true
  }
];

export function TestimonialsSection() {
  const { t } = useLanguage();
  return (
    <section className="section-apple">
      <div className="container-apple">
        <div className="text-center space-y-apple-4 sm:space-y-apple-6 mb-apple-8 sm:mb-apple-12">
          <div className="flex items-center justify-center gap-apple-2 mb-6">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="caption text-primary">{t('reviews.caption')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground px-2 sm:px-0">
            {t("testimonials.title")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            {t("testimonials.description")}
          </p>
        </div>

        {/* Google Reviews Header */}
        <div className="flex items-center justify-center gap-apple-4 mb-12 fade-in-up stagger-1">
          <div className="space-y-apple-3 sm:space-y-apple-4">
            {/* Rating Stars */}
            <div className="flex items-center justify-center sm:justify-start gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <span className="font-medium">{t('reviews.google')}</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-apple-6 sm:gap-apple-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={`card-apple apple-hover fade-in-up ${index === 0 ? 'stagger-2' : index === 1 ? 'stagger-3' : index === 2 ? 'stagger-4' : index === 3 ? 'stagger-5' : 'stagger-6'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-apple-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <div className="flex items-center gap-apple-2">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">{t('reviews.google')}</Badge>
                  </div>
                </div>
                {/* Testimonial Text */}
                <blockquote className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center sm:text-left">
                  "{testimonial.text}"
                </blockquote>

                <div className="flex flex-col gap-apple-2">
                  <h3 className="font-medium text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                  {testimonial.verified && (
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                      {t('reviews.verified')}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-apple-8 sm:mt-apple-12">
          <Button 
            asChild
            className="gap-2 min-h-[48px] px-6 w-full sm:w-auto"
          >
            <a 
              href="https://www.google.com/search?q=ai+workshop+switzerland+reviews" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t("testimonials.view_more")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
