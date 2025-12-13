import React from "react";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    showPassword: boolean;
    onTogglePassword: () => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
    id,
    value,
    onChange,
    error,
    showPassword,
    onTogglePassword
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-semibold text-right w-full block text-foreground/90">
                كلمة المرور
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "h-11 text-sm bg-background/60 text-left pl-10 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                        error && "border-destructive"
                    )}
                    dir="ltr"
                />
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && <p className="text-xs text-destructive font-medium text-right">{error}</p>}
            <p className="text-xs text-muted-foreground text-right">يجب أن تحتوي على 8 أحرف على الأقل</p>
        </div>
    );
};
