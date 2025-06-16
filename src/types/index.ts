import type { LucideIcon } from 'lucide-react';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
}

export interface HeroData {
  mainHeading: string;
  subHeadingPrimary: string;
  subHeadingSecondary: string;
  backgroundImageUrl: string; // Can be relative path or full URL
  backgroundImageHint: string;
  ctaButton1Text: string;
  ctaButton1Link: string;
  ctaButton2Text: string;
  ctaButton2Link: string;
}

export interface AboutData {
  imageUrl: string; // Can be relative path or full URL
  imageHint: string;
  imageAlt: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  resumeModalButtonText: string;
  downloadResumeButtonText: string;
  downloadResumeLink: string;
}

export interface Service {
  id: string; // Prisma will generate this
  title: string;
  description: string;
  imageUrl: string; // Can be relative path or full URL
  imageHint: string;
  // createdAt and updatedAt will be managed by Prisma
}

export interface Article {
  id: string; // Prisma will generate this
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  imageUrl: string; // Can be relative path or full URL
  imageHint: string;
  originalArticleUrl?: string | null; // Optional link to original article
  publishedDate: string; // ISO date string on client, DateTime in Prisma
  author: string;
  // createdAt and updatedAt will be managed by Prisma
}

export interface Technology {
  id: string; // Prisma will generate this
  name: string;
  iconName: keyof typeof import('lucide-react');
  color?: string;
  // createdAt and updatedAt will be managed by Prisma
}

export interface Recommendation {
  id: string; // Prisma will generate this
  name: string;
  title: string;
  avatarUrl: string; // Can be relative path or full URL
  avatarHint: string;
  message: string;
  linkedInUrl: string;
  // createdAt and updatedAt will be managed by Prisma
}
