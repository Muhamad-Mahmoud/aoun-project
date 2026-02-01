"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/shared/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import {
    Loader2,
    ChevronRight, /* Back in RTL */
    ChevronLeft, /* Next in RTL */
    UploadCloud,
    CheckCircle2,
    FileText,
    Heart,
    Stethoscope,
    GraduationCap,
    UtensilsCrossed,
    Home,
    CreditCard,
    HelpCircle,
    Sparkles,
    X,
    Image as ImageIcon,
    History
} from "lucide-react";
import { RequestCategory, UrgencyLevel } from "../types";
import { cn } from "@/shared/utils";

// Schema for Step 1
const step1Schema = z.object({
    title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
    category: z.enum(['HEALTH', 'EDUCATION', 'FOOD', 'HOUSING', 'DEBT', 'OTHER'] as [string, ...string[]]),
    amountNeeded: z.string().optional(),
    location: z.string().min(2, "الموقع مطلوب"),
});

// Schema for Step 2
const step2Schema = z.object({
    description: z.string().min(20, "يرجى كتابة وصف تفصيلي للحالة (20 حرف على الأقل)"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const categories = [
    { value: "HEALTH", label: "رعاية صحية", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { value: "EDUCATION", label: "تعليم", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { value: "FOOD", label: "دعم غذائي", icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    { value: "HOUSING", label: "سكن وإيواء", icon: Home, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/30" },
    { value: "DEBT", label: "سداد ديون", icon: CreditCard, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
    { value: "OTHER", label: "أخرى", icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/30" },
];


export function RequestWizard({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Step1Data & Step2Data>>({});
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: { ...formData } as any });
    const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: { ...formData } as any });

    const selectedCategory = form1.watch("category");

    const onStep1Submit = (data: Step1Data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(2);
    };

    const onStep2Submit = async (data: Step2Data) => {
        setIsSubmitting(true);
        // Simulate AI Determination
        const aiUrgency = data.description.includes("عاجل") || data.description.includes("طارئ") ? "CRITICAL" : "MEDIUM";
        const finalData = { ...formData, ...data, files: uploadedFiles, urgency: aiUrgency };
        await new Promise(r => setTimeout(r, 1500)); // Simulate API/AI Processing
        onSubmit(finalData);
        setIsSubmitting(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-3xl mx-auto px-2">
            {/* Premium Progress Indicator - Logical Props PS/PE */}
            <div className="relative mb-16">
                <div className="flex items-center justify-between relative z-10">
                    {[
                        { num: 1, label: "بيانات الطلب", icon: FileText },
                        { num: 2, label: "التفاصيل والمستندات", icon: UploadCloud },
                    ].map((s, i) => (
                        <div key={s.num} className="flex flex-col items-center flex-1">
                            <div className={cn(
                                "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-xl",
                                step >= s.num
                                    ? "bg-warm-green text-white shadow-warm-green/30 scale-110"
                                    : "bg-white text-slate-300 border border-slate-100 shadow-sm"
                            )}>
                                {step > s.num ? (
                                    <CheckCircle2 className="w-8 h-8" />
                                ) : (
                                    <s.icon className="w-7 h-7" />
                                )}
                            </div>
                            <span className={cn(
                                "text-sm font-black mt-4 transition-colors tracking-tight",
                                step >= s.num ? "text-slate-900" : "text-slate-300"
                            )}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Progress Line - Logical Inset PS/PE */}
                <div className="absolute top-8 inset-x-[20%] h-1.5 bg-slate-100 rounded-full -z-0">
                    <div
                        className="h-full bg-warm-green rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(110,195,116,0.3)]"
                        style={{ width: step === 1 ? '0%' : '100%' }}
                    />
                </div>
            </div>

            <Card className="border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] bg-white rounded-[3rem] overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-warm-green via-emerald-400 to-warm-green" />

                <CardHeader className="pb-4 pt-10 px-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-warm-green/10 flex items-center justify-center shrink-0 shadow-inner">
                            <Sparkles className="w-6 h-6 text-warm-green animate-pulse" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900">
                                {step === 1 ? "ما هي حاجتك اليوم؟" : "التفاصيل الداعمة"}
                            </CardTitle>
                            <CardDescription className="mt-1.5 font-bold text-slate-400">
                                {step === 1 ? "اختر التصنيف المناسب لطلبك لنتمكن من توجيهك للجهة المختصة." : "كلما زادت التفاصيل والمستندات، زادت سرعة دراسة حالتك."}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-10 pb-10">
                    {step === 1 && (
                        <Form {...form1}>
                            <form id="step1-form" onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-8">
                                {/* Category Selection - RTL Grid */}
                                <FormField control={form1.control} name="category" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-black text-slate-800 flex items-center gap-2 mb-4">
                                            <div className="w-1 h-4 bg-warm-green rounded-full" />
                                            تصنيف المساعدة
                                        </FormLabel>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                            {categories.map((cat) => (
                                                <div
                                                    key={cat.value}
                                                    onClick={() => field.onChange(cat.value)}
                                                    className={cn(
                                                        "relative cursor-pointer rounded-[2rem] border-2 p-6 transition-all duration-300 text-center flex flex-col items-center",
                                                        selectedCategory === cat.value
                                                            ? `${cat.border} ${cat.bg} shadow-2xl shadow-indigo-500/5 ring-4 ring-white`
                                                            : "border-slate-50 hover:border-slate-100 bg-slate-50/50 hover:bg-white"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm",
                                                        selectedCategory === cat.value ? "bg-white" : "bg-white"
                                                    )}>
                                                        <cat.icon className={cn(
                                                            "w-7 h-7",
                                                            selectedCategory === cat.value ? cat.color : "text-slate-300"
                                                        )} />
                                                    </div>
                                                    <p className={cn(
                                                        "font-black text-sm tracking-tight",
                                                        selectedCategory === cat.value ? "text-slate-900" : "text-slate-400"
                                                    )}>
                                                        {cat.label}
                                                    </p>
                                                    {selectedCategory === cat.value && (
                                                        <div className={cn("absolute top-4 end-4 w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-md")}>
                                                            <CheckCircle2 className={cn("w-4 h-4", cat.color)} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form1.control} name="title" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-base font-black text-slate-800 flex items-center gap-2">
                                            <div className="w-1 h-4 bg-warm-green rounded-full" />
                                            عنوان الطلب
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="مثال: مساعدة في تكاليف عملية جراحية عاجلة"
                                                className="h-16 text-lg rounded-2xl border-slate-200/60 focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green transition-all px-6 font-bold"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs font-bold text-slate-400 ps-1">اجعل العنوان مختصراً وواضحاً قدر الإمكان.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form1.control} name="location" render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-base font-black text-slate-800 flex items-center gap-2">
                                                <div className="w-1 h-4 bg-warm-green rounded-full" />
                                                الموقع الجغرافي
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="محافظة القاهرة، حي عين شمس"
                                                    className="h-14 rounded-2xl border-slate-200/60 px-6 font-bold"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form1.control} name="amountNeeded" render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-base font-black text-slate-800 flex items-center gap-2">
                                                <div className="w-1 h-4 bg-warm-green rounded-full" />
                                                المبلغ التقديري
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="5000"
                                                        className="h-14 rounded-2xl border-slate-200/60 pe-16 ps-6 font-bold"
                                                        {...field}
                                                    />
                                                    <span className="absolute end-6 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                                                        ج.م
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </form>
                        </Form>
                    )}

                    {step === 2 && (
                        <Form {...form2}>
                            <form id="step2-form" onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-10">

                                <FormField control={form2.control} name="description" render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-base font-black text-slate-800 flex items-center gap-2">
                                            <div className="w-1 h-5 bg-warm-green rounded-full" />
                                            شرح الحالة بالتفصيل
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="اروي لنا قصتك بوضوح، على سبيل المثال: 'أنا أم لأربعة أيتام، ولدينا حكم إخلاء من السكن لعدم سداد الإيجار لمدة 6 أشهر...'"
                                                className="min-h-[200px] text-lg rounded-[2.5rem] border-slate-200/60 p-8 leading-relaxed font-bold resize-none focus:ring-4 focus:ring-warm-green/5 bg-slate-50/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* File Upload Zone - RTL Aware */}
                                <div>
                                    <FormLabel className="text-base font-black text-slate-800 flex items-center gap-2 mb-6">
                                        <div className="w-1 h-5 bg-warm-green rounded-full" />
                                        المستندات المؤيدة (هام جداً)
                                    </FormLabel>

                                    <label className="block cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                        <div className="group border-4 border-dashed border-slate-100 hover:border-warm-green/30 rounded-[3rem] p-12 text-center transition-all duration-500 hover:bg-warm-green/5 bg-slate-50/50">
                                            <div className="w-20 h-20 rounded-[2rem] bg-white group-hover:scale-110 flex items-center justify-center mx-auto mb-6 transition-all shadow-xl group-hover:shadow-warm-green/20">
                                                <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-warm-green transition-colors" />
                                            </div>
                                            <p className="text-xl font-black mb-2 text-slate-800">
                                                اسحب الملفات هنا أو <span className="text-warm-green underline underline-offset-8">اضغط لاختيارها</span>
                                            </p>
                                            <p className="text-sm font-bold text-slate-400">PDF, JPG, PNG • الحد الأقصى 5 ميجابايت لكل ملف</p>
                                        </div>
                                    </label>

                                    {/* RTL Uploaded Files List */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-white border border-slate-100 rounded-[1.5rem] ps-6 pe-4 py-4 group hover:shadow-xl transition-all shadow-sm"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                                                            {file.type.includes('image') ? (
                                                                <ImageIcon className="w-6 h-6 text-sky-500" />
                                                            ) : (
                                                                <FileText className="w-6 h-6 text-rose-500" />
                                                            )}
                                                        </div>
                                                        <div className="max-w-[150px]">
                                                            <p className="text-sm font-black text-slate-700 truncate">{file.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => removeFile(index)}
                                                        className="h-10 w-10 p-0 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between border-t border-slate-50 p-10 bg-slate-50/50">
                    {step === 1 ? (
                        <div className="flex-1 flex justify-end">
                            <Button
                                type="submit"
                                form="step1-form"
                                size="lg"
                                className="bg-warm-green hover:bg-warm-green-light text-white shadow-2xl shadow-warm-green/30 rounded-2xl h-16 px-12 font-black text-lg transition-transform active:scale-95"
                            >
                                الخطوة التالية
                                <ChevronLeft className="ms-3 w-6 h-6" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setStep(1)}
                                className="rounded-2xl h-16 px-10 font-bold border-2 border-slate-100 hover:border-slate-200 bg-white"
                            >
                                <ChevronRight className="me-3 w-6 h-6" /> السابق
                            </Button>
                            <Button
                                type="submit"
                                form="step2-form"
                                size="lg"
                                disabled={isSubmitting}
                                className="bg-gradient-to-l from-warm-green to-emerald-600 text-white shadow-2xl shadow-warm-green/30 rounded-2xl h-16 px-12 font-black text-lg min-w-[200px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 me-3 animate-spin" />
                                        جاري المعالجة...
                                    </>
                                ) : (
                                    <>
                                        <Heart className="w-6 h-6 me-3" />
                                        تأكيد وإرسال
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            {/* Assistance Note */}
            <div className="mt-12 text-center animate-in fade-in duration-1000">
                <p className="text-slate-400 font-bold text-sm tracking-widest flex items-center justify-center gap-3">
                    <History className="w-4 h-4" /> يتم حفظ مسودة الطلب تلقائياً لراحتك.
                </p>
            </div>
        </div>
    );
}

