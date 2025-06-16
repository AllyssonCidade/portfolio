'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ArticleForm, { type ArticleFormData } from '../../article-form';
import type { Article } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const router = useRouter();
  const { toast } = useToast();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchArticle = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/articles/${slug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch article data');
          }
          const data = await response.json();
          setArticle(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(msg);
            toast({ title: "Error", description: msg, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticle();
    } else {
        setIsLoading(false);
        setError("Article slug is missing.");
        toast({ title: "Error", description: "Article slug is missing.", variant: "destructive" });
    }
  }, [slug, toast]);

  const handleSubmit = async (data: ArticleFormData) => {
    if (!slug) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update article');
      }

      toast({ title: "Success!", description: "Article updated successfully." });
      router.push('/admin/articles');
      router.refresh(); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-foreground/80">Loading article data...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Error: {error}</p>;
  }

  if (!article) {
    return <p className="text-foreground/70">Article not found or failed to load.</p>;
  }

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Edit Article: {article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ArticleForm 
          initialData={article} 
          isEditing={true} 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}
