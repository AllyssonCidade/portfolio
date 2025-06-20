// src/components/ScrollToTopButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <Button
      variant="default"
      size="icon"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 ease-in-out',
        'bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
}
