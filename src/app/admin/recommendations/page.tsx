// src/app/admin/recommendations/page.tsx
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import type { Recommendation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, PlusCircle, Trash2, Edit3, Linkedin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const initialRecommendationFormState: Omit<Recommendation, 'id'> = {
  name: '',
  title: '',
  avatarUrl: 'avatar-placeholder.png', // Default relative path
  avatarHint: 'person avatar',
  message: '',
  linkedInUrl: 'https://linkedin.com/in/',
};

export default function ManageRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [recommendationForm, setRecommendationForm] = useState(initialRecommendationFormState);
  const [editingRecId, setEditingRecId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recommendations');
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      toast({ title: "Error", description: `Could not fetch recommendations: ${msg}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []); // Removed toast from dependency array as it's stable

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecommendationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const url = editingRecId ? `/api/recommendations/${editingRecId}` : '/api/recommendations';
    const method = editingRecId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendationForm),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editingRecId ? 'update' : 'add'} recommendation`);
      }
      toast({ title: "Success!", description: `Recommendation ${editingRecId ? 'updated' : 'added'} successfully.` });
      setRecommendationForm(initialRecommendationFormState);
      setEditingRecId(null);
      await fetchRecommendations();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (recId: string, recName: string) => {
    if (!confirm(`Are you sure you want to delete the recommendation from "${recName}"?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/recommendations/${recId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete recommendation');
      }
      toast({ title: "Success!", description: "Recommendation deleted successfully." });
      await fetchRecommendations(); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };
  
  const handleEdit = (rec: Recommendation) => {
    setEditingRecId(rec.id);
    setRecommendationForm({
      name: rec.name,
      title: rec.title,
      avatarUrl: rec.avatarUrl,
      avatarHint: rec.avatarHint,
      message: rec.message,
      linkedInUrl: rec.linkedInUrl,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-8">Manage Recommendations</h2>

      <Card className="mb-8 bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{editingRecId ? 'Edit Recommendation' : 'Add New Recommendation'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground/80 font-medium">Name</Label>
              <Input id="name" name="name" value={recommendationForm.name} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="title" className="text-foreground/80 font-medium">Title (e.g., Tech Lead at Company)</Label>
              <Input id="title" name="title" value={recommendationForm.title} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="message" className="text-foreground/80 font-medium">Message</Label>
              <Textarea id="message" name="message" value={recommendationForm.message} onChange={handleInputChange} required rows={4} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="avatarUrl" className="text-foreground/80 font-medium">Avatar Filename or URL (e.g., person.png or https://...)</Label>
              <Input id="avatarUrl" name="avatarUrl" type="text" value={recommendationForm.avatarUrl} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" placeholder="avatar.png or https://..."/>
              <p className="text-xs text-muted-foreground mt-1">If using a filename, place the image in `public/images/`.</p>
            </div>
            <div>
              <Label htmlFor="avatarHint" className="text-foreground/80 font-medium">Avatar Hint (for AI generation)</Label>
              <Input id="avatarHint" name="avatarHint" value={recommendationForm.avatarHint} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="linkedInUrl" className="text-foreground/80 font-medium">LinkedIn Profile URL</Label>
              <Input id="linkedInUrl" name="linkedInUrl" type="url" value={recommendationForm.linkedInUrl} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingRecId ? <Edit3 size={18} className="mr-2" /> : <PlusCircle size={18} className="mr-2" />)}
                {editingRecId ? 'Update Recommendation' : 'Add Recommendation'}
              </Button>
              {editingRecId && (
                <Button type="button" variant="outline" onClick={() => { setEditingRecId(null); setRecommendationForm(initialRecommendationFormState); }}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <h3 className="text-2xl font-semibold text-primary mb-6">Current Recommendations</h3>
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-xl text-foreground/80">Loading recommendations...</p>
        </div>
      )}
      {!isLoading && error && !recommendations.length && <p className="text-destructive">Error loading recommendations: {error}</p>}
      {!isLoading && !error && recommendations.length === 0 && <p className="text-foreground/70">No recommendations found.</p>}
      
      {!isLoading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(rec => (
            <Card key={rec.id} className="bg-card border-border shadow-md flex flex-col">
              <CardHeader>
                 <div className="flex items-center space-x-3 mb-2">
                  {rec.avatarUrl && (
                    <Image 
                        src={rec.avatarUrl.startsWith('http') ? rec.avatarUrl : `/images/${rec.avatarUrl}`}
                        alt={`Avatar of ${rec.name}`} 
                        width={48} 
                        height={48} 
                        className="rounded-full border-2 border-primary/50 object-cover"
                        data-ai-hint={rec.avatarHint}
                    />
                  )}
                    <div>
                        <CardTitle className="text-md text-primary">{rec.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{rec.title}</p>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-foreground/80 line-clamp-4">{rec.message}</p>
                <a href={rec.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-primary mt-2 inline-flex items-center">
                    View on LinkedIn <Linkedin size={12} className="ml-1"/>
                </a>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border/50 pt-4">
                 <Button variant="outline" size="sm" onClick={() => handleEdit(rec)} disabled={isSubmitting} className="text-accent hover:text-accent-foreground border-accent hover:bg-accent/10">
                    <Edit3 size={16} className="mr-1" /> Edit
                  </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(rec.id, rec.name)} disabled={isSubmitting}>
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
