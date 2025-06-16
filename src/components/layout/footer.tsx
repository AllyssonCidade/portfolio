import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "https://github.com/AllyssonCidade", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/allysson-cidade/", icon: Linkedin, label: "LinkedIn" },
    { href: "mailto:allysson.cidade@example.com", icon: Mail, label: "Email" }, // Replace with actual email
  ];

  return (
    <footer className="py-12 bg-background border-t border-border text-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-center md:text-left">
            &copy; {currentYear} Allysson Cidade. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon size={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
