import dynamic from "next/dynamic";
import { HeroSection } from "@/features/home/components/HeroSection";

// Cache the marketing home page for 1 hour – improves TTFB
export const revalidate = 3600;

// Below-the-fold sections — lazy loaded for faster initial paint
const WhyAounSection = dynamic(() => import("@/features/home/components/WhyAounSection").then(mod => mod.WhyAounSection));
const JourneySection = dynamic(() => import("@/features/home/components/JourneySection").then(mod => mod.JourneySection));
const PartnersSection = dynamic(() => import("@/features/home/components/PartnersSection").then(mod => mod.PartnersSection));
const SuccessStoriesSection = dynamic(() => import("@/features/home/components/SuccessStoriesSection").then(mod => mod.SuccessStoriesSection));
const FAQSection = dynamic(() => import("@/features/home/components/FAQSection").then(mod => mod.FAQSection));


export default function Home() {
    return (
        <div className="flex flex-col gap-0">
            <HeroSection />
            <WhyAounSection />

            <JourneySection />
            <PartnersSection />
            <SuccessStoriesSection />
            <FAQSection />
        </div>
    );
}
