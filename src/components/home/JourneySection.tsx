"use client";

import { UserPlus, FileText, BrainCircuit, Building2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const steps = [
    {
        icon: UserPlus,
        number: "١",
        title: "أنشئ حسابك",
        description: "ابدأ بتسجيل بياناتك الأساسية بسهولة وسرعة لضمان التواصل الفعال.",
        color: "from-primary/80 to-primary",
    },
    {
        icon: FileText,
        number: "٢",
        title: "حدد احتياجك",
        description: "قم بوصف حالتك ونوع الدعم المطلوب (طبي، تعليمي، غذائي، إلخ) بدقة.",
        color: "from-secondary to-secondary/80",
    },
    {
        icon: BrainCircuit,
        number: "٣",
        title: "التحليل والترشيح",
        description: "يقوم نظامنا الذكي بتحليل طلبك وترشيح أنسب الجمعيات لتلبية احتياجك.",
        color: "from-accent to-accent/80",
    },
    {
        icon: Building2,
        number: "٤",
        title: "التوصيل المباشر",
        description: "يتم إيصال طلبك للجهة المختصة فوراً للمراجعة واتخاذ الإجراء اللازم.",
        color: "from-primary/60 to-secondary",
    },
    {
        icon: CheckCircle2,
        number: "٥",
        title: "استلام الدعم",
        description: "تتواصل معك الجمعية لتقديم الدعم المطلوب بعد الموافقة النهائية.",
        color: "from-secondary to-secondary/80",
    },
];

export function JourneySection() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
                {/* Header */}
                <div className="text-center mb-24 animate-fade-in">
                    <div className="inline-block px-5 py-2 rounded-full bg-card text-primary text-sm font-bold mb-5 border-2 border-primary/10 shadow-sm">
                        رحلة المستخدم
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
                        كيف تحصل على <span className="text-primary">المساعدة؟</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        خطوات ميسرة وواضحة تضمن وصول صوتك لمن يمد يد العون
                    </p>
                </div>

                {/* Journey Map */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Connection Line - Curved */}
                    <div className="hidden lg:block absolute top-20 left-10 right-10 h-1 -z-10">
                        <svg className="w-full h-24" viewBox="0 0 1000 80" preserveAspectRatio="none">
                            <path
                                d="M 0 40 Q 125 0 250 40 T 500 40 T 750 40 T 1000 40"
                                stroke="url(#gradient)"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray="12 8"
                                strokeLinecap="round"
                                className="opacity-40 animate-pulse"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                                    <stop offset="50%" stopColor="hsl(var(--accent))" />
                                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center animate-fade-in relative z-10"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    {/* Icon Circle with Number Badge */}
                                    <div className="relative mb-8">
                                        <div className="relative z-10 w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-card border-4 border-card shadow-xl flex items-center justify-center overflow-hidden">
                                            {/* Gradient Background */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10`}></div>

                                            <div className={`text-primary relative z-10`}>
                                                <Icon className="w-10 h-10 lg:w-12 lg:h-12" />
                                            </div>
                                        </div>

                                        {/* Number Badge */}
                                        <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-lg border-4 border-card shadow-lg z-20`}>
                                            {step.number}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold mb-2 text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm px-1 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-24">
                    <div className="inline-block rounded-[2.5rem] border border-border/50 bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-100"></div>

                        <h3 className="text-2xl md:text-3xl font-black mb-4 text-foreground relative z-10">
                            جاهز لتغيير واقعك للأفضل؟
                        </h3>
                        <p className="text-muted-foreground mb-8 text-lg relative z-10">
                            العديد من الأسر استفادت.. ابدأ خطوتك الأولى الآن
                        </p>
                        <Link href="/register" className="relative z-10">
                            <Button className="h-14 px-12 text-lg font-bold bg-[#EC4F10] text-white shadow-lg transition-all duration-300 gap-2 rounded-2xl">
                                سجل الآن مجاناً
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
