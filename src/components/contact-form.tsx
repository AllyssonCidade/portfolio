
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageSquare } from "lucide-react"; // Using MessageSquare for WhatsApp
import { useState } from "react";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  message: z
    .string()
    .min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); // Basic submitting state for button

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    const myPhoneNumber = "5571997248724"; // Your WhatsApp number without '+' or special chars
    const preFilledMessage = `Olá, meu nome é ${data.name}. Gostaria de falar sobre: ${data.message}`;
    const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(
      preFilledMessage
    )}`;

    try {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      toast({
        title: "Redirecionando para o WhatsApp...",
        description: "Se a conversa não abrir, verifique se o WhatsApp está instalado.",
      });
      form.reset();
    } catch (error) {
      console.error("Failed to open WhatsApp link:", error);
      toast({
        title: "Erro ao abrir o WhatsApp",
        description: "Não foi possível abrir o link do WhatsApp. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-foreground/80 font-medium">
          Seu Nome
        </Label>
        <Input
          id="name"
          type="text"
          {...form.register("name")}
          className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground"
          aria-invalid={form.formState.errors.name ? "true" : "false"}
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="message" className="text-foreground/80 font-medium">
          Sua Mensagem
        </Label>
        <Textarea
          id="message"
          {...form.register("message")}
          rows={5}
          className="mt-1 bg-input border-border focus:ring-primary focus:border-primary text-foreground"
          aria-invalid={form.formState.errors.message ? "true" : "false"}
          placeholder="Olá, Allysson! Gostaria de conversar sobre..."
        />
        {form.formState.errors.message && (
          <p className="mt-1 text-sm text-destructive">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-md shadow-md transition-transform hover:scale-105"
      >
        {isSubmitting ? (
           "Abrindo WhatsApp..."
        ) : (
          <>
            Enviar via WhatsApp <MessageSquare size={18} className="ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
