import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-primary to-cyan-500 -z-10" />
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-10" />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          No credit card required
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
          Ready to Transform Your Procurement?
        </h2>

        <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of buyers and vendors already saving time and money on every contract.
          Start your free account in under 2 minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" variant="secondary"
            className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20 font-semibold">
            <Link href="/register">
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <p className="mt-8 text-white/50 text-sm">
          Trusted by 2,400+ procurement teams · No setup fees · Cancel anytime
        </p>
      </div>
    </section>
  );
}

