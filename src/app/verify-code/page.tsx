"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";
import { verifyResetCode, forgotPassword } from "@/features/auth/api/authApi";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { AuthWrapper } from "@/features/auth/components/shared/AuthWrapper";

const verifyCodeSchema = z.object({
    code: z.string().min(4, "الكود يجب أن يتكون من 4 أرقام على الأقل"),
});

type VerifyCodeSchema = z.infer<typeof verifyCodeSchema>;

function VerifyCodeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyCodeSchema>({
        resolver: zodResolver(verifyCodeSchema),
    });

    useEffect(() => {
        if (!email) {
            toast.error("البريد الإلكتروني مفقود. يرجى البدء من جديد.");
            router.push("/forgot-password");
        }
    }, [email, router]);

    const onSubmit = async (data: VerifyCodeSchema) => {
        if (!email) return;

        setIsLoading(true);
        try {
            await verifyResetCode({ email, code: data.code });
            toast.success("تم التحقق من الكود بنجاح!");
            logger.info("Reset code verified", { email });

            // Redirect to reset password page
            router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(data.code)}`);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "الكود غير صحيح. حاول مرة أخرى.";
            toast.error(message);
            logger.error("Verify code error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) return;

        setIsResending(true);
        try {
            await forgotPassword({ email });
            toast.success("تم إعادة إرسال الكود!");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "فشل إعادة الإرسال. حاول مرة أخرى.";
            toast.error(message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AuthWrapper
            title="أدخل كود التحقق"
            description={`أدخل الكود المرسل إلى ${email}`}
            footerText="العودة إلى"
            footerLinkText="إدخال البريد الإلكتروني"
            footerLinkHref="/forgot-password"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="code" className="font-bold text-slate-900">
                        كود التحقق
                    </Label>
                    <Input
                        id="code"
                        type="text"
                        placeholder="أدخل الكود"
                        disabled={isLoading}
                        {...register("code")}
                        className={`h-12 text-center text-2xl tracking-widest ${errors.code ? "border-red-500" : ""}`}
                        maxLength={6}
                    />
                    {errors.code && (
                        <p className="text-sm text-red-600 font-bold">{errors.code.message}</p>
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
                            جاري التحقق...
                        </>
                    ) : (
                        <>
                            تحقق من الكود
                            <ArrowRight className="mr-2 h-5 w-5" />
                        </>
                    )}
                </Button>

                <div className="text-center">
                    <p className="text-sm text-slate-600 font-bold">
                        لم تستلم الكود؟{" "}
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="text-warm-green hover:text-warm-green-light font-black disabled:opacity-50"
                        >
                            {isResending ? "جاري الإرسال..." : "إعادة الإرسال"}
                        </button>
                    </p>
                </div>
            </form>
        </AuthWrapper>
    );
}

export default function VerifyCodePage() {
    return (
        <Suspense fallback={
            <AuthWrapper title="جاري التحميل..." description="">
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-warm-green" />
                </div>
            </AuthWrapper>
        }>
            <VerifyCodeContent />
        </Suspense>
    );
}
