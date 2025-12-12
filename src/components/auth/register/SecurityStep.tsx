import React from "react";
import { PasswordField } from "../shared/PasswordField";
import { TermsCheckbox } from "../shared/TermsCheckbox";
import { FormErrors } from "@/types/auth/register";

interface SecurityStepProps {
    password: string;
    acceptTerms: boolean;
    showPassword: boolean;
    errors: FormErrors;
    onPasswordChange: (value: string) => void;
    onTermsChange: (value: boolean) => void;
    onTogglePassword: () => void;
    idPrefix?: string;
}

export const SecurityStep: React.FC<SecurityStepProps> = ({
    password,
    acceptTerms,
    showPassword,
    errors,
    onPasswordChange,
    onTermsChange,
    onTogglePassword,
    idPrefix = ""
}) => {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-5 duration-300">
            <PasswordField
                id={`password${idPrefix}`}
                value={password}
                onChange={onPasswordChange}
                error={errors.password}
                showPassword={showPassword}
                onTogglePassword={onTogglePassword}
            />
            <TermsCheckbox
                id={`terms${idPrefix}`}
                checked={acceptTerms}
                onChange={onTermsChange}
                error={errors.acceptTerms}
            />
        </div>
    );
};
