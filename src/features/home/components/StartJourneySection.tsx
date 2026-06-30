"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Heart, ShieldCheck, Lock, HandHeart } from 'lucide-react';

export function StartJourneySection() {
    return (
        <section id="start-journey" className="bg-[#f8fbfa] py-16 md:py-24 relative overflow-hidden" dir="rtl" aria-labelledby="start-journey-title">
            <div className="container mx-auto max-w-[1280px] px-4 relative z-10">
                {/* 
                  Card Container: 
                  The background image contains the family on the left and the white curve/dots on the right.
                  We use it as a full cover background, and overlay the text on the right side.
                */}
                <div className="rounded-[2.5rem] shadow-[0_8px_40px_rgba(21,122,117,0.08)] overflow-hidden flex relative min-h-[500px]">
                    
                    {/* Full Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                        <Image 
                            src="/Start_your_journey.webp" 
                            alt="ابدأ رحلتك" 
                            fill 
                            loading="lazy"
                            sizes="(min-width: 1280px) 1280px, 100vw"
                            className="object-cover lg:object-fill object-center"
                        />
                    </div>

                    {/* Content Overlay - Positioned on the right */}
                    <div className="relative z-10 w-full flex justify-start">
                        <div className="w-full lg:w-[55%] xl:w-[50%] py-12 px-8 md:py-16 md:pl-12 md:pr-6 lg:pl-16 lg:pr-8 flex flex-col justify-center bg-white/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
                            
                            <div className="relative text-right max-w-xl mx-auto lg:mx-0 w-full">
                                <h2 id="start-journey-title" className="text-4xl md:text-[3.25rem] font-black text-[#144642] mb-3 leading-tight tracking-tight">
                                    ابدأ رحلتك اليوم
                                </h2>
                                <h3 className="text-xl md:text-[1.35rem] font-bold text-[#1a7a75] mb-6">
                                    جاهز لتغيير واقعك للأفضل؟
                                </h3>
                                <p className="text-[#64748b] text-[1.05rem] mb-10 leading-[1.8] font-medium">
                                    العديد من الأسر استفادت.. ابدأ خطوتك الأولى الآن <br className="hidden md:block" /> وانضم إلى منصة عون.
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mb-12">
                                    <Button asChild className="h-[3.25rem] px-8 bg-[#144642] hover:bg-[#0f3431] text-white rounded-[0.85rem] text-[15px] font-bold shadow-lg shadow-[#144642]/20 transition-all hover:-translate-y-0.5">
                                        <Link href="/register">
                                            ابدأ رحلتك الآن
                                            <ArrowLeft className="w-[1.15rem] h-[1.15rem] mr-2.5" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="h-[3.25rem] px-8 border-[#144642] text-[#144642] hover:bg-[#144642]/5 rounded-[0.85rem] text-[15px] font-bold transition-all hover:-translate-y-0.5 bg-transparent">
                                        <Link href="/explore">
                                            <Heart className="w-[1.15rem] h-[1.15rem] ml-2.5" aria-hidden="true" />
                                            استكشف الحملات
                                        </Link>
                                    </Button>
                                </div>

                                {/* Features Row */}
                                <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-8 border-t border-[#e2e8f0]/60">
                                    {/* Feature 1 */}
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-[#f59e0b]">
                                            <HandHeart className="w-[2.25rem] h-[2.25rem]" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[13px] font-bold text-[#334155]">مجاني بالكامل</span>
                                    </div>
                                    
                                    <div className="hidden sm:block w-px h-12 bg-[#e2e8f0]" /> {/* Divider */}

                                    {/* Feature 2 */}
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-[#0d9488]">
                                            <Lock className="w-[2.25rem] h-[2.25rem]" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[13px] font-bold text-[#334155]">آمن ومشفر</span>
                                    </div>

                                    <div className="hidden sm:block w-px h-12 bg-[#e2e8f0]" /> {/* Divider */}

                                    {/* Feature 3 */}
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-[#84cc16]">
                                            <ShieldCheck className="w-[2.25rem] h-[2.25rem]" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[13px] font-bold text-[#334155]">معتمد رسمياً</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
