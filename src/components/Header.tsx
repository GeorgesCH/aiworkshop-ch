import React, { useState } from "react";
import { Button, Badge } from "./design-system";
import { Menu, X, ChevronDown, Phone, Calendar, Sparkles, User as UserIcon, LogIn, LogOut, Play, BookOpen } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import { useAnalytics } from "../hooks/useAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useAuth } from "./AuthProvider";
import { useLearningProgress } from "../hooks/useLearningProgress";
import { learnCourseModules, learnHubCourseKey } from "./learn/courseMap";
import { AuthModal } from "./auth/AuthModal";
// Removed vike/client/router import - using standard navigation instead
// Use public asset path directly

interface HeaderProps {
  currentPage: string;
  onPageChange?: (page: string) => void;
}

export function Header({ currentPage, onPageChange = () => {} }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { trackClick } = useAnalytics({ page: currentPage });
  const { user, signIn, signUp, signOut } = useAuth();
  const modulesForProgress = React.useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId })), []);
  const { nextModule } = useLearningProgress(learnHubCourseKey, modulesForProgress as any);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Always use light logo since we're forcing light mode
  const getCurrentLogo = () => {
    return '/optimized/AI-Workshop_Logo_light-optimized.webp';
  };

  const navigateToPage = (page: string) => {
    console.log('Header navigateToPage called with:', page);
    console.log('onPageChange function:', onPageChange);
    trackClick(`nav-${page}`, 'header');
    if (typeof onPageChange === 'function') {
      console.log('Calling onPageChange with:', page);
      onPageChange(page);
    } else {
      console.error('onPageChange is not a function:', onPageChange);
    }
  };

  const courses = [
    { id: "ai-fundamentals", name: t("header.ai_fundamentals") },
    { id: "ai-business-intelligence", name: t("header.ai_business_intelligence") },
    { id: "generative-ai", name: t("header.generative_ai_business") },
    { id: "agentic-ai", name: t("header.agentic_ai"), badge: t("header.new") }
  ];

  const seoPages = [
    { id: "seo-landing", name: "SEO Landing Page", description: "Template Demo" }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full py-apple-4">
        <div className="container mx-auto px-apple-4">
          {/* Modern contained header with blur background */}
          <div className="flex h-14 lg:h-16 items-center justify-between rounded-apple-2xl border border-white/20 bg-white/80 backdrop-blur-[20px] shadow-apple-lg px-apple-6 relative z-10">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateToPage("home")}
                className="flex items-center gap-apple-3 group transition-apple rounded-apple px-apple-3 py-apple-2 hover:bg-gray-100/50 min-h-[44px]"
              >
                <img 
                  src={getCurrentLogo()} 
                  alt="AI Workshop Switzerland" 
                  className="h-4 sm:h-5 w-auto object-contain max-h-5 max-w-24"
                  style={{ maxHeight: '20px', maxWidth: '96px' }}
                />
                <span className="font-aiworkshop text-base sm:text-lg font-semibold text-foreground hidden xs:block">
                  AI-Workshop
                </span>
                <span className="font-aiworkshop text-sm font-extrabold text-foreground xs:hidden">
                  AI-Workshop
                </span>
              </button>
            </div>

            {/* Apple-style navigation - Clean and precise */}
            <nav className="hidden lg:flex items-center space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium transition-apple hover:text-primary rounded-full px-3 py-2 hover:bg-gray-100/40">
                  {t("header.courses")}
                  <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80 p-3 border-border/50 shadow-apple-lg bg-background/95 backdrop-blur-[20px]">
                  <div className="space-y-1">
                    {courses.map((course) => (
                      <DropdownMenuItem
                        key={course.id}
                        onClick={() => navigateToPage(course.id)}
                        className="flex flex-col items-start p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className="font-medium text-sm">{course.name}</div>
                          {course.badge && (
                            <Badge variant="apple" size="sm">
                              {course.badge}
                            </Badge>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => navigateToPage("coaching")}
                className="text-sm font-medium transition-apple hover:text-primary rounded-full px-3 py-2 hover:bg-gray-100/40"
              >
                {t("header.coaching")}
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium transition-apple hover:text-primary rounded-full px-3 py-2 hover:bg-gray-100/40">
                  {t("header.learn")}
                  <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 p-3 border-border/50 shadow-apple-lg bg-background/95 backdrop-blur-[20px]">
                  <div className="space-y-1">
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="font-medium text-sm">{t("header.learning_hub")}</div>
                    </DropdownMenuItem>
                    <div className="border-t border-border/30 my-2"></div>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-ai-overview")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.ai_overview")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-intelligence")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.intelligence_iq_eq_ai")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-machine-learning")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.machine_learning")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-deep-learning")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.deep_learning")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-neural-networks")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.neural_networks")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-foundation-models")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.foundation_models")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-generative-ai")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.generative_ai")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-llm-players")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.llm_players")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-ai-tools")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.ai_tools_protocols")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-ai-tools-directory")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.ai_tools_directory")}</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage("learn-interactive-exercises")}
                      className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                    >
                      <div className="text-sm">{t("header.interactive_exercises")}</div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => navigateToPage("about")}
                className="text-sm font-medium transition-apple hover:text-primary rounded-full px-3 py-2 hover:bg-gray-100/40"
              >
                {t("nav.about")}
              </button>

              <button
                onClick={() => navigateToPage("contact")}
                className="text-sm font-medium transition-apple hover:text-primary rounded-full px-3 py-2 hover:bg-gray-100/40"
              >
                {t("nav.contact")}
              </button>
            </nav>

            {/* Apple-style controls */}
            <div className="hidden lg:flex items-center space-x-3">
              <LanguageSwitcher />
              {/* Account menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium transition-apple rounded-full px-3 py-2 hover:bg-gray-100/40">
                  <UserIcon className="h-4 w-4" />
                  {user ? (user.email || 'Account') : t('header.sign_in', 'Sign in')}
                  <ChevronDown className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-2 border-border/50 shadow-apple-lg bg-background/95 backdrop-blur-[20px]">
                  {user ? (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                  ) : (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">{t('header.account', 'Your account')}</div>
                  )}
                  <Separator className="my-2" />
                  {user ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          if (nextModule) navigateToPage(nextModule.routeId);
                          else navigateToPage('learn');
                        }}
                        className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Play className="h-4 w-4" />
                          {nextModule ? t('header.continue_learning', 'Continue learning') + `: ${nextModule.routeId.replace('learn-','').replace('-', ' ')}` : t('header.browse_learn', 'Browse Learn Hub')}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigateToPage('learn')}
                        className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4" />
                          {t('header.my_learning', 'My learning')}
                        </div>
                      </DropdownMenuItem>
                      <Separator className="my-2" />
                      <DropdownMenuItem
                        onClick={async () => { await signOut(); }}
                        className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50 text-red-600"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <LogOut className="h-4 w-4" />
                          {t('header.sign_out', 'Sign out')}
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}
                        className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <LogIn className="h-4 w-4" />
                          {t('header.sign_in', 'Sign in')}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                        className="p-3 rounded-lg cursor-pointer transition-apple hover:bg-gray-100/50"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <UserIcon className="h-4 w-4" />
                          {t('header.create_account', 'Create account')}
                        </div>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="apple"
                size="default"
                onClick={() => navigateToPage("discovery-call")}
                leftIcon={<Phone className="h-4 w-4" />}
              >
                {t("nav.book_consultation")}
              </Button>
            </div>

            {/* Mobile controls - Menu button on right */}
            <div className="flex lg:hidden items-center space-x-3">
              <div className="order-1">
                <LanguageSwitcher />
              </div>
              <div className="mobile-menu-container">
                <button
                  className="mobile-menu-button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
                <span className="mobile-menu-text">
                  {isMenuOpen ? t("header.close") : t("header.menu")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile navigation overlay with modern blur */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white/90 backdrop-blur-[40px]">
            <nav className="container mx-auto px-apple-4 py-apple-6">
              <div className="space-y-6">
                {/* Courses Section */}
                <div className="space-y-3">
                  <div className="caption">
                    {t("header.courses")}
                  </div>
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          navigateToPage(course.id);
                          setIsMenuOpen(false);
                        }}
                        className="flex flex-col items-start w-full p-4 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 min-h-[56px]"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-sm font-medium">{course.name}</span>
                          {course.badge && (
                            <Badge variant="apple" size="sm">
                              {course.badge}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coaching Section */}
                <div className="space-y-3">
                  <div className="caption">
                    {t("header.coaching")}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigateToPage("coaching");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left p-3 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 text-sm font-medium"
                    >
                      {t("header.coaching")}
                    </button>
                  </div>
                </div>

                {/* Learn Section */}
                <div className="space-y-3">
                  <div className="caption">
                    {t("header.learn")}
                  </div>
                  <div className="space-y-2">
                                      <button
                      onClick={() => {
                        navigateToPage("learn");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left p-3 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 text-sm font-medium"
                    >
                      {t("header.learning_hub")}
                    </button>
                    {[
                      { id: "learn-ai-overview", name: t("header.ai_overview") },
                      { id: "learn-intelligence", name: t("header.intelligence_iq_eq_ai") },
                      { id: "learn-machine-learning", name: t("header.machine_learning") },
                      { id: "learn-deep-learning", name: t("header.deep_learning") },
                      { id: "learn-neural-networks", name: t("header.neural_networks") },
                      { id: "learn-foundation-models", name: t("header.foundation_models") },
                      { id: "learn-generative-ai", name: t("header.generative_ai") },
                      { id: "learn-llm-players", name: t("header.llm_players") },
                      { id: "learn-ai-tools", name: t("header.ai_tools_protocols") },
                      { id: "learn-ai-tools-directory", name: t("header.ai_tools_directory") },
                      { id: "learn-interactive-exercises", name: t("header.interactive_exercises") }
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          navigateToPage(item.id);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left p-3 rounded-lg transition-apple hover:bg-gray-100/30 text-sm"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigateToPage("about");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left p-3 rounded-lg transition-apple hover:bg-gray-100/30 text-sm font-medium"
                  >
                    {t("nav.about")}
                  </button>
                  <button
                    onClick={() => {
                      navigateToPage("contact");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left p-3 rounded-lg transition-apple hover:bg-gray-100/30 text-sm font-medium"
                  >
                    {t("nav.contact")}
                  </button>
                </div>

                {/* CTA Button */}
                <div className="pt-4 border-t border-border/30">
                  {/* Account controls (mobile) */}
                  <div className="mb-3 space-y-2">
                    <div className="caption">{t('header.account', 'Your account')}</div>
                    {user ? (
                      <>
                        <button
                          onClick={() => {
                            if (nextModule) navigateToPage(nextModule.routeId); else navigateToPage('learn');
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left p-3 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 text-sm font-medium flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" /> {nextModule ? t('header.continue_learning', 'Continue learning') : t('header.browse_learn', 'Browse Learn Hub')}
                        </button>
                        <button
                          onClick={() => { navigateToPage('learn'); setIsMenuOpen(false); }}
                          className="w-full text-left p-3 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 text-sm font-medium flex items-center gap-2"
                        >
                          <BookOpen className="h-4 w-4" /> {t('header.my_learning', 'My learning')}
                        </button>
                        <button
                          onClick={async () => { await signOut(); setIsMenuOpen(false); }}
                          className="w-full text-left p-3 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 text-sm font-medium flex items-center gap-2 text-red-600"
                        >
                          <LogOut className="h-4 w-4" /> {t('header.sign_out', 'Sign out')}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setAuthMode('signin'); setAuthOpen(true); setIsMenuOpen(false); }}
                          className="w-full text-left p-3 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 text-sm font-medium flex items-center gap-2"
                        >
                          <LogIn className="h-4 w-4" /> {t('header.sign_in', 'Sign in')}
                        </button>
                        <button
                          onClick={() => { setAuthMode('signup'); setAuthOpen(true); setIsMenuOpen(false); }}
                          className="w-full text-left p-3 rounded-xl border border-border/50 transition-apple hover:border-primary/30 hover:bg-gray-100/30 text-sm font-medium flex items-center gap-2"
                        >
                          <UserIcon className="h-4 w-4" /> {t('header.create_account', 'Create account')}
                        </button>
                      </>
                    )}
                  </div>
                  <Button 
                    variant="apple"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      navigateToPage("discovery-call");
                      setIsMenuOpen(false);
                    }}
                    leftIcon={<Phone className="h-4 w-4" />}
                  >
                    {t("nav.book_consultation")}
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
      <AuthModal open={authOpen} mode={authMode} onOpenChange={setAuthOpen} />
    </>
  );
}
