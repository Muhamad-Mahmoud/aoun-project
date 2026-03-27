"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card } from "@/shared/ui/card";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useChangePassword } from "@/features/settings/hooks/useChangePassword";

export function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, errors, watch, isLoading } = useChangePassword();

    const newPasswordValue = watch("newPassword") || "";
    
    // Password Strength Calculation
    const getStrength = (password: string) => {
        if (!password) return { score: 0, text: "" };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score <= 2) return { score, text: "ضعيفة", color: "bg-destructive" };
        if (score <= 4) return { score, text: "متوسطة", color: "bg-warning" };
        return { score, text: "قوية جداً", color: "bg-success" };
    };
    
    const strength = getStrength(newPasswordValue);

    return (
        <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-warm-green/10 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-warm-green" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">تغيير كلمة المرور</h2>
                    <p className="text-slate-600 font-bold">قم بتحديث كلمة المرور الخاصة بك</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="font-bold text-slate-900">
                        كلمة المرور الحالية
                    </Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="أدخل كلمة المرور الحالية"
                            disabled={isLoading}
                            {...register("currentPassword")}
                            className={`h-12 ps-12 ${errors.currentPassword ? "border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-sm text-destructive font-bold">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div className="h-px bg-slate-200" />

                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-bold text-slate-900">
                        كلمة المرور الجديدة
                    </Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="أدخل كلمة المرور الجديدة"
                            disabled={isLoading}
                            {...register("newPassword")}
                            className={`h-12 ps-12 ${errors.newPassword ? "border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {newPasswordValue && (
                        <div className="mt-3 space-y-2 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-500">قوة كلمة المرور:</span>
                                <span className={strength.color?.replace('bg-', 'text-')}>{strength.text}</span>
                            </div>
                            <div className="flex gap-1 h-1.5 w-full">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div 
                                        key={level} 
                                        className={`flex-1 rounded-full transition-all duration-300 ${level <= strength.score ? strength.color : 'bg-slate-100'}`} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {errors.newPassword && (
                        <p className="text-sm text-destructive font-bold">{errors.newPassword.message}</p>
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
                            placeholder="أعد إدخال كلمة المرور الجديدة"
                            disabled={isLoading}
                            {...register("confirmPassword")}
                            className={`h-12 ps-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-destructive font-bold">{errors.confirmPassword.message}</p>
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
                            جاري التغيير...
                        </>
                    ) : (
                        "تغيير كلمة المرور"
                    )}
                </Button>
            </form>
        </Card>
    );
}
