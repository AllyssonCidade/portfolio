import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import type { Technology } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(technologies);
  } catch (error) {
    console.error("Failed to fetch technologies:", error);
    return NextResponse.json(
      { message: "Failed to fetch technologies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newTechData: Omit<Technology, "id"> & { iconSvg?: string } =
      await request.json();

    if (!newTechData.name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!newTechData.iconName && !newTechData.iconSvg) {
      return NextResponse.json(
        { message: "Either iconName or iconSvg must be provided" },
        { status: 400 }
      );
    }

    const newTechnology = await prisma.technology.create({
      data: {
        name: newTechData.name,
        iconName: newTechData.iconName || null,
        iconSvg: newTechData.iconSvg || null,
        color: newTechData.color || "#FFFFFF",
      },
    });

    return NextResponse.json(newTechnology, { status: 201 });
  } catch (error) {
    console.error("Failed to create technology:", error);
    if (
      (error as any).code === "P2002" &&
      (error as any).meta?.target?.includes("name")
    ) {
      return NextResponse.json(
        { message: "Technology with this name already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create technology" },
      { status: 500 }
    );
  }
}
