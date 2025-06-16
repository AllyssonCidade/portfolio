'use client';
import TechnologyItem from "@/components/technology-item";
import type { Technology } from "@/types";
import * as LucideIcons from "lucide-react"; 
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const getIconComponent = (iconName: keyof typeof LucideIcons | undefined): LucideIcons.LucideIcon => {
  if (!iconName || !LucideIcons[iconName]) {
    return LucideIcons.Code; 
  }
  return LucideIcons[iconName] as LucideIcons.LucideIcon;
};

export default function TechnologiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/technologies');
        if (!response.ok) {
          throw new Error('Failed to fetch technologies');
        }
        const data: Technology[] = await response.json();
        setTechnologies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  useEffect(() => {
    const targetRef = sectionRef.current;
    if (isLoading || !targetRef) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
          observer.unobserve(targetRef);
        }
      },
      { threshold: 0.05 } 
    );

    observer.observe(targetRef);

    return () => {
      if (targetRef) {
        observer.unobserve(targetRef);
      }
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <section id="technologies" className="py-20 md:py-32 bg-secondary scroll-mt-20 relative overflow-hidden">
         <div className="absolute inset-0" style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
             <Loader2 className="h-12 w-12 animate-spin text-primary inline-block" />
        </div>
      </section>
    );
  }

  if (error || !technologies || technologies.length === 0) {
     return (
      <section id="technologies" className="py-20 md:py-32 bg-secondary scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <p className="text-destructive">{error || "Technologies not available."}</p>
        </div>
      </section>
    );
  }


  return (
    <section 
      id="technologies" 
      ref={sectionRef} 
      className="py-20 md:py-32 bg-secondary scroll-mt-20 relative overflow-hidden"
    >
      <div 
        className="absolute inset-0"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 
            className={`font-headline text-4xl sm:text-5xl font-bold text-center mb-16 text-primary ${isSectionVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          Tecnologias
        </h2>
        {technologies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {technologies.map((tech, index) => {
                const IconComponent = getIconComponent(tech.iconName as keyof typeof LucideIcons);
                return (
                <TechnologyItem 
                    key={tech.id} 
                    technology={{...tech, icon: IconComponent}} 
                    index={index} 
                />
                );
            })}
            </div>
        ) : (
            <p className="text-center text-foreground/70">Nenhuma tecnologia para exibir.</p>
        )}
      </div>
    </section>
  );
}
