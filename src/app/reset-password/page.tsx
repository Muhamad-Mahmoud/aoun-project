"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/features/auth/api/authApi";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { AuthWrapper } from "@/features/auth/components/shared/AuthWrapper";
import { ROUTES } from "@/shared/constants/routes";

const resetPasswordSchema = z.object({
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

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const verificationCode = searchParams.get("code");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (!email || !verificationCode) {
            toast.error("بيانات غير مكتملة. يرجى البدء من جديد.");
            router.push("/forgot-password");
        }
    }, [email, verificationCode, router]);

    const onSubmit = async (data: ResetPasswordSchema) => {
        if (!email || !verificationCode) return;

        setIsLoading(true);
        try {
            await resetPassword({
                email,
                verificationCode,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });
            setIsSuccess(true);
            toast.success("تم تغيير كلمة المرور بنجاح!");
            logger.info("Password reset successful", { email });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push(ROUTES.AUTH.LOGIN);
            }, 3000);
        } catch (error: any) {
            toast.error(error?.message || "حدث خطأ. حاول مرة أخرى.");
            logger.error("Reset password error", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthWrapper
                title="تم تغيير كلمة المرور!"
                description="تم تغيير كلمة المرور بنجاح. جاري تحويلك لتسجيل الدخول..."
            >
                <div className="flex flex-col items-center gap-6 py-8">
                    <div className="w-20 h-20 bg-warm-green/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-warm-green" />
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper
            title="إنشاء كلمة مرور جديدة"
            description="أدخل كلمة المرور الجديدة لحسابك"
            footerText="العودة إلى"
            footerLinkText="تسجيل الدخول"
            footerLinkHref={ROUTES.AUTH.LOGIN}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-bold text-slate-900">
                        كلمة المرور الجديدة
                    </Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="أدخل كلمة المرور الجديدة"
                            disabled={isLoading}
                            {...register("newPassword")}
                            className={`h-12 pl-12 ${errors.newPassword ? "border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-sm text-red-600 font-bold">{errors.newPassword.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-bold text-slate-900">
                        تأكيد كلمة المرور
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="أعد إدخال كلمة المرور"
                            disabled={isLoading}
                            {...register("confirmPassword")}
                            className={`h-12 pl-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-600 font-bold">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base font-black bg-warm-green hover:bg-warm-green-light shadow-lg shadow-warm-green/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : (
                        <>
                            تغيير كلمة المرور
                            <ArrowRight className="mr-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </form>
        </AuthWrapper>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <AuthWrapper title="جاري التحميل..." description="">
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-warm-green" />
                </div>
            </AuthWrapper>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
