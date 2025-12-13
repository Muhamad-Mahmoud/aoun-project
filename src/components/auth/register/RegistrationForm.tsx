import React from "react";
import { FileText } from "lucide-react";
import { Label } from "@/components/shadcn/label";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { FormField } from "../shared/FormField";
import { FormErrors } from "@/types/auth/register";

interface RegistrationFormProps {
    isRegistered: "yes" | "no";
    registrationNumber: string;
    errors: FormErrors;
    onRegisteredChange: (value: "yes" | "no") => void;
    onNumberChange: (value: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
    isRegistered,
    registrationNumber,
    errors,
    onRegisteredChange,
    onNumberChange
}) => {
    return (
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary/[0.03] via-primary/[0.01] to-transparent border border-primary/10 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary pb-2 mb-2 border-b border-primary/10">
                <div className="p-1.5 rounded-lg bg-primary/10">
                    <FileText className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">معلومات التسجيل</h3>
            </div>
            <div className="space-y-2">
                <div className="space-y-2">
                    <Label className="text-sm font-bold text-right w-full block text-foreground">
                        هل الجمعية مسجلة رسمياً؟
                    </Label>
                    <RadioGroup
                        value={isRegistered}
                        onValueChange={(val: string) => onRegisteredChange(val as "yes" | "no")}
                        className="flex gap-6 justify-end"
                    >
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <Label htmlFor="reg-yes" className="cursor-pointer text-sm font-medium group-hover:text-primary transition-colors">
                                نعم
                            </Label>
                            <RadioGroupItem value="yes" id="reg-yes" className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <Label htmlFor="reg-no" className="cursor-pointer text-sm font-medium group-hover:text-primary transition-colors">
                                لا
                            </Label>
                            <RadioGroupItem value="no" id="reg-no" className="w-4 h-4" />
                        </div>
                    </RadioGroup>
                </div>
                {isRegistered === "yes" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <FormField
                            id="registrationNumber"
                            label="رقم إشهار الجمعية"
                            placeholder="أدخل رقم التسجيل الرسمي"
                            value={registrationNumber}
                            onChange={onNumberChange}
                            error={errors.registrationNumber}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
