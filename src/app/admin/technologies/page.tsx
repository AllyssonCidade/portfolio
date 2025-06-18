"use client";

import { useState, useEffect, type FormEvent } from "react";
import type { Technology } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2, Edit3, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

const initialTechnologyFormState: Omit<Technology, "id"> & {
  iconSvg?: string;
} = {
  name: "",
  iconName: "Code",
  iconSvg: "",
  color: "#FFFFFF",
};

const getIconComponent = (
  iconName: IconName | undefined
): LucideIcons.LucideIcon => {
  if (!iconName || !LucideIcons[iconName]) {
    return LucideIcons.Code; // Default icon if not found
  }
  return LucideIcons[iconName] as LucideIcons.LucideIcon;
};

export default function ManageTechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [technologyForm, setTechnologyForm] = useState(
    initialTechnologyFormState
  );
  const [editingTechId, setEditingTechId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchTechnologies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/technologies");
      if (!response.ok) {
        throw new Error("Failed to fetch technologies");
      }
      const data = await response.json();
      setTechnologies(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(msg);
      toast({
        title: "Error",
        description: `Could not fetch technologies: ${msg}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTechnologyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const url = editingTechId
      ? `/api/technologies/${editingTechId}`
      : "/api/technologies";
    const method = editingTechId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(technologyForm),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${editingTechId ? "update" : "add"} technology`
        );
      }
      toast({
        title: "Success!",
        description: `Technology ${
          editingTechId ? "updated" : "added"
        } successfully.`,
      });
      setTechnologyForm(initialTechnologyFormState);
      setEditingTechId(null);
      await fetchTechnologies();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (techId: string, techName: string) => {
    if (
      !confirm(`Are you sure you want to delete the technology "${techName}"?`)
    ) {
      return;
    }
    try {
      const response = await fetch(`/api/technologies/${techId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete technology");
      }
      toast({
        title: "Success!",
        description: "Technology deleted successfully.",
      });
      await fetchTechnologies();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tech: Technology) => {
    setEditingTechId(tech.id);
    setTechnologyForm({
      name: tech.name,
      iconName: tech.iconName,
      iconSvg: tech.iconSvg ?? "", // substitui null por string vazia
      color: tech.color || "#FFFFFF",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const lucideIconNames = Object.keys(LucideIcons) as IconName[];

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-8">
        Manage Technologies
      </h2>

      <Card className="mb-8 bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            {editingTechId ? "Edit Technology" : "Add New Technology"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground/80 font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={technologyForm.name}
                onChange={handleInputChange}
                required
                className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground"
              />
            </div>

            <div>
              <Label
                htmlFor="iconName"
                className="text-foreground/80 font-medium"
              >
                Icon Name (Lucide Icon)
              </Label>
              <select
                id="iconName"
                name="iconName"
                value={technologyForm.iconName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full bg-input border-border focus:ring-primary focus:border-primary text-foreground rounded-md shadow-sm p-2"
              >
                {lucideIconNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Select an icon from{" "}
                <a
                  href="https://lucide.dev/icons/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Lucide Icons
                </a>
                .
              </p>
            </div>

            <div>
              <Label
                htmlFor="iconSvg"
                className="text-foreground/80 font-medium"
              >
                Icon SVG (raw SVG code)
              </Label>
              <textarea
                id="iconSvg"
                name="iconSvg"
                value={technologyForm.iconSvg || ""}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 w-full bg-input border-border focus:ring-primary focus:border-primary text-foreground rounded-md p-2"
                placeholder="<svg>...</svg>"
              />
            </div>

            <div>
              <Label htmlFor="color" className="text-foreground/80 font-medium">
                Color (Hex, e.g., #61DAFB)
              </Label>
              <div className="flex items-center mt-1">
                <Input
                  id="color"
                  name="color"
                  type="text"
                  value={technologyForm.color}
                  onChange={handleInputChange}
                  className="bg-input border-border focus:ring-primary focus:border-primary text-foreground rounded-l-md"
                  placeholder="#FFFFFF"
                />
                <Input
                  type="color"
                  value={technologyForm.color}
                  onChange={(e) =>
                    setTechnologyForm((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="w-12 h-10 p-1 rounded-r-md border-l-0 cursor-pointer"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingTechId ? (
                  <>
                    <Edit3 size={18} className="mr-2" />
                    Update Technology
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} className="mr-2" />
                    Add Technology
                  </>
                )}
              </Button>
              {editingTechId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingTechId(null);
                    setTechnologyForm(initialTechnologyFormState);
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <h3 className="text-2xl font-semibold text-primary mb-6">
        Current Technologies
      </h3>
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-xl text-foreground/80">
            Loading technologies...
          </p>
        </div>
      )}
      {!isLoading && error && !technologies.length && (
        <p className="text-destructive">Error loading technologies: {error}</p>
      )}
      {!isLoading && !error && technologies.length === 0 && (
        <p className="text-foreground/70">No technologies found.</p>
      )}

      {!isLoading && !error && technologies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {technologies.map((tech) => {
            const IconComponent = getIconComponent(tech.iconName as IconName);
            return (
              <Card
                key={tech.id}
                className="bg-card border-border shadow-md flex flex-col items-center text-center"
              >
                <CardHeader className="pb-2">
                  <IconComponent
                    size={36}
                    style={{ color: tech.color || "hsl(var(--foreground))" }}
                    className="mb-2 text-primary"
                  />
                  <CardTitle className="text-base text-primary line-clamp-2">
                    {tech.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-0 pb-2">
                  <p className="text-xs text-muted-foreground">ID: {tech.id}</p>
                  <p className="text-xs text-muted-foreground">
                    Icon: {tech.iconName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center">
                    Color:{" "}
                    <Palette
                      size={12}
                      className="inline ml-1 mr-0.5"
                      style={{ color: tech.color }}
                    />{" "}
                    {tech.color}
                  </p>
                  {tech.iconSvg && (
                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{ __html: tech.iconSvg }}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-center gap-2 border-t border-border/50 pt-3 pb-3 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tech)}
                    disabled={isSubmitting}
                    className="text-accent hover:text-accent-foreground border-accent hover:bg-accent/10 flex-1"
                  >
                    <Edit3 size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tech.id, tech.name)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Trash2 size={14} />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
