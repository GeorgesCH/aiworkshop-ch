import React, { Suspense, useEffect } from "react";
import { LazyWrapper } from "../LazyWrapper";

// Eager load critical above-the-fold components
import { HeroSection } from "../HeroSection";
import { StatsSection } from "../StatsSection";
import { FeatureGrid } from "../FeatureGrid";
import { ActionDock } from "../ActionDock";
const ResumeLearningBanner = React.lazy(() => import("../ResumeLearningBanner").then(m => ({ default: m.ResumeLearningBanner })));

// Temporarily disable lazy loading for problematic components to debug React hooks issue
import { WorkshopMethodologySection } from "../WorkshopMethodologySection";
import { ProgramsSection } from "../ProgramsSection";
import { VideoShowcaseSection } from "../VideoShowcaseSection";
import { WorkshopsSection } from "../WorkshopsSection";
import { WhyChooseUsSection } from "../WhyChooseUsSection";
import { TestimonialsSection } from "../TestimonialsSection";
import { FacilitatorSection } from "../FacilitatorSection";
import { ContactSection } from "../ContactSection";

// Lazy load page components
const AboutPage = React.lazy(() => import("../AboutPage").then(module => ({ default: module.AboutPage })));
const ContactPage = React.lazy(() => import("../ContactPage").then(module => ({ default: module.ContactPage })));
const LearnPage = React.lazy(() => import("../LearnPage").then(module => ({ default: module.LearnPage })));
const WorkshopBookingPage = React.lazy(() => import("../WorkshopBookingPage").then(module => ({ default: module.WorkshopBookingPage })));
const DiscoveryCallPage = React.lazy(() => import("../DiscoveryCallPage").then(module => ({ default: module.DiscoveryCallPage })));
const AIOverviewPage = React.lazy(() => import("../learn/AIOverviewPage").then(module => ({ default: module.AIOverviewPage })));
// Temporarily disable lazy loading to debug React hooks issue
// const IntelligencePage = React.lazy(() => import("../learn/IntelligencePage").then(module => ({ default: module.IntelligencePage })));
import { IntelligencePage } from "../learn/IntelligencePage";
// Load the full Machine Learning page eagerly to avoid lazy-loading issues
import { MachineLearningPage } from "../learn/MachineLearningPage";
const DeepLearningPage = React.lazy(() => import("../learn/DeepLearningPage").then(module => ({ default: module.DeepLearningPage })));
const NeuralNetworksPage = React.lazy(() => import("../learn/NeuralNetworksPage").then(module => ({ default: module.NeuralNetworksPage })));
const FoundationModelsPage = React.lazy(() => import("../learn/FoundationModelsPage").then(module => ({ default: module.FoundationModelsPage })));
const GenerativeAIPage = React.lazy(() => import("../learn/GenerativeAIPage").then(module => ({ default: module.GenerativeAIPage })));
const LLMPlayersPage = React.lazy(() => import("../learn/LLMPlayersPage").then(module => ({ default: module.LLMPlayersPage })));
const AIToolsPage = React.lazy(() => import("../learn/AIToolsPage").then(module => ({ default: module.AIToolsPage })));
const AIToolsDirectoryPage = React.lazy(() => import("../AIToolsDirectoryPage").then(module => ({ default: module.AIToolsDirectoryPage })));
const InteractiveExercisesPage = React.lazy(() => import("../InteractiveExercisesPage").then(module => ({ default: module.InteractiveExercisesPage })));
const AssessmentPage = React.lazy(() => import("../AssessmentPage").then(module => ({ default: module.AssessmentPage })));
const CoursePage = React.lazy(() => import("../CoursePage").then(module => ({ default: module.CoursePage })));
const CoachingPage = React.lazy(() => import("../CoachingPage").then(module => ({ default: module.CoachingPage })));
const SEOLandingPage = React.lazy(() => import("../SEOLandingPage").then(module => ({ default: module.SEOLandingPage })));
const AdminPage = React.lazy(() => import("../AdminPage").then(module => ({ default: module.AdminPage })));
const NotFoundPage = React.lazy(() => import("../NotFoundPage").then(module => ({ default: module.NotFoundPage })));
import type { Page } from "./types";
import { ErrorBoundary } from "../ErrorBoundary";

interface PageRouterProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export function PageRouter({ currentPage, setCurrentPage }: PageRouterProps) {
  // Enhanced debug logging
  console.log('🚀 PageRouter - currentPage:', currentPage);
  console.log('🚀 PageRouter - setCurrentPage function:', setCurrentPage);
  console.log('🚀 PageRouter - window.location.pathname:', typeof window !== 'undefined' ? window.location.pathname : 'N/A');
  
  // Global scroll-to-top on page change (avoid conflicts with sticky elements)
  useEffect(() => {
    // Check if there are sticky/fixed elements that might interfere
    const stickyElements = document.querySelectorAll('[style*="position: sticky"], [style*="position: fixed"], .sticky, .fixed');
    
    if (stickyElements.length > 0) {
      // Use 'auto' behavior to avoid conflicts with sticky elements
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } else {
      // Use smooth scrolling if no sticky elements
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [currentPage]);
  
  if (currentPage === "home") {
    return (
      <main>
        {/* Above the fold - load immediately */}
        <HeroSection onPageChange={setCurrentPage} />
        <FeatureGrid />
        <StatsSection />
        <Suspense fallback={<div className="animate-pulse bg-gray-100 h-24"></div>}>
          <LazyWrapper>
            <ResumeLearningBanner onPageChange={setCurrentPage} />
          </LazyWrapper>
        </Suspense>

        {/* Below the fold - temporarily loaded directly to debug React hooks issue */}
        <ProgramsSection onPageChange={setCurrentPage} />
        <VideoShowcaseSection />
        <WorkshopsSection onPageChange={setCurrentPage} />
        <WhyChooseUsSection onPageChange={setCurrentPage} />
        <TestimonialsSection />
        <FacilitatorSection />
        <ContactSection />
        <WorkshopMethodologySection />
        <ActionDock />
      </main>
    );
  }

  if (currentPage === "about") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <AboutPage onBackToHome={() => setCurrentPage("home")} onPageChange={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "contact") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <ContactPage onBackToHome={() => setCurrentPage("home")} />
      </Suspense>
    );
  }

