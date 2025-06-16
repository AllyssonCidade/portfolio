import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Recommendation } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recId = params.id;
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recId },
    });
    if (!recommendation) {
      return NextResponse.json({ message: "Recommendation not found" }, { status: 404 });
    }
    return NextResponse.json(recommendation);
  } catch (error) {
    console.error(`Failed to fetch recommendation ${params.id}:`, error);
    return NextResponse.json({ message: `Failed to fetch recommendation ${params.id}` }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recId = params.id;
    const updatedRecData: Partial<Omit<Recommendation, 'id'>> = await request.json();

    if (!updatedRecData.name || !updatedRecData.message || !updatedRecData.title) {
      return NextResponse.json({ message: "Name, message, and title are required" }, { status: 400 });
    }
    
    const recommendation = await prisma.recommendation.update({
      where: { id: recId },
      data: {
        name: updatedRecData.name,
        title: updatedRecData.title,
        avatarUrl: updatedRecData.avatarUrl,
        avatarHint: updatedRecData.avatarHint,
        message: updatedRecData.message,
        linkedInUrl: updatedRecData.linkedInUrl,
      },
    });
    return NextResponse.json(recommendation);

  } catch (error) {
    console.error(`Failed to update recommendation ${params.id}:`, error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ message: "Recommendation not found" }, { status: 404 });
    }
    return NextResponse.json({ message: `Failed to update recommendation ${params.id}` }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recId = params.id;
    await prisma.recommendation.delete({
      where: { id: recId },
    });
    return NextResponse.json({ message: "Recommendation deleted successfully" });

  } catch (error) {
    console.error(`Failed to delete recommendation ${params.id}:`, error);
     if ((error as any).code === 'P2025') {
      return NextResponse.json({ message: "Recommendation not found" }, { status: 404 });
    }
    return NextResponse.json({ message: `Failed to delete recommendation ${params.id}` }, { status: 500 });
  }
}
