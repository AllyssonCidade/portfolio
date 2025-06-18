import type { LucideIcon } from "lucide-react";

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
  backgroundImageUrl: string;
  backgroundImageHint: string;
  ctaButton1Text: string;
  ctaButton1Link: string;
  ctaButton2Text: string;
  ctaButton2Link: string;
}

export interface AboutData {
  imageUrl: string;
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
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  imageUrl: string;
  imageHint: string;
  originalArticleUrl?: string | null;
  publishedDate: string;
  author: string;
}

export interface Technology {
  id: string;
  name: string;
  iconName: keyof typeof import("lucide-react");
  iconSvg?: string | null;
  color?: string;
}

export interface Recommendation {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  avatarHint: string;
  message: string;
  linkedInUrl: string;
}
