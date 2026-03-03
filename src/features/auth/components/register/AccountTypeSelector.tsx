import React from "react";
import { Building2, User, Check } from "lucide-react";
import { cn } from "@/shared/utils";
import { AccountType } from "@/features/auth/types/register";

interface AccountTypeSelectorProps {
    accountType: AccountType;
    onChange: (type: AccountType) => void;
}

export const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ accountType, onChange }) => {
    return (
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-4">
            <button
                type="button"
                onClick={() => onChange("individual")}
                className={cn(
                    "relative p-6 rounded-2xl border-2 text-center transition-all duration-300 ease-out overflow-hidden group/card bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-3",
                    accountType === "individual"
                        ? "border-emerald-500 bg-emerald-50/20 shadow-[0_8px_20px_rgba(16,185,129,0.1)]"
                        : "border-slate-100 border-solid shadow-[0_4px_15px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
                )}
            >
                {accountType === "individual" && (
                    <div className="absolute top-4 right-4 animate-scale-in">
                        <div className="bg-emerald-500 rounded-full p-0.5">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}

                <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 mb-2",
                    accountType === "individual" ? "bg-emerald-100 text-emerald-600" : "bg-amber-50 text-amber-600 group-hover/card:bg-amber-100"
                )}>
                    <User className="w-6 h-6" />
                </div>

                <div className="text-center space-y-1">
                    <h3 className={cn(
                        "text-lg font-bold mb-1 transition-colors",
                        accountType === "individual" ? "text-emerald-900" : "text-slate-800"
                    )}>
                        فرد مستقل
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        للتبرع أو التطوع
                    </p>
                </div>
            </button>

            <button
                type="button"
                onClick={() => onChange("organization")}
                className={cn(
                    "relative p-6 rounded-2xl border-2 text-center transition-all duration-300 ease-out overflow-hidden group/card bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-3",
                    accountType === "organization"
                        ? "border-emerald-500 bg-emerald-50/20 shadow-[0_8px_20px_rgba(16,185,129,0.1)]"
                        : "border-slate-100 border-solid shadow-[0_4px_15px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
                )}
            >
                {accountType === "organization" && (
                    <div className="absolute top-4 right-4 animate-scale-in">
                        <div className="bg-emerald-500 rounded-full p-0.5">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}

                <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 mb-2",
                    accountType === "organization" ? "bg-emerald-100 text-emerald-600" : "bg-amber-50 text-amber-600 group-hover/card:bg-amber-100"
                )}>
                    <Building2 className="w-6 h-6" />
                </div>

                <div className="text-center space-y-1">
                    <h3 className={cn(
                        "text-lg font-bold mb-1 transition-colors",
                        accountType === "organization" ? "text-emerald-900" : "text-slate-800"
                    )}>
                        جمعية / مؤسسة
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        للشراكة وتقديم الدعم
                    </p>
                </div>
            </button>
        </div>
    );
};
