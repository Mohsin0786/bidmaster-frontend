import { Card, CardContent } from "@/components/ui/card";
import { Testimonial, TESTIMONIALS } from "./data";
import { Quote, ShieldCheck, Lock, Globe, Award } from "lucide-react";

interface SocialProofSectionProps {
  testimonials?: Testimonial[];
}

const TRUST_BADGES = [
  { label: "ISO 27001 Certified", icon: ShieldCheck },
  { label: "SOC 2 Type II", icon: Award },
  { label: "GDPR Compliant", icon: Globe },
  { label: "256-bit Encryption", icon: Lock },
];

export default function SocialProofSection({ testimonials = TESTIMONIALS }: SocialProofSectionProps) {
  return (
    <section id="testimonials" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Procurement Teams
            </span>{" "}
            Worldwide
          </h2>
          <p className="text-muted-foreground text-lg">
            Real results from real organizations using BidMaster every day.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4 group-hover:text-primary/30 transition-colors" />

                <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-cyan-500/60 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{testimonial.author}</p>
                    <p className="text-muted-foreground text-xs">
                      {testimonial.role} · {testimonial.organization}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {TRUST_BADGES.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
            >
              <Icon className="h-4 w-4 text-primary/60" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

