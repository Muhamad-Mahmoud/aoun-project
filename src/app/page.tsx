import dynamic from "next/dynamic";
import { HeroSection } from "@/features/home/components/HeroSection";

// Cache the marketing home page for 1 hour – improves TTFB
export const revalidate = 3600;

// Below-the-fold sections — lazy loaded for faster initial paint
const AboutSection = dynamic(() => import("@/features/home/components/AboutSection").then(mod => mod.AboutSection));
const JourneySection = dynamic(() => import("@/features/home/components/JourneySection").then(mod => mod.JourneySection));
const HowItWorksSection = dynamic(() => import("@/features/home/components/HowItWorksSection").then(mod => mod.HowItWorksSection));
const AssociationCTASection = dynamic(() => import("@/features/home/components/AssociationCTASection").then(mod => mod.AssociationCTASection));
const ImpactSections = dynamic(() => import("@/features/home/components/ImpactSections").then(mod => mod.ImpactSections));
const StartJourneySection = dynamic(() => import("@/features/home/components/StartJourneySection").then(mod => mod.StartJourneySection));
const FAQSection = dynamic(() => import("@/features/home/components/FAQSection").then(mod => mod.FAQSection));

export default function Home() {
    return (
        <div className="flex flex-col gap-0">
            <HeroSection />
            <AboutSection />
            <JourneySection />
            <HowItWorksSection />
            <AssociationCTASection />
            <ImpactSections />
            <StartJourneySection />
            <FAQSection />
        </div>
    );
}
