import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeatureSection from "@/components/landing/FeatureSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <>
      <LandingNav />
      <main>
        <HeroSection />
        <StatsSection />
        <FeatureSection />
        <HowItWorksSection />
        <SocialProofSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
