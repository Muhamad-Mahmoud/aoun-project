"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils";
import { ChevronLeft, Heart, Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Testimonial = {
    name: string;
    quote: string;
    image: string;
    alt: string;
};

type Partner = {
    name: string;
    logoSrc?: string;
};

const testimonials: Testimonial[] = [
    {
        name: "محمد",
        quote: "تمكنت من العودة لمدرستي بعد أن حصلت على دعم عون لتكاليف الدراسة.",
        image: "/person1.png",
        alt: "محمد من أسرة مستفيدة",
    },
    {
        name: "أم أحمد",
        quote: "ساعدوني في علاج ابني وكان لهم دور كبير في تحسين حالتنا.",
        image: "/person2.png",
        alt: "أم أحمد من أسرة مستفيدة",
    },
    {
        name: "أبو خالد",
        quote: "منحة صغيرة من عون بدأت بها مشروعي وفّر لي مصدر دخل مستقر.",
        image: "/person3.png",
        alt: "أبو خالد من أسرة مستفيدة",
    },
];

const partners: Partner[] = [
    { name: "الهلال الأحمر المصري", logoSrc: "/partners/egyptian-red-crescent.png" },
    { name: "جمعية رسالة", logoSrc: "/partners/resala.png" },
    { name: "جمعية الأورمان", logoSrc: "/partners/orman.png" },
    { name: "بنك الطعام المصري", logoSrc: "/partners/food-bank.png" },
    { name: "UNICEF لكل طفل", logoSrc: "/partners/unicef.svg" },
    { name: "وزارة التضامن الاجتماعي", logoSrc: "/partners/solidarity.png" },
];

export function ImpactSections() {
    return (
        <>
            <StoriesSection />
            <DonateCtaSection />
            <PartnersSliderSection />
        </>
    );
}

function StoriesSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollerRef = useRef<HTMLDivElement>(null);

    const goTo = useCallback((index: number) => {
        setActiveIndex(index);
        const scroller = scrollerRef.current;
        const card = scroller?.querySelector<HTMLElement>(`[data-story-index="${index}"]`);

        card?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, []);

    const handleStoryScroll = useCallback(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const scrollerCenter = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
        const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-story-index]"));
        const closestCard = cards.reduce<{ index: number; distance: number }>(
            (closest, card) => {
                const rect = card.getBoundingClientRect();
                const distance = Math.abs(rect.left + rect.width / 2 - scrollerCenter);
                const index = Number(card.dataset.storyIndex ?? 0);

                return distance < closest.distance ? { index, distance } : closest;
            },
            { index: 0, distance: Number.POSITIVE_INFINITY }
        );

        setActiveIndex(closestCard.index);
    }, []);

    return (
        <section id="stories" className="bg-white py-16 md:py-20" dir="rtl" aria-labelledby="stories-title">
            <div className="container mx-auto max-w-[1280px] px-4">
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#Eef4f3] text-[#157A75] text-sm font-bold tracking-wider mb-4">
                        أثرنا
                    </div>
                    <h2 id="stories-title" className="text-3xl lg:text-4xl font-black text-[#0F4C4A]">
                        قصص من الواقع .. أثر يدوم
                    </h2>
                </div>

                <div
                    ref={scrollerRef}
                    onScroll={handleStoryScroll}
                    className="scrollbar-hide grid auto-cols-[minmax(320px,1fr)] grid-flow-col gap-6 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:pb-0"
                    role="region"
                    aria-label="قصص المستفيدين"
                >
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.name}
                            testimonial={testimonial}
                            index={index}
                            isActive={activeIndex === index}
                        />
                    ))}
                </div>

                <div className="mt-8 flex justify-center gap-2" aria-label="تنقل قصص المستفيدين">
                    {testimonials.map((testimonial, index) => (
                        <button
                            key={testimonial.name}
                            type="button"
                            aria-label={`عرض قصة ${testimonial.name}`}
                            aria-current={activeIndex === index}
                            onClick={() => goTo(index)}
                            className={cn(
                                "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/30",
                                activeIndex === index ? "w-7 bg-warm-green" : "w-2.5 bg-border"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({
    testimonial,
    index,
    isActive,
}: {
    testimonial: Testimonial;
    index: number;
    isActive: boolean;
}) {
    return (
        <figure
            data-story-index={index}
            className={cn(
                "group min-h-[160px] snap-center overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_4px_20px_rgba(21,122,117,.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(21,122,117,.14)]",
                isActive && "border-warm-green/30"
            )}
        >
            <div className="flex min-h-[160px] items-stretch" dir="ltr">
                <div className="relative w-[42%] min-w-[132px] shrink-0 overflow-hidden bg-warm-green-pale">
                    <Image
                        src={testimonial.image}
                        alt={testimonial.alt}
                        fill
                        sizes="(min-width: 1024px) 180px, 42vw"
                        className="object-cover object-left transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-white/0" aria-hidden="true" />
                </div>

                <div className="relative flex min-w-0 flex-1 flex-col justify-center px-5 py-5 text-right" dir="rtl">
                    <Quote className="absolute right-4 top-4 h-8 w-8 rotate-180 fill-warm-green/20 text-warm-green/35" aria-hidden="true" />
                    <blockquote className="relative z-10 pt-6 text-[14px] font-bold leading-7 text-foreground md:text-[15px]">
                        {testimonial.quote}
                    </blockquote>
                    <figcaption className="relative z-10 mt-3">
                        <div className="text-sm font-black text-warm-green">{testimonial.name}</div>
                        <div className="mt-1 text-xs font-bold text-muted-foreground">من أسرة مستفيدة</div>
                    </figcaption>
                </div>
            </div>
        </figure>
    );
}

function DonateCtaSection() {
    const reduceMotion = useReducedMotion();

    return (
        <section id="donate-cta" className="bg-white py-6 md:py-8" dir="rtl" aria-labelledby="donate-cta-title">
            <div className="container mx-auto max-w-[1280px] px-4">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative overflow-hidden rounded-[20px] bg-gradient-to-l from-golden-orange to-golden-orange-dark shadow-[0_12px_40px_rgba(21,122,117,.14)]"
                    dir="ltr"
                >
                    <Image
                        src="/Donar.png"
                        alt=""
                        fill
                        priority={false}
                        sizes="(min-width: 1280px) 1280px, 100vw"
                        className="object-cover object-left opacity-95"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-golden-orange/80 via-golden-orange/35 to-transparent" />

                    <div className="relative z-10 grid min-h-[190px] items-center gap-6 px-6 py-7 md:grid-cols-[220px_1fr_360px] md:px-10 lg:grid-cols-[240px_1fr_410px] lg:px-12">
                        <div className="order-2 flex flex-col items-stretch gap-4 sm:items-center md:order-none md:items-start">
                            <Button
                                asChild
                                className="h-14 min-w-[172px] rounded-xl bg-white px-7 text-[15px] font-black text-warm-green shadow-sm hover:bg-warm-white hover:text-warm-green-dark"
                            >
                                <Link href="/explore">
                                    <Heart className="h-5 w-5" aria-hidden="true" />
                                    <span>تبرع الآن</span>
                                </Link>
                            </Button>

                            <span
                                className="inline-flex items-center justify-center gap-2 pr-1 text-sm font-bold text-white/90"
                                dir="rtl"
                            >
                                تبرعك يصنع الأمل
                            </span>
                        </div>

                        <div className="order-1 text-center md:order-none" dir="rtl">
                            <h2 id="donate-cta-title" className="text-[28px] font-black leading-[1.45] text-white md:text-[36px] lg:text-[40px]">
                                كن سبباً في تغيير حياة
                                <br />
                                تبرّع الآن وكن معهم.
                            </h2>
                        </div>

                        <div className="hidden md:block" aria-hidden="true" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function PartnersSliderSection() {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const reduceMotion = useReducedMotion();
    const duplicatedPartners = [...partners, ...partners, ...partners];

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        let animationFrame = 0;
        const loopWidth = scroller.scrollWidth / 3;

        if (!reduceMotion && scroller.scrollLeft < 1 && loopWidth > 0) {
            scroller.scrollLeft = loopWidth;
        }

        if (reduceMotion || paused) return;

        let previousTime = performance.now();
        let currentScroll = scroller.scrollLeft;
        const speed = 0.035;
        const tick = (time: number) => {
            const delta = time - previousTime;
            previousTime = time;

            currentScroll += delta * speed;

            if (currentScroll >= loopWidth * 2) {
                currentScroll -= loopWidth;
            }

            if (currentScroll <= 0) {
                currentScroll += loopWidth;
            }

            scroller.scrollLeft = currentScroll;
            animationFrame = requestAnimationFrame(tick);
        };

        animationFrame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrame);
    }, [paused, reduceMotion]);

    const scrollByCards = (direction: "previous" | "next") => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const amount = Math.max(scroller.clientWidth * 0.8, 280);
        scroller.scrollBy({
            left: direction === "next" ? amount : -amount,
            behavior: "smooth",
        });
    };

    return (
        <section id="partners" className="bg-white py-14 md:py-16" dir="rtl" aria-labelledby="partners-title">
            <div className="container mx-auto max-w-[1180px] px-4">
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#Eef4f3] text-[#157A75] text-sm font-bold tracking-wider mb-4">
                        شركاء النجاح
                    </div>
                    <h2 id="partners-title" className="text-3xl lg:text-4xl font-black text-[#0F4C4A]">
                        شركاؤنا في الخير
                    </h2>
                </div>

                <div
                    className="relative"
                    role="region"
                    aria-label="شعارات شركاء عون"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                >
                    <div
                        ref={scrollerRef}
                        className="scrollbar-hide flex gap-4 overflow-x-auto px-1 py-3"
                        dir="ltr"
                    >
                        {duplicatedPartners.map((partner, index) => (
                            <PartnerLogoCard key={`${partner.name}-${index}`} partner={partner} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function PartnerLogoCard({ partner }: { partner: Partner }) {
    return (
        <div className="flex h-24 min-w-[44%] snap-center items-center justify-center rounded-2xl border border-border bg-white px-5 text-center shadow-[0_4px_20px_rgba(21,122,117,.08)] sm:min-w-[30%] md:min-w-[22%] lg:min-w-[15%]">
            {partner.logoSrc ? (
                <Image
                    src={partner.logoSrc}
                    alt={partner.name}
                    width={170}
                    height={72}
                    className="max-h-16 w-auto max-w-[150px] object-contain"
                />
            ) : (
                <span className="text-sm font-black leading-6 text-warm-green">{partner.name}</span>
            )}
        </div>
    );
}
