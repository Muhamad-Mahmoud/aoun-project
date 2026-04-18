import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { FormData, FormErrors } from "@/features/auth/types/register";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";

interface SecurityFormProps {
    formData: FormData;
    errors: FormErrors;
    onChange: (field: keyof FormData, value: string | boolean) => void;
}

export const SecurityForm: React.FC<SecurityFormProps> = ({ formData, errors, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            <div className="p-8 md:p-10 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_45px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out relative overflow-hidden group/card z-10 text-right">
                {/* Background Pattern - Subtle */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#16a34a 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <div className="space-y-8 relative z-10">
                    {/* Password Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-800">
                                كلمة المرور
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => onChange("password", e.target.value)}
                                    className="text-right pr-4 pl-12 h-[52px] text-[15px] rounded-xl border-slate-200 focus-visible:ring-4 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all bg-slate-50 hover:bg-slate-100/50 focus:bg-white"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all z-10"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span className="sr-only">تبديل عرض كلمة المرور</span>
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive font-black mt-1 text-right">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-800">
                                تأكيد كلمة المرور
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => onChange("confirmPassword", e.target.value)}
                                    className="text-right pr-4 pl-12 h-[52px] text-[15px] rounded-xl border-slate-200 focus-visible:ring-4 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all bg-slate-50 hover:bg-slate-100/50 focus:bg-white"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all z-10"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span className="sr-only">تبديل عرض كلمة المرور</span>
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive font-black mt-1 text-right">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="pt-2 border-t border-slate-50">
                        <div className="flex items-start gap-3 group">
                            <div className="mt-1">
                                <Checkbox
                                    id="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(val) => {
                                        onChange("acceptTerms", !!val);
                                    }}
                                    className="w-6 h-6 rounded-lg border-2 border-slate-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label
                                    htmlFor="acceptTerms"
                                    className="text-base font-bold text-slate-700 cursor-pointer group-hover:text-slate-900 transition-colors block"
                                >
                                    أوافق على الشروط والأحكام
                                </Label>
                                <p
                                    className="text-sm text-slate-400 font-medium leading-relaxed cursor-pointer"
                                    onClick={() => onChange("acceptTerms", !formData.acceptTerms)}
                                >
                                    باستمرارك في التسجيل، أنت توافق على سياسة الخصوصية وشروط الاستخدام الخاصة بمنصة عون.
                                </p>
                            </div>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-xs text-destructive font-black mt-2 text-right">
                                {errors.acceptTerms}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Security Tip */}
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-slate-500 font-bold">
                    نحن نستخدم أحدث تقنيات التشفير لضمان أمن وخصوصية بياناتك.
                </p>
            </div>
        </div>
    );
};
