"use client";
import type { Technology as TechnologyType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface TechnologyItemProps {
  technology: TechnologyType & { icon: LucideIcon };
  index: number;
}

export default function TechnologyItem({
  technology,
  index,
}: TechnologyItemProps) {
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
        threshold: 0.4,
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
      className={`${
        isVisible
          ? `animate-scale-in-item animation-delay-${index * 75}`
          : "opacity-0 scale-90 invisible"
      } will-change-transform`}
    >
      <Card
        className="group transition-all duration-300 ease-in-out rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center aspect-square">
          {technology.iconSvg ? (
            <div
              className="w-18 h-18 mb-3 text-primary transition-colors group-hover:text-accent"
              style={{
                color: technology.color || "currentColor",
              }}
              dangerouslySetInnerHTML={{ __html: technology.iconSvg }}
            />
          ) : (
            <IconComponent
              size={48}
              className="mb-3 text-primary transition-colors group-hover:text-accent"
              strokeWidth={1.5}
              style={technology.color ? { color: technology.color } : {}}
            />
          )}

          <p className="text-sm md:text-base font-medium text-center text-foreground group-hover:text-accent transition-colors">
            {technology.name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
