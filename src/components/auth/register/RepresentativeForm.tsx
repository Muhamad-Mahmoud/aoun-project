import React from "react";
import { User } from "lucide-react";
import { FormField } from "../shared/FormField";
import { FormData, FormErrors } from "@/types/auth/register";

interface RepresentativeFormProps {
    formData: FormData;
    errors: FormErrors;
    onChange: (field: keyof FormData, value: string) => void;
}

export const RepresentativeForm: React.FC<RepresentativeFormProps> = ({ formData, errors, onChange }) => {
    return (
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary/[0.03] via-primary/[0.01] to-transparent border border-primary/10 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary pb-2 mb-2 border-b border-primary/10">
                <div className="p-1.5 rounded-lg bg-primary/10">
                    <User className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">بيانات المسؤول</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
                <FormField
                    id="repName"
                    label="الاسم الرباعي"
                    placeholder="أحمد محمود علي سالم"
                    value={formData.repName}
                    onChange={(val) => onChange("repName", val)}
                    error={errors.repName}
                />
                <FormField
                    id="repJob"
                    label="الوظيفة"
                    placeholder="الرئيس التنفيذي"
                    value={formData.repJob}
                    onChange={(val) => onChange("repJob", val)}
                    error={errors.repJob}
                />
                <FormField
                    id="repEmail"
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.repEmail}
                    onChange={(val) => onChange("repEmail", val)}
                    error={errors.repEmail}
                    dir="ltr"
                />
                <FormField
                    id="repPhone"
                    label="رقم الهاتف"
                    type="tel"
                    placeholder="01012345678"
                    value={formData.repPhone}
                    onChange={(val) => onChange("repPhone", val)}
                    error={errors.repPhone}
                    dir="ltr"
                />
            </div>
        </div>
    );
};
