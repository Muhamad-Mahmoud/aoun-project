"use client";

import React from "react";
import Link from "next/link";
import { Button as UiButton } from "@/components/ui/button";
import {
    CardContent,
} from "@/components/ui/card";
import { Loader2, UserPlus, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useRegisterForm } from "@/hooks/auth/useRegisterForm";
import {
    ProgressBar,
    AccountTypeSelector,
    IndividualForm,
    RepresentativeForm,
    OrganizationForm,
    RegistrationForm,
    SecurityStep
} from "@/components/auth/register";
import { AuthWrapper } from "@/components/auth/shared";

export default function RegisterPage() {
    const {
        isLoading,
        showPassword,
        currentStep,
        formData,
        errors,
        totalSteps,
        handleInputChange,
        handleAccountTypeChange,
        handleSubmit,
        nextStep,
        prevStep,
        togglePassword,
    } = useRegisterForm();

    const renderStepContent = () => {
        if (formData.accountType === "individual") {
            if (currentStep === 1) {
                return <IndividualForm formData={formData} errors={errors} onChange={handleInputChange} />;
            }
            return (
                <SecurityStep
                    password={formData.password}
                    acceptTerms={formData.acceptTerms}
                    showPassword={showPassword}
                    errors={errors}
                    onPasswordChange={(val) => handleInputChange("password", val)}
                    onTermsChange={(val) => handleInputChange("acceptTerms", val)}
                    onTogglePassword={togglePassword}
                />
            );
        }

        switch (currentStep) {
            case 1:
                return <RepresentativeForm formData={formData} errors={errors} onChange={handleInputChange} />;
            case 2:
                return <OrganizationForm formData={formData} errors={errors} onChange={handleInputChange} />;
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
                    <SecurityStep
                        password={formData.password}
                        acceptTerms={formData.acceptTerms}
                        showPassword={showPassword}
                        errors={errors}
                        onPasswordChange={(val) => handleInputChange("password", val)}
                        onTermsChange={(val) => handleInputChange("acceptTerms", val)}
                        onTogglePassword={togglePassword}
                        idPrefix="-org"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AuthWrapper
            title="إنشاء حساب جديد"
            description="انضم إلى مجتمع عون وكن جزءاً من التغيير الإيجابي"
            footerText="لديك حساب بالفعل؟"
            footerLinkText="تسجيل الدخول"
            footerLinkHref="/login"
            headerIcon={<UserPlus />}
            maxWidth="4xl"
        >
            <div className="pt-0 pb-3 animate-fade-in delay-100">
                <AccountTypeSelector accountType={formData.accountType} onChange={handleAccountTypeChange} />
            </div>

            <form onSubmit={handleSubmit} className="animate-fade-in-up delay-200">
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} accountType={formData.accountType} />

                <div className="mt-5">
                    {renderStepContent()}
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-border/40">
                    {currentStep > 1 && (
                        <UiButton
                            type="button"
                            onClick={prevStep}
                            variant="outline"
                            className="basis-1/3 h-12 font-medium border-border/60 hover:bg-muted/50 transition-all hover:-translate-x-1"
                        >
                            <ArrowLeft className="ml-2 h-4 w-4" />
                            السابق
                        </UiButton>
                    )}

                    {currentStep < totalSteps ? (
                        <UiButton
                            type="button"
                            onClick={nextStep}
                            className="flex-1 h-12 font-bold shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            التالي
                            <ArrowRight className="mr-2 h-5 w-5" />
                        </UiButton>
                    ) : (
                        <UiButton
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-12 font-bold shadow-lg shadow-green-500/20 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                    جاري إنشاء الحساب...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="ml-2 h-5 w-5" />
                                    إنشاء الحساب
                                </>
                            )}
                        </UiButton>
                    )}
                </div>
            </form>
        </AuthWrapper>
    );
}
