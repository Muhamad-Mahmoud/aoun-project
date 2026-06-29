import { UserPlus, FileText, BrainCircuit, Building2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

const steps = [
    {
        icon: UserPlus,
        number: "١",
        title: "أنشئ حسابك",
        description: "سجل بياناتك الأساسية بسهولة",
    },
    {
        icon: FileText,
        number: "٢",
        title: "حدد احتياجك",
        description: "اختر نوع الدعم المطلوب",
    },
    {
        icon: BrainCircuit,
        number: "٣",
        title: "التحليل الذكي",
        description: "نظامنا يرشح أنسب الجمعيات",
    },
    {
        icon: Building2,
        number: "٤",
        title: "التوصيل المباشر",
        description: "نوصل طلبك للجهة المختصة",
    },
    {
        icon: CheckCircle2,
        number: "٥",
        title: "استلام الدعم",
        description: "الجمعية تتواصل معك مباشرة",
    },
];

export function JourneySection() {
    return (
        <>
            <section id="journey" className="py-24 md:py-32 bg-warm-green/5 relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
                    {/* Header */}
                    <div className="!text-center mb-20 animate-fade-in">
                        <div className="section-pill">
                            رحلة المستخدم
                        </div>
                        <h2 className="section-title">
                            كيف تحصل على{" "}
                            <span className="title-highlight">المساعدة؟</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
                                        className="flex flex-col items-center !text-center animate-fade-in relative group"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Step Circle with Number */}
                                        <div className="relative mb-4 lg:mb-6">
                                            {/* Main Circle */}
                                            <div className={`relative z-10 w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white border-4 ${isFirst ? 'border-warm-green' : 'border-border group-hover:border-warm-green/40 transition-colors duration-300'} shadow-lg flex items-center justify-center`}>
                                                <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-warm-green transform group-hover:scale-110 transition-transform duration-300" />
                                            </div>

                                            {/* Number Badge - Solid Saturated Color */}
                                            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-warm-green text-white flex items-center justify-center font-bold text-base lg:text-lg shadow-md z-20">
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
                </div>
            </section>
        </>
    );
}
