"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

// Validation Schema
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string()
        .min(8, "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل")
        .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
        .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
        .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
        .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
});

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<void> {
    await apiClient.post(API_ENDPOINTS.user.changePassword, data);
}

export function useChangePassword() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordSchema) => {
        setIsLoading(true);
        try {
            await changePassword(data);
            toast.success("تم تغيير كلمة المرور بنجاح!");
            logger.info("Password changed successfully");
            reset();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "فشل تغيير كلمة المرور. حاول مرة أخرى.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isLoading,
    };
}
