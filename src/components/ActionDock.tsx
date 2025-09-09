import React from 'react'
import { Calendar, ArrowUp } from 'lucide-react'
import { Button } from './ui/button'
import { useLanguage } from './LanguageProvider'

export function ActionDock() {
  const { t } = useLanguage();
  
  // Smart scroll to top that avoids conflicts with sticky elements
  const scrollTop = () => {
    const stickyElements = document.querySelectorAll('[style*="position: sticky"], [style*="position: fixed"], .sticky, .fixed');
    
    if (stickyElements.length > 0) {
      // Use 'auto' behavior to avoid conflicts with sticky elements
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      // Use smooth scrolling if no sticky elements
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-background/80 backdrop-blur-xl p-1 shadow-apple-lg">
        <Button
          size="sm"
          className="px-3 py-2 rounded-full btn-apple"
          onClick={() => window.open('https://calendly.com/georgeraymond/30min', '_blank')}
        >
          <Calendar className="h-4 w-4 mr-2" /> {t('nav.book_consultation')}
        </Button>
      </div>
      <Button variant="outline" size="icon" className="rounded-full apple-transition" onClick={scrollTop}>
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  )
}
