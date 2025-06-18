import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Technology } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const techId = params.id;
    const technology = await prisma.technology.findUnique({
      where: { id: techId },
    });
    if (!technology) {
      return NextResponse.json(
        { message: "Technology not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(technology);
  } catch (error) {
    console.error(`Failed to fetch technology ${params.id}:`, error);
    return NextResponse.json(
      { message: `Failed to fetch technology ${params.id}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const techId = params.id;
    const updatedTechData: Partial<Omit<Technology, "id">> =
      await request.json();

    if (!updatedTechData.name || !updatedTechData.iconName) {
      return NextResponse.json(
        { message: "Name and iconName are required" },
        { status: 400 }
      );
    }

    const technology = await prisma.technology.update({
      where: { id: techId },
      data: {
        name: updatedTechData.name,
        iconName: updatedTechData.iconName,
        iconSvg: updatedTechData.iconSvg || null,
        color: updatedTechData.color || "#FFFFFF",
      },
    });

    return NextResponse.json(technology);
  } catch (error) {
    console.error(`Failed to update technology ${params.id}:`, error);
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Technology not found" },
        { status: 404 }
      );
    }
    if (
      (error as any).code === "P2002" &&
      (error as any).meta?.target?.includes("name")
    ) {
      // const conflictingTech = await prisma.technology.findUnique({ where: { name: updatedTechData.name } });
      // if (conflictingTech && conflictingTech.id !== techId) {
      //   return NextResponse.json({ message: "Another technology with this name already exists." }, { status: 409 });
      // }
    }
    return NextResponse.json(
      { message: `Failed to update technology ${params.id}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const techId = params.id;
    await prisma.technology.delete({
      where: { id: techId },
    });
    return NextResponse.json({ message: "Technology deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete technology ${params.id}:`, error);
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Technology not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: `Failed to delete technology ${params.id}` },
      { status: 500 }
    );
  }
}
