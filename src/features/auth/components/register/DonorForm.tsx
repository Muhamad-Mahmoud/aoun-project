import React from "react";
import { FormField } from "../shared/FormField";
import { FormData, FormErrors } from "@/features/auth/types/register";

interface DonorFormProps {
    formData: FormData;
    errors: FormErrors;
    onChange: (field: keyof FormData, value: string) => void;
}

export const DonorForm: React.FC<DonorFormProps> = ({ formData, errors, onChange }) => {
    return (
        <div className="space-y-[18px] animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            <div className="p-8 md:p-10 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_45px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out relative overflow-hidden group/card z-10 text-right">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="grid lg:grid-cols-2 gap-[18px] relative z-10">
                    <FormField
                        id="firstName"
                        label="الاسم الأول"
                        placeholder="محمد"
                        value={formData.firstName}
                        onChange={(val) => onChange("firstName", val)}
                        error={errors.firstName}
                    />
                    <FormField
                        id="lastName"
                        label="الاسم الأخير"
                        placeholder="أحمد"
                        value={formData.lastName}
                        onChange={(val) => onChange("lastName", val)}
                        error={errors.lastName}
                    />
                    <FormField
                        id="phone"
                        label="رقم الهاتف"
                        type="tel"
                        placeholder="01012345678"
                        value={formData.phone}
                        onChange={(val) => onChange("phone", val)}
                        error={errors.phone}
                        dir="ltr"
                    />
                    <FormField
                        id="email"
                        label="البريد الإلكتروني"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(val) => onChange("email", val)}
                        error={errors.email}
                        dir="ltr"
                    />
                </div>
            </div>
        </div>
    );
};
