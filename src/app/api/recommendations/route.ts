import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import type { Recommendation } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const recommendations = await prisma.recommendation.findMany({
      orderBy: {
        createdAt: 'desc', // Or any other order
      },
    });
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return NextResponse.json({ message: "Failed to fetch recommendations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newRecData: Omit<Recommendation, 'id'> = await request.json();
    
    if (!newRecData.name || !newRecData.message || !newRecData.title) {
      return NextResponse.json({ message: "Name, message, and title are required" }, { status: 400 });
    }

    const newRecommendation = await prisma.recommendation.create({
      data: {
        name: newRecData.name,
        title: newRecData.title,
        avatarUrl: newRecData.avatarUrl || "https://placehold.co/80x80.png",
        avatarHint: newRecData.avatarHint || "person avatar",
        message: newRecData.message,
        linkedInUrl: newRecData.linkedInUrl || "https://www.linkedin.com/in/allysson-cidade/",
      },
    });
    
    return NextResponse.json(newRecommendation, { status: 201 });

  } catch (error) {
    console.error("Failed to create recommendation:", error);
    return NextResponse.json({ message: "Failed to create recommendation" }, { status: 500 });
  }
}
