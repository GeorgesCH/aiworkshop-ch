import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Home, Search, Mail } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface NotFoundPageProps {
  onBackToHome: () => void;
}

export function NotFoundPage({ onBackToHome }: NotFoundPageProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={onBackToHome}
                className="gap-2 mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("common.back_to_home") || "Back to Home"}
              </Button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <Search className="w-6 h-6 text-red-600" />
                </div>
                <Badge className="bg-red-500/10 text-red-600">
                  Page Not Found
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-medium mb-6 leading-tight">
                Page Not Found
                <span className="text-primary block lg:inline"> 404</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The page you're looking for doesn't exist. Let us help you find what you need.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={onBackToHome} className="gap-2">
                  <Home className="h-5 w-5" />
                  Go to Homepage
                </Button>
                <Button variant="outline" size="lg" className="gap-2" onClick={() => window.location.href = '/contact'}>
                  <Mail className="h-5 w-5" />
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Popular Pages */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-8">Popular Pages</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-start gap-3 text-left"
                  onClick={() => window.location.href = '/about'}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">About Us</div>
                    <div className="text-sm text-gray-600">Learn about our AI training services</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-start gap-3 text-left"
                  onClick={() => window.location.href = '/coaching'}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">AI Coaching</div>
                    <div className="text-sm text-gray-600">Get personalized AI guidance</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-6 flex flex-col items-start gap-3 text-left"
                  onClick={() => window.location.href = '/ai-fundamentals'}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">AI Fundamentals</div>
                    <div className="text-sm text-gray-600">Master AI basics</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
