import React, { useState, useEffect } from "react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useAuth } from "./FirebaseAuthProvider";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language } = useLanguage();
  const { trackClick } = useAnalytics({ page: currentPage });
  const { user, signIn, signUp, signOut } = useAuth();
  const modulesForProgress = React.useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId })), []);
  const { nextModule } = useLearningProgress(learnHubCourseKey, modulesForProgress as any);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Always use light logo since we're forcing light mode
  const getCurrentLogo = () => {
    return '/@optimized/AI-Workshop_Logo_light-optimized.webp';
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
      <header className="sticky top-4 z-50 w-full">
        <div className={`py-2 sm:py-3 ${isScrolled ? 'shadow-lg backdrop-blur-md bg-white/80 border-white/20' : 'shadow-sm backdrop-blur-sm bg-white/60 border-white/10'} flex h-14 md:h-16 items-center justify-between rounded-2xl border transition-all duration-300 container mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="flex items-center space-x-4 relative z-20">
            <button
              onClick={() => navigateToPage("home")}
              className="flex items-center gap-2 group rounded-xl px-2.5 py-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 min-h-[40px]"
              aria-label="Go to home"
            >
              <img 
                src={getCurrentLogo()} 
                alt="AI Workshop Switzerland" 
                className="w-[35px] h-auto object-contain"
                width="35"
                height="35"
              />
              <span className="font-aiworkshop text-[15px] md:text-base font-semibold text-foreground hidden sm:block">
                AI-Workshop
              </span>
            </button>
          </div>

          {/* Primary navigation (desktop) */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-2 relative z-20">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 group">
                {t("header.courses")}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-3 border border-white/20 shadow-lg backdrop-blur-md bg-white/90 rounded-xl">
                <div className="space-y-1">
                  {courses.map((course) => (
                    <DropdownMenuItem
                      key={course.id}
                      onClick={() => navigateToPage(course.id)}
                      className="flex flex-col items-start p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
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
              onClick={() => navigateToPage("develop")}
              className={`text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${
                currentPage === "develop" ? "text-primary" : "text-foreground"
              }`}
            >
              {t("nav.develop", "Develop")}
            </button>

            <button
              onClick={() => navigateToPage("coaching")}
              className="text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            >
              {t("header.coaching")}
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 group">
                {t("header.learn")}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 p-3 border border-white/20 shadow-lg backdrop-blur-md bg-white/90 rounded-xl">
                <div className="space-y-1">
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="font-medium text-sm">{t("header.learning_hub")}</div>
                  </DropdownMenuItem>
                  <div className="border-t border-gray-200 my-2"></div>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-ai-overview")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.ai_overview")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-intelligence")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.intelligence_iq_eq_ai")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-machine-learning")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.machine_learning")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-deep-learning")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.deep_learning")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-neural-networks")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.neural_networks")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-foundation-models")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.foundation_models")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-generative-ai")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.generative_ai")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-llm-players")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.llm_players")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-ai-tools")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.ai_tools_protocols")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-ai-tools-directory")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.ai_tools_directory")}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPage("learn-interactive-exercises")}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm">{t("header.interactive_exercises")}</div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => navigateToPage("contact")}
              className="text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
            >
              {t("nav.contact")}
            </button>

          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-2 relative z-20">
            <LanguageSwitcher />
            {/* Account menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 group">
                <UserIcon className="h-4 w-4" />
                {user ? (user.email || 'Account') : t('header.sign_in', 'Sign in')}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-3 border border-white/20 shadow-lg backdrop-blur-md bg-white/90 rounded-xl">
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
                      className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Play className="h-4 w-4" /> {nextModule ? t('header.continue_learning', 'Continue learning') + `: ${nextModule.routeId.replace('learn-','').replace('-', ' ')}` : t('header.browse_learn', 'Browse Learn Hub')}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigateToPage('learn')}
                      className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4" /> {t('header.my_learning', 'My learning')}
                      </div>
                    </DropdownMenuItem>
                    <Separator className="my-2" />
                    <DropdownMenuItem
                      onClick={async () => { await signOut(); }}
                      className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 text-red-600"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <LogOut className="h-4 w-4" /> {t('header.sign_out', 'Sign out')}
                      </div>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}
                      className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <LogIn className="h-4 w-4" /> {t('header.sign_in', 'Sign in')}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                      className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-4 w-4" /> {t('header.create_account', 'Create account')}
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="apple"
              size="default"
              className="rounded-xl"
              onClick={() => navigateToPage("discovery-call")}
              leftIcon={<Phone className="h-4 w-4" />}
            >
              {t("nav.book_consultation")}
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2 relative z-20">
            <LanguageSwitcher />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="text-sm font-medium">Menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 backdrop-blur-md bg-white/95 border-l border-white/20">
                <SheetHeader className="p-6 pb-4">
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <div className="px-6 pb-6 space-y-6 overflow-y-auto h-full">
                  {/* Courses Section */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          className="flex flex-col items-start w-full p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 min-h-[48px]"
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

                  {/* Develop Section */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigateToPage("develop");
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[15px] font-medium transition-colors hover:bg-gray-50 ${
                        currentPage === "develop" ? "text-primary/90" : "text-foreground"
                      }`}
                    >
                      {t("nav.develop", "Develop")}
                    </button>
                  </div>

                  {/* Coaching Section */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("header.coaching")}
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigateToPage("coaching");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 text-[15px] font-medium"
                      >
                        {t("header.coaching")}
                      </button>
                    </div>
                  </div>

                  {/* Learn Section */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("header.learn")}
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigateToPage("learn");
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 text-[15px] font-medium"
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
                          className="block w-full text-left p-3 rounded-xl transition-colors hover:bg-gray-50 text-[15px]"
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
                        navigateToPage("contact");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left p-3 rounded-xl transition-colors hover:bg-gray-50 text-[15px] font-medium"
                    >
                      {t("nav.contact")}
                    </button>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-gray-200">
                    {/* Account controls (mobile) */}
                    <div className="mb-3 space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('header.account', 'Your account')}</div>
                      {user ? (
                        <>
                          <button
                            onClick={() => {
                              if (nextModule) navigateToPage(nextModule.routeId); else navigateToPage('learn');
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 text-[15px] font-medium flex items-center gap-2"
                          >
                            <Play className="h-4 w-4" /> {nextModule ? t('header.continue_learning', 'Continue learning') : t('header.browse_learn', 'Browse Learn Hub')}
                          </button>
                          <button
                            onClick={() => { navigateToPage('learn'); setIsMenuOpen(false); }}
                            className="w-full text-left p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 text-[15px] font-medium flex items-center gap-2"
                          >
                            <BookOpen className="h-4 w-4" /> {t('header.my_learning', 'My learning')}
                          </button>
                          <button
                            onClick={async () => { await signOut(); setIsMenuOpen(false); }}
                            className="w-full text-left p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 text-[15px] font-medium flex items-center gap-2 text-red-600"
                          >
                            <LogOut className="h-4 w-4" /> {t('header.sign_out', 'Sign out')}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setAuthMode('signin'); setAuthOpen(true); setIsMenuOpen(false); }}
                            className="w-full text-left p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 text-[15px] font-medium flex items-center gap-2"
                          >
                            <LogIn className="h-4 w-4" /> {t('header.sign_in', 'Sign in')}
                          </button>
                          <button
                            onClick={() => { setAuthMode('signup'); setAuthOpen(true); setIsMenuOpen(false); }}
                            className="w-full text-left p-3 rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 text-[15px] font-medium flex items-center gap-2"
                          >
                            <UserIcon className="h-4 w-4" /> {t('header.create_account', 'Create account')}
                          </button>
                        </>
                      )}
                    </div>
                    <Button 
                      variant="apple"
                      size="lg"
                      className="w-full rounded-xl"
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
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </header>
      <AuthModal open={authOpen} mode={authMode} onOpenChange={setAuthOpen} />
    </>
  );
}
