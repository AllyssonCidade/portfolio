
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Loader2, PlusCircle, Trash2, Edit3, Eye, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import Image from 'next/image';

const ARTICLES_PER_PAGE = 6;

export default function ManageArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { toast } = useToast();

  const fetchArticles = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles?page=${page}&limit=${ARTICLES_PER_PAGE}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data.articles);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      toast({ title: "Error", description: `Could not fetch articles: ${msg}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [fetchArticles, currentPage]);

  const handleDelete = async (slug: string, articleTitle: string) => {
    if (!confirm(`Are you sure you want to delete the article "${articleTitle}"? This cannot be undone.`)) {
      return;
    }
    setIsDeleting(slug);
    try {
      const response = await fetch(`/api/articles/${slug}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete article');
      }
      toast({ title: "Success!", description: "Article deleted successfully." });
      if (articles.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev -1);
      } else {
        fetchArticles(currentPage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Manage Articles</h2>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/admin/articles/new">
            <PlusCircle size={18} className="mr-2" /> Add New Article
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-xl text-foreground/80">Loading articles...</p>
        </div>
      )}
      {!isLoading && error && <p className="text-destructive text-center py-10">Error loading articles: {error}</p>}
      {!isLoading && !error && articles.length === 0 && (
        <p className="text-foreground/70 text-center py-10">
          {currentPage > 1 ? "No articles on this page." : "No articles found. Add one to get started!"}
        </p>
      )}
      
      {!isLoading && !error && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Card key={article.id} className="bg-card border-border shadow-md flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg text-primary line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    By {article.author} on {format(new Date(article.publishedDate), 'MMM dd, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="relative w-full h-40 object-cover rounded-md mb-2 overflow-hidden">
                      <Image 
                          src={article.imageUrl.startsWith('http') ? article.imageUrl : `/images/${article.imageUrl}`} 
                          alt={article.title} 
                          fill
                          className="object-cover"
                          data-ai-hint={article.imageHint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                  </div>
                  <p className="text-sm text-foreground/80 line-clamp-3">{article.excerpt}</p>
                   <p className="text-xs text-muted-foreground mt-1">Slug: /articles/{article.slug}</p>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-end gap-2 border-t border-border/50 pt-4">
                   <Button variant="outline" size="sm" asChild className="text-accent hover:text-accent-foreground border-accent hover:bg-accent/10">
                      <Link href={`/admin/articles/edit/${article.slug}`}>
                        <Edit3 size={16} className="mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="text-blue-500 hover:text-blue-400 border-blue-500 hover:bg-blue-500/10">
                      <Link href={`/articles/${article.slug}`} target="_blank">
                          <Eye size={16} className="mr-1" /> View
                      </Link>
                    </Button>
                    {article.originalArticleUrl && (
                         <Button variant="outline" size="sm" asChild className="text-purple-500 hover:text-purple-400 border-purple-500 hover:bg-purple-500/10">
                            <Link href={article.originalArticleUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={16} className="mr-1" /> Original Link
                            </Link>
                        </Button>
                    )}
                  <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(article.slug, article.title)} 
                      disabled={isDeleting === article.slug}
                  >
                    {isDeleting === article.slug ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 size={16} className="mr-1" />}
                     Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              <Button 
                onClick={handlePreviousPage} 
                disabled={currentPage === 1 || isLoading}
                variant="outline"
              >
                <ChevronLeft size={18} className="mr-1" /> Previous
              </Button>
              <span className="text-foreground/80">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages || isLoading}
                variant="outline"
              >
                Next <ChevronRight size={18} className="ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
