import { Quote, MapPin, Heart } from "lucide-react";

const stories = [
    {
        name: "أم أحمد",
        location: "الإسكندرية",
        story: "بفضل الله، تمكنت عبر منصة عون من الوصول إلى جمعية تكفلت بإجراء العملية الجراحية لابني في وقت قياسي. شكراً لكم على سرعة الاستجابة والاهتمام.",
        category: "رعاية صحية",
    },
    {
        name: "محمد سعيد",
        location: "أسيوط",
        story: "كنت أواجه صعوبة في سداد المصروفات الدراسية لابنتي. ساعدتني المنصة في التواصل مع مؤسسة تعليمية تكفلت بكافة المصاريف لاستكمال تعليمها الجامعي.",
        category: "دعم تعليمي",
    },
    {
        name: "فاطمة حسن",
        location: "القاهرة",
        story: "في وقت الأزمة، وجدنا الدعم الفوري من خلال عون. تم توصيلنا ببنك الطعام وحصلنا على الدعم الغذائي الشهري للأسر المستحقة بكل سهولة وكرامة.",
        category: "دعم غذائي",
    },
];

export function SuccessStoriesSection() {
    return (
        <section id="stories" className="py-24 md:py-32 bg-rhythm-creamy relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
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
                        return (
                            <div
                                key={index}
                                className="card-unified flex flex-col !text-center items-center h-full relative"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Quote Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-warm-green flex items-center justify-center mb-6 shadow-md">
                                    <Quote className="w-7 h-7 text-white" />
                                </div>

                                {/* Story */}
                                <p className="text-muted-foreground leading-relaxed text-base mb-6 flex-grow italic">
                                    "{story.story}"
                                </p>

                                {/* Author Info */}
                                <div className="w-full flex items-center justify-between pt-6 border-t border-border">
                                    <div className="text-right">
                                        <h3 className="text-lg font-bold text-foreground mb-1">{story.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                                            <MapPin className="w-4 h-4 text-golden-orange" />
                                            <span>{story.location}</span>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-warm-green/10 text-warm-green text-xs font-bold border border-warm-green/20">
                                        {story.category}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Note */}
            <div className="!text-center mt-16">
                <p className="text-muted-foreground text-lg font-semibold">
                    <span className="font-bold text-warm-green">+١,٢٠٠ أسرة</span> استفادت من منصة عون حتى الآن
                </p>
            </div>
        </section>
    );
}
