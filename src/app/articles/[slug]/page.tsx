
import type { Article } from '@/types';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Image from "next/image";
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarDays, UserCircle, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


async function getArticle(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'; 
  try {
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, { cache: 'no-store' }); 
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch article: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null; 
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) {
    return {
      title: 'Artigo não encontrado',
    };
  }
  const imageUrl = article.imageUrl.startsWith('http') ? article.imageUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/images/${article.imageUrl}`;
  return {
    title: `${article.title} | Allysson Cidade`,
    description: article.excerpt,
    openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [
            {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: article.title,
            },
        ],
    },
  };
}


export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound(); 
  }
  const displayImageUrl = article.imageUrl.startsWith('http') ? article.imageUrl : `/images/${article.imageUrl}`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <article>
            <header className="mb-8">
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <UserCircle size={18} />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <time dateTime={article.publishedDate}>
                    {format(new Date(article.publishedDate), 'dd \'de\' MMMM \'de\' yyyy')}
                  </time>
                </div>
              </div>
              {article.imageUrl && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
                  <Image
                    src={displayImageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    data-ai-hint={article.imageHint}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 896px"
                  />
                </div>
              )}
            </header>

            <div className="prose prose-invert prose-lg max-w-none 
                            prose-headings:text-primary prose-headings:font-headline 
                            prose-p:text-foreground/80 prose-li:text-foreground/80
                            prose-a:text-accent hover:prose-a:text-primary
                            prose-strong:text-foreground/90
                            prose-blockquote:border-accent prose-blockquote:text-muted-foreground
                            prose-code:text-sm prose-code:bg-card prose-code:p-1 prose-code:rounded-md prose-code:font-code
                            prose-pre:bg-card prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                            ">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.contentMarkdown}</ReactMarkdown>
            </div>

            {article.originalArticleUrl && (
              <div className="mt-12 text-center border-t border-border/50 pt-8">
                <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors group">
                  <Link href={article.originalArticleUrl} target="_blank" rel="noopener noreferrer">
                    Ler Artigo Original 
                    <ExternalLink size={16} className="ml-2 group-hover:text-accent-foreground transition-colors" />
                  </Link>
                </Button>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  try {
    const res = await fetch(`${baseUrl}/api/articles`); // Fetches the paginated response
    if (!res.ok) return [];
    const data = await res.json();
    const articles: Article[] = data.articles || []; // Ensure we get the articles array
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error("Error fetching articles for static params:", error);
    return [];
  }
}
