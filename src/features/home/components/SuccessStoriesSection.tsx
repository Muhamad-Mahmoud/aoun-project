import { MapPin, Heart, BookOpen, Utensils } from "lucide-react";

const stories = [
    {
        name: "أم أحمد",
        location: "الإسكندرية",
        story: "بفضل الله، تمكنت عبر منصة عون من الوصول إلى جمعية تكفلت بإجراء العملية الجراحية لابني في وقت قياسي. شكراً لكم على سرعة الاستجابة والاهتمام.",
        category: "رعاية صحية",
        icon: Heart,
        initials: "أأ",
        colorClass: "bg-rose-100 text-rose-600 border-rose-200"
    },
    {
        name: "محمد سعيد",
        location: "أسيوط",
        story: "كنت أواجه صعوبة في سداد المصروفات الدراسية لابنتي. ساعدتني المنصة في التواصل مع مؤسسة تعليمية تكفلت بكافة المصاريف لاستكمال تعليمها الجامعي.",
        category: "دعم تعليمي",
        icon: BookOpen,
        initials: "مس",
        colorClass: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
        name: "فاطمة حسن",
        location: "القاهرة",
        story: "في وقت الأزمة، وجدنا الدعم الفوري من خلال عون. تم توصيلنا ببنك الطعام وحصلنا على الدعم الغذائي الشهري للأسر المستحقة بكل سهولة وكرامة.",
        category: "دعم غذائي",
        icon: Utensils,
        initials: "فح",
        colorClass: "bg-orange-100 text-orange-600 border-orange-200"
    },
];

export function SuccessStoriesSection() {
    return (
        <section id="stories" className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Soft decorative background element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-warm-green/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-[1400px] relative z-10" dir="rtl">
                {/* Header */}
                <div className="!text-center mb-16 animate-fade-in">
                    <div className="section-pill">
                        قصص نجاح
                    </div>
                    <h2 className="section-title">
                        قصص <span className="title-highlight">نجاح</span> حقيقية
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        نماذج حقيقية لأسر تغيرت حياتهم للأفضل من خلال منصة عون
                    </p>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {stories.map((story, index) => {
                        const CategoryIcon = story.icon;
                        
                        return (
                            <div
                                key={index}
                                className="group relative bg-white border border-border shadow-sm rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-warm-green/30 flex flex-col h-full"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Author Info Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-warm-green/20 to-warm-green/5 text-warm-green flex items-center justify-center font-bold text-xl border border-warm-green/20 shrink-0">
                                        {story.initials}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold text-foreground">{story.name}</h3>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-semibold">
                                            <MapPin className="w-3.5 h-3.5 text-golden-orange" />
                                            <span>{story.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Story text */}
                                <p className="text-muted-foreground leading-relaxed text-[15px] flex-grow">
                                    "{story.story}"
                                </p>

                                {/* Bottom Category Badge */}
                                <div className="mt-6 pt-6 border-t border-border/50 flex justify-end">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${story.colorClass}`}>
                                        <CategoryIcon className="w-3.5 h-3.5" />
                                        {story.category}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
