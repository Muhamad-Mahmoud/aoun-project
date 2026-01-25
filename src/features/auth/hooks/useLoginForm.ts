'use client';

/**
 * Login Form Hook
 * Manages login form state using react-hook-form and integrates with auth API
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/logger";
import { login } from "../api/authApi";
import { loginSchema, type LoginSchema } from "../types/schema";
import type { ApiError } from "@/lib/api/types";
import { useAuthContext } from "@/shared/providers";
import { ROUTES } from "@/shared/constants/routes";

export const useLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { login: authLogin } = useAuthContext();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await login(data);
            logger.debug("Login successful", { userId: response.user.id });

            // Update Auth Context and Storage (Fetches user details internally)
            await authLogin(response.token, response.refreshToken);

            // Redirect to home or dashboard
            router.push(ROUTES.HOME);
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.';
            setError(errorMessage);
            logger.error("Login submission failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        showPassword,
        error,
        togglePassword,
        onSubmit,
    };
};
