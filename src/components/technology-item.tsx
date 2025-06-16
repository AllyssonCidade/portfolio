'use client';
import type { Technology as TechnologyType } from '@/types'; // Renamed to avoid conflict
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';


interface TechnologyItemProps {
  technology: TechnologyType & { icon: LucideIcon }; // Expecting icon component to be passed
  index: number; 
}

export default function TechnologyItem({ technology, index }: TechnologyItemProps) {
  const IconComponent = technology.icon;
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentItemRef = itemRef.current;
    if (currentItemRef) {
      observer.observe(currentItemRef);
    }

    return () => {
      if (currentItemRef) {
        observer.unobserve(currentItemRef);
      }
    };
  }, []);

  return (
    <div 
      ref={itemRef} 
      className={`${isVisible ? 'animate-scale-in-item' : 'opacity-0'}`} 
      style={{ animationDelay: isVisible ? `${index * 75}ms` : undefined }}
    >
      <Card
        className="group transition-all duration-300 ease-in-out rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center aspect-square">
          <IconComponent
            size={48}
            className="mb-3 text-primary transition-colors group-hover:text-accent"
            strokeWidth={1.5}
            style={technology.color ? { color: technology.color } : {}}
          />
          <p className="text-sm md:text-base font-medium text-center text-foreground group-hover:text-accent transition-colors">
            {technology.name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
