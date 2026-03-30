import AnimatedCounter from "./AnimatedCounter";
import { STATS, type Stat } from "./data";

interface StatsSectionProps {
  stats?: Stat[];
}

export default function StatsSection({ stats = STATS }: StatsSectionProps) {
  return (
    <section className="relative py-14 overflow-hidden">
      {/* Gradient band */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-cyan-500/5 to-primary/5" />
      <div className="absolute inset-0 border-y border-border/50" />

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:divide-x divide-border/60">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center px-12 py-4 text-center group">
              <p className="text-5xl font-black bg-gradient-to-br from-primary to-cyan-500 bg-clip-text text-transparent tabular-nums">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

