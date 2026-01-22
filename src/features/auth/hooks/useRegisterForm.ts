'use client';

/**
 * Register Form Hook
 * Manages registration form state and integrates with auth API
 */

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { register } from "../api/authApi";
import type { RegisterData } from "../types";
import type { ApiError } from "@/lib/api/types";

// Import validation utilities from old location (will migrate later)
import { FormData, FormErrors, AccountType, INITIAL_FORM_DATA } from "@/features/auth/types/register";
import { validateStep } from "@/features/auth/utils/register-validation";

export const useRegisterForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    // Read URL parameter and set initial account type
    useEffect(() => {
        if (!searchParams) return;

        const type = searchParams.get('type');
        if (type === 'organization' || type === 'individual') {
            setFormData(prev => ({ ...prev, accountType: type as AccountType }));
        }
    }, [searchParams]);

    const totalSteps = formData.accountType === "individual" ? 2 : 4;

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));

        setErrors(prev => {
            if (prev[field]) {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const validateCurrentStep = useCallback((): boolean => {
        const newErrors = validateStep(formData.accountType, currentStep, formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, currentStep]);

    const nextStep = useCallback(() => {
        setAttemptedSubmit(true);
        if (validateCurrentStep() && currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            setAttemptedSubmit(false);
        }
    }, [validateCurrentStep, currentStep, totalSteps]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleAccountTypeChange = useCallback((type: AccountType) => {
        setFormData(prev => ({ ...prev, accountType: type }));
        setCurrentStep(1);
        setErrors({});
        setTouched({});
        setAttemptedSubmit(false);
    }, []);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setAttemptedSubmit(true);

        if (!validateCurrentStep()) return;

        setIsLoading(true);
        try {
            // Map form data to API format
            const registerData: RegisterData = {
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.password, // Use same password as confirmation
                name: formData.name,
                phone: formData.phone,
                userType: formData.accountType,
            };

            const response = await register(registerData);
            logger.debug("Registration successful", { userId: response.userId });

            // Redirect to login or verification page
            router.push("/login");
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || 'فشل التسجيل. يرجى المحاولة مرة أخرى.';

            // Set API errors
            if (apiError.errors) {
                // Convert API errors (string[]) to form errors (string)
                const formErrors: FormErrors = {};
                Object.entries(apiError.errors).forEach(([key, messages]) => {
                    formErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setErrors(formErrors);
            } else {
                setErrors({ general: errorMessage });
            }

            logger.error("Registration submission failed", err);
        } finally {
            setIsLoading(false);
        }
    }, [validateCurrentStep, formData, router]);

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Filter errors to only show touched fields or all fields if submit was attempted
    const visibleErrors = Object.keys(errors).reduce((acc, key) => {
        if (attemptedSubmit || touched[key]) {
            acc[key] = errors[key];
        }
        return acc;
    }, {} as FormErrors);

    return {
        isLoading,
        showPassword,
        currentStep,
        formData,
        errors: visibleErrors,
        totalSteps,
        handleInputChange,
        handleAccountTypeChange,
        handleSubmit,
        nextStep,
        prevStep,
        togglePassword,
    };
};
