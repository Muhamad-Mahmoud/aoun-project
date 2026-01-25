import React from "react";
import { FormField } from "../shared/FormField";
import { FormData, FormErrors } from "@/features/auth/types/register";

interface OrganizationFormProps {
    formData: FormData;
    errors: FormErrors;
    onChange: (field: keyof FormData, value: string) => void;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ formData, errors, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/[0.03] via-primary/[0.01] to-transparent border border-primary/10 shadow-sm backdrop-blur-sm">
                <div className="grid lg:grid-cols-2 gap-4">
                    <FormField
                        id="name"
                        label="اسم الجمعية"
                        placeholder="مؤسسة الخير للتنمية"
                        value={formData.name}
                        onChange={(val) => onChange("name", val)}
                        error={errors.name}
                    />
                    <FormField
                        id="capacity"
                        label="القدرة الاستيعابية (عدد الأسر)"
                        placeholder="100"
                        type="number"
                        value={formData.capacity}
                        onChange={(val) => onChange("capacity", val)}
                        error={errors.capacity}
                    />
                    <FormField
                        id="email"
                        label="البريد الإلكتروني للجمعية"
                        type="email"
                        placeholder="info@charity.org"
                        value={formData.email}
                        onChange={(val) => onChange("email", val)}
                        error={errors.email}
                        dir="ltr"
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
                        id="governorate"
                        label="المحافظة"
                        placeholder="القاهرة"
                        value={formData.governorate}
                        onChange={(val) => onChange("governorate", val)}
                        error={errors.governorate}
                    />
                    <FormField
                        id="city"
                        label="المدينة / المركز"
                        placeholder="مدينة نصر"
                        value={formData.city}
                        onChange={(val) => onChange("city", val)}
                        error={errors.city}
                    />
                    <div className="lg:col-span-2">
                        <FormField
                            id="coverageNotes"
                            label="ملاحظات التغطية"
                            placeholder="نغطي جميع أنحاء المحافظة..."
                            value={formData.coverageNotes}
                            onChange={(val) => onChange("coverageNotes", val)}
                            error={errors.coverageNotes}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
