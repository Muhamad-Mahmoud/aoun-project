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
                    <div className="mx-auto max-w-3xl">
                        {!submitted ? (
                            <div className="space-y-12">
                                {/* Centered Header Section */}
                                <div className="space-y-4 text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest">
                                        <Sparkles className="w-3.5 h-3.5" /> مساعدات رقمية
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                                        طلب مساعدة <span className="text-primary">جديد</span>
                                    </h1>
                                    <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                                        نحن هنا لنقف بجانبك. املأ البيانات التالية بدقة لنتمكن من دراسة حالتك وتقديم الدعم المناسب.
                                    </p>
                                </div>

                                {/* Focused Form Section */}
                                <RequestWizard onSubmit={handleSubmit} />
                            </div>
                        ) : (
                            <Card className="max-w-xl mx-auto p-12 text-center border-none shadow-2xl rounded-[3rem] animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-warm-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 className="w-12 h-12 text-warm-green" />
                                </div>
                                <h1 className="text-2xl font-bold mb-3 text-slate-900">تم استلام طلبك بنجاح!</h1>
                                <p className="text-slate-500 font-medium mb-10 text-base leading-relaxed">
                                    لقد سجلنا طلبك برقم <span className="text-slate-900 font-bold border-b-2 border-warm-green/30">#REQ-2024-002</span>.
                                    جاري الآن تحويله للفريق المختص للمراجعة.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button asChild className="h-14 rounded-2xl bg-warm-green hover:bg-warm-green-light text-white font-bold text-base">
                                        <Link href="/dashboard/family/requests">
                                            متابعة طلباتي
                                        </Link>
                                    </Button>
                                    <Button asChild variant="ghost" className="h-12 rounded-2xl font-semibold text-slate-400">
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
