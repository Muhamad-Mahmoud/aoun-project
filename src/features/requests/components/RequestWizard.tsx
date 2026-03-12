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
    Eye,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { motion, AnimatePresence } from "framer-motion";

// Import extracted components
import { requestFormSchema, defaultFormValues, RequestFormData, stepFieldNames, stepSchemas } from "./wizard/schemas/requestSchema";
import { Step1BasicInfo } from "./wizard/steps/Step1BasicInfo";
import { Step2Employment } from "./wizard/steps/Step2Employment";
import { Step3Health } from "./wizard/steps/Step3Health";
import { Step4Financial } from "./wizard/steps/Step4Financial";
import { Step5Attachments } from "./wizard/steps/Step5Attachments";
import { Step6Review } from "./wizard/steps/Step6Review";
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

// Wizard steps definition (Added Review Step)
const wizardSteps: WizardStep[] = [
    { num: 1, label: "البيانات", icon: Sparkles },
    { num: 2, label: "العمل والسكن", icon: Briefcase },
    { num: 3, label: "الصحة", icon: Heart },
    { num: 4, label: "المالية", icon: Coins },
    { num: 5, label: "المرفقات", icon: FileText },
    { num: 6, label: "مراجعة", icon: Eye },
];

const TOTAL_STEPS = wizardSteps.length;

export function RequestWizard({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
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

    // Watch values for conditional rendering and Review step
    const formValues = form.watch();
    const selectedRequestType = form.watch("requestType");
    const isWorking = form.watch("isWorking") ?? false;
    const hasInsurance = form.watch("hasInsurance") ?? false;
    const hasDisability = form.watch("hasDisability") ?? false;
    const hasChronicDisease = form.watch("hasChronicDisease") ?? false;
    const registeredSocialSupport = form.watch("registeredSocialSupport") ?? false;
    const hasOtherCommitments = form.watch("hasOtherCommitments") ?? false;
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
            if (issues.length > 0) {
                issues.forEach((err: any) => {
                    // Force trigger form validation display
                    form.trigger(err.path as any);
                });
            }
        }
    }, [currentStep, form]);

    const goToPreviousStep = useCallback(() => {
        setDirection(-1);
        setCurrentStep(prev => Math.max(prev - 1, 0));
    }, []);

    const goToStep = useCallback(async (targetStep: number) => {
        if (targetStep < currentStep) {
            setDirection(-1);
            setCurrentStep(targetStep);
            return;
        }
        if (targetStep > currentStep) {
            const formData = form.getValues();
            const stepSchema = stepSchemas[currentStep];
            
            if (!stepSchema) {
                setDirection(1);
                setCompletedSteps(prev => new Set([...prev, currentStep]));
                setCurrentStep(targetStep);
                return;
            }
            
            try {
                await stepSchema.parseAsync(formData);
                setDirection(1);
                setCompletedSteps(prev => new Set([...prev, currentStep]));
                setCurrentStep(targetStep);
            } catch (error: any) {
                const issues = error.issues || error.errors || [];
                if (issues.length > 0) {
                    issues.forEach((err: any) => {
                        form.trigger(err.path as any);
                    });
                }
            }
        }
    }, [currentStep, form]);

    // Form submission
    const handleSubmit = async (data: RequestFormData) => {
        setIsSubmitting(true);
        try {
            const validationResult = await requestFormSchema.safeParseAsync(data);
            if (!validationResult.success) {
                return;
            }
            await onSubmit({ ...data, attachments: uploadedFiles });
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLastStep = currentStep === TOTAL_STEPS - 1;
    const isFirstStep = currentStep === 0;

    // Framer motion variants
    const stepVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.98,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            scale: 0.98,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        })
    };

    const progressPercentage = ((currentStep + 1) / TOTAL_STEPS) * 100;

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 rounded-2xl overflow-hidden mb-10 bg-white" dir="rtl">

            {/* Compact Header with Progress */}
            <CardHeader className="bg-white border-b border-slate-100/80 px-5 sm:px-8 py-6 gap-0 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-black text-slate-900">
                                {wizardSteps[currentStep].label}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                                خطوة {currentStep + 1} من {TOTAL_STEPS}
                            </span>
                        </div>
                        
                        {/* Linear text stepper (breadcrumbs style) */}
                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            {wizardSteps.map((step, idx) => {
                                const isActive = idx === currentStep;
                                const isPast = idx < currentStep;
                                return (
                                    <div key={step.num} className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "transition-colors",
                                            isActive ? "text-warm-green" : isPast ? "text-slate-600" : ""
                                        )}>
                                            {isPast ? <Check className="w-3 h-3 inline-block mr-0.5" /> : null}
                                            {step.label}
                                        </span>
                                        {idx < TOTAL_STEPS - 1 && <ChevronLeft className="w-3 h-3" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 text-left">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">نسبة الإنجاز</span>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-warm-green rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-8 relative overflow-hidden bg-white min-h-[350px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        {/* Step Content with framer-motion transition */}
                        <div className="relative">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="pb-2"
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

            {/* Footer with Navigation */}
            <CardFooter className="flex items-center justify-between p-5 sm:px-8 sm:py-6 bg-slate-50 border-t border-slate-100 gap-4">
                {/* Previous Button */}
                <Button
                    type="button"
                    variant="ghost"
                    onClick={goToPreviousStep}
                    disabled={isFirstStep}
                    className={cn(
                        "rounded-xl px-6 py-2.5 h-11 font-bold transition-all duration-300 text-sm",
                        isFirstStep ? "opacity-0 pointer-events-none" : "hover:bg-white hover:shadow-sm text-slate-600 border border-slate-200 bg-white"
                    )}
                >
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                    السابق
                </Button>

                {/* Next / Submit Button */}
                {isLastStep ? (
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={isSubmitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 text-sm font-bold shadow-sm min-w-[200px] transition-all duration-300"
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
                        className="bg-warm-green hover:bg-[#86b541] rounded-xl px-10 h-11 text-sm font-bold shadow-sm min-w-[140px] transition-all duration-300 text-white"
                    >
                        التالي
                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

