import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Shield,
  Users,
  Heart,
  Lightbulb,
  Volume2,
  Search,
  Brain,
  PlayCircle,
  Rocket,
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  Palette,
  Presentation,
  Target,
  MessageCircle,
  Zap
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const principles = [
  {
    icon: Shield,
    titleKey: "methodology.principle_confidential_title",
    descriptionKey: "methodology.principle_confidential_desc",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Heart,
    titleKey: "methodology.principle_personal_title",
    descriptionKey: "methodology.principle_personal_desc",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: Users,
    title: "Stay Respectful",
    description: "Listen and appreciate others' views. Kindness is our language.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Lightbulb,
    title: "Be Generative",
    description: "Let's grow ideas together! Think outside the box!",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  }
];

const learnerTypes = [
  {
    icon: Volume2,
    type: "Introverts",
    title: "Turn Up the Volume!",
    description: "Share your thoughts, and let's hear your voice!",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    icon: Search,
    type: "Extroverts", 
    title: "Tune Into Your Inner Detective",
    description: "Listen and ask questions to help others shine!",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export function WorkshopMethodologySection() {
  const { t } = useLanguage();

  return (
    <section className="section-apple" aria-labelledby="workshop-methodology-heading">
      <div className="container-apple">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="outline" className="px-4 py-1.5 border-primary/30 text-primary">
              {t("methodology.badge")}
            </Badge>
          </div>
          <h2 id="workshop-methodology-heading" className="heading-2 mb-4">
            {t("methodology.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("methodology.subtitle")}
          </p>
        </div>

        {/* Key Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border shadow-sm p-6 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-semibold">4</div>
              <div className="text-sm text-gray-600">{t('methodology.stats.hours')}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl font-semibold">12</div>
              <div className="text-sm text-gray-600">{t('methodology.stats.people_avg')}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-lg font-semibold">{t('methodology.stats.flexible')}</div>
              <div className="text-sm text-gray-600">{t('methodology.stats.location')}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-lg font-semibold">5</div>
              <div className="text-sm text-gray-600">{t('methodology.stats.cities')}</div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-16">
          <h3 className="heading-3 text-center mb-12">{t('methodology.principles_title')}</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">
                      {principle.titleKey ? t(principle.titleKey) : principle.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {principle.descriptionKey ? t(principle.descriptionKey) : principle.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Learning Styles */}
        <div>
          <h3 className="heading-3 text-center mb-12">{t('methodology.learning_styles_title')}</h3>
          
          <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {learnerTypes.map((learner, index) => {
              const IconComponent = learner.icon;
              const isIntrovert = index === 0;
              
              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${isIntrovert ? 'bg-indigo-50' : 'bg-orange-50'} flex items-center justify-center shrink-0`}>
                        <IconComponent className={`w-6 h-6 ${isIntrovert ? 'text-indigo-600' : 'text-orange-600'}`} />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Badge 
                            variant="secondary" 
                            className={`mb-2 ${isIntrovert ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}
                          >
                            {isIntrovert ? t('methodology.learners.introverts') : t('methodology.learners.extroverts')}
                          </Badge>
                          <h4 className="font-semibold">{isIntrovert ? t('methodology.learners.introverts_title') : t('methodology.learners.extroverts_title')}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {isIntrovert ? t('methodology.learners.introverts_desc') : t('methodology.learners.extroverts_desc')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
