import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
            />
            {error && (
                <p className="text-xs text-destructive font-semibold text-right">
                    {error}
                </p>
            )}
        </div>
    );
};
