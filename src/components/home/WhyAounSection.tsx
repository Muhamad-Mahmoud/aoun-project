"use client";

import { MapPinned, Target, Zap, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: MapPinned,
        title: " بحث ذكي حسب النطاق الجغرافي",
        description: "نربطك بأقرب الجمعيات الخيرية في منطقتك ومحافظتك بدقة عالية لضمان سهولة الوصول.",
        gradient: "from-primary/80 to-primary",
    },
    {
        icon: Target,
        title: " توجيه دقيق حسب نوع الدعم",
        description: "سواء كان احتياجك طبيًا، تعليميًا، أو ماديًا، نقوم بتوصيلك بالجهة المتخصصة لتلبية طلبك بكفاءة.",
        gradient: "from-secondary to-secondary/80",
    },
    {
        icon: Zap,
        title: " استجابة سريعة وفورية",
        description: "لا داعي للانتظار الطويل؛ نحرص على الرد وتوجيهك لأفضل الخيارات المناسبة خلال 24 ساعة.",
        gradient: "from-accent to-accent/80",
    },
    {
        icon: ShieldCheck,
        title: "جهات ومؤسسات معتمدة",
        description: "نتعاون حصريًا مع جمعيات ومؤسسات مرخصة رسميًا من وزارة التضامن الاجتماعي لضمان الأمان والمصداقية.",
        gradient: "from-primary/80 to-secondary",
    },
];

export function WhyAounSection() {
    return (
        <section id="why-aoun" className="py-20 md:py-28 bg-card relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-l from-primary/10 to-secondary/10 text-primary text-sm font-bold mb-5 border border-primary/20">
                        لماذا عون؟
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        مميزات{" "}
                        <span className="text-primary relative inline-block">
                            المنصة الذكية
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-accent opacity-25" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        نظام متكامل يجمع بين الذكاء الاصطناعي والشفافية لضمان وصول الدعم لمستحقيه
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="relative bg-card rounded-3xl p-8 border-2 border-border shadow-lg transition-all duration-500 flex flex-col h-full overflow-hidden items-center text-center"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-[0.03] -z-10`}></div>

                                {/* Icon Container */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-4 text-foreground leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    {feature.description}
                                </p>

                                {/* Decorative Corner */}
                                <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-br-full -z-10`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
