import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Service } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc', // Or any other order you prefer
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json({ message: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newServiceData: Omit<Service, 'id'> = await request.json();
    
    if (!newServiceData.title || !newServiceData.description || !newServiceData.imageUrl || !newServiceData.imageHint) {
      return NextResponse.json({ message: "Missing required fields: title, description, imageUrl, imageHint" }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        title: newServiceData.title,
        description: newServiceData.description,
        imageUrl: newServiceData.imageUrl,
        imageHint: newServiceData.imageHint,
      },
    });

    return NextResponse.json(newService, { status: 201 });

  } catch (error) {
    console.error("Failed to create service:", error);
    // Add more specific error handling if needed, e.g., for unique constraint violations
    return NextResponse.json({ message: "Failed to create service" }, { status: 500 });
  }
}
