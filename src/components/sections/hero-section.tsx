'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import type { HeroData } from '@/types';

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/hero');
        if (!response.ok) {
          throw new Error('Failed to fetch hero data');
        }
        const data: HeroData = await response.json();
        setHeroData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    const targetRef = contentRef.current;
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
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <section 
        id="home" 
        className="relative min-h-screen flex items-center justify-center py-20 scroll-mt-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-background/80 z-1"></div>
        <Loader2 className="h-12 w-12 animate-spin text-primary z-10" />
      </section>
    );
  }

  if (error || !heroData) {
    return (
      <section 
        id="home" 
        className="relative min-h-screen flex items-center justify-center py-20 scroll-mt-20 overflow-hidden"
      >
         <div className="absolute inset-0 bg-background/80 z-1"></div>
        <p className="text-destructive z-10">Error: {error || "Hero data not available."}</p>
      </section>
    );
  }

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center py-20 scroll-mt-20 overflow-hidden"
    >
      {heroData.backgroundImageUrl && (
          <Image
            src={heroData.backgroundImageUrl.startsWith('http') ? heroData.backgroundImageUrl : `/images/${heroData.backgroundImageUrl}`}
            alt={heroData.backgroundImageHint || "Background image"}
            fill
            className="object-cover z-0 opacity-20"
            data-ai-hint={heroData.backgroundImageHint}
            priority
          />
        )}
      <div className="absolute inset-0 bg-background/80 z-1"></div>

      <div 
        ref={contentRef}
        className={`relative container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}`}
      >
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground">
          {heroData.mainHeading}
          <span className="block text-primary mt-2 sm:mt-4">
            {heroData.subHeadingPrimary}
          </span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-xl sm:text-2xl text-foreground/80 font-medium">
          {heroData.subHeadingSecondary}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-md shadow-lg transition-transform hover:scale-105">
            <Link href={heroData.ctaButton1Link}>
              {heroData.ctaButton1Text} <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 rounded-md shadow-lg transition-transform hover:scale-105">
            <Link href={heroData.ctaButton2Link}>
              {heroData.ctaButton2Text}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
