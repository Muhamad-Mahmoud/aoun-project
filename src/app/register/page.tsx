"use client";

import React, { Suspense } from "react";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import {
    ProgressBar,
    AccountTypeSelector,
    IndividualForm,
    OrganizationForm,
    SecurityForm,
} from "@/features/auth/components/register";
import { AuthWrapper } from "@/features/auth/components/shared/AuthWrapper";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

export default function RegisterPage() {
    return (
        <AuthWrapper
            title="إنشاء حساب جديد"
            description="ابدأ رحلتك معنا اليوم وساهم في بناء مجتمع أفضل"
            footerText="لديك حساب بالفعل؟"
            footerLinkText="تسجيل الدخول"
            footerLinkHref={ROUTES.AUTH.LOGIN}
        >
            <Suspense fallback={
                <div className="space-y-12 py-12">
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/3 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                        <p className="text-slate-400 font-bold">جاري تحميل النموذج...</p>
                    </div>
                </div>
            }>
                <RegisterFormContent />
            </Suspense>
        </AuthWrapper>
    );
}

function RegisterFormContent() {
    const {
        isLoading,
        currentStep,
        formData,
        errors,
        totalSteps,
        handleInputChange,
        handleAccountTypeChange,
        handleSubmit,
        nextStep,
        prevStep,
    } = useRegisterForm();

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

        // Organization Flow
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
    };

    // Debug Log
    console.log("Render RegisterPage:", { currentStep, isLoading, errors });

    return (
        <div className="space-y-6">
            {/* Step 0: Account Selection Header */}
            <div className="animate-fade-in duration-500">
                <AccountTypeSelector
                    accountType={formData.accountType}
                    onChange={handleAccountTypeChange}
                />
            </div>

            <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
                accountType={formData.accountType}
            />

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                <div className="animate-fade-in-up duration-500">
                    {renderStep()}
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="flex-1 font-bold h-12 rounded-xl border-2 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all text-base"
                        >
                            السابق
                            <ChevronRight className="mr-2 h-5 w-5" />
                        </Button>
                    )}

                    {currentStep < totalSteps ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="flex-[2] font-bold h-12 rounded-xl bg-gradient-to-l from-primary to-emerald-400 hover:shadow-lg hover:shadow-primary/20 transition-all text-base text-white"
                        >
                            التالي
                            <ChevronLeft className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] font-bold h-12 rounded-xl bg-gradient-to-l from-[#10b981] to-[#059669] hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-base text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                    جاري إنشاء الحساب...
                                </>
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
