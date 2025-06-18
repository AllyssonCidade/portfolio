"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";
import { BookOpen, Loader2, PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

const ARTICLES_PER_PAGE = 3;

export default function ArticlesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticlesPage = async (pageToFetch: number) => {
    if (pageToFetch === 1) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/articles?page=${pageToFetch}&limit=${ARTICLES_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();

      if (pageToFetch === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles((prevArticles) => [
          ...prevArticles,
          ...(data.articles || []),
        ]);
      }
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      if (pageToFetch === 1) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchArticlesPage(1);
  }, []);

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
    };
  }, [isLoading]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      fetchArticlesPage(currentPage + 1);
    }
  };

  return (
    <section
      id="articles"
      ref={sectionRef}
      className={`py-20 md:py-32 bg-background scroll-mt-20 ${
        isVisible ? "animate-fade-in-scale" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-4xl sm:text-5xl font-bold text-center mb-4 text-primary">
          Artigos e Guias Técnicos
        </h2>
        <p className="text-center text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
          Compartilhando conhecimento e experiências através de posts e
          tutoriais.
        </p>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-3 text-lg text-foreground/80">
              Carregando artigos...
            </p>
          </div>
        )}
        {!isLoading && error && (
          <p className="text-center text-destructive">
            Falha ao carregar artigos: {error}
          </p>
        )}
        {!isLoading && !error && articles.length === 0 && (
          <p className="text-center text-foreground/70">
            Nenhum artigo publicado ainda. Volte em breve!
          </p>
        )}

        {!isLoading && !error && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  className={`
                        transition-all duration-700 ease-out will-change-transform
                        ${
                          isVisible
                            ? "opacity-100 scale-100 visible"
                            : "opacity-0 scale-90 invisible"
                        }
                      `}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <Card className="bg-card border-border shadow-lg flex flex-col group transition-all duration-300 ease-in-out hover:shadow-primary/30 hover:border-primary/50 overflow-hidden h-full">
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      {article.imageUrl && (
                        <Image
                          src={
                            article.imageUrl.startsWith("http")
                              ? article.imageUrl
                              : `/images/${article.imageUrl}`
                          }
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint={article.imageHint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="font-headline text-xl text-primary group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Por {article.author} em{" "}
                        {format(new Date(article.publishedDate), "dd/MM/yyyy")}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="prose prose-sm text-foreground/70 leading-relaxed line-clamp-3 max-w-none">
                        <ReactMarkdown>{article.excerpt}</ReactMarkdown>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/50">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground group-hover:border-primary group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                      >
                        <Link href={`/articles/${article.slug}`}>
                          Ler Artigo Completo{" "}
                          <BookOpen size={16} className="ml-2" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>

            {currentPage < totalPages && !isLoading && (
              <div className="mt-12 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="default"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} className="mr-2" />
                      Carregar Mais Artigos
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
