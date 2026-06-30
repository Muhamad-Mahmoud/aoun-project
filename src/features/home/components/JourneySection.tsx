"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HandHeart, Wheat, GraduationCap, Stethoscope, HandCoins, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import Link from 'next/link';

const programs = [
    {
        title: "الإغاثة العاجلة",
        description: "تدخل سريع وفعّال لتقديم العون في حالات الطوارئ والأزمات.",
        icon: HandHeart,
        iconColor: "text-[#3b82f6]", // Blue
        bgColor: "bg-[#3b82f6]/10",
        hoverBgColor: "group-hover/card:bg-[#3b82f6]/5",
        href: "/login"
    },
    {
        title: "الغذاء والاحتياجات",
        description: "تأمين السلال الغذائية والمستلزمات الأساسية للأسر المحتاجة.",
        icon: Wheat,
        iconColor: "text-[#f59e0b]", // Amber
        bgColor: "bg-[#f59e0b]/10",
        hoverBgColor: "group-hover/card:bg-[#f59e0b]/5",
        href: "/login"
    },
    {
        title: "التعليم والتدريب",
        description: "دعم مسيرة التعليم وتوفير البرامج التدريبية لبناء مستقبل مشرق.",
        icon: GraduationCap,
        iconColor: "text-[#8b5cf6]", // Violet
        bgColor: "bg-[#8b5cf6]/10",
        hoverBgColor: "group-hover/card:bg-[#8b5cf6]/5",
        href: "/login"
    },
    {
        title: "الصحة والعلاج",
        description: "توفير الأدوية والتكفل بالعمليات الجراحية للمرضى المحتاجين.",
        icon: Stethoscope,
        iconColor: "text-[#10b981]", // Emerald
        bgColor: "bg-[#10b981]/10",
        hoverBgColor: "group-hover/card:bg-[#10b981]/5",
        href: "/login"
    },
    {
        title: "المساعدات المالية",
        description: "تفريج الكرب وتقديم دعم مالي مباشر للأسر المتعففة.",
        icon: HandCoins,
        iconColor: "text-[#14b8a6]", // Teal
        bgColor: "bg-[#14b8a6]/10",
        hoverBgColor: "group-hover/card:bg-[#14b8a6]/5",
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
    const isVisibleRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
            { threshold: 0, rootMargin: '100px' }
        );
        const el = scrollRef.current;
        if (el) observer.observe(el);
        return () => observer.disconnect();
    }, []);

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
        
        const SPEED = 0.03; 

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) return;

        const step = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            if (!isPaused && !isDragging && el && setEl && isVisibleRef.current) {
                accumulator += deltaTime * SPEED;
                
                if (accumulator >= 1) {
                    const pixelsToMove = Math.floor(accumulator);
                    accumulator -= pixelsToMove;
                    el.scrollLeft -= pixelsToMove;
                }

                const maxScroll = setEl.offsetWidth;
                if (Math.abs(el.scrollLeft) >= maxScroll) {
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
        <section id="journey" className="py-24 md:py-32 bg-[#F8FCFB] relative overflow-hidden" dir="rtl">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#12a17b]/10 border border-[#12a17b]/20 text-[#0f3a29] text-sm font-bold tracking-wide mb-6 shadow-sm transition-transform hover:scale-105">
                        <Target className="w-4 h-4 text-[#12a17b]" />
                        <span>مجالات العون</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[#0f3a29] tracking-tight">
                        نغطي أهم مجالات الحاجة
                    </h2>
                </div>
            </div>

            {/* Slider Container - Now constrained to standard container width */}
            <div className="container mx-auto max-w-[1280px] px-4 relative group/slider">
                
                {/* Floating Arrows */}
                <button 
                    onClick={() => scroll('right')} 
                    aria-label="السابق" 
                    className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-[#12a17b]/20 shadow-[0_8px_30px_rgba(18,161,123,0.15)] flex items-center justify-center text-[#0f3a29] hover:bg-[#12a17b] hover:text-white hover:border-[#12a17b] transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 hidden sm:flex hover:scale-110"
                >
                    <ArrowRight className="w-6 h-6" />
                </button>
                
                <button 
                    onClick={() => scroll('left')} 
                    aria-label="التالي" 
                    className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-[#12a17b]/20 shadow-[0_8px_30px_rgba(18,161,123,0.15)] flex items-center justify-center text-[#0f3a29] hover:bg-[#12a17b] hover:text-white hover:border-[#12a17b] transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hidden sm:flex hover:scale-110"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Added -mx-4 and px-4 so the card shadows don't get clipped by the container overflow if it happens, but the width is still constrained */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-2 [&::-webkit-scrollbar]:hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={onMouseLeave}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', willChange: 'scroll-position' }}
                    role="region"
                    aria-label="مجالات العون"
                >
                    <div className="flex pb-16 pt-4 w-max" role="list">
                        
                        {/* First Set */}
                        <div ref={firstSetRef} className="flex gap-6 md:gap-8 pl-6 md:pl-8">
                            {programs.map((program, i) => {
                                const Icon = program.icon;
                                return (
                                    <Link 
                                        href={program.href} 
                                        key={i} 
                                        role="listitem"
                                        className="group/card flex flex-col relative w-[85vw] sm:w-[45vw] md:w-[320px] shrink-0 bg-white rounded-3xl border border-slate-100 p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#12a17b]/15 overflow-hidden"
                                        draggable="false"
                                    >
                                        {/* Decorative blob top-right */}
                                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${program.hoverBgColor} opacity-0 transition-all duration-700 group-hover/card:scale-[3] group-hover/card:opacity-100 -z-10`}></div>
                                        
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`w-16 h-16 rounded-2xl ${program.bgColor} flex items-center justify-center transition-transform duration-500 group-hover/card:scale-110 group-hover/card:-rotate-3 shadow-sm`}>
                                                <Icon className={`w-8 h-8 ${program.iconColor}`} strokeWidth={2} />
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 transition-all duration-300 group-hover/card:bg-[#12a17b] group-hover/card:text-white group-hover/card:shadow-md">
                                                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover/card:-rotate-45" />
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-black text-[#0f3a29] mb-3 transition-colors duration-300">
                                            {program.title}
                                        </h3>
                                        <p className="text-slate-500 text-[15px] leading-relaxed mb-4 font-medium transition-colors duration-300 group-hover/card:text-slate-600">
                                            {program.description}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                        
                        {/* Second Set (Duplicate) */}
                        <div className="flex gap-6 md:gap-8">
                            {programs.map((program, i) => {
                                const Icon = program.icon;
                                return (
                                    <Link 
                                        href={program.href} 
                                        key={`dup-${i}`} 
                                        role="listitem"
                                        className="group/card flex flex-col relative w-[85vw] sm:w-[45vw] md:w-[320px] shrink-0 bg-white rounded-3xl border border-slate-100 p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#12a17b]/15 overflow-hidden"
                                        draggable="false"
                                    >
                                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${program.hoverBgColor} opacity-0 transition-all duration-700 group-hover/card:scale-[3] group-hover/card:opacity-100 -z-10`}></div>
                                        
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`w-16 h-16 rounded-2xl ${program.bgColor} flex items-center justify-center transition-transform duration-500 group-hover/card:scale-110 group-hover/card:-rotate-3 shadow-sm`}>
                                                <Icon className={`w-8 h-8 ${program.iconColor}`} strokeWidth={2} />
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 transition-all duration-300 group-hover/card:bg-[#12a17b] group-hover/card:text-white group-hover/card:shadow-md">
                                                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover/card:-rotate-45" />
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-black text-[#0f3a29] mb-3 transition-colors duration-300">
                                            {program.title}
                                        </h3>
                                        <p className="text-slate-500 text-[15px] leading-relaxed mb-4 font-medium transition-colors duration-300 group-hover/card:text-slate-600">
                                            {program.description}
                                        </p>
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
