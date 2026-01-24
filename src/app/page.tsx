import { HeroSection } from "@/features/home/components/HeroSection";

import { WhyAounSection } from "@/features/home/components/WhyAounSection";
import { JourneySection } from "@/features/home/components/JourneySection";
import { PartnersSection } from "@/features/home/components/PartnersSection";
import { SuccessStoriesSection } from "@/features/home/components/SuccessStoriesSection";
import { FAQSection } from "@/features/home/components/FAQSection";

export default function Home() {
    return (
        <div className="flex flex-col gap-0 pb-20">

            <HeroSection />
            <WhyAounSection />

            <JourneySection />
            <PartnersSection />
            <SuccessStoriesSection />
            <FAQSection />
        </div>
    );
}
