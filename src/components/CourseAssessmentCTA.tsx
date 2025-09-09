import { useState } from "react";
import { AssessmentCTA } from "./AssessmentCTA";
// Remove WorkshopBookingModal import as we now use routing
import { Button } from "./ui/button";
import { Calendar, Target } from "lucide-react";

interface CourseAssessmentCTAProps {
  courseId: string;
  onPageChange?: (page: string) => void;
}

export function CourseAssessmentCTA({ courseId, onPageChange }: CourseAssessmentCTAProps) {
  // Removed booking modal state as we now use routing

  const assessmentConfig = {
    "ai-fundamentals": {
      title: "Test Your AI Readiness",
      description: "See where AI can help your work before attending the workshop",
      exerciseId: "ai-tasks"
    },
    "ai-business-intelligence": {
      title: "Assess Your Data Analysis Needs", 
      description: "Discover how AI can enhance your business intelligence workflows",
      exerciseId: "ai-tasks"
    },
    "generative-ai": {
      title: "Evaluate Your Creative AI Potential",
      description: "Find out which creative tasks AI could transform for your team",
      exerciseId: "ai-tasks"
    },
    "agentic-ai": {
      title: "Future-Proof Your AI Strategy",
      description: "Plan your AI roadmap with our strategic visioning exercise",
      exerciseId: "future-planning"
    }
  };

  const config = assessmentConfig[courseId as keyof typeof assessmentConfig] || assessmentConfig["ai-fundamentals"];

  return (
    <>
      <div className="my-16 space-y-8">
        <AssessmentCTA
          title={config.title}
          description={config.description}
          exerciseId={config.exerciseId}
          variant="banner"
          onTakeAssessment={(exerciseId) => onPageChange?.("assessment")}
          className="max-w-4xl mx-auto"
        />
        
        {/* Workshop Booking CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-8">
            <div className="relative z-10 text-center space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-primary">Ready to Book This Workshop?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Secure your spot in our AI training program. Our workshops fill up quickly, 
                  so reserve your place today and transform your team's AI capabilities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => onPageChange && onPageChange("workshop-booking")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Workshop Now
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onPageChange?.("assessment")}
                  className="px-8"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Take Assessment First
                </Button>
              </div>
              
              <p className="text-xs text-gray-600">
                Secure booking • Flexible dates • Money-back guarantee
              </p>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full transform -translate-x-12 translate-y-12" />
          </div>
        </div>
      </div>

      {/* Removed Workshop Booking Modal - now uses routing */}
    </>
  );
}