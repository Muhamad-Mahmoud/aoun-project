"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HandHeart, Wheat, GraduationCap, Stethoscope, HandCoins, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const programs = [
    {
        title: "الإغاثة العاجلة",
        description: "تدخل سريع وفعّال لتقديم العون في حالات الطوارئ والأزمات.",
        icon: HandHeart,
        iconColor: "text-[#3b82f6]", // Blue
        bgColor: "bg-[#3b82f6]/10",
        href: "/login"
    },
    {
        title: "الغذاء والاحتياجات",
        description: "تأمين السلال الغذائية والمستلزمات الأساسية للأسر المحتاجة.",
        icon: Wheat,
        iconColor: "text-[#f59e0b]", // Amber
        bgColor: "bg-[#f59e0b]/10",
        href: "/login"
    },
    {
        title: "التعليم والتدريب",
        description: "دعم مسيرة التعليم وتوفير البرامج التدريبية لبناء مستقبل مشرق.",
        icon: GraduationCap,
        iconColor: "text-[#8b5cf6]", // Violet
        bgColor: "bg-[#8b5cf6]/10",
        href: "/login"
    },
    {
        title: "الصحة والعلاج",
        description: "توفير الأدوية والتكفل بالعمليات الجراحية للمرضى المحتاجين.",
        icon: Stethoscope,
        iconColor: "text-[#10b981]", // Emerald
        bgColor: "bg-[#10b981]/10",
        href: "/login"
    },
    {
        title: "المساعدات المالية",
        description: "تفريج الكرب وتقديم دعم مالي مباشر للأسر المتعففة.",
        icon: HandCoins,
        iconColor: "text-[#14b8a6]", // Teal
        bgColor: "bg-[#14b8a6]/10",
        href: "/login"
    }
];

export function JourneySection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const firstSetRef = useRef<HTMLDivElement>(null);
    
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        const setEl = firstSetRef.current;
        if (!el || !setEl) return;

        let animationId: number;
        let lastTime = performance.now();
        let accumulator = 0;
        
        // 0.03 pixels per millisecond = 30px per second (slow and smooth)
        const SPEED = 0.03; 

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) return;

        const step = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            if (!isPaused && !isDragging && el && setEl) {
                accumulator += deltaTime * SPEED;
                
                if (accumulator >= 1) {
                    const pixelsToMove = Math.floor(accumulator);
                    accumulator -= pixelsToMove;
                    el.scrollLeft -= pixelsToMove;
                }

                // Seamless loop check: reset precisely when we scroll the exact width of the first set
                const maxScroll = setEl.offsetWidth;
                if (Math.abs(el.scrollLeft) >= maxScroll) {
                    // We remove maxScroll to keep any fractional scroll that exceeded it for perfect smoothness
                    el.scrollLeft += maxScroll; 
                }
            }
            animationId = requestAnimationFrame(step);
        };

        animationId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationId);
    }, [isPaused, isDragging]);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setIsPaused(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeftPos(scrollRef.current?.scrollLeft || 0);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
        setIsPaused(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
        setIsPaused(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current.offsetLeft || 0);
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeftPos - walk;
    };

    return (
        <section id="journey" className="py-24 md:py-32 bg-white relative overflow-hidden" dir="rtl">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#Eef4f3] text-[#157A75] text-sm font-bold tracking-wider mb-4">
                        مجالات العون
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[#0F4C4A]">
                        نغطي أهم مجالات الحاجة
                    </h2>
                </div>
            </div>

            {/* Slider Container */}
            <div className="relative max-w-[1500px] mx-auto group/slider">
                
                {/* Floating Arrows */}
                <button 
                    onClick={() => scroll('right')} 
                    aria-label="السابق" 
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border border-[#E3ECEA] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#1C2B2A] hover:bg-[#F6FAF9] hover:border-[#2BA9A4] transition-all opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 hidden sm:flex"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
                
                <button 
                    onClick={() => scroll('left')} 
                    aria-label="التالي" 
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border border-[#E3ECEA] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#1C2B2A] hover:bg-[#F6FAF9] hover:border-[#2BA9A4] transition-all opacity-0 group-hover/slider:opacity-100 hidden sm:flex"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto cursor-grab active:cursor-grabbing px-4 md:px-16 xl:px-[calc((100vw-1400px)/2+2rem)] [&::-webkit-scrollbar]:hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={onMouseLeave}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    role="region"
                    aria-label="مجالات العون"
                >
                    <div className="flex pb-16 pt-4 w-max" role="list">
                        
                        {/* First Set (Includes padding on the left to act as the gap between sets) */}
                        <div ref={firstSetRef} className="flex gap-4 md:gap-6 pl-4 md:pl-6">
                            {programs.map((program, i) => {
                                const Icon = program.icon;
                                return (
                                    <Link 
                                        href={program.href} 
                                        key={i} 
                                        role="listitem"
                                        className="group/card flex flex-col items-center text-center w-[85vw] sm:w-[45vw] md:w-[320px] shrink-0 bg-white rounded-[24px] border border-[#E3ECEA] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_20px_40px_rgba(21,122,117,0.08)] shadow-[0_4px_20px_rgba(21,122,117,0.03)]"
                                        draggable="false"
                                    >
                                        <div className={`w-20 h-20 rounded-[20px] ${program.bgColor} flex items-center justify-center mb-6 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-3`}>
                                            <Icon className={`w-10 h-10 ${program.iconColor}`} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#1C2B2A] mb-3">
                                            {program.title}
                                        </h3>
                                        <p className="text-[#5C726F] text-sm leading-relaxed mb-8 line-clamp-2 px-2">
                                            {program.description}
                                        </p>
                                        <div className="mt-auto flex items-center gap-2 text-[#2BA9A4] text-sm font-bold transition-all duration-300 group-hover/card:gap-3">
                                            <span>تعرّف أكثر</span>
                                            <ArrowLeft className="w-4 h-4" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        
                        {/* Second Set (Duplicate for seamless looping) */}
                        <div className="flex gap-4 md:gap-6">
                            {programs.map((program, i) => {
                                const Icon = program.icon;
                                return (
                                    <Link 
                                        href={program.href} 
                                        key={`dup-${i}`} 
                                        role="listitem"
                                        className="group/card flex flex-col items-center text-center w-[85vw] sm:w-[45vw] md:w-[320px] shrink-0 bg-white rounded-[24px] border border-[#E3ECEA] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_20px_40px_rgba(21,122,117,0.08)] shadow-[0_4px_20px_rgba(21,122,117,0.03)]"
                                        draggable="false"
                                    >
                                        <div className={`w-20 h-20 rounded-[20px] ${program.bgColor} flex items-center justify-center mb-6 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-3`}>
                                            <Icon className={`w-10 h-10 ${program.iconColor}`} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#1C2B2A] mb-3">
                                            {program.title}
                                        </h3>
                                        <p className="text-[#5C726F] text-sm leading-relaxed mb-8 line-clamp-2 px-2">
                                            {program.description}
                                        </p>
                                        <div className="mt-auto flex items-center gap-2 text-[#2BA9A4] text-sm font-bold transition-all duration-300 group-hover/card:gap-3">
                                            <span>تعرّف أكثر</span>
                                            <ArrowLeft className="w-4 h-4" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
