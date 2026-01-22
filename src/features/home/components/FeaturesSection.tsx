"use client";

import { FileSearch, Brain, BarChart3, Network } from "lucide-react";

const features = [
    {
        icon: FileSearch,
        title: "استخراج البيانات تلقائيًا",
        description: "استخراج وتحليل البيانات من المستندات الرسمية بدقة عالية فور رفعها للنظام.",
    },
    {
        icon: Brain,
        title: "تصنيف نوع المساعدة",
        description: "تحديد نوع المساعدة الأنسب (مالية، طبية، تعليمية) بدقة عبر خوارزميات الذكاء الاصطناعي.",
    },
    {
        icon: BarChart3,
        title: "تقييم مستوى الحاجة",
        description: "تحليل البيانات لتحديد أولويات الدعم بعدالة وشفافية تامة بناءً على المعايير.",
    },
    {
        icon: Network,
        title: "التوصية بالجهة المناسبة",
        description: "ربط الأسر بالجمعيات الخيرية المناسبة تلقائياً حسب الموقع ونوع الاحتياج.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 border border-primary/20">
                        لماذا عون؟
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-foreground">
                        مميزات{" "}
                        <span className="text-primary relative inline-block">
                            المنصة الذكية
                            <svg className="absolute w-full h-2 -bottom-2 left-0 text-primary opacity-20" viewBox="0 0 100 10" preserveAspectRatio="none">
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
                                className="group relative bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Icon Container - All Blue */}
                                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 text-foreground font-display group-hover:text-primary transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-base line-clamp-3">
                                    {feature.description}
                                </p>

                                {/* Decorative Background Icon */}
                                <div className="absolute bottom-4 left-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
                                    <Icon className="w-32 h-32 text-foreground" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
