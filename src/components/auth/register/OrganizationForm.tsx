import React from "react";
import { Building2 } from "lucide-react";
import { FormField } from "../shared/FormField";
import { FormData, FormErrors } from "@/types/auth/register";

interface OrganizationFormProps {
    formData: FormData;
    errors: FormErrors;
    onChange: (field: keyof FormData, value: string) => void;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ formData, errors, onChange }) => {
    return (
        <div className="space-y-2">
            <div className="grid lg:grid-cols-2 gap-4">
                <FormField
                    id="orgName"
                    label="اسم الجمعية"
                    placeholder="مؤسسة الخير للتنمية"
                    value={formData.orgName}
                    onChange={(val) => onChange("orgName", val)}
                    error={errors.orgName}
                />
                <FormField
                    id="orgLegalName"
                    label="الاسم القانوني"
                    placeholder="الاسم المسجل رسمياً"
                    value={formData.orgLegalName}
                    onChange={(val) => onChange("orgLegalName", val)}
                    error={errors.orgLegalName}
                />
                <FormField
                    id="orgAddress"
                    label="العنوان المسجل"
                    placeholder="الشارع، المنطقة، المدينة"
                    value={formData.orgAddress}
                    onChange={(val) => onChange("orgAddress", val)}
                    error={errors.orgAddress}
                />
                <FormField
                    id="orgGovernorate"
                    label="المحافظة"
                    placeholder="القاهرة"
                    value={formData.orgGovernorate}
                    onChange={(val) => onChange("orgGovernorate", val)}
                    error={errors.orgGovernorate}
                />
            </div>
        </div>
    );
};
