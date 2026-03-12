"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import {
    Loader2,
    Sparkles,
    Briefcase,
    Heart,
    Coins,
    FileText,
    Stethoscope,
    GraduationCap,
    UtensilsCrossed,
    Home,
    CreditCard,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Check,
    Eye,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { motion, AnimatePresence } from "framer-motion";

// Import extracted components
import { requestFormSchema, defaultFormValues, RequestFormData, stepSchemas } from "./wizard/schemas/requestSchema";
import { Step1BasicInfo } from "./wizard/steps/Step1BasicInfo";
import { Step2Employment } from "./wizard/steps/Step2Employment";
import { Step3Health } from "./wizard/steps/Step3Health";
import { Step4Financial } from "./wizard/steps/Step4Financial";
import { Step5Attachments } from "./wizard/steps/Step5Attachments";
import { Step6Review } from "./wizard/steps/Step6Review";
import { RequestCategory, WizardStep } from "./wizard/types";

const categories: RequestCategory[] = [
    { value: 0, label: "مساعدة مالية", icon: Coins, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { value: 1, label: "رعاية صحية", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { value: 2, label: "دعم غذائي", icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    { value: 3, label: "سكن وإيواء", icon: Home, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/30" },
    { value: 4, label: "تعليم", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { value: 5, label: "فواتير وخدمات", icon: CreditCard, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
    { value: 6, label: "أخرى", icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/30" },
];

const wizardSteps: WizardStep[] = [
    { num: 1, label: "البيانات", icon: Sparkles },
    { num: 2, label: "العمل والسكن", icon: Briefcase },
    { num: 3, label: "الصحة", icon: Heart },
    { num: 4, label: "المالية", icon: Coins },
    { num: 5, label: "المرفقات", icon: FileText },
    { num: 6, label: "مراجعة", icon: Eye },
];

const TOTAL_STEPS = wizardSteps.length;

// Framer motion step variants (as const to satisfy TS)
const stepVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 40 : -40,
        opacity: 0,
        scale: 0.99,
        transition: { type: "spring" as const, stiffness: 350, damping: 32 },
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 350, damping: 32 },
    },
    exit: (dir: number) => ({
        x: dir < 0 ? 40 : -40,
        opacity: 0,
        scale: 0.99,
        transition: { type: "spring" as const, stiffness: 350, damping: 32 },
    }),
};

export function RequestWizard({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RequestFormData>({
        resolver: zodResolver(requestFormSchema) as any,
        defaultValues: defaultFormValues as any,
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const formValues = form.watch();
    const selectedRequestType = form.watch("requestType");
    const isWorking = form.watch("isWorking") ?? false;
    const hasInsurance = form.watch("hasInsurance") ?? false;
    const hasDisability = form.watch("hasDisability") ?? false;
    const hasChronicDisease = form.watch("hasChronicDisease") ?? false;
    const registeredSocialSupport = form.watch("registeredSocialSupport") ?? false;
    const hasOtherCommitments = form.watch("hasOtherCommitments") ?? false;
    const housingType = form.watch("housingType");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const goToNextStep = useCallback(async () => {
        const formData = form.getValues();
        const stepSchema = stepSchemas[currentStep];
        if (!stepSchema) {
            if (currentStep < TOTAL_STEPS - 1) {
                setDirection(1);
                setCompletedSteps(prev => new Set([...prev, currentStep]));
                setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
            }
            return;
        }
        try {
            await stepSchema.parseAsync(formData);
            setDirection(1);
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
        } catch (error: any) {
            const issues = error.issues || error.errors || [];
            issues.forEach((err: any) => form.trigger(err.path as any));
        }
    }, [currentStep, form]);

    const goToPreviousStep = useCallback(() => {
        setDirection(-1);
        setCurrentStep(prev => Math.max(prev - 1, 0));
    }, []);

    const handleSubmit = async (data: RequestFormData) => {
        setIsSubmitting(true);
        try {
            const result = await requestFormSchema.safeParseAsync(data);
            if (!result.success) return;
            await onSubmit({ ...data, attachments: uploadedFiles });
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLastStep = currentStep === TOTAL_STEPS - 1;
    const isFirstStep = currentStep === 0;
    const progressPercentage = ((currentStep + 1) / TOTAL_STEPS) * 100;

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-[0_8px_40px_rgba(0,0,0,0.07)] border border-slate-100 rounded-2xl overflow-hidden mb-10 bg-white" dir="rtl">

            {/* ── Header ── */}
            <CardHeader className="bg-white border-b border-slate-100 px-5 sm:px-7 pt-5 pb-4 gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: step name + breadcrumbs */}
                    <div>
                        <div className="flex items-baseline gap-2 mb-1.5">
                            <span className="text-[15px] font-black text-slate-900">{wizardSteps[currentStep].label}</span>
                            <span className="text-xs font-bold text-slate-400">الخطوة {currentStep + 1} / {TOTAL_STEPS}</span>
                        </div>

                        {/* Breadcrumb dots */}
                        <div className="flex items-center gap-1.5">
                            {wizardSteps.map((step, idx) => {
                                const isActive = idx === currentStep;
                                const isPast = idx < currentStep;
                                return (
                                    <div key={step.num} className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "inline-flex items-center justify-center rounded-full transition-all duration-300",
                                            isActive
                                                ? "w-5 h-5 bg-warm-green text-white"
                                                : isPast
                                                    ? "w-4 h-4 bg-slate-200 text-slate-500"
                                                    : "w-3 h-3 bg-slate-100"
                                        )}>
                                            {isActive && <span className="text-[9px] font-black">{step.num}</span>}
                                            {isPast && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                                        </span>
                                        {idx < TOTAL_STEPS - 1 && (
                                            <span className={cn("w-4 h-px transition-colors", isPast ? "bg-slate-300" : "bg-slate-100")} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: progress bar */}
                    <div className="w-full sm:w-40">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-slate-400">الإنجاز</span>
                            <span className="text-[10px] font-bold text-warm-green">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-warm-green rounded-full"
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* ── Content ── */}
            <CardContent className="p-5 sm:p-7 bg-white min-h-[340px] relative overflow-hidden">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="relative">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    {currentStep === 0 && (
                                        <Step1BasicInfo
                                            control={form.control}
                                            selectedRequestType={selectedRequestType}
                                            categories={categories}
                                        />
                                    )}
                                    {currentStep === 1 && (
                                        <Step2Employment
                                            control={form.control}
                                            isWorking={isWorking}
                                        />
                                    )}
                                    {currentStep === 2 && (
                                        <Step3Health
                                            control={form.control}
                                            hasInsurance={hasInsurance}
                                            hasDisability={hasDisability}
                                            hasChronicDisease={hasChronicDisease}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <Step4Financial
                                            control={form.control}
                                            registeredSocialSupport={registeredSocialSupport}
                                            housingType={housingType}
                                            hasOtherCommitments={hasOtherCommitments}
                                        />
                                    )}
                                    {currentStep === 4 && (
                                        <Step5Attachments
                                            uploadedFiles={uploadedFiles}
                                            onFileUpload={handleFileUpload}
                                            onRemoveFile={handleRemoveFile}
                                        />
                                    )}
                                    {currentStep === 5 && (
                                        <Step6Review
                                            formData={formValues as RequestFormData}
                                            categories={categories}
                                            uploadedFiles={uploadedFiles}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </form>
                </Form>
            </CardContent>

            {/* ── Footer ── */}
            <CardFooter className="flex items-center justify-between px-5 sm:px-7 py-4 bg-slate-50/80 border-t border-slate-100 gap-3">
                {/* Back */}
                <Button
                    type="button"
                    variant="ghost"
                    onClick={goToPreviousStep}
                    disabled={isFirstStep}
                    className={cn(
                        "rounded-xl px-5 h-10 font-bold text-sm transition-all duration-200",
                        isFirstStep
                            ? "opacity-0 pointer-events-none"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                    )}
                >
                    <ChevronRight className="w-4 h-4 ml-1" />
                    السابق
                </Button>

                {/* Next / Submit */}
                {isLastStep ? (
                    <Button
                        type="button"
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={isSubmitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-11 text-sm font-bold shadow-sm min-w-[180px] transition-all duration-200"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                جاري التأكيد...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4 ml-2" />
                                إرسال الطلب النهائي
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={goToNextStep}
                        className="bg-warm-green hover:bg-[#86b541] text-white rounded-xl px-8 h-10 text-sm font-bold shadow-sm min-w-[130px] transition-all duration-200"
                    >
                        التالي
                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
