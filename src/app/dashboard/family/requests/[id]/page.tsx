"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
    ArrowRight,
    Calendar,
    MapPin,
    Stethoscope,
    FileText,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    History,
    FileSearch
} from "lucide-react";
import { cn } from "@/shared/utils";

// Mock data for a specific request
const MOCK_REQUEST_DETAILS = {
    id: "REQ-2024-001",
    title: "مساعدة في علاج طبي",
    category: "صحة",
    description: "طلب مساعدة طارئة لإجراء عملية جراحية دقيقة في العين لطفل يبلغ من العمر ٨ سنوات. تبلغ التكلفة الإجمالية ١٥،٠٠٠ جنيه مصري، وتم توفير مبلغ ٥،٠٠٠ جنيه فقط من العائلة.",
    status: "قيد المراجعة",
    location: "القاهرة، مصر",
    createdAt: "١٢ يناير ٢٠٢٤",
    lastUpdate: "منذ ساعتين",
    priority: "عالية",
    assignedTo: "أحمد كمال (باحث اجتماعي)",
    documents: [
        { name: "التقرير الطبي.pdf", size: "٢.٤ ميجابايت", type: "PDF" },
        { name: "عرض سعر المستشفى.pdf", size: "١.٢ ميجابايت", type: "PDF" },
        { name: "صورة بطاقة العائل.jpg", size: "٨٠٠ كيلوبايت", type: "IMAGE" },
    ],
    timeline: [
        { status: "تم استلام الطلب", date: "١٢ يناير ٢٠٢٤ - ١٠:٠٠ ص", desc: "تم استلام طلبك بنجاح وجاري التحقق من المستندات.", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        { status: "جاري مراجعة المستندات", date: "١٤ يناير ٢٠٢٤ - ٠٢:٣٠ م", desc: "يقوم الفريق المختص بمراجعة التقارير الطبية المقدمة.", icon: FileSearch, color: "text-blue-500", bg: "bg-blue-50" },
        { status: "تحديث: انتظار الزيارة الميدانية", date: "اليوم - ٠٩:٠٠ ص", desc: "تم تحديد موعد للزيارة الميدانية للتحقق من الحالة.", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    ]
};

export default function RequestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const request = MOCK_REQUEST_DETAILS;

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#fcfdfe]">
                <DashboardTopBar userType="family" />

                <main className="p-4 sm:p-10 pb-20 pt-20 lg:pt-32 relative z-10">
                    <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">

                        {/* Header & Navigation */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                            <div className="flex items-start gap-5">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    className="w-14 h-14 rounded-3xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 shrink-0 transition-transform active:scale-90"
                                >
                                    <ArrowRight className="w-7 h-7" />
                                </Button>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[10px] px-3 py-1 rounded-lg tracking-wider uppercase">
                                            {id || request.id}
                                        </Badge>
                                        <span className="text-slate-200 text-xs">•</span>
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">تم التقديم في {request.createdAt}</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">تفاصيل الطلب</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-slate-200 font-black flex items-center gap-3 transition-all active:scale-95">
                                    <History className="w-5 h-5 text-slate-400" /> سجل التعديلات
                                </Button>
                                <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary-light shadow-xl shadow-primary/20 font-black text-lg transition-all active:scale-95">
                                    تحديث البيانات
                                </Button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-12 items-start">
                            {/* Main Content */}
                            <div className="lg:col-span-8 space-y-12">

                                {/* Info Card */}
                                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white group">
                                    <div className="h-3 w-full bg-gradient-to-r from-warm-green via-emerald-400 to-primary" />
                                    <CardContent className="p-12">
                                        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
                                            <div className="w-20 h-20 rounded-[2.5rem] bg-warm-green text-white flex items-center justify-center shrink-0 shadow-2xl shadow-warm-green/20 border-4 border-white ring-1 ring-warm-green/10 transition-transform group-hover:rotate-3 duration-500">
                                                <Stethoscope className="w-10 h-10" />
                                            </div>
                                            <div className="flex-1 space-y-4 text-start">
                                                <h2 className="text-3xl font-black text-slate-900 leading-none">{request.title}</h2>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm font-black text-slate-600">{request.location}</span>
                                                    </div>
                                                    <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
                                                        <span className="text-sm font-black text-primary uppercase">{request.category}</span>
                                                    </div>
                                                    <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-amber-500" />
                                                        <span className="text-sm font-black text-amber-600">{request.lastUpdate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-6 bg-primary rounded-full" />
                                                <h4 className="text-xl font-black text-slate-900">وصف الحالة</h4>
                                            </div>
                                            <div className="relative p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/50 group/desc overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                                                <p className="text-slate-600 font-bold leading-relaxed text-lg relative z-10">
                                                    {request.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Documents Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-8 bg-golden-orange rounded-full shadow-[0_0_12px_rgba(var(--golden-orange),0.4)]" />
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">المستندات المرفقة</h2>
                                        </div>
                                        <Button variant="ghost" className="text-primary font-black hover:bg-primary/5 rounded-2xl h-12 px-6">تحميل كافة الملفات</Button>
                                    </div>
                                    <div className="grid gap-6">
                                        {request.documents.map((doc, i) => (
                                            <div key={i} className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between gap-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 hover:-translate-y-1">
                                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                                                        <FileText className="w-8 h-8" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <p className="font-black text-slate-900 text-lg truncate leading-tight">{doc.name}</p>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.1em]">{doc.size} • {doc.type}</p>
                                                    </div>
                                                </div>
                                                <Button size="icon" className="w-14 h-14 rounded-2xl bg-slate-900 text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90">
                                                    <Download className="w-6 h-6" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Timeline & Status */}
                            <div className="lg:col-span-4 space-y-12 sticky top-[140px]">

                                {/* Current Status Card */}
                                <Card className="p-10 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group">
                                    <div className="absolute -top-20 -end-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />

                                    <h3 className="text-xs font-black mb-8 relative z-10 flex items-center gap-2 text-slate-400 uppercase tracking-[0.2em]">
                                        <div className="w-2 h-2 rounded-full bg-warm-green shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        الحالة الحالية
                                    </h3>

                                    <div className="flex items-center gap-6 mb-10 relative z-10">
                                        <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <Badge className="bg-golden-orange text-white text-[9px] border-none px-2 rounded-[4px] absolute -top-2 shadow-lg shadow-golden-orange/20 font-black">نشط</Badge>
                                            <p className="text-xs text-slate-400 font-bold mb-1">المحطة</p>
                                            <p className="text-3xl font-black text-white leading-none">٢</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-3xl font-black text-white tracking-tight">{request.status}</p>
                                            <p className="text-xs text-slate-500 font-bold">بمراجعة الباحث الاجتماعي</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نسبة الإكتمال</span>
                                            <span className="text-sm font-black text-warm-green">٥٠٪</span>
                                        </div>
                                        <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                                            <div className="h-full bg-gradient-to-r from-warm-green to-emerald-400 rounded-full w-1/2 shadow-[0_0_15px_rgba(34,197,94,0.4)] relative">
                                                <div className="absolute top-0 right-0 h-full w-8 bg-white/20 blur-md animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Interactive Timeline */}
                                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
                                    <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                                <History className="w-5 h-5 text-slate-400" />
                                            </div>
                                            سجل المتابعة
                                        </h3>
                                    </div>
                                    <CardContent className="p-10 px-8">
                                        <div className="space-y-12 relative before:absolute before:inset-y-0 before:end-[27px] before:w-[2px] before:bg-slate-50">
                                            {request.timeline.map((step, i) => (
                                                <div key={i} className="relative pe-16 text-end group/item">
                                                    <div className={cn(
                                                        "absolute end-0 top-0 w-14 h-14 rounded-[1.5rem] border-4 border-white shadow-xl flex items-center justify-center z-10 group-hover/item:scale-110 transition-transform duration-500",
                                                        step.bg
                                                    )}>
                                                        <step.icon className={cn("w-7 h-7", step.color)} />
                                                    </div>
                                                    <div className="space-y-1 transition-all">
                                                        <p className="text-lg font-black text-slate-900 leading-none">{step.status}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{step.date}</p>
                                                        <p className="text-xs text-slate-500 font-bold leading-relaxed mt-2 opacity-80">{step.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Support Center Widget */}
                                <Card className="p-10 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-primary group relative overflow-hidden text-start">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
                                    <div className="absolute bottom-0 start-0 w-24 h-24 bg-black/10 rounded-full blur-[60px] pointer-events-none" />

                                    <div className="relative z-10 text-white space-y-8">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                                            <AlertCircle className="w-8 h-8 opacity-80" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black leading-tight">تحتاج مساعدة بخصوص هذا الطلب؟</h3>
                                            <p className="text-white/80 text-sm font-bold leading-relaxed">
                                                نحن هنا لضمان وصول المساعدة إليك بأسرع وقت. تواصل مع المختص المباشر حالاً.
                                            </p>
                                        </div>
                                        <Button className="w-full bg-white text-primary hover:bg-slate-50 font-black rounded-2xl h-14 text-lg shadow-2xl shadow-black/10 transition-all active:scale-95">
                                            بدء محادثة فورية
                                        </Button>
                                    </div>
                                </Card>

                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
