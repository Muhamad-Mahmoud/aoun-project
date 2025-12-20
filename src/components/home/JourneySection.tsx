"use client";

import { UserPlus, FileText, BrainCircuit, Building2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";

import { colors } from "@/lib/colors";

const steps = [
    {
        icon: UserPlus,
        number: "١",
        title: "أنشئ حسابك",
        description: "سجل بياناتك الأساسية بسهولة",
        color: colors.emerald.gradient,
    },
    {
        icon: FileText,
        number: "٢",
        title: "حدد احتياجك",
        description: "اختر نوع الدعم المطلوب",
        color: colors.orange.gradient,
    },
    {
        icon: BrainCircuit,
        number: "٣",
        title: "التحليل الذكي",
        description: "نظامنا يرشح أنسب الجمعيات",
        color: colors.purple.gradient,
    },
    {
        icon: Building2,
        number: "٤",
        title: "التوصيل المباشر",
        description: "نوصل طلبك للجهة المختصة",
        color: colors.cyan.gradient,
    },
    {
        icon: CheckCircle2,
        number: "٥",
        title: "استلام الدعم",
        description: "الجمعية تتواصل معك مباشرة",
        color: colors.warmGreen.gradient,
    },
];

export function JourneySection() {
    return (
        <section id="journey" className="py-20 md:py-28 bg-warm-beige/50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-golden-orange/3 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-blue/3 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
                {/* Header */}
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-block px-5 py-2 rounded-full bg-white text-warm-green text-sm font-bold mb-5 border border-warm-green/20 shadow-sm">
                        رحلة المستخدم
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold mb-6 text-foreground">
                        كيف تحصل على <span className="text-warm-green">المساعدة؟</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        خطوات بسيطة وواضحة تضمن وصول صوتك لمن يمد يد العون
                    </p>
                </div>

                {/* Steps - Responsive Grid/Stack */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Connection Line - Desktop Only */}
                    <div className="hidden lg:block absolute top-[66px] left-16 right-16 h-0.5 bg-border -z-10"></div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isFirst = index === 0;

                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center animate-fade-in relative group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Step Circle with Number */}
                                    <div className="relative mb-4 lg:mb-6">
                                        {/* Main Circle */}
                                        <div className={`relative z-10 w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white border-4 ${isFirst ? 'border-warm-green' : 'border-border/40 group-hover:border-warm-green/40 transition-colors duration-300'} shadow-lg flex items-center justify-center`}>
                                            <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-warm-green transform group-hover:scale-110 transition-transform duration-300" />
                                        </div>

                                        {/* Number Badge - Prominent */}
                                        <div className={`absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-base lg:text-lg shadow-xl z-20`}>
                                            {step.number}
                                        </div>
                                    </div>

                                    {/* Content - Concise */}
                                    <h3 className="text-base lg:text-lg font-bold mb-1.5 lg:mb-2 text-foreground px-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground text-[13px] lg:text-sm leading-relaxed max-w-[200px] mx-auto">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA - Repeated Strategically */}
                <div className="text-center mt-20">
                    <div className="inline-block rounded-3xl bg-white p-10 shadow-xl max-w-2xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                            جاهز لتغيير واقعك للأفضل؟
                        </h3>
                        <p className="text-muted-foreground mb-8 text-base">
                            العديد من الأسر استفادت.. ابدأ خطوتك الأولى الآن
                        </p>
                        <Link href="/register">
                            <Button className="h-14 px-10 text-lg font-bold bg-gradient-to-l from-golden-orange via-golden-orange-light to-golden-orange hover:from-golden-orange-dark hover:to-golden-orange text-white shadow-lg transition-all duration-250 gap-2 rounded-2xl hover:scale-[1.02] hover:-translate-y-0.5">
                                ابدأ رحلتك الآن
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
