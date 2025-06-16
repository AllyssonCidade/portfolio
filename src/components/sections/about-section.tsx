'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import ResumeModal from "@/components/resume-modal";
import type { AboutData } from '@/types';
import { Loader2 } from 'lucide-react';

export default function AboutSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/about');
        if (!response.ok) {
          throw new Error('Failed to fetch about data');
        }
        const data: AboutData = await response.json();
        setAboutData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
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
      <section id="about" className="py-20 md:py-32 scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'rgba(54, 64, 68, 0.08)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary inline-block" />
        </div>
      </section>
    );
  }

  if (error || !aboutData) {
     return (
      <section id="about" className="py-20 md:py-32 scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'rgba(54, 64, 68, 0.08)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <p className="text-destructive">Error: {error || "About data not available."}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
        id="about" 
        className="py-20 md:py-32 scroll-mt-20 relative overflow-hidden"
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'rgba(255, 255, 255, 0.08)', 
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '16px', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        ></div>
        <div 
          ref={contentRef}
          className={`container mx-auto px-4 sm:px-6 lg:px-8 relative ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}
        >
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative aspect-square md:aspect-[3/4] rounded-lg overflow-hidden shadow-2xl group">
             {aboutData.imageUrl && (
              <Image
                src={aboutData.imageUrl.startsWith('http') ? aboutData.imageUrl : `/images/${aboutData.imageUrl}`}
                alt={aboutData.imageAlt}
                width={600}
                height={800}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={aboutData.imageHint}
              />
             )}
            </div>
            <div className="space-y-6">
              <h2 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
                {aboutData.title}
              </h2>
              <p className="text-lg text-muted leading-relaxed">
                {aboutData.paragraph1}
              </p>
              <p className="text-lg text-muted leading-relaxed">
                {aboutData.paragraph2}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <Button 
                  onClick={() => setIsResumeModalOpen(true)} 
                  variant="default" 
                  size="lg" 
                  className="text-primary-foreground hover:bg-primary/90"
                >
                  {aboutData.resumeModalButtonText}
                </Button>
                <Button asChild variant="secondary" size="lg" className="text-secondary-foreground hover:bg-secondary/90">
                  <Link href={aboutData.downloadResumeLink} download>{aboutData.downloadResumeButtonText}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
