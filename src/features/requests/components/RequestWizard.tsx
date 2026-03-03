"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
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
} from "lucide-react";
import { cn } from "@/shared/utils";

// ===== CSS Keyframes for step transitions =====
const wizardAnimations = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// Import extracted components
import { requestFormSchema, defaultFormValues, RequestFormData, stepFieldNames } from "./wizard/schemas/requestSchema";
import { Step1BasicInfo } from "./wizard/steps/Step1BasicInfo";
import { Step2Employment } from "./wizard/steps/Step2Employment";
import { Step3Health } from "./wizard/steps/Step3Health";
import { Step4Financial } from "./wizard/steps/Step4Financial";
import { Step5Attachments } from "./wizard/steps/Step5Attachments";
import { RequestCategory, WizardStep } from "./wizard/types";

// Category definitions
const categories: RequestCategory[] = [
    { value: 0, label: "مساعدة مالية", icon: Coins, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { value: 1, label: "رعاية صحية", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    { value: 2, label: "دعم غذائي", icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    { value: 3, label: "سكن وإيواء", icon: Home, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/30" },
    { value: 4, label: "تعليم", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { value: 5, label: "فواتير وخدمات", icon: CreditCard, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
    { value: 6, label: "أخرى", icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/30" },
];

// Wizard steps definition
const wizardSteps: WizardStep[] = [
    { num: 1, label: "بيانات الطلب", icon: Sparkles },
    { num: 2, label: "العمل والسكن", icon: Briefcase },
    { num: 3, label: "الحالة الصحية", icon: Heart },
    { num: 4, label: "الحالة المالية", icon: Coins },
    { num: 5, label: "المرفقات", icon: FileText },
];

const TOTAL_STEPS = wizardSteps.length;

export function RequestWizard({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Single unified form
    const form = useForm<RequestFormData>({
        resolver: zodResolver(requestFormSchema) as any,
        defaultValues: defaultFormValues as any,
        mode: "onTouched",
        reValidateMode: "onChange"
    });

    // Watch values for conditional rendering
    const selectedRequestType = form.watch("requestType");
    const isWorking = form.watch("isWorking") ?? false;
    const hasInsurance = form.watch("hasInsurance") ?? false;
    const hasDisability = form.watch("hasDisability") ?? false;
    const hasChronicDisease = form.watch("hasChronicDisease") ?? false;
    const hasOtherCommitments = form.watch("hasOtherCommitments") ?? false;
    const registeredSocialSupport = form.watch("registeredSocialSupport") ?? false;
    const housingType = form.watch("housingType");

    // File upload handlers
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Per-step validation + navigation
    const goToNextStep = useCallback(async () => {
        const fieldsToValidate = stepFieldNames[currentStep] || [];
        if (fieldsToValidate.length > 0) {
            const isValid = await form.trigger(fieldsToValidate as any);
            if (!isValid) return;
        }
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
    }, [currentStep, form]);

    const goToPreviousStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    }, []);

    const goToStep = useCallback(async (targetStep: number) => {
        // Can only go back freely, or go forward if all previous steps are completed
        if (targetStep < currentStep) {
            setCurrentStep(targetStep);
            return;
        }
        // To skip forward, validate the current step first
        if (targetStep > currentStep) {
            const fieldsToValidate = stepFieldNames[currentStep] || [];
            if (fieldsToValidate.length > 0) {
                const isValid = await form.trigger(fieldsToValidate as any);
                if (!isValid) return;
            }
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            setCurrentStep(targetStep);
        }
    }, [currentStep, form]);

    // Form submission
    const handleSubmit = async (data: RequestFormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit({ ...data, attachments: uploadedFiles });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLastStep = currentStep === TOTAL_STEPS - 1;
    const isFirstStep = currentStep === 0;
    const progressPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;

    return (
        <>
        <style>{wizardAnimations}</style>
        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 rounded-3xl overflow-hidden mb-10" dir="rtl">

            {/* Header */}
            <CardHeader className="bg-gradient-to-br from-warm-green/5 to-warm-green/10 border-b border-warm-green/10 px-8 py-8 gap-4">
                <div className="flex flex-col items-center gap-2 pb-4">
                    <CardTitle className="text-3xl font-black text-slate-900 text-center">طلب مساعدة جديد</CardTitle>
                    <CardDescription className="text-center text-slate-600 text-sm max-w-2xl">
                        املأ البيانات بدقة لنتمكن من خدمتك بأفضل شكل
                    </CardDescription>
                </div>

                {/* Step Progress Indicator */}
                <div className="w-full pt-4">
                    <div className="flex items-center justify-between relative">
                        {wizardSteps.map((step, idx) => {
                            const isActive = idx === currentStep;
                            const isCompleted = completedSteps.has(idx);
                            const isPast = idx < currentStep;

                            return (
                                <div key={step.num} className="flex flex-col items-center relative flex-1">
                                    {/* Connector line (between steps) */}
                                    {idx < TOTAL_STEPS - 1 && (
                                        <div className="absolute top-1/2 -right-1/2 w-full h-0.5 -z-10 -translate-y-1/2">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-500",
                                                    isPast || isCompleted
                                                        ? "bg-warm-green"
                                                        : "bg-slate-200"
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step circle */}
                                    <button
                                        type="button"
                                        onClick={() => goToStep(idx)}
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 shrink-0",
                                            isActive
                                                ? "bg-warm-green border-warm-green text-white shadow-lg shadow-warm-green/30 scale-110"
                                                : isCompleted || isPast
                                                    ? "bg-warm-green/10 border-warm-green text-warm-green"
                                                    : "bg-white border-slate-200 text-slate-400"
                                        )}
                                    >
                                        {isCompleted || isPast ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <step.icon className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Step label */}
                                    <span
                                        className={cn(
                                            "text-[11px] font-bold mt-2.5 text-center transition-colors duration-300 whitespace-nowrap",
                                            isActive
                                                ? "text-warm-green"
                                                : isPast || isCompleted
                                                    ? "text-slate-600"
                                                    : "text-slate-400"
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        {/* Step Content with transition */}
                        <div className="min-h-[400px]">
                            <div key={currentStep} className="space-y-6" style={{ animation: "fadeSlideUp 0.35s ease-out both" }}>
                                {/* Section Header */}
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    {(() => {
                                        const StepIcon = wizardSteps[currentStep].icon;
                                        return <StepIcon className="w-5 h-5 text-warm-green" />;
                                    })()}
                                    <h3 className="text-lg font-black text-slate-800">
                                        {currentStep === 0 && "بيانات الطلب الأساسية"}
                                        {currentStep === 1 && "الحالة المهنية والسكن"}
                                        {currentStep === 2 && "الحالة الصحية"}
                                        {currentStep === 3 && "الحالة المالية والالتزامات"}
                                        {currentStep === 4 && "المرفقات والوثائق"}
                                    </h3>
                                    <span className="text-xs font-medium text-slate-400 mr-auto">
                                        {currentStep + 1} / {TOTAL_STEPS}
                                    </span>
                                </div>

                                {/* Step Components */}
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
                                        hasOtherCommitments={hasOtherCommitments}
                                        registeredSocialSupport={registeredSocialSupport}
                                        housingType={housingType}
                                    />
                                )}
                                {currentStep === 4 && (
                                    <Step5Attachments
                                        uploadedFiles={uploadedFiles}
                                        onFileUpload={handleFileUpload}
                                        onRemoveFile={handleRemoveFile}
                                    />
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>

            {/* Footer with Navigation */}
            <CardFooter className="flex items-center justify-between p-6 sm:p-8 bg-slate-50/50 border-t border-slate-100 gap-4">
                {/* Previous Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={isFirstStep}
                    className={cn(
                        "rounded-xl h-12 px-6 font-bold transition-all duration-200 border-slate-200",
                        isFirstStep ? "opacity-0 pointer-events-none" : "hover:bg-slate-100"
                    )}
                >
                    <ChevronRight className="w-4 h-4 ml-2" />
                    السابق
                </Button>

                {/* Next / Submit Button */}
                {isLastStep ? (
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={isSubmitting}
                        className="bg-warm-green hover:bg-warm-green/90 rounded-xl px-10 h-12 text-base font-bold shadow-lg shadow-warm-green/20 min-w-[180px] transition-all duration-200"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                جاري الإرسال...
                            </>
                        ) : (
                            "إرسال الطلب"
                        )}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={goToNextStep}
                        className="bg-warm-green hover:bg-warm-green/90 rounded-xl px-10 h-12 text-base font-bold shadow-lg shadow-warm-green/20 min-w-[160px] transition-all duration-200"
                    >
                        التالي
                        <ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                )}
            </CardFooter>
        </Card>
        </>
    );
}
