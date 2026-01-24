/**
 * Login Form Component
 * Handles user authentication
 */

"use client";

import React from "react";
import Link from "next/link";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Eye, EyeOff, Loader2, LogIn, Mail } from "lucide-react";
import { ErrorDisplay } from "@/shared/components/common";
import { AuthWrapper } from "./shared/AuthWrapper";
import { useLoginForm } from "../hooks/useLoginForm";
import { ROUTES } from "@/shared/constants/routes";

export function LoginForm() {
    const { form, isLoading, showPassword, error, togglePassword, onSubmit } = useLoginForm();

    return (
        <AuthWrapper
            title="مرحباً بعودتك"
            description="أدخل بيانات اعتمادك للوصول إلى حسابك"
            footerText="ليس لديك حساب؟"
            footerLinkText="إنشاء حساب جديد"
            footerLinkHref={ROUTES.AUTH.REGISTER}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {error && (
                        <ErrorDisplay
                            message={error}
                            onDismiss={() => { }}
                        />
                    )}

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-base font-bold text-right w-full block text-foreground">
                                    البريد الإلكتروني
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="name@example.com"
                                            className="text-left pl-10"
                                            dir="ltr"
                                            {...field}
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-right" />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-base font-bold text-foreground">
                                        كلمة المرور
                                    </FormLabel>
                                    <Link
                                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                                        className="text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
                                    >
                                        نسيت كلمة المرور؟
                                    </Link>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="text-left pl-10"
                                            dir="ltr"
                                            {...field}
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
                                </FormControl>
                                <FormMessage className="text-right" />
                            </FormItem>
                        )}
                    />

                    {/* Remember Me */}
                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 justify-end space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1"
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground order-2 cursor-pointer m-0">
                                    تذكرني
                                </FormLabel>
                            </FormItem>
                        )}
                    />

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
            </Form>
        </AuthWrapper>
    );
}
