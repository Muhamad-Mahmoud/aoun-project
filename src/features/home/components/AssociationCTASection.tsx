import { Button } from "@/shared/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AssociationCTASection() {
    return (
        <section className="bg-white py-8 md:py-10" dir="rtl">
            <div className="container mx-auto max-w-[1400px] px-4">
                <div className="relative flex min-h-[198px] items-center overflow-hidden rounded-xl bg-[#0f6a60] shadow-[0_8px_28px_rgba(15,106,96,0.18)] ring-1 ring-black/5">
                    <Image
                        src="/Are_you_association.png"
                        alt="شبكة عون للجمعيات الخيرية"
                        fill
                        priority
                        sizes="(min-width: 1400px) 1400px, 100vw"
                        className="object-cover object-left"
                    />

                    <div className="absolute inset-0 bg-gradient-to-l from-[#0f766c]/35 via-[#0f766c]/10 to-transparent" />
                    <div className="absolute inset-0 bg-[#0b5f56]/10" />

                    <div
                        className="relative z-10 flex w-full justify-center px-6 py-8 text-center md:justify-end md:px-16 lg:px-24"
                        dir="ltr"
                    >
                        <div className="flex w-full max-w-[380px] flex-col items-center" dir="rtl">
                            <h2 className="text-[22px] font-extrabold leading-[1.45] text-white drop-shadow-sm md:text-[26px]">
                                هل أنت جمعية خيرية مسجلة؟
                            </h2>
                            <p className="mt-2 max-w-[350px] text-[16px] font-bold leading-[1.75] text-white/95 drop-shadow-sm md:text-[17px]">
                                انضم لشبكة عون واستقبل طلبات مساعدة موثقة من محافظتك
                            </p>

                            <Button
                                asChild
                                className="mt-5 h-12 w-full max-w-[300px] rounded-lg border border-[#ff9d2e] bg-[#f58a1f] px-7 text-[15px] font-extrabold text-white shadow-[0_5px_14px_rgba(245,138,31,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#e97912] hover:shadow-[0_8px_18px_rgba(245,138,31,0.34)]"
                            >
                                <Link href="/register?type=association" className="flex items-center justify-center gap-2">
                                    <span>سجل جمعيتك الآن</span>
                                    <ChevronLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
