import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "./data";
import MobileMenuWrapper from "./MobileMenuWrapper";

export default function LandingNav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:shadow-primary/40 transition-shadow">
            <span className="text-primary-foreground font-black text-sm">B</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            BidMaster
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild size="sm" className="shadow-md shadow-primary/20">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        <MobileMenuWrapper />
      </div>
    </header>
  );
}

