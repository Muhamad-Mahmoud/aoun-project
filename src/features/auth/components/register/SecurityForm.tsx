import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, CheckSquare, Square } from "lucide-react";
import { FormField } from "../shared/FormField";
import { FormData, FormErrors } from "@/features/auth/types/register";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";

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
                        <div className="relative group">
                            <FormField
                                id="password"
                                label="كلمة المرور"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(val) => onChange("password", val)}
                                error={errors.password}
                                dir="ltr"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-4 top-[42px] text-slate-400 hover:text-emerald-600 transition-all p-2 rounded-lg hover:bg-slate-100"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="relative group">
                            <FormField
                                id="confirmPassword"
                                label="تأكيد كلمة المرور"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(val) => onChange("confirmPassword", val)}
                                error={errors.confirmPassword}
                                dir="ltr"
                            />
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
