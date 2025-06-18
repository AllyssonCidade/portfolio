"use client";
import type { GitHubRepo } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ProjectCardProps {
  repo: GitHubRepo;
  index: number;
}

export default function ProjectCard({ repo, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
    transition-all duration-700 ease-out will-change-transform
    ${
      isVisible
        ? "opacity-100 scale-100 visible"
        : "opacity-0 scale-90 invisible"
    }
  `}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <Card className="bg-[#1C1C1C] border-card shadow-lg flex flex-col h-full rounded-lg transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:border-primary/40">
        <CardHeader className="p-6">
          <CardTitle className="font-headline text-2xl text-foreground truncate">
            {repo.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-6 pt-0">
          <CardDescription className="text-muted leading-relaxed line-clamp-4">
            {repo.description || "Sem descrição disponível."}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-4 border-t border-card/30">
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no GitHub <ExternalLink size={16} className="ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
