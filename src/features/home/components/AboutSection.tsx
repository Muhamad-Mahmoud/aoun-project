"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { ShieldCheck, User, CheckCircle2, ArrowLeft } from 'lucide-react';

export function AboutSection() {
    return (
        <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden" dir="rtl">
            <div className="container mx-auto max-w-[1280px] px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    
                    {/* Image Area - RTL First element goes to the Right */}
                    <div className="w-full lg:w-[50%] flex justify-center lg:justify-end shrink-0">
                        <div className="relative w-full max-w-[650px] aspect-[1.63]">
                            <Image 
                                src="/description.png" 
                                alt="عن منصة عون" 
                                fill 
                                className="object-cover rounded-[2rem] shadow-lg hover:shadow-xl transition-shadow duration-500"
                                priority
                            />
                        </div>
                    </div>

                    {/* Content Area - RTL Second element goes to the Left */}
                    <div className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-right">
                        
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#Eef4f3] text-[#157A75] text-sm font-bold tracking-wider mb-4">
                                رسالتنا
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-[#0F4C4A] mb-6 leading-tight tracking-tight">
                                نحو مجتمع يتكاتف ليرتقي
                            </h2>
                            <p className="text-[#64748b] text-[1.125rem] leading-[1.85] font-medium max-w-xl mx-auto lg:mx-0">
                                نسعى في عون إلى تسهيل وصول المساعدات لمستحقيها بأعلى درجات الشفافية والكرامة، من خلال استخدام التقنيات الذكية وبالتعاون مع الجمعيات الموثوقة.
                            </p>
                        </div>

                        {/* Features Row */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-8 sm:gap-12 pt-2 mb-10">
                            
                            {/* Feature 1: Reliability */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                                <div className="w-12 h-12 rounded-full bg-[#e6f4f1] flex items-center justify-center text-[#1a7a75] mb-4">
                                    <ShieldCheck className="w-[1.4rem] h-[1.4rem]" strokeWidth={2.5} />
                                </div>
                                <h5 className="font-extrabold text-[#113f3b] text-[17px] mb-1.5">موثوقية</h5>
                                <p className="text-[13.5px] text-[#64748b] font-medium leading-[1.7] max-w-[130px]">شركاء معتمدون ورقابة صارمة</p>
                            </div>

                            {/* Feature 2: Transparency */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                                <div className="w-12 h-12 rounded-full bg-[#f1f8e9] flex items-center justify-center text-[#65a30d] mb-4">
                                    <CheckCircle2 className="w-[1.4rem] h-[1.4rem]" strokeWidth={2.5} />
                                </div>
                                <h5 className="font-extrabold text-[#113f3b] text-[17px] mb-1.5">شفافية</h5>
                                <p className="text-[13.5px] text-[#64748b] font-medium leading-[1.7] max-w-[130px]">معلومات واضحة وتقارير دورية</p>
                            </div>

                            {/* Feature 3: Dignity */}
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
                                <div className="w-12 h-12 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] mb-4">
                                    <User className="w-[1.4rem] h-[1.4rem]" strokeWidth={2.5} />
                                </div>
                                <h5 className="font-extrabold text-[#113f3b] text-[17px] mb-1.5">كرامة</h5>
                                <p className="text-[13.5px] text-[#64748b] font-medium leading-[1.7] max-w-[130px]">نحفظ كرامتك في كل خطوة</p>
                            </div>

                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-center lg:justify-end">
                            <Button asChild className="h-[3.25rem] px-8 bg-[#144642] hover:bg-[#0f3431] text-white rounded-xl text-[15px] font-bold shadow-lg shadow-[#144642]/20 transition-all hover:-translate-y-0.5">
                                <Link href="/about">
                                    تعرف علينا أكثر
                                    <ArrowLeft className="w-[1.15rem] h-[1.15rem] mr-2.5" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
