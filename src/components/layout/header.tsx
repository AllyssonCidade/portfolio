"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "#home", label: "Início" },
  { href: "#about", label: "Sobre Mim" },
  { href: "#projects", label: "Projetos" },
  { href: "#technologies", label: "Tecnologias" },
  // { href: '/playground', label: 'Playground' }, // Removed
  { href: "#contact", label: "Contato" },
];

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="#home"
            className="text-2xl font-headline font-bold text-primary transition-colors hover:text-primary/80"
          >
            Allysson Cidade
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.href.startsWith("/") ? (
                  <span className="flex items-center">
                    {item.label}
                    {/* Specific icon logic for playground removed as item is removed */}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu">
                  <Menu className="h-6 w-6 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-card p-6">
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                    <Link
                      href="#home"
                      className="text-xl font-headline font-bold text-primary"
                      onClick={closeSheet}
                    >
                      Allysson Cidade
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeSheet}
                      aria-label="Fechar menu"
                    >
                      <X className="h-6 w-6 text-foreground" />
                    </Button>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-lg font-medium text-foreground/90 hover:text-primary transition-colors"
                        onClick={closeSheet}
                      >
                        {item.href.startsWith("/") ? (
                          <span className="flex items-center">
                            {item.label}
                            {/* Specific icon logic for playground removed as item is removed */}
                          </span>
                        ) : (
                          item.label
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
