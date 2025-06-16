// src/app/admin/hero/page.tsx
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import type { HeroData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialHeroFormState: HeroData = {
  mainHeading: "",
  subHeadingPrimary: "",
  subHeadingSecondary: "",
  backgroundImageUrl: "hero-placeholder.jpg", // Default relative path
  backgroundImageHint: "default background",
  ctaButton1Text: "CTA 1",
  ctaButton1Link: "#",
  ctaButton2Text: "CTA 2",
  ctaButton2Link: "#",
};

export default function ManageHeroPage() {
  const [heroData, setHeroData] = useState<HeroData>(initialHeroFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchHeroData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/hero');
        if (!response.ok) {
          throw new Error('Failed to fetch hero data');
        }
        const data = await response.json();
        setHeroData(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(msg);
        toast({ title: "Error", description: `Could not fetch hero data: ${msg}`, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHeroData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update hero data');
      }
      toast({ title: "Success!", description: "Hero section updated successfully." });
      const updatedData = await response.json();
      setHeroData(updatedData);
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
        <p className="ml-4 text-xl text-foreground/80">Loading Hero Data...</p>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Manage Hero Section</CardTitle>
        <CardDescription>Update the content for the main hero banner of your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="mainHeading" className="text-foreground/80 font-medium">Main Heading</Label>
            <Input id="mainHeading" name="mainHeading" value={heroData.mainHeading} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="subHeadingPrimary" className="text-foreground/80 font-medium">Sub Heading (Primary)</Label>
            <Input id="subHeadingPrimary" name="subHeadingPrimary" value={heroData.subHeadingPrimary} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="subHeadingSecondary" className="text-foreground/80 font-medium">Sub Heading (Secondary)</Label>
            <Textarea id="subHeadingSecondary" name="subHeadingSecondary" value={heroData.subHeadingSecondary} onChange={handleInputChange} rows={2} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div>
            <Label htmlFor="backgroundImageUrl" className="text-foreground/80 font-medium">Background Image Filename (e.g., hero-bg.jpg)</Label>
            <Input id="backgroundImageUrl" name="backgroundImageUrl" type="text" value={heroData.backgroundImageUrl} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" placeholder="hero-background.jpg"/>
            <p className="text-xs text-muted-foreground mt-1">Place the image in `public/images/` folder.</p>
          </div>
           <div>
            <Label htmlFor="backgroundImageHint" className="text-foreground/80 font-medium">Background Image Hint</Label>
            <Input id="backgroundImageHint" name="backgroundImageHint" value={heroData.backgroundImageHint} onChange={handleInputChange} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ctaButton1Text" className="text-foreground/80 font-medium">CTA Button 1 Text</Label>
              <Input id="ctaButton1Text" name="ctaButton1Text" value={heroData.ctaButton1Text} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="ctaButton1Link" className="text-foreground/80 font-medium">CTA Button 1 Link</Label>
              <Input id="ctaButton1Link" name="ctaButton1Link" value={heroData.ctaButton1Link} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ctaButton2Text" className="text-foreground/80 font-medium">CTA Button 2 Text</Label>
              <Input id="ctaButton2Text" name="ctaButton2Text" value={heroData.ctaButton2Text} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="ctaButton2Link" className="text-foreground/80 font-medium">CTA Button 2 Link</Label>
              <Input id="ctaButton2Link" name="ctaButton2Link" value={heroData.ctaButton2Link} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isSubmitting || isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={18} className="mr-2"/>}
            Save Hero Content
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
