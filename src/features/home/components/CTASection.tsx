import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

export function CTASection() {
    return (
        <section className="py-24 bg-warm-green/5 relative overflow-hidden" dir="rtl">
            <div className="container mx-auto px-4 max-w-[1400px]">
                <div className="bg-brand-dark rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl text-center">
                    {/* Modern Geometric Decor & Blur Orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
                        
                        {/* Soft Glowing Orbs */}
                        <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-warm-green/20 rounded-full blur-[120px]" />
                        <div className="absolute -right-32 -top-32 w-96 h-96 bg-golden-orange/15 rounded-full blur-[120px]" />
                        
                        {/* Diagonal Accent Lines */}
                        <div className="absolute right-20 top-10 w-[300px] h-px bg-gradient-to-r from-transparent via-golden-orange/30 to-transparent -rotate-45" />
                        <div className="absolute left-20 bottom-10 w-[400px] h-px bg-gradient-to-r from-transparent via-warm-green/30 to-transparent -rotate-45" />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="section-title-dark mb-6 text-4xl lg:text-5xl">
                            جاهز لتغيير واقعك للأفضل؟
                        </h2>
                        <p className="text-white/80 mb-10 text-lg lg:text-xl leading-relaxed">
                            العديد من الأسر استفادت.. ابدأ خطوتك الأولى الآن وانضم إلى منصة عون.
                        </p>
                        <Link href="/register">
                            <Button className="h-14 lg:h-16 px-10 lg:px-12 text-lg font-bold bg-golden-orange hover:bg-golden-orange-light text-brand-dark shadow-[0_8px_20px_hsla(var(--golden-orange)/0.3)] transition-[background,box-shadow,transform] duration-300 gap-3 rounded-xl hover:scale-[1.03] hover:-translate-y-1">
                                ابدأ رحلتك الآن
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
