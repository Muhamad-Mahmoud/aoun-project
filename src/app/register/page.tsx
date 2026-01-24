"use client";

import React from "react";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import {
    ProgressBar,
    AccountTypeSelector,
    IndividualForm,
    OrganizationForm,
    RepresentativeForm,
    RegistrationForm,
    SecurityStep,
} from "@/features/auth/components/register";
import { AuthWrapper } from "@/features/auth/components/shared/AuthWrapper";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

export default function RegisterPage() {
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
        if (currentStep === 1) {
            return (
                <AccountTypeSelector
                    accountType={formData.accountType}
                    onChange={handleAccountTypeChange}
                />
            );
        }

        if (formData.accountType === "individual") {
            return (
                <IndividualForm
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                />
            );
        }

        // Organization Flow
        switch (currentStep) {
            case 2:
                return (
                    <OrganizationForm
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />
                );
            case 3:
                return (
                    <RegistrationForm
                        isRegistered={formData.isRegistered}
                        registrationNumber={formData.registrationNumber}
                        errors={errors}
                        onRegisteredChange={(val) => handleInputChange("isRegistered", val)}
                        onNumberChange={(val) => handleInputChange("registrationNumber", val)}
                    />
                );
            case 4:
                return (
                    <RepresentativeForm
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />
                );
            default:
                return null;
        }
    };


    return (
        <div className="container mx-auto flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
            <AuthWrapper
                title="إنشاء حساب جديد"
                description="ابدأ رحلتك معنا اليوم وساهم في بناء مجتمع أفضل"
                footerText="لديك حساب بالفعل؟"
                footerLinkText="تسجيل الدخول"
                footerLinkHref={ROUTES.AUTH.LOGIN}
            >
                <div className="space-y-8">
                    <ProgressBar
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        accountType={formData.accountType}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {renderStep()}

                        <div className="flex items-center gap-4">
                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 font-bold h-11"
                                >
                                    المتابعة
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 font-bold h-11"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        "إتمام التسجيل"
                                    )}
                                </Button>
                            )}


                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="flex-1 font-bold h-11"
                                >
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                    السابق
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </AuthWrapper>
        </div>
    );
}
