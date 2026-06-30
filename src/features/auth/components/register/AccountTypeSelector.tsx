import React from "react";
import { Building2, User, Users, Check } from "lucide-react";
import { cn } from "@/shared/utils";
import { AccountType } from "@/features/auth/types/register";

interface AccountTypeSelectorProps {
    accountType: AccountType;
    onChange: (type: AccountType) => void;
}

export const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({ accountType, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4">
            <button
                type="button"
                onClick={() => onChange("individual")}
                className={cn(
                    "relative px-4 py-4 rounded-xl border-2 text-center transition-all duration-300 ease-out overflow-hidden group/card bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-2",
                    accountType === "individual"
                        ? "border-[#12a17b] bg-[#12a17b]/5 shadow-[0_8px_20px_rgba(18,161,123,0.1)]"
                        : "border-slate-100 border-solid shadow-[0_4px_15px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-[#12a17b]/30"
                )}
            >
                {accountType === "individual" && (
                    <div className="absolute top-4 right-4 animate-scale-in">
                        <div className="bg-[#12a17b] rounded-full p-0.5">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}

                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 mb-1",
                    accountType === "individual" ? "bg-[#12a17b]/10 text-[#12a17b]" : "bg-slate-100 text-[#0f3a29] group-hover/card:bg-[#12a17b]/10 group-hover/card:text-[#12a17b]"
                )}>
                    <Users className="w-5 h-5" />
                </div>

                <div className="text-center space-y-0.5">
                    <h3 className={cn(
                        "text-[15px] font-bold transition-colors",
                        accountType === "individual" ? "text-[#0f3a29]" : "text-slate-800"
                    )}>
                        أسرة
                    </h3>
                    <p className="text-[12px] text-slate-500 font-medium">
                        لطلب المساعدة والدعم
                    </p>
                </div>
            </button>

            <button
                type="button"
                onClick={() => onChange("organization")}
                className={cn(
                    "relative px-4 py-4 rounded-xl border-2 text-center transition-all duration-300 ease-out overflow-hidden group/card bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-2",
                    accountType === "organization"
                        ? "border-[#f58a1f] bg-[#f58a1f]/5 shadow-[0_8px_20px_rgba(245,138,31,0.1)]"
                        : "border-slate-100 border-solid shadow-[0_4px_15px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-[#f58a1f]/30"
                )}
            >
                {accountType === "organization" && (
                    <div className="absolute top-4 right-4 animate-scale-in">
                        <div className="bg-[#f58a1f] rounded-full p-0.5">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}

                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 mb-1",
                    accountType === "organization" ? "bg-[#f58a1f]/10 text-[#f58a1f]" : "bg-slate-100 text-[#0f3a29] group-hover/card:bg-[#f58a1f]/10 group-hover/card:text-[#f58a1f]"
                )}>
                    <Building2 className="w-5 h-5" />
                </div>

                <div className="text-center space-y-0.5">
                    <h3 className={cn(
                        "text-[15px] font-bold transition-colors",
                        accountType === "organization" ? "text-[#9c530b]" : "text-slate-800"
                    )}>
                        جمعية
                    </h3>
                    <p className="text-[12px] text-slate-500 font-medium">
                        للشراكة وتقديم الدعم
                    </p>
                </div>
            </button>

            <button
                type="button"
                onClick={() => onChange("donor")}
                className={cn(
                    "relative px-4 py-4 rounded-xl border-2 text-center transition-all duration-300 ease-out overflow-hidden group/card bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-2",
                    accountType === "donor"
                        ? "border-[#12a17b] bg-[#12a17b]/5 shadow-[0_8px_20px_rgba(18,161,123,0.1)]"
                        : "border-slate-100 border-solid shadow-[0_4px_15px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-[#12a17b]/30"
                )}
            >
                {accountType === "donor" && (
                    <div className="absolute top-4 right-4 animate-scale-in">
                        <div className="bg-[#12a17b] rounded-full p-0.5">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}

                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 mb-1",
                    accountType === "donor" ? "bg-[#12a17b]/10 text-[#12a17b]" : "bg-slate-100 text-[#0f3a29] group-hover/card:bg-[#12a17b]/10 group-hover/card:text-[#12a17b]"
                )}>
                    <User className="w-5 h-5" />
                </div>

                <div className="text-center space-y-0.5">
                    <h3 className={cn(
                        "text-[15px] font-bold transition-colors",
                        accountType === "donor" ? "text-[#0f3a29]" : "text-slate-800"
                    )}>
                        متبرع
                    </h3>
                    <p className="text-[12px] text-slate-500 font-medium">
                        التبرع للحملات والمحتاجين
                    </p>
                </div>
            </button>
        </div>
    );
};
