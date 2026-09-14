import React from 'react';
import { UserPlus, ClipboardList, FileSearch, Handshake, HeartHandshake } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

const steps = [
    {
        number: "١",
        title: "اختر نوع المساعدة",
        description: "حدّد نوع الدعم الذي تحتاجه بسهولة.",
        icon: UserPlus
    },
    {
        number: "٢",
        title: "قدّم طلبك",
        description: "املأ البيانات المطلوبة وأرسل طلبك.",
        icon: ClipboardList
    },
    {
        number: "٣",
        title: "نراجع طلبك",
        description: "نقوم بدراسة طلبك بعناية لتحديد الأنسب لك.",
        icon: FileSearch
    },
    {
        number: "٤",
        title: "نوصِلك بالجهة المناسبة",
        description: "نربطك بالجمعية الأنسب لمساعدتك.",
        icon: Handshake
    },
    {
        number: "٥",
        title: "تصل المساعدة",
        description: "تصلك المساعدة وتبدأ رحلة الأمل.",
        icon: HeartHandshake
    }
];

export function HowItWorksSection() {
    return (
        <section className="py-24 md:py-32 bg-[#F6FAF9] relative overflow-hidden" dir="rtl">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Header */}
                <div className="text-center mb-24 animate-fade-in">
                    <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#Eef4f3] text-[#157A75] text-sm font-bold tracking-wider mb-4">
                        كيف نعمل
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[#0F4C4A]">
                        خطوات بسيطة.. أثر كبير
                    </h2>
                </div>

                {/* Journey Steps */}
                <div className="relative max-w-6xl mx-auto px-4">
                    <ol className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-4 relative m-0 p-0 list-none">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isLast = index === steps.length - 1;
                            
                            return (
                                <li 
                                    key={index} 
                                    className="flex flex-col items-center text-center group w-full lg:w-1/5 animate-fade-in-up relative"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    {/* Connector Line (Desktop) */}
                                    {!isLast && (
                                        <div className="hidden lg:block absolute top-[44px] -left-1/2 w-full h-[2px] -z-10">
                                            {/* Dotted Line */}
                                            <div className="w-full h-[2px] border-t-[2px] border-dotted border-[#2BA9A4]/40"></div>
                                            {/* Arrow Head */}
                                            <div className="absolute top-1/2 -translate-y-1/2 left-0 text-[#2BA9A4]/50">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                                                    <path d="M9 18l6-6-6-6" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Icon Circle */}
                                    <div className="relative z-10 w-[88px] h-[88px] rounded-full bg-white shadow-[0_4px_20px_rgba(21,122,117,0.06)] flex items-center justify-center mb-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_12px_40px_rgba(21,122,117,0.12)] shrink-0">
                                        <Icon className="w-8 h-8 text-[#0F4C4A] transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                                        
                                        {/* Number Badge at Top Center */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0F4C4A] text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform duration-300 group-hover:scale-110">
                                            {step.number}
                                        </div>
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div>
                                        <h3 className="text-lg font-black text-[#1C2B2A] mb-2">{step.title}</h3>
                                        <p className="text-[#5C726F] text-sm leading-relaxed max-w-[200px] mx-auto">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Mobile Connector Line */}
                                    {!isLast && (
                                        <div className="block lg:hidden absolute top-[88px] bottom-[-64px] left-1/2 -translate-x-1/2 w-[2px] -z-10">
                                            <div className="w-[2px] h-full border-l-[2px] border-dotted border-[#2BA9A4]/40 mx-auto"></div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>

                    {/* CTA Button placed under Step 5 (Far Left in RTL) */}
                    <div className="mt-16 hidden lg:flex justify-end animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                        <Button asChild variant="outline" size="lg" className="border border-[#0F4C4A] text-[#0F4C4A] bg-transparent hover:bg-[#0F4C4A] hover:text-white rounded-full px-8 py-5 h-auto font-bold text-base transition-all duration-300">
                            <Link href="/login">
                                تعرّف على التفاصيل
                            </Link>
                        </Button>
                    </div>
                    {/* CTA Button for Mobile (Centered) */}
                    <div className="mt-12 flex lg:hidden justify-center animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                        <Button asChild variant="outline" size="lg" className="border border-[#0F4C4A] text-[#0F4C4A] bg-transparent hover:bg-[#0F4C4A] hover:text-white rounded-full px-8 py-5 h-auto font-bold text-base transition-all duration-300">
                            <Link href="/login">
                                تعرّف على التفاصيل
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
