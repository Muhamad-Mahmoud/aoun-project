"use client";

import { MapPinned, Target, Zap, ShieldCheck } from "lucide-react";
import { colors } from "@/lib/colors";

const features = [
    {
        icon: MapPinned,
        title: "بحث ذكي حسب النطاق الجغرافي",
        description: "نربطك بأقرب الجمعيات الخيرية في منطقتك ومحافظتك بدقة عالية لضمان سهولة الوصول.",
        bg: colors.warmGreen.lightGradient,
        gradient: colors.warmGreen.gradient,
        border: colors.warmGreen.borderLight,
    },
    {
        icon: Target,
        title: "توجيه دقيق حسب نوع الدعم",
        description: "سواء كان احتياجك طبيًا، تعليميًا، أو ماديًا، نقوم بتوصيلك بالجهة المتخصصة لتلبية طلبك بكفاءة.",
        bg: colors.purple.lightGradient,
        gradient: colors.purple.gradient,
        border: colors.purple.borderLight,
    },
    {
        icon: Zap,
        title: "استجابة سريعة خلال 24 ساعة",
        description: "لا داعي للانتظار الطويل؛ نحرص على الرد وتوجيهك لأفضل الخيارات المناسبة خلال 24 ساعة.",
        bg: colors.orange.lightGradient,
        gradient: colors.orange.gradient,
        border: colors.orange.borderLight,
    },
    {
        icon: ShieldCheck,
        title: "جهات ومؤسسات معتمدة",
        description: "نتعاون حصريًا مع جمعيات ومؤسسات مرخصة رسميًا من وزارة التضامن الاجتماعي لضمان الأمان والمصداقية.",
        bg: colors.emerald.lightGradient,
        gradient: colors.emerald.gradient,
        border: colors.emerald.borderLight,
    },
];

export function WhyAounSection() {
    return (
        <section id="why-aoun" className="py-20 md:py-28 bg-warm-beige relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-l from-warm-green/10 to-warm-green-light/10 text-warm-green text-sm font-bold mb-5 border border-warm-green/20">
                        لماذا عون؟
                    </div>
                    <h2 className="text-4xl md:text-h2-desktop font-bold mb-6 text-foreground">
                        مميزات{" "}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-br from-warm-green via-warm-green-light to-warm-green bg-clip-text text-transparent">
                                المنصة الذكية
                            </span>
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-cyan-500 opacity-25" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        نظام متكامل يجمع بين الذكاء الاصطناعي والشفافية لضمان وصول الدعم لمستحقيه
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative bg-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 border-2 ${feature.border} hover:border-emerald-500/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-center text-center h-full`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Icon Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-50 group-hover:opacity-70 transition-opacity duration-500 -z-10`}></div>

                                {/* Icon */}
                                <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 lg:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-base lg:text-lg font-bold mb-2.5 lg:mb-3 text-foreground leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-[13px] lg:text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
