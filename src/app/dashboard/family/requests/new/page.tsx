"use client";

import { useState } from "react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { CheckCircle2, ChevronRight, Sparkles, HelpCircle, ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { RequestWizard } from "@/features/requests/components/RequestWizard";
import Link from "next/link";
import { cn } from "@/shared/utils";

export default function NewRequestPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (data: any) => {
        console.log("Request Submitted:", data);
        setSubmitted(true);
    };

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#f8fafc] relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-warm-green/5 rounded-full blur-[100px] -z-0 pointer-events-none" />

                <DashboardTopBar userType="family" />

                <main className="p-4 sm:p-10 pb-20 pt-20 lg:pt-32 relative z-10">
                    <div className="mx-auto max-w-5xl">
                        {!submitted ? (
                            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                                {/* Left side: Form */}
                                <div className="lg:col-span-8 space-y-8 lg:space-y-10">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest">
                                            <Sparkles className="w-4 h-4" /> مساعدات رقمية
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                                            طلب مساعدة <br /><span className="text-primary">جديد</span>
                                        </h1>
                                        <p className="text-xl text-slate-500 font-bold max-w-xl leading-relaxed">
                                            نحن هنا لنقف بجانبك. املأ البيانات التالية بدقة لنتمكن من دراسة حالتك وتقديم الدعم المناسب في أسرع وقت.
                                        </p>
                                    </div>
                                    <RequestWizard onSubmit={handleSubmit} />
                                </div>

                                {/* Right side: Guidance */}
                                <div className="lg:col-span-4 sticky top-8 space-y-6">
                                    <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white">
                                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-golden-orange/10 flex items-center justify-center">
                                                <HelpCircle className="w-6 h-6 text-golden-orange" />
                                            </div>
                                            نصائح للتقديم
                                        </h3>
                                        <ul className="space-y-6">
                                            {[
                                                { title: "الصدق والشفافية", desc: "تأكد من صحة جميع المعلومات المذكورة لضمان قبول الطلب." },
                                                { title: "المستندات الداعمة", desc: "ارفق جميع التقارير الطبية أو فواتير الديون المطلوبة." },
                                                { title: "وصف الحالة", desc: "اشرح ظروفك بوضوح وتفصيل ليتمكن المختصون من فهم احتياجك." }
                                            ].map((tip, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-black text-slate-400 mt-1">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-sm mb-1">{tip.title}</p>
                                                        <p className="text-xs text-slate-500 font-bold leading-relaxed">{tip.desc}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>

                                    <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
                                        <h3 className="text-xl font-black mb-4 relative z-10">هل تحتاج للمساعدة؟</h3>
                                        <p className="text-slate-400 font-bold text-sm mb-6 relative z-10 leading-relaxed">
                                            فريق الدعم الفني متواجد لمساعدتك في تعبئة النموذج إذا واجهت أي صعوبة.
                                        </p>
                                        <Button className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-black relative z-10">
                                            تحدث معنا الآن
                                        </Button>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <Card className="max-w-xl mx-auto p-12 text-center border-none shadow-2xl rounded-[3rem] animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-warm-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 className="w-12 h-12 text-warm-green" />
                                </div>
                                <h1 className="text-3xl font-black mb-4">تم استلام طلبك بنجاح!</h1>
                                <p className="text-slate-500 font-bold mb-10 text-lg leading-relaxed">
                                    لقد سجلنا طلبك برقم <span className="text-slate-900 border-b-2 border-warm-green">#REQ-2024-002</span>.
                                    جاري الآن تحويله للفريق المختص للمراجعة.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <Button asChild className="h-16 rounded-2xl bg-warm-green hover:bg-warm-green-light text-white font-black text-lg">
                                        <Link href="/dashboard/family/requests">
                                            متابعة طلباتي
                                        </Link>
                                    </Button>
                                    <Button asChild variant="ghost" className="h-14 rounded-2xl font-bold text-slate-400">
                                        <Link href="/dashboard/family" className="flex items-center gap-2">
                                            العودة للرئيسية <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
