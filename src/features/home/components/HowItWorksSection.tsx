import React from 'react';
import { UserPlus, ClipboardList, FileSearch, Handshake, HeartHandshake, Target, ArrowLeft } from 'lucide-react';
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
        <section className="py-24 md:py-32 bg-white relative overflow-hidden" dir="rtl">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#12a17b]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Header */}
                <div className="text-center mb-24 animate-fade-in flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#12a17b]/10 border border-[#12a17b]/20 text-[#0f3a29] text-sm font-bold tracking-wide mb-6 shadow-sm transition-transform hover:scale-105">
                        <Target className="w-4 h-4 text-[#12a17b]" />
                        <span>كيف نعمل</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[#0f3a29]">
                        خطوات بسيطة.. أثر كبير
                    </h2>
                </div>

                {/* Journey Steps */}
                <div className="relative max-w-6xl mx-auto px-4">
                    {/* The main connector line - moved behind all items for a cleaner look */}
                    <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] -z-10 bg-gradient-to-r from-transparent via-[#12a17b]/20 to-transparent"></div>

                    <ol className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-4 relative m-0 p-0 list-none">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isLast = index === steps.length - 1;
                            
                            return (
                                <li 
                                    key={index} 
                                    className="flex flex-col items-center text-center group w-full lg:w-1/5 relative"
                                >
                                    {/* Mobile Connector Line */}
                                    {!isLast && (
                                        <div className="block lg:hidden absolute top-[88px] bottom-[-48px] left-1/2 -translate-x-1/2 w-[2px] -z-10 bg-gradient-to-b from-[#12a17b]/20 to-transparent"></div>
                                    )}

                                    {/* Icon Circle */}
                                    <div className="relative z-10 w-[88px] h-[88px] rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center mb-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-[#12a17b]/10 group-hover:border-[#12a17b]/30 group-hover:bg-white shrink-0">
                                        <Icon className="w-8 h-8 text-[#0f3a29] transition-all duration-500 group-hover:scale-110 group-hover:text-[#12a17b]" strokeWidth={2} />
                                        
                                        {/* Premium Number Badge */}
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-[#12a17b] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#12a17b]/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                            {step.number}
                                        </div>
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div>
                                        <h3 className="text-lg font-black text-[#0f3a29] mb-3 transition-colors duration-300 group-hover:text-[#12a17b]">{step.title}</h3>
                                        <p className="text-slate-500 text-[14px] leading-relaxed max-w-[200px] mx-auto font-medium">
                                            {step.description}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    {/* Centered CTA Button */}
                    <div className="mt-20 flex justify-center">
                        <Button asChild className="h-14 px-10 bg-[#0f3a29] hover:bg-[#12a17b] text-white rounded-2xl text-[15px] font-bold shadow-xl shadow-[#0f3a29]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#12a17b]/30 group">
                            <Link href="/login" className="flex items-center gap-3">
                                تعرّف على التفاصيل
                                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
