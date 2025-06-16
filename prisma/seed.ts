import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Seed Hero
  await prisma.hero.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      mainHeading: "Allysson Cidade",
      subHeadingPrimary: "Desenvolvedor Mobile",
      subHeadingSecondary:
        "Com foco em performance, boas práticas e entrega real de valor.",
      backgroundImageUrl: "hero-background.jpg", // Relative path
      backgroundImageHint: "developer workspace code",
      ctaButton1Text: "Ver Projetos",
      ctaButton1Link: "#projects",
      ctaButton2Text: "Entre em Contato",
      ctaButton2Link: "#contact",
    },
  });
  console.log("Seeded Hero section");

  // Seed About
  await prisma.about.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      imageUrl: "allysson-portrait.png", // Relative path
      imageHint: "developer portrait professional",
      imageAlt: "Retrato de Allysson Cidade, desenvolvedor mobile",
      title: "Sobre Mim",
      paragraph1:
        "Sou um desenvolvedor mobile com experiência em React Native, Java e Firebase, criando apps modernos, bem estruturados e performáticos. Já atuei como freelancer, entregando soluções reais para agências e e-commerces.",
      paragraph2:
        "Hoje, participo de uma residência técnica onde desenvolvo aplicações para dispositivos SMART POS, lidando com requisitos, testes e integração com back-end. Gosto de aprender continuamente, trabalhar em equipe e contribuir com projetos criativos com impacto real.",
      resumeModalButtonText: "Ver Currículo",
      downloadResumeButtonText: "Baixar Currículo",
      downloadResumeLink: "/curriculo-allysson.pdf", // Path to PDF in /public
    },
  });
  console.log("Seeded About section");

  // Seed Services
  const servicesData = [
    {
      title: "Desenvolvimento de Sites com React e Next.js", // Ensure unique
      description:
        "Criação de sites rápidos, responsivos e otimizados para SEO, com foco em performance e usabilidade.",
      imageUrl: "service-web-dev.png", // Relative path
      imageHint: "modern web interface",
    },
    {
      title: "Desenvolvimento de Apps Híbridos com React Native", // Ensure unique
      description:
        "Desenvolvimento de aplicações mobile modernas usando Expo e Firebase, com integração de APIs RESTful e GraphQL.",
      imageUrl: "service-mobile-dev.png", // Relative path
      imageHint: "mobile app dark",
    },
    {
      title: "Criação de Tutoriais e Artigos Técnicos", // Ensure unique
      description:
        "Produção de conteúdo didático, artigos técnicos e passo a passos para ajudar outros desenvolvedores.",
      imageUrl: "service-content-creation.png", // Relative path
      imageHint: "keyboard writing code",
    },
  ];
  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { title: service.title }, // Use unique title for upsert
      update: service,
      create: service,
    });
  }
  console.log(`Seeded ${servicesData.length} services`);

  // Seed Articles
  const articlesData = [
    {
      slug: "dominando-state-management-react-native",
      title: "Dominando State Management em React Native",
      excerpt:
        "Uma análise profunda sobre as melhores práticas e bibliotecas para gerenciamento de estado em seus aplicativos React Native...",
      contentMarkdown:
        "## Introdução ao State Management\n\nGerenciar o estado em aplicações React Native pode ser desafiador à medida que a complexidade cresce. Esta seção detalha várias abordagens...\n\n### Context API\n\nPara cenários mais simples...\n\n### Redux\n\nPara aplicações maiores...\n\n### Zustand/Jotai\n\nAlternativas modernas...",
      imageUrl: "https://media.licdn.com/dms/image/v2/D4D12AQElnsiR9Vvqzw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1729046472531?e=1755734400&v=beta&t=ei5-OUTuDVngXESBOc9VrzEHEDXoFNvMXTGhWSMQ7-s", // External URL example
      imageHint: "code abstract",
      originalArticleUrl: "https://www.linkedin.com/pulse/dominando-state-management-em-react-native-allysson-cidade-vf9pc/",
      publishedDate: new Date("2024-05-15T10:00:00Z"),
      author: "Allysson Cidade",
    },
    {
      slug: "firebase-para-desenvolvedores-mobile",
      title: "Firebase para Desenvolvedores Mobile: Guia Completo",
      excerpt:
        "Explore como o Firebase pode acelerar o desenvolvimento de seus apps, desde a autenticação até o real-time database...",
      contentMarkdown:
        "## Firebase: Uma Plataforma Completa\n\nO Firebase oferece um backend como serviço (BaaS) que inclui banco de dados, autenticação, storage, e muito mais. \n\n### Autenticação Simplificada\n\n### Firestore/Realtime Database\n\n### Cloud Functions...",
      imageUrl: "article-firebase-mobile.png", // Relative path
      imageHint: "mobile development",
      originalArticleUrl: null, // No original link for this one
      publishedDate: new Date("2024-06-01T10:00:00Z"),
      author: "Allysson Cidade",
    },
  ];
  for (const article of articlesData) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }
  console.log(`Seeded ${articlesData.length} articles`);

  // Seed Technologies
  const technologiesData = [
    { name: "React Native", iconName: "Smartphone", color: "#61DAFB" },
    { name: "Expo", iconName: "Box", color: "#000020" },
    { name: "Firebase", iconName: "DatabaseZap", color: "#FFCA28" },
    { name: "Java", iconName: "Coffee", color: "#007396" },
    { name: "Next.js", iconName: "Layers", color: "#000000" },
    { name: "Prisma", iconName: "Database", color: "#2D3748" },
    { name: "PostgreSQL", iconName: "Database", color: "#336791" },
  ];
  for (const tech of technologiesData) {
    await prisma.technology.upsert({
      where: { name: tech.name },
      update: tech,
      create: tech,
    });
  }
  console.log(`Seeded ${technologiesData.length} technologies`);

  // Seed Recommendations
  const recommendationsData = [
    {
      name: "João Silva",
      title: "Tech Lead na Agência X",
      avatarUrl: "avatar-joao.png", // Relative path
      avatarHint: "person avatar",
      message:
        "Allysson é extremamente comprometido, domina React Native e sempre entrega soluções com qualidade. Trabalhar com ele foi uma ótima experiência, superando expectativas em diversos projetos.",
      linkedInUrl: "https://www.linkedin.com/in/allysson-cidade/",
    },
    {
      name: "Maria Santos",
      title: "Product Manager na Startup Y",
      avatarUrl: "avatar-maria.png", // Relative path
      avatarHint: "person avatar",
      message:
        "Profissional atento aos detalhes, ótimo em comunicação e em propor soluções criativas. Super recomendo o trabalho do Allysson, que sempre se mostrou proativo e eficiente.",
      linkedInUrl: "https://www.linkedin.com/in/allysson-cidade/",
    },
  ];
  for (const rec of recommendationsData) {
    const existingRec = await prisma.recommendation.findFirst({
      where: { name: rec.name, title: rec.title },
    });
    if (!existingRec) {
      await prisma.recommendation.create({
        data: rec,
      });
    } else {
      await prisma.recommendation.update({
        where: { id: existingRec.id },
        data: rec,
      });
    }
  }
  console.log(`Seeded ${recommendationsData.length} recommendations`);

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
