"use client";

import { useEffect, useState, useRef } from "react";
import type { GitHubRepo } from "@/types";
import ProjectCard from "@/components/project-card";
import { Loader2, PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

const PROJECTS_PER_PAGE = 6;

export default function ProjectsSection() {
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
  const [visibleRepos, setVisibleRepos] = useState<GitHubRepo[]>([]);
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const targetRef = sectionRef.current;
    if (loading || !targetRef) {
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
  }, [loading]);

  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://api.github.com/users/AllyssonCidade/repos?sort=updated&direction=desc"
        );
        if (!response.ok) {
          throw new Error(
            `Falha ao buscar repositórios: ${response.statusText}`
          );
        }
        const data = await response.json();
        setAllRepos(data);
        setVisibleRepos(data.slice(0, PROJECTS_PER_PAGE));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, []);

  const handleLoadMore = () => {
    const newVisibleCount = visibleCount + PROJECTS_PER_PAGE;
    setVisibleCount(newVisibleCount);
    setVisibleRepos(allRepos.slice(0, newVisibleCount));
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-20 md:py-32 bg-background scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end ${
            isSectionVisible
              ? "opacity-100 scale-100 visible transition-all duration-700 ease-out"
              : "opacity-0 scale-90 invisible"
          }
`}
          style={{ animationDelay: isSectionVisible ? "0ms" : undefined }}
        >
          <div className="mb-6 md:mb-0 md:text-left">
            <p className="text-muted-foreground text-base md:text-lg">
              Projetos reais com tecnologias modernas
            </p>
          </div>
          <div className="md:text-right w-full md:w-auto">
            <h2 className="font-headline text-4xl sm:text-5xl font-bold text-primary uppercase tracking-wider">
              Meus Projetos
            </h2>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-xl text-foreground/80">
              Carregando projetos...
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar Projetos</AlertTitle>
            <AlertDescription>
              {error} Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && allRepos.length === 0 && (
          <p className="text-center text-xl text-foreground/70">
            Nenhum projeto encontrado no GitHub no momento.
          </p>
        )}

        {!loading && !error && visibleRepos.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleRepos.map((repo, index) => (
                <ProjectCard key={repo.id} repo={repo} index={index} />
              ))}
            </div>
            {visibleCount < allRepos.length && (
              <div
                className={`text-center mt-12 ${
                  isSectionVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: isSectionVisible
                    ? `${visibleRepos.length * 100 + 200}ms`
                    : undefined,
                }}
              >
                <Button
                  onClick={handleLoadMore}
                  variant="default"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 w-full max-w-xs sm:max-w-sm mx-auto text-lg py-3 rounded-md shadow-md"
                >
                  <PlusCircle size={20} className="mr-2" />
                  Carregar mais projetos
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
