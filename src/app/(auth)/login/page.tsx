"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Eye, EyeOff, Loader2, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import { AuthWrapper } from "@/components/auth/shared";

export default function LoginPage() {
    const { isLoading, showPassword, togglePassword, onSubmit } = useLoginForm();

    return (
        <AuthWrapper
            title="مرحباً بعودتك"
            description="أدخل بيانات اعتمادك للوصول إلى حسابك"
            footerText="ليس لديك حساب؟"
            footerLinkText="إنشاء حساب جديد"
            footerLinkHref="/register"
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

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-base font-bold text-foreground">كلمة المرور</Label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
                        >
                            نسيت كلمة المرور؟
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="text-left pl-10"
                            dir="ltr"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">تبديل عرض كلمة المرور</span>
                        </button>
                    </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 justify-end">
                    <Checkbox id="remember" className="order-1" />
                    <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground order-2 cursor-pointer"
                    >
                        تذكرني
                    </label>
                </div>

                {/* Submit Button */}
                <Button className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all h-11" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري تسجيل الدخول...
                        </>
                    ) : (
                        <>
                            <LogIn className="ml-2 h-4 w-4" />
                            تسجيل الدخول
                        </>
                    )}
                </Button>
            </form>
        </AuthWrapper>
    );
}
