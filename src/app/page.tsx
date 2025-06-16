import Header from "@/components/layout/header";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import ServicesSection from "@/components/sections/services-section";
import ProjectsSection from "@/components/sections/projects-section";
import ArticlesSection from "@/components/sections/articles-section";
import TechnologiesSection from "@/components/sections/technologies-section";
import RecommendationsSection from "@/components/sections/recommendations-section";
import ContactSection from "@/components/sections/contact-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ArticlesSection />
        <TechnologiesSection />
        <RecommendationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
