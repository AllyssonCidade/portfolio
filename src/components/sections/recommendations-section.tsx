'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Recommendation } from '@/types';
import { ChevronLeft, ChevronRight, Linkedin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AUTOPLAY_INTERVAL = 8000; 

export default function RecommendationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false); 
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/recommendations');
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data: Recommendation[] = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);


  const handleNext = useCallback(() => {
    if (recommendations.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
    );
  }, [recommendations.length]);

  const handlePrev = () => {
    if (recommendations.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    if (recommendations.length === 0) return;
    setCurrentIndex(index);
  };

  const handleInteraction = () => {
    setIsInteracting(true);
     if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };
  
  const handleNextWithInteraction = () => {
    handleInteraction();
    handleNext();
  };

  const handlePrevWithInteraction = () => {
    handleInteraction();
    handlePrev();
  };

  const handleDotClickWithInteraction = (index: number) => {
    handleInteraction();
    handleDotClick(index);
  };

  useEffect(() => {
    const targetRef = sectionRef.current;
    if (isLoading || !targetRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(targetRef);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(targetRef);
    return () => {
      if (targetRef) observer.unobserve(targetRef);
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isLoading]);

 useEffect(() => {
    if (!isInteracting && isVisible && recommendations.length > 1 && !isLoading) {
      autoplayTimerRef.current = setInterval(handleNext, AUTOPLAY_INTERVAL);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isInteracting, isVisible, handleNext, recommendations.length, isLoading]);


  const handleTouchStart = (e: React.TouchEvent) => {
    if (recommendations.length <= 1) return;
    touchStartX.current = e.targetTouches[0].clientX;
    handleInteraction();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (recommendations.length <= 1) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (recommendations.length <= 1) return;
    if (touchStartX.current === 0 || touchEndX.current === 0) return;

    if (touchStartX.current - touchEndX.current > 50) { 
      handleNext();
    } else if (touchStartX.current - touchEndX.current < -50) { 
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };
  
  if (isLoading) {
    return (
      <section id="recommendations" className="py-20 md:py-32 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary inline-block" />
        </div>
      </section>
    );
  }

  if (error || !recommendations || recommendations.length === 0) {
     return (
      <section id="recommendations" className="py-20 md:py-32 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-destructive">{error || "Recommendations not available."}</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="recommendations" 
      ref={sectionRef} 
      className={`py-20 md:py-32 bg-background scroll-mt-20 ${isVisible ? 'animate-slide-in-bottom' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-4xl sm:text-5xl font-bold text-center mb-4 text-primary">
          O que dizem sobre mim
        </h2>
        <p className="text-center text-lg text-foreground/70 mb-12 md:mb-16 max-w-2xl mx-auto">
          Recomendações reais de pessoas com quem já trabalhei, direto do meu perfil no LinkedIn.
        </p>

        {recommendations.length > 0 ? (
        <div 
          className="relative overflow-hidden max-w-3xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {recommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="w-full flex-shrink-0 px-2"
              >
                <div 
                  className="p-6 md:p-8 rounded-lg shadow-xl min-h-[300px] flex flex-col justify-between"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                     {rec.avatarUrl && (
                      <Image
                        src={rec.avatarUrl.startsWith('http') ? rec.avatarUrl : `/images/${rec.avatarUrl}`}
                        alt={`Avatar de ${rec.name}`}
                        width={64}
                        height={64}
                        className="rounded-full object-cover border-2 border-primary/50"
                        data-ai-hint={rec.avatarHint}
                      />
                     )}
                    </div>
                    <div>
                      <h3 className="font-headline text-xl text-primary">{rec.name}</h3>
                      <p className="text-sm text-muted">{rec.title}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed line-clamp-4 mb-6 flex-grow">
                    {rec.message}
                  </p>
                  <div className="text-right">
                    <Button asChild variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      <Link href={rec.linkedInUrl} target="_blank" rel="noopener noreferrer">
                        Ver no LinkedIn <Linkedin size={16} className="ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

           {recommendations.length > 1 && (
            <>
                <button
                    onClick={handlePrevWithInteraction}
                    aria-label="Recomendação anterior"
                    className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-card/50 text-foreground p-2 rounded-full hover:bg-primary/80 hover:text-primary-foreground transition-colors z-10 hidden md:block"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    onClick={handleNextWithInteraction}
                    aria-label="Próxima recomendação"
                    className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-card/50 text-foreground p-2 rounded-full hover:bg-primary/80 hover:text-primary-foreground transition-colors z-10 hidden md:block"
                >
                    <ChevronRight size={28} />
                </button>
            </>
           )}

          {recommendations.length > 1 && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-10 mt-8">
              {recommendations.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleDotClickWithInteraction(index)}
                  aria-label={`Ir para recomendação ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'bg-primary scale-125' : 'bg-muted/50 hover:bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        ) : (
             <p className="text-center text-foreground/70">Nenhuma recomendação para exibir.</p>
        )}
      </div>
    </section>
  );
}
