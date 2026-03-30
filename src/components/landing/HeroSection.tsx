"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown } from "lucide-react";

function HeroCtaScroll() {
  const handleClick = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Button variant="outline" size="lg" onClick={handleClick} className="group border-border/60 hover:border-primary/40 hover:bg-primary/5">
      See How It Works
      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
}

function BidGraphSVG() {
  const bars = [
    { x: 60,  h: 190, bid: "$48,000" },
    { x: 125, h: 152, bid: "$38,500" },
    { x: 190, h: 115, bid: "$31,200" },
    { x: 255, h: 82,  bid: "$26,800" },
    { x: 320, h: 52,  bid: "$22,400" },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cyan-500/5 to-transparent rounded-3xl blur-2xl" />

      <div className="relative glass-card rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Live Auction</p>
            <p className="text-sm font-semibold text-foreground">Office Supplies Q4 2026</p>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>

        <svg
          viewBox="0 0 420 220"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Descending bid graph showing prices going down over time"
          role="img"
          className="w-full"
        >
          {/* Grid */}
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={y} x1="40" y1={y} x2="400" y2={y}
              stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
          ))}

          {/* Ceiling price line */}
          <line x1="40" y1="22" x2="400" y2="22"
            stroke="hsl(var(--destructive))" strokeOpacity="0.5"
            strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="398" y="18" fontSize="9" fill="hsl(var(--destructive))"
            fillOpacity="0.7" textAnchor="end" fontWeight="600">Ceiling $52k</text>

          {/* Bars */}
          {bars.map(({ x, h }, i) => {
            const isLast = i === bars.length - 1;
            return (
              <g key={x}>
                {/* Bar shadow */}
                <rect x={x + 2} y={210 - h + 2} width="42" height={h}
                  rx="5" fill="hsl(var(--primary))" fillOpacity="0.08" />
                {/* Bar body */}
                <rect x={x} y={210 - h} width="42" height={h}
                  rx="5"
                  fill={isLast ? "hsl(var(--primary))" : "hsl(var(--primary))"}
                  fillOpacity={isLast ? "0.9" : 0.15 + i * 0.04}
                  stroke="hsl(var(--primary))"
                  strokeOpacity={isLast ? "0" : "0.3"}
                  strokeWidth="1"
                />
                {/* Winning badge on last bar */}
                {isLast && (
                  <>
                    <rect x={x - 4} y={210 - h - 22} width="50" height="18"
                      rx="4" fill="hsl(var(--primary))" fillOpacity="0.15"
                      stroke="hsl(var(--primary))" strokeOpacity="0.4" strokeWidth="1" />
                    <text x={x + 21} y={210 - h - 10} fontSize="8"
                      fill="hsl(var(--primary))" textAnchor="middle" fontWeight="700">
                      LOWEST
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Trend line */}
          <polyline
            points="81,20 146,58 211,95 276,128 341,158"
            fill="none" stroke="hsl(var(--primary))"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="5 3" strokeOpacity="0.6"
          />

          {/* Bid labels */}
          {bars.map(({ x, h, bid }, i) => (
            <text key={x} x={x + 21} y={210 - h - 6}
              fontSize="8" fill="currentColor" fillOpacity={i === bars.length - 1 ? 0.9 : 0.45}
              textAnchor="middle" fontWeight={i === bars.length - 1 ? "700" : "400"}>
              {bid}
            </text>
          ))}

          {/* X labels */}
          {["Bid 1", "Bid 2", "Bid 3", "Bid 4", "Bid 5"].map((label, i) => (
            <text key={label} x={81 + i * 65} y="218"
              fontSize="9" fill="currentColor" fillOpacity="0.4" textAnchor="middle">
              {label}
            </text>
          ))}
        </svg>

        {/* Savings badge */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingDown className="h-3.5 w-3.5 text-green-500" />
            <span>57% below ceiling price</span>
          </div>
          <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
            Saved $29,600
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div className="flex flex-col gap-7">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Reverse-Auction Procurement Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Win Better{" "}
              <span className="bg-gradient-to-r from-primary via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                Procurement.
              </span>{" "}
              Every Time.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Set your ceiling price, invite vendors, and watch them compete downward.
              BidMaster delivers real savings on every contract — automatically.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                <Link href="/register">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <HeroCtaScroll />
            </div>

            {/* Social proof mini */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {["SM", "DO", "PS", "JK"].map((initials) => (
                  <div key={initials}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-cyan-500/60 border-2 border-background flex items-center justify-center text-[10px] font-bold text-white">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">2,400+</span> procurement teams trust BidMaster
              </p>
            </div>
          </div>

          {/* Right — graphic */}
          <div className="flex items-center justify-center">
            <BidGraphSVG />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

