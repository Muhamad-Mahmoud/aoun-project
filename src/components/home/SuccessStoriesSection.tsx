"use client";

import { Quote, MapPin, Heart } from "lucide-react";

const stories = [
    {
        name: "أم أحمد",
        location: "الإسكندرية",
        story: "بفضل الله، تمكنت عبر منصة عون من الوصول إلى جمعية تكفلت بإجراء العملية الجراحية لابني في وقت قياسي. شكراً لكم على سرعة الاستجابة والاهتمام.",
        category: "رعاية صحية",
        color: "from-primary/80 to-primary",
    },
    {
        name: "محمد سعيد",
        location: "أسيوط",
        story: "كنت أواجه صعوبة في سداد المصروفات الدراسية لابنتي. ساعدتني المنصة في التواصل مع مؤسسة تعليمية تكفلت بكافة المصاريف لاستكمال تعليمها الجامعي.",
        category: "دعم تعليمي",
        color: "from-secondary to-secondary/80",
    },
    {
        name: "فاطمة حسن",
        location: "القاهرة",
        story: "في وقت الأزمة، وجدنا الدعم الفوري من خلال عون. تم توصيلنا ببنك الطعام وحصلنا على الدعم الغذائي الشهري للأسر المستحقة بكل سهولة وكرامة.",
        category: "دعم غذائي",
        color: "from-accent to-accent/80",
    },
];

export function SuccessStoriesSection() {
    return (
        <section className="py-20 md:py-28 bg-card relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-l from-secondary/10 to-primary/10 text-secondary text-sm font-bold mb-5 border border-secondary/20">
                        قصص نجاح
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        حكايات{" "}
                        <span className="text-secondary relative inline-block">
                            واقعية
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-accent opacity-25" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        نماذج حقيقية لأسر تغيرت حياتهم للأفضل من خلال منصة عون
                    </p>
                </div>

                {/* Stories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <div
                            key={index}
                            className="relative bg-card rounded-3xl p-8 border-2 border-border shadow-lg transition-all duration-500 flex flex-col overflow-hidden text-center items-center"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-[0.03] -z-10`}></div>

                            {/* Quote Icon */}
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${story.color} flex items-center justify-center mb-6 shadow-lg`}>
                                <Quote className="w-7 h-7 text-white" />
                            </div>

                            {/* Story */}
                            <p className="text-muted-foreground leading-relaxed text-base mb-6 flex-grow italic">
                                "{story.story}"
                            </p>

                            {/* Author Info */}
                            <div className="w-full flex items-center justify-between pt-6 border-t-2 border-border">
                                <div className="text-right">
                                    <h4 className="text-lg font-bold text-foreground mb-1">{story.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{story.location}</span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full bg-gradient-to-l ${story.color} text-white text-xs font-bold`}>
                                    {story.category}
                                </div>
                            </div>

                            {/* Decorative Heart */}
                            <div className="absolute bottom-4 left-4 opacity-5">
                                <Heart className="w-20 h-20 text-secondary" fill="currentColor" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className="text-center mt-12">
                    <p className="text-muted-foreground text-lg">
                        <span className="font-bold text-primary">+١,٢٠٠ أسرة</span> استفادت من منصة عون حتى الآن
                    </p>
                </div>
            </div>
        </section>
    );
}
