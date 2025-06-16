import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Article } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const articleSlug = params.slug;
    const article = await prisma.article.findUnique({
      where: { slug: articleSlug },
    });

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...article,
      publishedDate: article.publishedDate.toISOString(),
    });
  } catch (error) {
    console.error(`Failed to fetch article ${params.slug}:`, error);
    return NextResponse.json({ message: `Failed to fetch article ${params.slug}` }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const currentSlug = params.slug;
    const updatedArticleData: Partial<Omit<Article, 'id'>> & { publishedDate?: string } = await request.json();

    if (!updatedArticleData.title || !updatedArticleData.contentMarkdown || !updatedArticleData.excerpt) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    
    if (updatedArticleData.slug && updatedArticleData.slug !== currentSlug) {
        const existingArticleByNewSlug = await prisma.article.findUnique({ where: { slug: updatedArticleData.slug } });
        if (existingArticleByNewSlug) {
            return NextResponse.json({ message: "New slug already exists. Please choose a unique slug." }, { status: 409 });
        }
    }
    
    const dataToUpdate: any = { 
        title: updatedArticleData.title,
        slug: updatedArticleData.slug,
        excerpt: updatedArticleData.excerpt,
        contentMarkdown: updatedArticleData.contentMarkdown,
        imageUrl: updatedArticleData.imageUrl,
        imageHint: updatedArticleData.imageHint,
        originalArticleUrl: updatedArticleData.originalArticleUrl || null,
        author: updatedArticleData.author,
     };
    if (updatedArticleData.publishedDate) {
      dataToUpdate.publishedDate = new Date(updatedArticleData.publishedDate);
    }


    const article = await prisma.article.update({
      where: { slug: currentSlug },
      data: dataToUpdate,
    });

    return NextResponse.json({
      ...article,
      publishedDate: article.publishedDate.toISOString(),
    });

  } catch (error) {
    console.error(`Failed to update article ${params.slug}:`, error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('slug')) {
      return NextResponse.json({ message: "Article slug already exists. Please choose a unique slug." }, { status: 409 });
    }
    return NextResponse.json({ message: `Failed to update article ${params.slug}` }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const articleSlug = params.slug;
    await prisma.article.delete({
      where: { slug: articleSlug },
    });
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete article ${params.slug}:`, error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ message: `Failed to delete article ${params.slug}` }, { status: 500 });
  }
}
