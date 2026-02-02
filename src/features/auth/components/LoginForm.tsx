"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff, Loader2, LogIn, Mail, ChevronLeft } from "lucide-react";
import { ErrorDisplay } from "@/shared/components/common";
import { useLoginForm } from "../hooks/useLoginForm";
import type { LoginCredentials } from "../types";
import { checkRateLimit, getRemainingAttempts, getResetTime } from "@/lib/security/rateLimiter";
import { toast } from "sonner";

export function LoginForm() {
    const { isLoading, showPassword, error, togglePassword, onSubmit } = useLoginForm();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check rate limit before proceeding
        if (!checkRateLimit(email)) {
            const resetTime = getResetTime(email);
            const minutes = Math.ceil(resetTime / 60);
            toast.error(
                `تم تجاوز عدد المحاولات المسموح بها. حاول مرة أخرى بعد ${minutes} دقيقة.`,
                { duration: 5000 }
            );
            return;
        }

        const credentials: LoginCredentials = {
            email,
            password,
            rememberMe,
        };

        await onSubmit(credentials);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <ErrorDisplay
                    message={error}
                    onDismiss={() => { }}
                />
            )}

            {/* Form Card - Matching Registration Style */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/[0.03] via-primary/[0.01] to-transparent border border-primary/10 shadow-sm backdrop-blur-sm">
                <div className="space-y-4">
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
                                className="text-left pl-10 h-11"
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
                                className="text-left pl-10 h-11"
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
                    <div className="flex items-center gap-2 justify-end pt-2">
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
                </div>
            </div>

            {/* Submit Button - Matching Registration Style */}
            <div className="pt-4 border-t border-slate-100">
                <Button
                    className="w-full font-bold h-12 rounded-xl bg-gradient-to-l from-primary to-emerald-400 hover:shadow-lg hover:shadow-primary/20 transition-all text-base text-white"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                            جاري تسجيل الدخول...
                        </>
                    ) : (
                        <>
                            تسجيل الدخول
                            <ChevronLeft className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
                <Link
                    href="/forgot-password"
                    className="text-sm font-bold text-warm-green hover:text-warm-green-light transition-colors"
                >
                    نسيت كلمة المرور؟
                </Link>
            </div>
        </form>
    );
}
