import React from "react";
import { Checkbox } from "@/components/shadcn/checkbox";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TermsCheckboxProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ id, checked, onChange, error }) => {
    return (
        <>
            <div className={cn(
                "flex items-center gap-2.5 justify-end p-3.5 rounded-xl border transition-colors duration-200",
                error ? "bg-destructive/10 border-destructive/50" : "bg-muted/20 border-border/40"
            )}>
                <label htmlFor={id} className="text-xs font-medium leading-relaxed text-muted-foreground order-2 cursor-pointer">
                    أوافق على{" "}
                    <Link href="/terms" className="text-primary hover:text-primary/80 underline-offset-2 hover:underline font-semibold transition-colors">
                        الشروط والأحكام
                    </Link>
                </label>
                <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(checked) => onChange(checked as boolean)}
                    className="order-1 w-4 h-4 border-primary/50"
                />
            </div>
            {error && <p className="text-xs text-destructive font-medium text-right">{error}</p>}
        </>
    );
};
