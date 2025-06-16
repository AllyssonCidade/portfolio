import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import type { HeroData } from '@/types';

// The Hero section is treated as a single entity. We'll use a fixed ID (e.g., 1).
const HERO_CONTENT_ID = 1;

export async function GET(request: NextRequest) {
  try {
    const heroContent = await prisma.hero.findUnique({
      where: { id: HERO_CONTENT_ID },
    });
    if (!heroContent) {
      // If no content, return a default structure or an empty one
      // For now, let's return a 404 or a default. Let's return default.
      const defaultHero: HeroData = {
        mainHeading: "Allysson Cidade",
        subHeadingPrimary: "Desenvolvedor Mobile",
        subHeadingSecondary: "Com foco em performance, boas práticas e entrega real de valor.",
        backgroundImageUrl: "https://placehold.co/1920x1080.png",
        backgroundImageHint: "developer workspace code",
        ctaButton1Text: "Ver Projetos",
        ctaButton1Link: "#projects",
        ctaButton2Text: "Entre em Contato",
        ctaButton2Link: "#contact",
      };
      return NextResponse.json(defaultHero);
    }
    return NextResponse.json(heroContent);
  } catch (error) {
    console.error("Failed to fetch hero content:", error);
    return NextResponse.json({ message: "Failed to fetch hero content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedData: Omit<HeroData, 'id'> = await request.json();

    if (!updatedData.mainHeading || !updatedData.subHeadingPrimary) {
        return NextResponse.json({ message: "Main heading and primary sub-heading are required." }, { status: 400 });
    }
    
    const heroContent = await prisma.hero.upsert({
      where: { id: HERO_CONTENT_ID },
      update: updatedData,
      create: {
        id: HERO_CONTENT_ID,
        ...updatedData,
      },
    });
    
    return NextResponse.json(heroContent);
  } catch (error) {
    console.error("Failed to update hero content:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: "Failed to update hero content", error: errorMessage }, { status: 500 });
  }
}
