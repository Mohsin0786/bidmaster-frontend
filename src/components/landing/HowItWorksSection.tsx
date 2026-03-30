import { WorkflowTabs } from "./WorkflowTabs";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30 -z-10" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Simple Process,{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Powerful Results
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you&apos;re buying or selling, BidMaster makes the process transparent and efficient.
          </p>
        </div>

        <div className="mx-auto max-w-2xl glass-card rounded-2xl p-8">
          <WorkflowTabs />
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;

