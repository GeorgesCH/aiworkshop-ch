import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { TrendingUp, Users, Building2, Award, MapPin, Calendar } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
// Use optimized image from public folder
const businessIntelligenceImage = "/optimized/aiworkshop-business-intelligence-training-optimized.webp";

const stats = [
  {
    icon: Users,
    value: "500+",
    labelKey: "stats.professionals_trained",
    descriptionKey: "stats.professionals_description",
    color: "text-blue-600"
  },
  {
    icon: Building2,
    value: "50+",
    labelKey: "stats.companies_served",
    descriptionKey: "stats.companies_description",
    color: "text-green-600"
  },
  {
    icon: Award,
    value: "5.0",
    labelKey: "stats.google_rating",
    descriptionKey: "stats.rating_description",
    color: "text-yellow-600"
  },
  {
    icon: MapPin,
    value: "5",
    labelKey: "stats.cities_covered",
    descriptionKey: "stats.cities_description",
    color: "text-purple-600"
  },
  {
    icon: Calendar,
    value: "8+",
    labelKey: "stats.years_experience",
    descriptionKey: "stats.in_ai_innovation",
    color: "text-orange-600"
  },
  {
    icon: TrendingUp,
    value: "95%",
    labelKey: "stats.workshops_delivered",
    descriptionKey: "stats.workshops_description",
    color: "text-red-600"
  }
];

export function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Visual Content */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-apple"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative w-full">
                  <ImageWithFallback
                    src={businessIntelligenceImage}
                    alt={t("stats.image_alt")}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Overlay Text */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <Badge variant="secondary" className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-white text-xs">
                      {t("stats.proven_results")}
                    </Badge>
                    <h3 className="text-white text-lg font-semibold leading-tight drop-shadow-lg">
                      {t("stats.measurable_impact")}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Floating Achievement Card */}
              <div className="absolute -bottom-6 -right-6 hidden lg:block z-20">
                <Card className="relative overflow-hidden border border-border/60 shadow-2xl bg-background/90 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <CardContent className="relative p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">100%</div>
                    <div className="text-sm text-muted-foreground">{t("stats.satisfaction")}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-transparent">
                  {t("stats.our_impact")}
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {t("stats.trusted_by_professionals")}
                  </span>
                </h2>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  {t("stats.track_record")}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="group relative overflow-hidden border border-border/60 shadow-lg hover:shadow-2xl transition-all duration-apple hover:scale-[1.02] bg-background/90 backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{stat.value}</div>
                            <div className="font-medium text-sm text-foreground">{stat.labelKey ? t(stat.labelKey) : stat.label}</div>
                            <div className="text-xs text-muted-foreground">{stat.descriptionKey ? t(stat.descriptionKey) : stat.description}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="relative group p-6 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-apple"></div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">{t("stats.ready_to_join")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("stats.start_journey")}
                    </p>
                  </div>
                  <button
                    onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
                    className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10">{t("stats.get_started")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