  if (currentPage === "coaching") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <CoachingPage />
      </Suspense>
    );
  }

  if (currentPage === "learn") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <LearnPage onBackToHome={() => setCurrentPage("home")} onNavigateToTopic={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-ai-overview") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <AIOverviewPage onBackToLearn={() => setCurrentPage("learn")} onNavigateToTopic={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-intelligence") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <IntelligencePage onPageChange={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-machine-learning") {
    return (
      <ErrorBoundary>
        <MachineLearningPage onBackToLearn={() => setCurrentPage("learn")} />
      </ErrorBoundary>
    );
  }

  if (currentPage === "learn-deep-learning") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <DeepLearningPage onBackToLearn={() => setCurrentPage("learn")} onNavigateToTopic={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-neural-networks") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <NeuralNetworksPage onBackToLearn={() => setCurrentPage("learn")} onNavigateToTopic={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-foundation-models") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <FoundationModelsPage onBackToLearn={() => setCurrentPage("learn")} onNavigateToTopic={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-generative-ai") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <GenerativeAIPage onBackToLearn={() => setCurrentPage("learn")} onNavigateToTopic={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-llm-players") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <LLMPlayersPage onBackToLearn={() => setCurrentPage("learn")} onNavigateToTopic={setCurrentPage} />
      </Suspense>
    );
  }

  if (currentPage === "learn-ai-tools") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <AIToolsPage onBackToLearn={() => setCurrentPage("learn")} />
      </Suspense>
    );
  }

  // AI Tools Directory now under Learn section
  if (currentPage === "learn-ai-tools-directory") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <AIToolsDirectoryPage onBackToHome={() => setCurrentPage("learn")} />
      </Suspense>
    );
  }

  // Interactive Exercises now under Learn section
  if (currentPage === "learn-interactive-exercises") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <InteractiveExercisesPage onBackToHome={() => setCurrentPage("learn")} onPageChange={setCurrentPage} />
      </Suspense>
    );
  }

  // Assessment Page
  if (currentPage === "assessment") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <AssessmentPage onBackToHome={() => setCurrentPage("home")} onPageChange={setCurrentPage} />
      </Suspense>
    );
  }

  // Workshop Booking Page
  if (currentPage === "workshop-booking") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <WorkshopBookingPage onBackToHome={() => setCurrentPage("home")} />
      </Suspense>
    );
  }

  // Discovery Call Page
  if (currentPage === "discovery-call") {
    console.log('🎯 DISCOVERY CALL PAGE RENDERED - currentPage is discovery-call');
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <DiscoveryCallPage onBackToHome={() => setCurrentPage("home")} />
      </Suspense>
    );
  }

  if (currentPage === "seo-landing") {
    // Get the current URL to determine city and service
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const normalizedPath = pathWithoutLang.replace(/\/$/, '') || '/';
    
    // Extract city from URL
    const cityMatch = normalizedPath.match(/^\/(geneva|zurich|basel|bern|lausanne)/);
    const city = cityMatch ? cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1) : "Zurich";
    
    // Extract service from URL if present
    const serviceMatch = normalizedPath.match(/\/(ai-fundamentals|ai-business-intelligence|generative-ai|agentic-ai|ai-training|chatgpt-training|machine-learning-training)/);
    let service = "AI Training";
    let industry = "Business";
    
    if (serviceMatch) {
      switch (serviceMatch[1]) {
        case "ai-fundamentals":
          service = "AI Fundamentals Training";
          break;
        case "ai-business-intelligence":
          service = "AI for Business Intelligence";
          break;
        case "generative-ai":
          service = "Generative AI Training";
          break;
        case "agentic-ai":
          service = "Agentic AI Training";
          break;
        case "chatgpt-training":
          service = "ChatGPT Training";
          break;
        case "machine-learning-training":
          service = "Machine Learning Training";
          break;
        default:
          service = "AI Training";
      }
    }
    
    // Set industry based on city
    switch (city.toLowerCase()) {
      case "geneva":
        industry = "Finance";
        break;
      case "basel":
        industry = "Healthcare";
        break;
      case "bern":
        industry = "Government";
        break;
      case "lausanne":
        industry = "Technology";
        break;
      default:
        industry = "Business";
    }

    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <SEOLandingPage 
          city={city} 
          service={service} 
          industry={industry} 
          onPageChange={setCurrentPage} 
        />
      </Suspense>
    );
  }

  if (currentPage === "admin") {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <AdminPage />
      </Suspense>
    );
  }

  

  if (currentPage === "not-found") {
    console.log('❌ NOT FOUND PAGE RENDERED - currentPage is not-found');
    console.log('❌ This means the URL was not matched to any known page type');
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <NotFoundPage onBackToHome={() => setCurrentPage("home")} />
      </Suspense>
    );
  }

  // Try to render as a course page, if that fails, show not-found
  try {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <CoursePage courseId={currentPage} onBackToHome={() => setCurrentPage("home")} onPageChange={setCurrentPage} />
      </Suspense>
    );
  } catch (error) {
    return (
      <Suspense fallback={<div className="animate-pulse bg-gray-100 min-h-screen"></div>}>
        <NotFoundPage onBackToHome={() => setCurrentPage("home")} />
      </Suspense>
    );
  }
}
