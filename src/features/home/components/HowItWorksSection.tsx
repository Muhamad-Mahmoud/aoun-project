import { ArrowLeft, User, FileText, Globe, Building2, HeartHandshake } from "lucide-react";

export function HowItWorksSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden" dir="rtl">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-3xl lg:text-4xl font-black text-brand-dark mb-4">
                        كيف تعمل <span className="text-golden-orange">عون؟</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        رحلة مبسطة تضمن وصول الدعم لمستحقيه بمنتهى الشفافية
                    </p>
                </div>

                {/* Flowchart */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[52px] left-16 right-16 h-1 bg-gradient-to-r from-warm-green/10 via-warm-green/40 to-warm-green/10 -z-10 rounded-full" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 relative">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-border shadow-sm flex items-center justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-warm-green/40 group-hover:shadow-lg">
                                <User className="w-10 h-10 text-warm-green/70" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">أسرة محتاجة</h3>
                        </div>

                        {/* Arrow Mobile / Spacer Desktop */}
                        <div className="hidden lg:flex absolute top-12 -right-8 w-full justify-center pointer-events-none -z-10 opacity-0">
                            <ArrowLeft className="w-6 h-6 text-warm-green" />
                        </div>
                        <div className="flex lg:hidden justify-center -my-4 text-warm-green/40"><ArrowLeft className="w-6 h-6 -rotate-90" /></div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-border shadow-sm flex items-center justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-warm-green/40 group-hover:shadow-lg">
                                <FileText className="w-10 h-10 text-warm-green/70" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">تقديم طلب</h3>
                        </div>

                        <div className="flex lg:hidden justify-center -my-4 text-warm-green/40"><ArrowLeft className="w-6 h-6 -rotate-90" /></div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-warm-green to-brand-dark shadow-[0_15px_30px_rgba(15,93,70,0.25)] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_20px_40px_rgba(15,93,70,0.35)] -mt-2">
                                <Globe className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="font-black text-xl text-brand-dark mb-1">منصة عون</h3>
                        </div>

                        <div className="flex lg:hidden justify-center -my-4 text-warm-green/40"><ArrowLeft className="w-6 h-6 -rotate-90" /></div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-border shadow-sm flex items-center justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-golden-orange/40 group-hover:shadow-lg">
                                <Building2 className="w-10 h-10 text-golden-orange/80" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">جمعية معتمدة</h3>
                        </div>

                        <div className="flex lg:hidden justify-center -my-4 text-warm-green/40"><ArrowLeft className="w-6 h-6 -rotate-90" /></div>

                        {/* Step 5 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-border shadow-sm flex items-center justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-golden-orange/40 group-hover:shadow-lg">
                                <HeartHandshake className="w-10 h-10 text-golden-orange/80" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">توصيل الدعم</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
