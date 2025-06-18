"use client";
import Image from "next/image";
import type { Service } from "@/types";
import { ArrowUpRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const AUTOPLAY_INTERVAL = 7000; // 7 seconds

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data: Service[] = await response.json();
        setServicesData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const handleNext = useCallback(() => {
    if (servicesData.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === servicesData.length - 1 ? 0 : prevIndex + 1
    );
  }, [servicesData.length]);

  const handlePrev = () => {
    if (servicesData.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? servicesData.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    if (servicesData.length === 0) return;
    setCurrentIndex(index);
  };

  const handleInteraction = useCallback(() => {
    setIsInteracting(true);
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

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
    if (loading || !targetRef) return;

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
  }, [loading]);

  useEffect(() => {
    if (!isInteracting && isVisible && servicesData.length > 1 && !loading) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = setInterval(handleNext, AUTOPLAY_INTERVAL);
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isInteracting, isVisible, handleNext, servicesData.length, loading]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (servicesData.length <= 1) return;
    touchStartX.current = e.targetTouches[0].clientX;
    handleInteraction();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (servicesData.length <= 1) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (servicesData.length <= 1) return;
    if (touchStartX.current === 0 || touchEndX.current === 0) return;

    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    } else if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    const targetRef = sectionRef.current;
    if (loading || !targetRef) {
      return;
    }

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
      if (targetRef) {
        observer.unobserve(targetRef);
      }
    };
  }, [loading]);

  if (loading) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="py-20 md:py-32 bg-background scroll-mt-20 relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary inline-block" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="services"
        className="py-20 md:py-32 bg-background scroll-mt-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (servicesData.length === 0 && !loading) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="py-20 md:py-32 bg-background scroll-mt-20 relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-wider text-foreground ${
              isVisible ? "animate-fade-in" : "opacity-0"
            }`}
            style={{ animationDelay: isVisible ? `100ms` : undefined }}
          >
            SERVIÇOS ADAPTADOS PARA <span className="text-primary">VOCÊ</span>
          </h2>
          <p className="text-foreground/70">
            Nenhum serviço disponível no momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 md:py-32 bg-background scroll-mt-20 relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          className={`font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-wider text-foreground transition-all duration-700 ease-out will-change-transform
        ${
          isVisible
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-90 invisible"
        }`}
          style={{ transitionDelay: isVisible ? "100ms" : undefined }}
        >
          SERVIÇOS ADAPTADOS PARA <span className="text-primary">VOCÊ</span>
        </h2>

        <div
          className="relative overflow-hidden rounded-lg shadow-xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {servicesData.map((service, index) => (
              <div
                key={service.id}
                className="relative aspect-[4/5] md:aspect-[16/9] w-full flex-shrink-0 group"
              >
                {service.imageUrl && (
                  <Image
                    src={
                      service.imageUrl.startsWith("http")
                        ? service.imageUrl
                        : `/images/${service.imageUrl}`
                    }
                    alt={service.description || service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={service.imageHint}
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="font-headline text-2xl md:text-4xl text-white drop-shadow-md mb-4">
                    {service.title}
                  </h3>
                  <ArrowUpRight
                    size={32}
                    className="text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                    strokeWidth={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {servicesData.length > 1 && (
            <>
              <button
                onClick={handlePrevWithInteraction}
                aria-label="Previous service"
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-primary/80 transition-colors z-10 hidden md:block"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={handleNextWithInteraction}
                aria-label="Next service"
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-primary/80 transition-colors z-10 hidden md:block"
              >
                <ChevronRight size={28} />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-10">
                {servicesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClickWithInteraction(index)}
                    aria-label={`Go to service ${index + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "bg-primary scale-125"
                        : "bg-muted/70 hover:bg-muted"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
