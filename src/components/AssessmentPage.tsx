import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  ArrowLeft, 
  Brain,
  Clock,
  CheckCircle,
  ArrowRight,
  Target,
  Lightbulb,
  Users,
  BarChart3,
  Calendar,
  Mail,
  User
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import { useAnalytics, useFormAnalytics } from "../hooks/useAnalytics";
import { trackAssessment } from "../utils/analytics";
// Remove WorkshopBookingModal import as we now use routing
import { submitExerciseResponse, ExerciseSubmissionData, submitContactForm, ContactFormData } from "../utils/firebaseApi";
import { getSessionId } from "../utils/exerciseApi";

interface AssessmentPageProps {
  onBackToHome?: () => void;
  onPageChange?: (page: string) => void;
}

interface Question {
  id: string;
  titleKey: string;
  descriptionKey: string;
  options: { id: string; textKey: string; value: number }[];
  category: "awareness" | "tools" | "strategy" | "readiness";
}

const assessmentQuestions: Question[] = [
  {
    id: "ai_awareness",
    titleKey: "assessment.questions.ai_awareness.title",
    descriptionKey: "assessment.questions.ai_awareness.description",
    category: "awareness",
    options: [
      { id: "none", textKey: "assessment.questions.ai_awareness.options.none", value: 1 },
      { id: "basic", textKey: "assessment.questions.ai_awareness.options.basic", value: 2 },
      { id: "good", textKey: "assessment.questions.ai_awareness.options.good", value: 3 },
      { id: "expert", textKey: "assessment.questions.ai_awareness.options.expert", value: 4 }
    ]
  },
  {
    id: "current_tools",
    titleKey: "assessment.questions.current_tools.title", 
    descriptionKey: "assessment.questions.current_tools.description",
    category: "tools",
    options: [
      { id: "none", textKey: "assessment.questions.current_tools.options.none", value: 1 },
      { id: "chatgpt", textKey: "assessment.questions.current_tools.options.chatgpt", value: 2 },
      { id: "multiple", textKey: "assessment.questions.current_tools.options.multiple", value: 3 },
      { id: "advanced", textKey: "assessment.questions.current_tools.options.advanced", value: 4 }
    ]
  },
  {
    id: "business_goals",
    titleKey: "assessment.questions.business_goals.title",
    descriptionKey: "assessment.questions.business_goals.description", 
    category: "strategy",
    options: [
      { id: "unclear", textKey: "assessment.questions.business_goals.options.unclear", value: 1 },
      { id: "exploring", textKey: "assessment.questions.business_goals.options.exploring", value: 2 },
      { id: "defined", textKey: "assessment.questions.business_goals.options.defined", value: 3 },
      { id: "strategic", textKey: "assessment.questions.business_goals.options.strategic", value: 4 }
    ]
  },
  {
    id: "team_readiness",
    titleKey: "assessment.questions.team_readiness.title",
    descriptionKey: "assessment.questions.team_readiness.description",
    category: "readiness", 
    options: [
      { id: "resistant", textKey: "assessment.questions.team_readiness.options.resistant", value: 1 },
      { id: "curious", textKey: "assessment.questions.team_readiness.options.curious", value: 2 },
      { id: "ready", textKey: "assessment.questions.team_readiness.options.ready", value: 3 },
      { id: "eager", textKey: "assessment.questions.team_readiness.options.eager", value: 4 }
    ]
  },
  {
    id: "implementation_timeline",
    titleKey: "assessment.questions.implementation_timeline.title",
    descriptionKey: "assessment.questions.implementation_timeline.description",
    category: "strategy",
    options: [
      { id: "no_plans", textKey: "assessment.questions.implementation_timeline.options.no_plans", value: 1 },
      { id: "exploring", textKey: "assessment.questions.implementation_timeline.options.exploring", value: 2 },
      { id: "six_months", textKey: "assessment.questions.implementation_timeline.options.six_months", value: 3 },
      { id: "immediate", textKey: "assessment.questions.implementation_timeline.options.immediate", value: 4 }
    ]
  }
];

