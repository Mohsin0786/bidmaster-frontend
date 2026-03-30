"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BUYER_STEPS, VENDOR_STEPS, type WorkflowStep } from "./data";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function StepList({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="space-y-5">
      {steps.map((step) => (
        <li key={step.step} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500 text-sm font-bold text-white shadow-md shadow-primary/20">
              {step.step}
            </span>
            {step.step < steps.length && (
              <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent mt-1" />
            )}
          </div>
          <div className="pb-5">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function WorkflowTabs() {
  return (
    <Tabs defaultValue="buyers" className="w-full">
      <TabsList className="mb-8 w-full h-12 p-1 bg-muted/60 rounded-xl">
        <TabsTrigger value="buyers" className="flex-1 rounded-lg text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
          For Buyers
        </TabsTrigger>
        <TabsTrigger value="vendors" className="flex-1 rounded-lg text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
          For Vendors
        </TabsTrigger>
      </TabsList>

      <TabsContent value="buyers" className="mt-0">
        <StepList steps={BUYER_STEPS} />
        <div className="mt-6 pt-6 border-t border-border/50">
          <Button asChild className="shadow-md shadow-primary/20">
            <Link href="/register">
              Get Started as a Buyer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="vendors" className="mt-0">
        <StepList steps={VENDOR_STEPS} />
        <div className="mt-6 pt-6 border-t border-border/50">
          <Button asChild className="shadow-md shadow-primary/20">
            <Link href="/register">
              Get Started as a Vendor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

