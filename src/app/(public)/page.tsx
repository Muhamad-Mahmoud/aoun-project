import { HeroSection } from "@/components/home/HeroSection";
import { WhyAounSection } from "@/components/home/WhyAounSection";
import { JourneySection } from "@/components/home/JourneySection";
import { SuccessStoriesSection } from "@/components/home/SuccessStoriesSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { FAQSection } from "@/components/home/FAQSection";

export default function Home() {
    return (
        <>
            <HeroSection />
            <WhyAounSection />
            <JourneySection />
            <SuccessStoriesSection />
            <PartnersSection />
            <FAQSection />
        </>
    );
}