export function AssessmentPage({ onBackToHome, onPageChange }: AssessmentPageProps) {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  // Removed booking modal state as we now use routing
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureData, setLeadCaptureData] = useState({
    name: "",
    email: "",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentStartTime] = useState(Date.now());
  
  const { trackClick, trackConversion } = useAnalytics({ page: 'assessment' });
  const { trackFormStart, trackFormComplete, trackFormAbandon, trackFieldFocus, trackFieldBlur } = useFormAnalytics('assessment-lead-capture', 'assessment');

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const isComplete = Object.keys(answers).length === assessmentQuestions.length;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Track question answered
    trackAssessment('question_answered', currentQuestion + 1);
    
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Assessment complete - show lead capture first
      trackAssessment('completed');
      setTimeout(() => setShowLeadCapture(true), 500);
    }
  };

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = assessmentQuestions.length * 4;
    return Math.round((total / maxScore) * 100);
  };

  const getRecommendation = (score: number) => {
    if (score >= 80) return "advanced";
    if (score >= 60) return "intermediate";
    if (score >= 40) return "beginner";
    return "starter";
  };

  const resetAssessment = () => {
    trackClick('reset-assessment', 'assessment-page');
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShowLeadCapture(false);
    setLeadCaptureData({ name: "", email: "", company: "" });
  };

  // Track assessment start
  useEffect(() => {
    trackAssessment('started');
  }, []);

  const handleLeadCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!leadCaptureData.name.trim() || !leadCaptureData.email.trim()) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    setIsSubmitting(true);
    trackFormComplete();

    try {
      const timeSpentMinutes = Math.round((Date.now() - assessmentStartTime) / 60000);
      
      // Prepare assessment data for exercise API
      const exerciseData: ExerciseSubmissionData = {
        exercise_type: 'assessment',
        responses: answers,
        email: leadCaptureData.email.trim().toLowerCase(),
        completion_status: 'completed',
        time_spent_minutes: timeSpentMinutes,
        user_session_id: getSessionId()
      };

      // Submit assessment using exercise API
      const response = await submitExerciseResponse(exerciseData);
      
      if (response.success) {
        // Also create a contact submission for CRM tracking
        try {
          const contactData: ContactFormData = {
            name: leadCaptureData.name.trim(),
            email: leadCaptureData.email.trim().toLowerCase(),
            company: leadCaptureData.company?.trim() || undefined,
            message: `AI Readiness Assessment completed. Score: ${calculateScore()}/20. Time spent: ${timeSpentMinutes} minutes.`,
            form_type: 'assessment'
          };
          
          await submitContactForm(contactData);
        } catch (contactError) {
          console.warn('Failed to create contact submission:', contactError);
          // Don't fail the assessment if contact submission fails
        }
        
        // Success handling
        toast.success("Assessment submitted successfully!", {
          description: "Thank you for completing our AI readiness assessment.",
          duration: 6000,
        });
        
        // Show results
        setShowLeadCapture(false);
        setShowResults(true);
        
        console.log('Assessment submitted successfully:', {
          name: leadCaptureData.name,
          email: exerciseData.email,
          company: leadCaptureData.company,
          score: calculateScore(),
          time_spent: timeSpentMinutes,
          total_questions: assessmentQuestions.length
        });
      } else {
        const errorMsg = response.error || response.message || "An error occurred while submitting your assessment.";
        toast.error(errorMsg);
      }
      
    } catch (error) {
      console.error('Assessment submission error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipLeadCapture = () => {
    setShowLeadCapture(false);
    setShowResults(true);
  };

  // Lead capture form
  if (showLeadCapture) {
    return (
      <div className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {onBackToHome && (
                <Button 
                  variant="ghost" 
                  onClick={onBackToHome}
                  className="mb-8 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("assessment.back_to_home")}
                </Button>
              )}

              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                      Assessment Complete!
                    </h1>
                    <p className="text-gray-600">
                      Get your personalized AI readiness results and recommendations.
                    </p>
                  </div>

                  <form onSubmit={handleLeadCaptureSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={leadCaptureData.name}
                        onChange={(e) => setLeadCaptureData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={leadCaptureData.email}
                        onChange={(e) => setLeadCaptureData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email address"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company (Optional)
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={leadCaptureData.company}
                        onChange={(e) => setLeadCaptureData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Enter your company name"
                        className="mt-2"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Get My Results
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={skipLeadCapture}
                        disabled={isSubmitting}
                      >
                        Skip for Now
                      </Button>
                    </div>
                  </form>

                  <p className="text-xs text-gray-600 text-center mt-6">
                    We'll use your information to send you your assessment results and relevant AI insights. 
                    We respect your privacy and won't spam you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const recommendation = getRecommendation(score);
    
    return (
      <div className="min-h-screen bg-white">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {onBackToHome && (
                <Button 
                  variant="ghost" 
                  onClick={onBackToHome}
                  className="mb-8 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("assessment.back_to_home")}
                </Button>
              )}

              {/* Results Header */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {t("assessment.results.title")}
                </h1>
                <p className="text-xl text-gray-600">
                  {t("assessment.results.subtitle")}
                </p>
              </div>

              {/* Score Display */}
              <Card className="mb-8">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
                    <div className="text-lg text-gray-600">
                      {t(`assessment.results.score_levels.${recommendation}.title`)}
                    </div>
                  </div>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {t(`assessment.results.score_levels.${recommendation}.description`)}
                  </p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold">{t("assessment.results.recommended_next_steps")}</h3>
                    </div>
                    <ul className="space-y-3">
                      {[1, 2, 3].map(num => (
                        <li key={num} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600">
                            {t(`assessment.results.score_levels.${recommendation}.steps.${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold">{t("assessment.results.suggested_courses")}</h3>
                    </div>
                    <div className="space-y-3">
                      {recommendation === "starter" && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          {t("course.ai_fundamentals.title")}
                        </Button>
                      )}
                      {recommendation === "beginner" && (
                        <>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("course.ai_fundamentals.title")}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("course.generative_ai.title")}
                          </Button>
                        </>
                      )}
                      {(recommendation === "intermediate" || recommendation === "advanced") && (
                        <>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("course.ai_business_intelligence.title")}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("course.agentic_ai.title")}
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Section */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">{t("assessment.results.ready_to_start")}</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    {t("assessment.results.book_consultation")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="gap-2"
                      onClick={() => onPageChange && onPageChange("workshop-booking")}
                    >
                      <Calendar className="w-4 h-4" />
                      {t("assessment.results.book_workshop")}
                    </Button>
                    <Button variant="outline" size="lg" onClick={resetAssessment}>
                      {t("assessment.results.retake_assessment")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Removed Workshop Booking Modal - now uses routing */}
      </div>
    );
  }

  const currentQ = assessmentQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {onBackToHome && (
              <Button 
                variant="ghost" 
                onClick={onBackToHome}
                className="mb-8 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("assessment.back_to_home")}
              </Button>
            )}
            
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                <Brain className="w-4 h-4 mr-2" />
                {t("assessment.page_badge")}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {t("assessment.page_title")}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t("assessment.page_subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">
                  {t("assessment.question")} {currentQuestion + 1} {t("assessment.of")} {assessmentQuestions.length}
                </span>
                <span className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {t("assessment.estimated_time")}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Question */}
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">
                      {t(currentQ.titleKey)}
                    </h2>
                    <p className="text-gray-600">
                      {t(currentQ.descriptionKey)}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {currentQ.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className="p-6 h-auto justify-start text-left hover:border-primary hover:bg-primary/5"
                        onClick={() => handleAnswer(currentQ.id, option.value)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <span className="text-sm font-medium">{String.fromCharCode(65 + currentQ.options.indexOf(option))}</span>
                          </div>
                          <span className="flex-1">{t(option.textKey)}</span>
                          <ArrowRight className="w-4 h-4 text-gray-600" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("assessment.previous")}
              </Button>

              <div className="text-sm text-gray-600">
                {Object.keys(answers).length} / {assessmentQuestions.length} {t("assessment.completed")}
              </div>

              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(prev => Math.min(assessmentQuestions.length - 1, prev + 1))}
                disabled={currentQuestion === assessmentQuestions.length - 1}
                className="gap-2"
              >
                {t("assessment.next")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
