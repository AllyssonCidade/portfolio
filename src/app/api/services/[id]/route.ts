import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Service } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error(`Failed to fetch service ${params.id}:`, error);
    return NextResponse.json({ message: `Failed to fetch service ${params.id}` }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;
    const updatedServiceData: Partial<Omit<Service, 'id'>> = await request.json();

    if (!updatedServiceData.title || !updatedServiceData.description || !updatedServiceData.imageUrl || !updatedServiceData.imageHint) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        title: updatedServiceData.title,
        description: updatedServiceData.description,
        imageUrl: updatedServiceData.imageUrl,
        imageHint: updatedServiceData.imageHint,
      },
    });
    return NextResponse.json(service);

  } catch (error) {
    console.error(`Failed to update service ${params.id}:`, error);
    // Handle specific Prisma errors like P2025 (Record to update not found)
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ message: `Failed to update service ${params.id}` }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id;
    await prisma.service.delete({
      where: { id: serviceId },
    });
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete service ${params.id}:`, error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ message: `Failed to delete service ${params.id}` }, { status: 500 });
  }
}
