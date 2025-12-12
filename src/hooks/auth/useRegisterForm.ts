import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FormData, FormErrors, AccountType, INITIAL_FORM_DATA } from "@/types/auth/register";
import { validateStep } from "@/utils/auth/register-validation";

export const useRegisterForm = () => {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<FormErrors>({});

    // Read URL parameter and set initial account type
    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'organization' || type === 'individual') {
            setFormData(prev => ({ ...prev, accountType: type as AccountType }));
        }
    }, [searchParams]);

    const totalSteps = formData.accountType === "individual" ? 2 : 4;

    const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

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
        if (validateCurrentStep() && currentStep < totalSteps) {
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
    }, []);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateCurrentStep()) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("Form Data:", formData);
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [validateCurrentStep, formData]);

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return {
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
    };
};
