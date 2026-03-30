import { Card, CardContent } from "@/components/ui/card";
import { Feature, FEATURES } from "./data";

interface FeatureSectionProps {
  features?: Feature[];
}

export default function FeatureSection({ features = FEATURES }: FeatureSectionProps) {
  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Procure Smarter
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for both buyers and vendors — every tool you need in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-border/60 hover:border-primary/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-cyan-500/0 group-hover:from-primary/3 group-hover:to-cyan-500/3 transition-all duration-300" />

                <CardContent className="relative p-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-cyan-500/15 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-base mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

