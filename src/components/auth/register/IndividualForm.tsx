import React from "react";
import { FormField } from "../shared/FormField";
import { FormData, FormErrors } from "@/types/auth/register";

interface IndividualFormProps {
    formData: FormData;
    errors: FormErrors;
    onChange: (field: keyof FormData, value: string) => void;
}

export const IndividualForm: React.FC<IndividualFormProps> = ({ formData, errors, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/[0.03] via-primary/[0.01] to-transparent border border-primary/10 shadow-sm backdrop-blur-sm">
                <div className="grid lg:grid-cols-2 gap-4">
                    <FormField
                        id="name"
                        label="الاسم الرباعي"
                        placeholder="محمد أحمد علي سالم"
                        value={formData.name}
                        onChange={(val) => onChange("name", val)}
                        error={errors.name}
                    />
                    <FormField
                        id="governorate"
                        label="المحافظة"
                        placeholder="القاهرة"
                        value={formData.governorate}
                        onChange={(val) => onChange("governorate", val)}
                        error={errors.governorate}
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
