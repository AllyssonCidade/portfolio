'use client';

import { useState, useEffect, type FormEvent } from 'react';
import type { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, PlusCircle, Trash2, Edit3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const initialServiceFormState: Omit<Service, 'id'> = {
  title: '',
  description: '',
  imageUrl: 'placeholder-service.png', // Default relative path
  imageHint: 'default placeholder',
};

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [serviceForm, setServiceForm] = useState(initialServiceFormState);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({ title: "Error", description: "Could not fetch services.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const url = editingServiceId ? `/api/services/${editingServiceId}` : '/api/services';
    const method = editingServiceId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editingServiceId ? 'update' : 'add'} service`);
      }
      toast({ title: "Success!", description: `Service ${editingServiceId ? 'updated' : 'added'} successfully.` });
      setServiceForm(initialServiceFormState); 
      setEditingServiceId(null); 
      await fetchServices(); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    setIsSubmitting(true); 
    try {
      const response = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete service');
      }
      toast({ title: "Success!", description: "Service deleted successfully." });
      await fetchServices(); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
      imageHint: service.imageHint,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };


  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-8">Manage Services</h2>

      <Card className="mb-8 bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{editingServiceId ? 'Edit Service' : 'Add New Service'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-foreground/80 font-medium">Title</Label>
              <Input id="title" name="title" value={serviceForm.title} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="description" className="text-foreground/80 font-medium">Description</Label>
              <Textarea id="description" name="description" value={serviceForm.description} onChange={handleInputChange} required rows={3} className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            <div>
              <Label htmlFor="imageUrl" className="text-foreground/80 font-medium">Image Filename (e.g., my-image.png)</Label>
              <Input id="imageUrl" name="imageUrl" type="text" value={serviceForm.imageUrl} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" placeholder="example.png"/>
              <p className="text-xs text-muted-foreground mt-1">Place the image in `public/images/` folder.</p>
            </div>
            <div>
              <Label htmlFor="imageHint" className="text-foreground/80 font-medium">Image Hint (for AI generation)</Label>
              <Input id="imageHint" name="imageHint" value={serviceForm.imageHint} onChange={handleInputChange} required className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingServiceId ? <Edit3 size={18} className="mr-2" /> : <PlusCircle size={18} className="mr-2" />)}
                {editingServiceId ? 'Update Service' : 'Add Service'}
              </Button>
              {editingServiceId && (
                <Button type="button" variant="outline" onClick={() => { setEditingServiceId(null); setServiceForm(initialServiceFormState); }}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <h3 className="text-2xl font-semibold text-primary mb-6">Current Services</h3>
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-xl text-foreground/80">Loading services...</p>
        </div>
      )}
      {!isLoading && error && <p className="text-destructive">Error loading services: {error}</p>}
      {!isLoading && !error && services.length === 0 && <p className="text-foreground/70">No services found.</p>}
      
      {!isLoading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Card key={service.id} className="bg-card border-border shadow-md flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg text-primary">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="relative w-full h-40 object-cover rounded-md mb-2 overflow-hidden">
                    <Image 
                        src={service.imageUrl.startsWith('http') ? service.imageUrl : `/images/${service.imageUrl}`} 
                        alt={service.title} 
                        fill
                        className="object-cover"
                        data-ai-hint={service.imageHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <p className="text-sm text-foreground/80 line-clamp-3">{service.description}</p>
                <p className="text-xs text-muted mt-1">Hint: {service.imageHint}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border/50 pt-4">
                 <Button variant="outline" size="sm" onClick={() => handleEdit(service)} disabled={isSubmitting} className="text-accent hover:text-accent-foreground border-accent hover:bg-accent/10">
                    <Edit3 size={16} className="mr-1" /> Edit
                  </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)} disabled={isSubmitting}>
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
