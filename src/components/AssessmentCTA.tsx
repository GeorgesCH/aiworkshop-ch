import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface AssessmentCTAProps {
  title?: string;
  description?: string;
  exerciseId?: string;
  variant?: "compact" | "card" | "banner";
  className?: string;
  onTakeAssessment?: (exerciseId: string) => void;
}

export function AssessmentCTA({
  title,
  description,
  exerciseId = "ai-tasks",
  variant = "card",
  className = "",
  onTakeAssessment
}: AssessmentCTAProps) {
  const { t } = useLanguage();

  const assessmentTitle = title || t("assessment.title");
  const assessmentDescription = description || t("assessment.description");

  const handleClick = () => {
    if (onTakeAssessment) {
      onTakeAssessment(exerciseId);
    }
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{t("assessment.free_assessment")}</div>
          <div className="text-xs text-gray-600">{t("assessment.minutes")}</div>
        </div>
        <Button size="sm" variant="outline" onClick={handleClick} className="gap-1">
          {t("assessment.start")}
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm sm:text-base">{assessmentTitle}</div>
              <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {t("assessment.minutes_free")}
              </div>
            </div>
          </div>
          <Button size="sm" onClick={handleClick} className="gap-2 shrink-0 self-start sm:self-auto">
            {t("assessment.take_assessment")}
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">{assessmentTitle}</h3>
                <Badge variant="secondary" className="text-xs">{t("common.free_consultation")}</Badge>
              </div>
              <p className="text-sm text-gray-600">{assessmentDescription}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                {t("assessment.minutes")}
              </div>
              <Button size="sm" onClick={handleClick} className="gap-2">
                {t("assessment.start_assessment")}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
