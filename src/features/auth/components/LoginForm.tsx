"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff, Loader2, LogIn, Mail, ChevronLeft } from "lucide-react";
import { ErrorDisplay } from "@/shared/components/common";
import { useLoginForm } from "../hooks/useLoginForm";
import type { LoginCredentials } from "../types";
// Rate limiter import removed
import { toast } from "sonner";

export function LoginForm() {
    const { isLoading, showPassword, error, togglePassword, onSubmit } = useLoginForm();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check rate limit before proceeding
        
        const credentials: LoginCredentials = {
            email,
            password,
            rememberMe,
        };

        startTransition(async () => {
            await onSubmit(credentials);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {error && (
                <ErrorDisplay
                    message={error}
                    onDismiss={() => { }}
                />
            )}

            {/* Form Card - Premium SaaS Glassmorphism */}
            <div className="p-8 md:px-10 md:py-9 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_45px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out relative overflow-hidden group/card z-10">
                {/* Internal Section Header */}
                <div className="text-center mb-8 border-b border-slate-200 pb-5 -mx-10">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.12em] block">
                        تسجيل الدخول إلى حسابك
                    </span>
                </div>
                
                <div className="space-y-[18px] relative z-10">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-right w-full block text-slate-800">
                            البريد الإلكتروني
                        </Label>
                        <div className="relative group">
                            <Mail strokeWidth={1.5} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="أدخل البريد الإلكتروني"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}      
                                className="text-right pr-11 pl-4 h-[52px] text-[15px] rounded-xl border-slate-200 focus-visible:ring-4 focus-visible:ring-[#12a17b]/20 focus-visible:border-[#12a17b] transition-all bg-slate-50 hover:bg-slate-100/50 focus:bg-white"
                                dir="rtl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">     
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-800">
                                كلمة المرور
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#12a17b] hover:text-[#0f3a29] underline underline-offset-4 decoration-[#12a17b]/30 hover:decoration-[#12a17b] font-bold transition-all"
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                        <div className="relative group">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}       
                                placeholder="أدخل كلمة المرور"    
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}   
                                className="text-right pr-4 pl-12 h-[52px] text-[15px] rounded-xl border-slate-200 focus-visible:ring-4 focus-visible:ring-[#12a17b]/20 focus-visible:border-[#12a17b] transition-all bg-slate-50 hover:bg-slate-100/50 focus:bg-white"
                                dir="rtl"
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#12a17b] hover:bg-[#12a17b]/10 transition-all z-10"
                            >
                                {showPassword ? (
                                    <EyeOff strokeWidth={1.5} className="h-4 w-4" />
                                ) : (
                                    <Eye strokeWidth={1.5} className="h-4 w-4" />
                                )}
                                <span className="sr-only">تبديل عرض كلمة المرور</span>
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-start gap-3 pt-1">  
                        <Checkbox
                            id="remember"
                            className="mt-[3px] w-[18px] h-[18px] rounded border-slate-300 data-[state=checked]:bg-[#12a17b] data-[state=checked]:border-[#12a17b] transition-all"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer select-none text-right"
                        >
                            تذكرني
                            <span className="block text-xs text-slate-500 font-medium mt-1.5 opacity-80">حفظ الجلسة على هذا الجهاز فقط</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 relative z-20">
                <Button
                    className="w-full text-[15px] font-semibold flex items-center justify-center px-8 py-3.5 h-[54px] rounded-full bg-[#12a17b] hover:bg-[#0f3a29] shadow-[0_8px_20px_rgba(18,161,123,0.25)] hover:shadow-[0_18px_40px_rgba(15,58,41,0.35)] hover:-translate-y-[1px] transition-all duration-300 ease-out text-white group"
                    type="submit"
                    disabled={isLoading || isPending}
                >
                    {(isLoading || isPending) ? (
                        <>
                            <Loader2 strokeWidth={1.5} className="ml-2 h-5 w-5 animate-spin" />   
                            جاري تسجيل الدخول...
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-2 group w-full relative">
                            <LogIn strokeWidth={1.5} className="w-5 h-5 text-emerald-100 group-hover:text-white group-hover:scale-110 transition-all" />
                            <span>تسجيل الدخول</span>
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}
