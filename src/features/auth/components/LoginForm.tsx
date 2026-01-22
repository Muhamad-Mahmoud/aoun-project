/**
 * Login Form Component
 * Handles user authentication
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff, Loader2, LogIn, Mail } from "lucide-react";
import { ErrorDisplay } from "@/shared/components/shared";
import { AuthWrapper } from "./shared/AuthWrapper";
import { useLoginForm } from "../hooks/useLoginForm";
import type { LoginCredentials } from "../types";

export function LoginForm() {
    const { isLoading, showPassword, error, togglePassword, onSubmit } = useLoginForm();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const credentials: LoginCredentials = {
            email,
            password,
            rememberMe,
        };

        await onSubmit(credentials);
    };

    return (
        <AuthWrapper
            title="مرحباً بعودتك"
            description="أدخل بيانات اعتمادك للوصول إلى حسابك"
            footerText="ليس لديك حساب؟"
            footerLinkText="إنشاء حساب جديد"
            footerLinkHref="/register"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <ErrorDisplay
                        message={error}
                        onDismiss={() => { }}
                    />
                )}

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-bold text-right w-full block text-foreground">
                        البريد الإلكتروني
                    </Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-left pl-10"
                            dir="ltr"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-base font-bold text-foreground">
                            كلمة المرور
                        </Label>
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <Checkbox
                        id="remember"
                        className="order-1"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground order-2 cursor-pointer"
                    >
                        تذكرني
                    </label>
                </div>

                {/* Submit Button */}
                <Button
                    className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all h-11"
                    type="submit"
                    disabled={isLoading}
                >
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
