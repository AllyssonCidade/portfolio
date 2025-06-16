-- CreateTable
CREATE TABLE "Hero" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mainHeading" TEXT NOT NULL,
    "subHeadingPrimary" TEXT NOT NULL,
    "subHeadingSecondary" TEXT NOT NULL,
    "backgroundImageUrl" TEXT NOT NULL,
    "backgroundImageHint" TEXT NOT NULL,
    "ctaButton1Text" TEXT NOT NULL,
    "ctaButton1Link" TEXT NOT NULL,
    "ctaButton2Text" TEXT NOT NULL,
    "ctaButton2Link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "imageUrl" TEXT NOT NULL,
    "imageHint" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "paragraph1" TEXT NOT NULL,
    "paragraph2" TEXT NOT NULL,
    "resumeModalButtonText" TEXT NOT NULL,
    "downloadResumeButtonText" TEXT NOT NULL,
    "downloadResumeLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageHint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageHint" TEXT NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "avatarHint" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "linkedInUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");
