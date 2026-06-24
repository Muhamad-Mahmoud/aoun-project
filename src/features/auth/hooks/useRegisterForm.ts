'use client';

/**
 * Register Form Hook
 * Manages registration form state and integrates with auth API
 */

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { registerFamily, registerAssociation, login, registerDonor } from "../api/authApi";
import type { RegisterFamilyRequest, RegisterAssociationRequest, RegisterDonorRequest, LoginCredentials } from "../types";
import type { ApiError } from "@/lib/api/types";
import { useAuthContext } from "@/shared/providers";
import { ROUTES } from "@/shared/constants/routes";
import { toast } from "sonner"; // Assuming sonner is used, or use valid notification approach

// Import validation utilities from old location (will migrate later)
import { FormData, FormErrors, AccountType, INITIAL_FORM_DATA } from "@/features/auth/types/register";
import { validateStep } from "@/features/auth/utils/register-validation";

export const useRegisterForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login: authLogin } = useAuthContext();
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
        if (type === 'organization' || type === 'individual' || type === 'donor') {
            setFormData(prev => ({ ...prev, accountType: type as AccountType }));
        }
    }, [searchParams]);

    const totalSteps = 2; // Always 2 steps now (Info -> Security)

    // Clear errors and submit attempt when changing steps
    useEffect(() => {
        setErrors({});
        setTouched({});
        setAttemptedSubmit(false);
    }, [currentStep]);

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));

        setErrors(prev => {
            // Only clear the specific error for the field being changed
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

    const nextStep = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setAttemptedSubmit(true);
        if (validateCurrentStep() && currentStep < totalSteps) {
            // Explicitly clear validation state before advancing
            // This ensures the next step renders without inherited errors
            setErrors({});
            setTouched({});
            setAttemptedSubmit(false);

            setCurrentStep(prev => prev + 1);
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

        // If not on the last step, treat submit as "Next"
        if (currentStep < totalSteps) {
            nextStep();
            return;
        }

        logger.debug("handleSubmit triggered");
        setAttemptedSubmit(true);

        try {
            const isValid = validateCurrentStep();

            if (!isValid) {
                logger.warn("Validation failed preventing submission");
                toast.error("يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح");
                return;
            }

            setIsLoading(true);

            let response;
            // Common fields are already in formData, just map specifics
            const {
                email, phone, password, confirmPassword,
                country, city, governorate
            } = formData;

            if (formData.accountType === 'individual') {
                const familyData: RegisterFamilyRequest = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email,
                    phone,
                    headNationalId: formData.headNationalId,
                    password,
                    confirmPassword,
                    country,
                    city,
                    governorate,
                    neighborhood: formData.neighborhood,
                };
                logger.debug("Sending Individual registration");
                response = await registerFamily(familyData);
            } else if (formData.accountType === 'organization') {
                const associationData: RegisterAssociationRequest = {
                    name: formData.name, // Association Name
                    email,
                    phone,
                    password,
                    confirmPassword,
                    country,
                    city,
                    governorate,
                    capacity: Number(formData.capacity) || 0,
                    coverageNotes: formData.coverageNotes,
                };
                logger.debug("Sending Association registration");
                response = await registerAssociation(associationData);
            } else {
                const donorData: RegisterDonorRequest = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email,
                    phoneNumber: phone,
                    password,
                    confirmPassword
                };
                logger.debug("Sending Donor registration");
                response = await registerDonor(donorData);
            }

            logger.info("Registration successful", { userId: response?.userId });

            // Auto-Login
            try {
                const loginData: LoginCredentials = {
                    email,
                    password
                };
                const loginResponse = await login(loginData);
                logger.debug("Auto-login response received");

                if (loginResponse.token) {
                    await authLogin(loginResponse.token, loginResponse.refreshToken, loginResponse.user);

                    logger.info("Auto-login successful");
                    toast.success("تم إنشاء الحساب وتسجيل الدخول بنجاح");
                    router.replace(ROUTES.DASHBOARD.HOME);
                } else {
                    toast.success("تم إنشاء الحساب بنجاح");
                    router.push(ROUTES.AUTH.LOGIN);
                }
            } catch (loginError) {
                logger.error("Auto-login failed after registration", loginError);
                toast.success("تم إنشاء الحساب بنجاح، الرجاء تسجيل الدخول");
                router.push(ROUTES.AUTH.LOGIN);
            }

        } catch (err: unknown) {
            logger.error("Registration critical error", err);

            // Handle standard API errors
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
                // Also show a toast for better visibility
                toast.error("يرجى تصحيح الأخطاء في النموذج: " + Object.values(formErrors).join(", "));
            } else {
                setErrors({ general: errorMessage });
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [validateCurrentStep, formData, router, authLogin, nextStep, currentStep, totalSteps]);

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
