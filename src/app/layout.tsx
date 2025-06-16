import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopButton from '@/components/ScrollToTopButton';
import './globals.css';

export const metadata: Metadata = {
  title: 'Allysson Cidade | Desenvolvedor Mobile',
  description: 'Portfólio de Allysson Cidade, Desenvolvedor Mobile especialista em React Native, Java, Firebase e mais. Foco em performance, boas práticas e entrega real.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
