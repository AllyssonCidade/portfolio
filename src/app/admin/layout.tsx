
// src/app/admin/layout.tsx
import Link from 'next/link';
import { Home, Settings, Briefcase, FileText, Share2, MessageSquareText, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutAction } from './logout/actions';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/hero", label: "Manage Hero", icon: Settings },
    { href: "/admin/about", label: "Manage About", icon: Users },
    { href: "/admin/services", label: "Manage Services", icon: Briefcase },
    { href: "/admin/articles", label: "Manage Articles", icon: FileText },
    { href: "/admin/technologies", label: "Manage Technologies", icon: Share2 },
    { href: "/admin/recommendations", label: "Manage Recommendations", icon: MessageSquareText },
    // { href: "/playground", label: "Playground", icon: Rocket }, // Removed
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-72 bg-card p-6 border-r border-border shadow-md flex flex-col justify-between">
        <div>
          <Link href="/admin">
            <h1 className="text-3xl font-bold text-primary mb-10 hover:text-primary/80 transition-colors">Admin Panel</h1>
          </Link>
          <nav>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="flex items-center text-foreground/80 hover:text-primary hover:bg-primary/10 p-3 rounded-md transition-all duration-200 ease-in-out group"
                    target={item.href.startsWith('/') && !item.href.startsWith('/admin') ? '_blank' : undefined}
                    rel={item.href.startsWith('/') && !item.href.startsWith('/admin') ? 'noopener noreferrer' : undefined}
                  >
                    <item.icon size={20} className="mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <form action={logoutAction} className="mt-auto">
          <Button type="submit" variant="ghost" className="w-full justify-start text-foreground/80 hover:text-destructive hover:bg-destructive/10 p-3 group">
            <LogOut size={20} className="mr-3 text-muted-foreground group-hover:text-destructive transition-colors" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        </form>
      </aside>
      <main className="flex-1 p-8 bg-background overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
