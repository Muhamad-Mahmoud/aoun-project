"use client";

import React, { useTransition } from "react";
import dynamic from "next/dynamic";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { ProgressBar, AccountTypeSelector } from "@/features/auth/components/register";
import { Button } from "@/shared/ui/button";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

// Dynamic Imports for Heavy Form Steps to drastically reduce initial JS load
const IndividualForm = dynamic(() => import("@/features/auth/components/register/IndividualForm").then(mod => ({ default: mod.IndividualForm })), {
    loading: () => <FormLoadingSkeleton />,
});

const OrganizationForm = dynamic(() => import("@/features/auth/components/register/OrganizationForm").then(mod => ({ default: mod.OrganizationForm })), {
    loading: () => <FormLoadingSkeleton />,
});

const DonorForm = dynamic(() => import("@/features/auth/components/register/DonorForm").then(mod => ({ default: mod.DonorForm })), {
    loading: () => <FormLoadingSkeleton />,
});

const SecurityForm = dynamic(() => import("@/features/auth/components/register/SecurityForm").then(mod => ({ default: mod.SecurityForm })), {
    loading: () => <FormLoadingSkeleton />,
});

function FormLoadingSkeleton() {
    return (
        <div className="space-y-8 p-10 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-50 animate-pulse text-right">
            <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-slate-100 rounded-lg w-full"></div>
                <div className="h-12 bg-slate-100 rounded-lg w-full"></div>
            </div>
            <div className="h-12 bg-slate-100 rounded-lg w-full"></div>
            <div className="h-12 bg-slate-100 rounded-lg w-3/4"></div>
            <div className="flex justify-center pt-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#12a17b]" />
            </div>
        </div>
    );
}

export function RegisterFormContent() {
    const {
        isLoading,
        currentStep,
        formData,
        errors,
        totalSteps,
        handleInputChange,
        handleAccountTypeChange,
        handleSubmit: hookHandleSubmit,
        nextStep: hookNextStep,
        prevStep: hookPrevStep,
    } = useRegisterForm();

    const [isPending, startTransition] = useTransition();

    const handleAccountTypeChangeWithTransition = (type: Parameters<typeof handleAccountTypeChange>[0]) => {
        startTransition(() => {
            handleAccountTypeChange(type);
        });
    }

    const nextStep = () => {
        startTransition(() => {
            hookNextStep();
        });
    };

    const prevStep = () => {
        startTransition(() => {
            hookPrevStep();
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        startTransition(() => {
            hookHandleSubmit(e);
        });
    };

    const renderStep = () => {
        if (formData.accountType === "individual") {
            if (currentStep === 1) {
                return (
                    <IndividualForm
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />
                );
            }
            return (
                <SecurityForm
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                />
            );
        }

        if (formData.accountType === "organization") {
            if (currentStep === 1) {
                return (
                    <OrganizationForm
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />
                );
            }
            return (
                <SecurityForm
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                />
            );
        }

        // Donor Flow
        if (currentStep === 1) {
            return (
                <DonorForm
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                />
            );
        }
        return (
            <SecurityForm
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
            />
        );
    };

    return (
        <div className="space-y-6">
            {/* Step 0: Account Selection Header */}
            <div className={`animate-fade-in duration-500 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                <AccountTypeSelector
                    accountType={formData.accountType}
                    onChange={handleAccountTypeChangeWithTransition}
                />
            </div>

            <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
                accountType={formData.accountType}
            />

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                <div className="animate-fade-in-up duration-500 min-h-[400px]">
                    {renderStep()}
                </div>

                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-100">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1 font-bold h-[54px] rounded-full border-2 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all text-base"
                        >
                            السابق
                            <ChevronRight className="mr-2 h-5 w-5" />
                        </Button>
                    )}

                    {currentStep < totalSteps ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="flex-[2] font-bold h-[54px] rounded-full bg-[#12a17b] hover:bg-[#0f3a29] hover:shadow-[0_14px_30px_rgba(18,161,123,0.3)] hover:-translate-y-0.5 transition-all text-base text-white"
                        >
                            التالي
                            <ChevronLeft className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isLoading || isPending}
                            className="flex-[2] font-bold h-[54px] rounded-full bg-[#12a17b] hover:bg-[#0f3a29] hover:shadow-[0_14px_30px_rgba(18,161,123,0.35)] hover:-translate-y-0.5 transition-all text-base text-white relative group"
                        >
                            {(isLoading || isPending) ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    جاري المعالجة...
                                </div>
                            ) : (
                                "إتمام التسجيل"
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
