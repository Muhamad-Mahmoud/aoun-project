"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button as UiButton } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { AuthWrapper } from "@/components/auth/shared";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    }

    if (isSubmitted) {
        return (
            <AuthWrapper
                title="تحقق من بريدك الإلكتروني"
                description="لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني."
            >
                <div className="space-y-4 text-center py-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        يرجى التحقق من صندوق الوارد الخاص بك واتباع التعليمات لإعادة تعيين كلمة المرور.
                    </p>
                    <Link href="/login" className="block w-full">
                        <UiButton className="w-full h-11 font-medium" variant="outline">
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                            العودة لتسجيل الدخول
                        </UiButton>
                    </Link>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper
            title="هل نسيت كلمة المرور؟"
            description="أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور"
            footerText="تذكرت كلمة المرور؟"
            footerLinkText="تسجيل الدخول"
            footerLinkHref="/login"
        >
            <form onSubmit={onSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-bold text-right w-full block text-foreground">البريد الإلكتروني</Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="text-left pl-10"
                            dir="ltr"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Submit Button */}
                <UiButton className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all h-11" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الإرسال...
                        </>
                    ) : (
                        <>
                            <Mail className="ml-2 h-4 w-4" />
                            إرسال رابط الاستعادة
                        </>
                    )}
                </UiButton>
            </form>
        </AuthWrapper>
    );
}
