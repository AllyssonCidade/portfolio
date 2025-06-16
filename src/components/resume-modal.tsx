'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] text-foreground border-border max-w-3xl w-[90%] max-h-[90vh] p-0 data-[state=open]:animate-fade-in-scale">
        <div className="p-6 sm:p-8 relative overflow-y-auto max-h-[calc(90vh-4rem)] scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
          <DialogHeader className="mb-6 text-left">
            <DialogTitle className="text-3xl font-headline text-primary">Allysson Cidade Costa de Carvalho</DialogTitle>
             <DialogClose asChild className="absolute top-4 right-4 sm:top-6 sm:right-6">
               <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                 <X size={24} />
                 <span className="sr-only">Fechar</span>
               </Button>
            </DialogClose>
          </DialogHeader>

          <p className="text-muted text-sm mb-1">Catu de Abrantes (Abrantes) - BA</p>
          <p className="text-muted text-sm mb-1">(71) 99724-8724</p>
          <p className="text-muted text-sm mb-6">allyssoncidade@gmail.com</p>

          <hr className="my-6 border-border" />

          <section className="mb-6">
            <h3 className="text-2xl font-headline text-primary mb-3">Resumo Profissional</h3>
            <p className="text-foreground/80 leading-relaxed mb-3">
              Desenvolvedor Mobile com expertise em React, React Native. Freelancer especializado na criação de soluções práticas para sites de agências. Habilidade no desenvolvimento de aplicações utilizando Expo e Firebase, além de interfaces modernas com React e Next.js. Proficiente em integração de APIs com RESTful e GraphQL.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Atualmente participando de um programa de residência em software, aprimorando trabalho em equipe, habilidades técnicas e resolução de problemas com metodologias ágeis e versionamento via GitHub. Experiência também com back-end em Node.js e Strapi. Apaixonado por tecnologia e aprendizado contínuo.
            </p>
          </section>

          <hr className="my-6 border-border" />

          <section className="mb-6">
            <h3 className="text-2xl font-headline text-primary mb-3">Formação</h3>
            <ul className="list-disc list-outside pl-5 space-y-1 text-foreground/80">
              <li><strong>Análise e Desenvolvimento de Sistemas</strong> – Anhanguera</li>
              <li><strong>Gestão e Governança da Tecnologia da Informação</strong></li>
            </ul>
          </section>

          <hr className="my-6 border-border" />
          
          <section className="mb-6">
            <h3 className="text-2xl font-headline text-primary mb-4">Experiência Profissional</h3>
            <div className="mb-4">
              <p className="font-semibold text-foreground text-lg">Desenvolvedor Mobile Residente – CEPEDI</p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-foreground/80 mt-1">
                <li>Desenvolvimento de apps para SMART POS com Java (em parceria com Ingenico).</li>
                <li>Análise de requisitos, criação de interfaces, testes e integração com backend.</li>
                <li>Uso de SDKs externas, metodologias ágeis, Git.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">Desenvolvedor Web – Freelancer</p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-foreground/80 mt-1">
                <li>Criação de componentes personalizados para websites.</li>
                <li>Scripts otimizados com foco em SEO, correções de bugs e manutenção de e-commerces.</li>
                <li>Uso de JavaScript, PHP, HTML/CSS, WordPress, Nuvemshop.</li>
              </ul>
            </div>
          </section>

          <hr className="my-6 border-border" />

          <section className="mb-6">
            <h3 className="text-2xl font-headline text-primary mb-3">Cursos Extracurriculares</h3>
            <ul className="text-foreground/80 space-y-1 md:columns-2 md:gap-x-8">
              <li>React Avançado (Next.js) – Udemy</li>
              <li>JavaScript Essentials 2 – Cisco</li>
              <li>CCNAv7 – Cisco</li>
              <li>Gestão de Projetos – Anhanguera</li>
              <li>Compliance e Governança – Anhanguera</li>
              <li>Cyber Security Fundamentals – IBM</li>
              <li>Python para Análise de Dados – Anhanguera</li>
              <li>Design Thinking – FIAP</li>
              <li>Formação Front-End (React) – Oracle + Alura</li>
              <li>Python para Machine Learning – Didática Tech</li>
            </ul>
          </section>

          <hr className="my-6 border-border" />

          <section className="mb-6">
            <h3 className="text-2xl font-headline text-primary mb-3">Competências Técnicas</h3>
            <ul className="space-y-2 text-foreground/80">
              <li><strong>Front-End:</strong> React.js, Next.js, Expo, HTML, CSS, JavaScript, Figma</li>
              <li><strong>Back-End:</strong> Node.js, Express, Strapi, Firebase, Python</li>
              <li><strong>Mobile:</strong> Java, React Native, Expo, Firebase</li>
              <li><strong>Banco de Dados:</strong> Firebase, Firestore, MySQL, Sequelize</li>
              <li><strong>Versionamento e Metodologias:</strong> Git, GitHub, Jira, Scrum, Airtable</li>
              <li><strong>Plataformas:</strong> WordPress, Nuvemshop</li>
            </ul>
          </section>

          <hr className="my-6 border-border" />

          <section>
            <h3 className="text-2xl font-headline text-primary mb-3">Idiomas</h3>
            <ul className="list-disc list-outside pl-5 space-y-1 text-foreground/80">
              <li>Inglês – Intermediário</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
