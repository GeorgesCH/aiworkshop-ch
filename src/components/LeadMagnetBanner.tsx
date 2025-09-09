import { Button } from "./ui/button";
import { Brain, Clock, ArrowRight } from "lucide-react";

interface LeadMagnetBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  onClick?: () => void;
  className?: string;
}

export function LeadMagnetBanner({ 
  title = "Ready to Test Your AI Knowledge?",
  description = "Take our free 10-minute assessment to discover AI opportunities",
  ctaText = "Start Free Assessment",
  onClick,
  className = ""
}: LeadMagnetBannerProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium mb-1">{title}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {description}
                  </div>
                </div>
              </div>
              <Button onClick={onClick} className="gap-2 shrink-0">
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}