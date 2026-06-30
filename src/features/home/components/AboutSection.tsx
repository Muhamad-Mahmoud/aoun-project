"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { ShieldCheck, User, CheckCircle2, ArrowLeft, Target } from 'lucide-react';

export function AboutSection() {
    return (
        <section id="about" className="min-h-[calc(100vh-76px)] flex items-center py-12 lg:py-0 bg-white relative overflow-hidden" dir="rtl">
            {/* Subtle decorative background - compact */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#12a17b]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            
            <div className="container mx-auto max-w-[1280px] px-4">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    
                    {/* Content Area - RTL First element goes to the Right */}
                    <div className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-right">
                        
                        <div className="mb-6 lg:mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12a17b]/10 border border-[#12a17b]/20 text-[#0f3a29] text-sm font-bold tracking-wide mb-4 shadow-sm">
                                <Target className="w-4 h-4 text-[#12a17b]" />
                                <span>رسالتنا</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-[#0f3a29] mb-4 leading-tight tracking-tight">
                                نحو مجتمع <span className="text-[#12a17b]">يتكاتف</span> ليرتقي
                            </h2>
                            <p className="text-slate-600 text-base lg:text-[1.125rem] leading-[1.7] font-medium max-w-xl mx-auto lg:mx-0">
                                نسعى في عون إلى تسهيل وصول المساعدات لمستحقيها بأعلى درجات الشفافية والكرامة، من خلال استخدام التقنيات الذكية وبالتعاون مع الجمعيات الموثوقة.
                            </p>
                        </div>

                        {/* Features Row - Compact */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-6 sm:gap-10 pt-2 mb-8">
                            
                            {/* Feature 1: Reliability */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-right group cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-[#e6f4f1] flex items-center justify-center text-[#1a7a75] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#12a17b] group-hover:text-white shadow-sm">
                                    <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <h5 className="font-extrabold text-[#113f3b] text-base mb-1 transition-colors group-hover:text-[#12a17b]">موثوقية</h5>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[120px]">شركاء معتمدون ورقابة صارمة</p>
                            </div>

                            {/* Feature 2: Transparency */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-right group cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-[#f1f8e9] flex items-center justify-center text-[#65a30d] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#65a30d] group-hover:text-white shadow-sm">
                                    <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <h5 className="font-extrabold text-[#113f3b] text-base mb-1 transition-colors group-hover:text-[#65a30d]">شفافية</h5>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[120px]">معلومات واضحة وتقارير دورية</p>
                            </div>

                            {/* Feature 3: Dignity */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-right group cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#4f46e5] group-hover:text-white shadow-sm">
                                    <User className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <h5 className="font-extrabold text-[#113f3b] text-base mb-1 transition-colors group-hover:text-[#4f46e5]">كرامة</h5>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[120px]">نحفظ كرامتك في كل خطوة</p>
                            </div>

                        </div>

                        {/* CTA Button - Align Right (justify-start in RTL) */}
                        <div className="flex justify-center lg:justify-start">
                            <Button asChild className="h-12 px-8 bg-[#0f3a29] hover:bg-[#12a17b] text-white rounded-xl text-[15px] font-bold shadow-lg shadow-[#0f3a29]/20 transition-all hover:-translate-y-1">
                                <Link href="/about" className="flex items-center group">
                                    تعرف علينا أكثر
                                    <ArrowLeft className="w-5 h-5 mr-2.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>

                    </div>

                    {/* Image Area - RTL Second element goes to the Left */}
                    <div className="w-full lg:w-[50%] flex justify-center lg:justify-end shrink-0 relative">
                        <div className="relative w-full max-w-[550px] aspect-[1.5] group">
                            {/* Decorative shadow under image */}
                            <div className="absolute inset-4 bg-[#12a17b]/10 rounded-[2rem] transform translate-x-3 translate-y-3 -z-10 transition-transform duration-500 group-hover:translate-x-5 group-hover:translate-y-5"></div>
                            <Image 
                                src="/description.webp" 
                                alt="عن منصة عون" 
                                fill 
                                loading="lazy"
                                className="object-cover rounded-[2rem] shadow-xl border-4 border-white transition-transform duration-500 group-hover:-translate-y-2"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
