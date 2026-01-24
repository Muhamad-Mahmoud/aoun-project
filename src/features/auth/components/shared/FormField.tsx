import React from "react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/utils";

interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    dir?: "ltr" | "rtl";
}

export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    dir = "rtl"
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-base font-bold text-right w-full block text-foreground">
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    dir === "ltr" ? "text-left" : "text-right",
                    error && "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
                dir={dir}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {error && (
                <p 
                    id={`${id}-error`}
                    className="text-xs text-destructive font-semibold text-right"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

