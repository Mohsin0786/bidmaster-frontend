import Link from "next/link";
import { FOOTER_GROUPS } from "./data";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          {/* Brand column */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xs">B</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                BidMaster
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">
              Smarter procurement through competitive reverse-auction bidding.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Github, label: "GitHub" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          <div className="flex flex-col sm:flex-row gap-10">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="min-w-[120px]">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BidMaster. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for modern procurement teams
          </p>
        </div>
      </div>
    </footer>
  );
}

