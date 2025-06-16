'use client';

import { useState, useEffect, type FormEvent } from 'react';
import type { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

export type ArticleFormData = Omit<Article, 'id' | 'publishedDate'> & { publishedDate?: string }; 

interface ArticleFormProps {
  initialData?: Article | null;
  isEditing: boolean;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  isLoading?: boolean;
}

const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export default function ArticleForm({ initialData, isEditing, onSubmit, isLoading: isSubmitting }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    slug: '',
    title: '',
    excerpt: '',
    contentMarkdown: '',
    imageUrl: 'article-placeholder.png', 
    imageHint: 'article placeholder',
    originalArticleUrl: '',
    author: 'Allysson Cidade',
    publishedDate: new Date().toISOString().split('T')[0], 
    ...initialData, 
  });
  
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    if (initialData) {
      setFormData({
        slug: initialData.slug,
        title: initialData.title,
        excerpt: initialData.excerpt,
        contentMarkdown: initialData.contentMarkdown,
        imageUrl: initialData.imageUrl,
        imageHint: initialData.imageHint,
        originalArticleUrl: initialData.originalArticleUrl || '',
        author: initialData.author,
        publishedDate: initialData.publishedDate ? new Date(initialData.publishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'title' && !isEditing && !initialData?.slug) { 
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, publishedDate: e.target.value}));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.contentMarkdown) {
        toast({ title: "Error", description: "Please fill in all required fields (Title, Slug, Excerpt, Content).", variant: "destructive" });
        return;
    }
    const dataToSubmit: ArticleFormData = {
        ...formData,
        publishedDate: formData.publishedDate ? new Date(formData.publishedDate).toISOString() : new Date().toISOString(),
        originalArticleUrl: formData.originalArticleUrl || null, // Ensure it's null if empty
    };
    await onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-foreground/80 font-medium">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
      </div>
      <div>
        <Label htmlFor="slug" className="text-foreground/80 font-medium">Slug (URL Path)</Label>
        <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
        <p className="text-xs text-muted-foreground mt-1">Auto-generated from title if left empty on creation. Used in the URL, e.g., /articles/your-slug.</p>
      </div>
      <div>
        <Label htmlFor="excerpt" className="text-foreground/80 font-medium">Excerpt (Short Summary)</Label>
        <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} required rows={3} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
      </div>
      <div>
        <Label htmlFor="contentMarkdown" className="text-foreground/80 font-medium">Content (Markdown)</Label>
        <Textarea id="contentMarkdown" name="contentMarkdown" value={formData.contentMarkdown} onChange={handleInputChange} required rows={15} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground font-mono text-sm" />
        <p className="text-xs text-muted-foreground mt-1">Write your article content using Markdown syntax.</p>
      </div>
      <div>
        <Label htmlFor="imageUrl" className="text-foreground/80 font-medium">Image Filename or URL (e.g., article-banner.jpg or https://...)</Label>
        <Input id="imageUrl" name="imageUrl" type="text" value={formData.imageUrl} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" placeholder="article-image.png or https://example.com/image.jpg"/>
        <p className="text-xs text-muted-foreground mt-1">If using a filename, place the image in `public/images/`. Otherwise, provide a full URL.</p>
      </div>
      <div>
        <Label htmlFor="imageHint" className="text-foreground/80 font-medium">Image Hint (e.g., 'code abstract')</Label>
        <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
      </div>
       <div>
        <Label htmlFor="originalArticleUrl" className="text-foreground/80 font-medium">Original Article Link (Optional)</Label>
        <Input id="originalArticleUrl" name="originalArticleUrl" type="url" value={formData.originalArticleUrl || ''} onChange={handleInputChange} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" placeholder="https://www.linkedin.com/pulse/your-article"/>
        <p className="text-xs text-muted-foreground mt-1">Link to the original post (e.g., on LinkedIn, Medium).</p>
      </div>
      <div>
        <Label htmlFor="author" className="text-foreground/80 font-medium">Author</Label>
        <Input id="author" name="author" value={formData.author} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
      </div>
      <div>
        <Label htmlFor="publishedDate" className="text-foreground/80 font-medium">Published Date</Label>
        <Input id="publishedDate" name="publishedDate" type="date" value={formData.publishedDate ? formData.publishedDate.split('T')[0] : ''} onChange={handleDateChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? <Save size={18} className="mr-2"/> : <PlusCircle size={18} className="mr-2"/>)}
        {isEditing ? 'Save Changes' : 'Create Article'}
      </Button>
       <Button type="button" variant="outline" onClick={() => router.push('/admin/articles')} className="ml-2">
        Cancel
      </Button>
    </form>
  );
}
