'use client';

/**
 * Login Form Hook
 * Manages login form state and integrates with auth API
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { login } from "../api/authApi";
import type { LoginCredentials } from "../types";
import type { ApiError } from "@/lib/api/types";

export const useLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const onSubmit = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await login(credentials);
            logger.debug("Login successful", { userId: response.user.id });

            // Redirect to home or dashboard
            router.push("/");
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.';
            setError(errorMessage);
            logger.error("Login submission failed", err);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return {
        isLoading,
        showPassword,
        error,
        togglePassword,
        onSubmit,
    };
};
