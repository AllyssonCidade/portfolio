
'use client';
import ContactForm from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from 'react';

export default function ContactSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, 
      }
    );

    const currentCardRef = cardRef.current;
    if (currentCardRef) {
      observer.observe(currentCardRef);
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);

  return (
    <section id="contact" className="py-20 md:py-32 bg-background scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={cardRef} 
          className={`max-w-2xl mx-auto text-center ${isVisible ? 'animate-slide-in-bottom' : 'opacity-0'}`}
        >
           <h2 className="font-headline text-4xl sm:text-5xl font-bold mb-4 text-primary">
            Vamos Conversar!
          </h2>
          <p className="text-lg text-foreground/80 mb-12">
            Tem alguma pergunta ou projeto em mente? Me envie uma mensagem direta no WhatsApp!
          </p>
          <Card className="bg-card border-border shadow-xl p-4 sm:p-8 text-left">
            <CardContent className="p-0 md:p-2">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
