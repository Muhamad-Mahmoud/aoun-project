import React from "react";
import { User, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountType } from "@/types/auth/register";

interface AccountTypeSelectorProps {
    accountType: AccountType;
    onChange: (type: AccountType) => void;
}

export const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ accountType, onChange }) => {
    return (
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto mb-4">
            <button
                type="button"
                onClick={() => onChange("individual")}
                className={cn(
                    "relative p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 hover:-translate-y-1 group overflow-hidden",
                    accountType === "individual"
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                        : "border-border/40 bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
            >
                {accountType === "individual" && (
                    <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 fill-primary/10" />
                    </div>
                )}

                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300",
                    accountType === "individual" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
                )}>
                    <User className="w-8 h-8" />
                </div>

                <div className="text-center space-y-1">
                    <span className={cn(
                        "block text-sm font-bold transition-colors",
                        accountType === "individual" ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}>
                        فرد مستقل
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                        للتبرع أو التطوع
                    </span>
                </div>
            </button>

            <button
                type="button"
                onClick={() => onChange("organization")}
                className={cn(
                    "relative p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 hover:-translate-y-1 group overflow-hidden",
                    accountType === "organization"
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                        : "border-border/40 bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
            >
                {accountType === "organization" && (
                    <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 fill-primary/10" />
                    </div>
                )}

                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300",
                    accountType === "organization" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
                )}>
                    <Building2 className="w-8 h-8" />
                </div>

                <div className="text-center space-y-1">
                    <span className={cn(
                        "block text-sm font-bold transition-colors",
                        accountType === "organization" ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}>
                        جمعية / مؤسسة
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                        للشراكة وتقديم الدعم
                    </span>
                </div>
            </button>
        </div>
    );
};
