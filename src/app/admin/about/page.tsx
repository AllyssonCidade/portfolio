// src/app/admin/about/page.tsx
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import type { AboutData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialAboutFormState: AboutData = {
  imageUrl: "profile-placeholder.png", // Default relative path
  imageHint: "default placeholder",
  imageAlt: "Placeholder image",
  title: "",
  paragraph1: "",
  paragraph2: "",
  resumeModalButtonText: "Ver Currículo",
  downloadResumeButtonText: "Baixar Currículo",
  downloadResumeLink: "/curriculo-allysson.pdf", // Assuming PDF in /public
};

export default function ManageAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>(initialAboutFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchAboutData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/about');
        if (!response.ok) {
          throw new Error('Failed to fetch About Me data');
        }
        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(msg);
        toast({ title: "Error", description: `Could not fetch About Me data: ${msg}`, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update About Me data');
      }
      toast({ title: "Success!", description: "About Me section updated successfully." });
      const updatedData = await response.json();
      setAboutData(updatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-foreground/80">Loading About Me Data...</p>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Manage About Me Section</CardTitle>
        <CardDescription>Update the content for the "About Me" part of your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-foreground/80 font-medium">Section Title</Label>
            <Input id="title" name="title" value={aboutData.title} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="paragraph1" className="text-foreground/80 font-medium">Paragraph 1</Label>
            <Textarea id="paragraph1" name="paragraph1" value={aboutData.paragraph1} onChange={handleInputChange} required rows={4} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="paragraph2" className="text-foreground/80 font-medium">Paragraph 2</Label>
            <Textarea id="paragraph2" name="paragraph2" value={aboutData.paragraph2} onChange={handleInputChange} rows={4} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="imageUrl" className="text-foreground/80 font-medium">Image Filename (e.g., profile.png)</Label>
            <Input id="imageUrl" name="imageUrl" type="text" value={aboutData.imageUrl} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" placeholder="allysson-portrait.png"/>
            <p className="text-xs text-muted-foreground mt-1">Place the image in `public/images/` folder.</p>
          </div>
          <div>
            <Label htmlFor="imageHint" className="text-foreground/80 font-medium">Image Hint</Label>
            <Input id="imageHint" name="imageHint" value={aboutData.imageHint} onChange={handleInputChange} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="imageAlt" className="text-foreground/80 font-medium">Image Alt Text</Label>
            <Input id="imageAlt" name="imageAlt" value={aboutData.imageAlt} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="resumeModalButtonText" className="text-foreground/80 font-medium">"Ver Currículo" Button Text</Label>
            <Input id="resumeModalButtonText" name="resumeModalButtonText" value={aboutData.resumeModalButtonText} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="downloadResumeButtonText" className="text-foreground/80 font-medium">"Baixar Currículo" Button Text</Label>
            <Input id="downloadResumeButtonText" name="downloadResumeButtonText" value={aboutData.downloadResumeButtonText} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="downloadResumeLink" className="text-foreground/80 font-medium">Download Resume Link (e.g., /cv.pdf)</Label>
            <Input id="downloadResumeLink" name="downloadResumeLink" value={aboutData.downloadResumeLink} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isSubmitting || isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={18} className="mr-2"/>}
            Save About Me Content
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
