'use client';

import ArticleForm, { type ArticleFormData } from '../article-form';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewArticlePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create article');
      }

      toast({ title: "Success!", description: "Article created successfully." });
      router.push('/admin/articles');
      router.refresh(); // To reflect changes in the articles list page
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Create New Article</CardTitle>
      </CardHeader>
      <CardContent>
        <ArticleForm 
          isEditing={false} 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}
