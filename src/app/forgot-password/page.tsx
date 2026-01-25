"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { forgotPassword } from "@/features/auth/api/authApi";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { AuthWrapper } from "@/features/auth/components/shared/AuthWrapper";
import { ROUTES } from "@/shared/constants/routes";

const forgotPasswordSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const email = watch("email");

    const onSubmit = async (data: ForgotPasswordSchema) => {
        setIsLoading(true);
        try {
            await forgotPassword({ email: data.email });
            setIsSuccess(true);
            toast.success("تم إرسال كود التحقق إلى بريدك الإلكتروني");
            logger.info("Password reset email sent", { email: data.email });

            // Redirect to verify code page after 2 seconds
            setTimeout(() => {
                router.push(`/verify-code?email=${encodeURIComponent(data.email)}`);
            }, 2000);
        } catch (error: any) {
            toast.error(error?.message || "حدث خطأ. حاول مرة أخرى.");
            logger.error("Forgot password error", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthWrapper
                title="تم إرسال الكود!"
                description={`تحقق من بريدك الإلكتروني ${email}`}
            >
                <div className="flex flex-col items-center gap-6 py-8">
                    <div className="w-20 h-20 bg-warm-green/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-warm-green" />
                    </div>
                    <p className="text-sm text-slate-500 font-bold">
                        جاري التحويل لصفحة التحقق...
                    </p>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper
            title="نسيت كلمة المرور؟"
            description="لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك كود التحقق"
            footerText="تذكرت كلمة المرور؟"
            footerLinkText="تسجيل الدخول"
            footerLinkHref={ROUTES.AUTH.LOGIN}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-slate-900">
                        البريد الإلكتروني
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="example@domain.com"
                        disabled={isLoading}
                        {...register("email")}
                        className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600 font-bold">{errors.email.message}</p>
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
                            جاري الإرسال...
                        </>
                    ) : (
                        <>
                            إرسال كود التحقق
                            <ArrowRight className="mr-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </form>
        </AuthWrapper>
    );
}
