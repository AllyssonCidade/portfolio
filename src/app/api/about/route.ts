import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import type { AboutData } from '@/types';

// The About section is treated as a single entity. We'll use a fixed ID (e.g., 1).
const ABOUT_CONTENT_ID = 1;

export async function GET(request: NextRequest) {
  try {
    const aboutContent = await prisma.about.findUnique({
      where: { id: ABOUT_CONTENT_ID },
    });
    if (!aboutContent) {
      // If no content, return a default structure or an empty one.
      // For now, let's return a default.
      const defaultAbout: AboutData = {
        imageUrl: "https://placehold.co/600x800.png",
        imageHint: "developer portrait professional",
        imageAlt: "Retrato de Allysson Cidade, desenvolvedor mobile",
        title: "Sobre Mim",
        paragraph1: "Sou um desenvolvedor mobile com experiência em React Native, Java e Firebase, criando apps modernos, bem estruturados e performáticos. Já atuei como freelancer, entregando soluções reais para agências e e-commerces.",
        paragraph2: "Hoje, participo de uma residência técnica onde desenvolvo aplicações para dispositivos SMART POS, lidando com requisitos, testes e integração com back-end. Gosto de aprender continuamente, trabalhar em equipe e contribuir com projetos criativos com impacto real.",
        resumeModalButtonText: "Ver Currículo",
        downloadResumeButtonText: "Baixar Currículo",
        downloadResumeLink: "/curriculo-allysson.pdf",
      };
      return NextResponse.json(defaultAbout);
    }
    return NextResponse.json(aboutContent);
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return NextResponse.json({ message: "Failed to fetch about content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedData: Omit<AboutData, 'id'> = await request.json();

    if (!updatedData.title || !updatedData.paragraph1) {
      return NextResponse.json({ message: "Title and paragraph1 are required." }, { status: 400 });
    }
    
    const aboutContent = await prisma.about.upsert({
      where: { id: ABOUT_CONTENT_ID },
      update: updatedData,
      create: {
        id: ABOUT_CONTENT_ID,
        ...updatedData,
      },
    });
    
    return NextResponse.json(aboutContent);
  } catch (error) {
    console.error("Failed to update about content:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: "Failed to update about content", error: errorMessage }, { status: 500 });
  }
}
