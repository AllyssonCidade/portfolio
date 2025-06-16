import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Article } from '@/types';

// Helper to generate slug (can be more sophisticated)
const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const ARTICLES_PER_PAGE = 6; // Default items per page for admin view

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || ARTICLES_PER_PAGE.toString(), 10);
  const skip = (page - 1) * limit;

  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        publishedDate: 'desc',
      },
      skip: skip,
      take: limit,
    });

    const totalArticles = await prisma.article.count();
    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      articles: articles.map(article => ({
        ...article,
        publishedDate: article.publishedDate.toISOString(), 
      })),
      totalArticles,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json({ message: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newArticleData: Omit<Article, 'id' | 'publishedDate'> & { publishedDate?: string } = await request.json();
    
    if (!newArticleData.title || !newArticleData.contentMarkdown || !newArticleData.excerpt) {
      return NextResponse.json({ message: "Missing required fields: title, contentMarkdown, excerpt" }, { status: 400 });
    }

    let slug = newArticleData.slug || generateSlug(newArticleData.title);
    const existingArticleBySlug = await prisma.article.findUnique({ where: { slug } });
    if (existingArticleBySlug) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`; 
    }

    const publishedDate = newArticleData.publishedDate ? new Date(newArticleData.publishedDate) : new Date();

    const newArticle = await prisma.article.create({
      data: {
        title: newArticleData.title,
        slug: slug,
        excerpt: newArticleData.excerpt,
        contentMarkdown: newArticleData.contentMarkdown,
        imageUrl: newArticleData.imageUrl || 'https://placehold.co/600x400.png',
        imageHint: newArticleData.imageHint || 'default article image',
        originalArticleUrl: newArticleData.originalArticleUrl || null,
        publishedDate: publishedDate,
        author: newArticleData.author || "Allysson Cidade",
      },
    });

    return NextResponse.json({
      ...newArticle,
      publishedDate: newArticle.publishedDate.toISOString(),
    }, { status: 201 });

  } catch (error) {
    console.error("Failed to create article:", error);
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('slug')) {
      return NextResponse.json({ message: "Article slug already exists. Please choose a unique slug." }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to create article" }, { status: 500 });
  }
}
