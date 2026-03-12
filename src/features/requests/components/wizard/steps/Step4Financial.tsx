import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { RequestFormData } from "../schemas/requestSchema";
import { Wallet, Receipt, Home, Building2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface Step4FinancialProps {
    control: Control<RequestFormData>;
    registeredSocialSupport: boolean;
    housingType: number;
    hasOtherCommitments: boolean;
}

export function Step4Financial({ control, registeredSocialSupport, housingType, hasOtherCommitments }: Step4FinancialProps) {
    
    // Helper for input styling
    const inputClassName = "h-12 rounded-xl border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm transition-all duration-300 px-4 text-[14px] font-medium placeholder:text-slate-400";
    
    // Helper for section headers
    const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100/80">
            <div className="w-7 h-7 rounded-lg bg-warm-green/10 flex items-center justify-center text-warm-green">
                <Icon className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-[15px] font-black text-slate-800">{title}</h4>
        </div>
    );

    return (
        <div className="space-y-6 sm:space-y-8">
            
            {/* 1. Basic Expenses Section */}
            <div className="bg-slate-50/50 p-4 sm:p-5 rounded-[1.5rem] border border-slate-100/80 shadow-sm">
                <SectionHeader title="المصروفات الأساسية" icon={Wallet} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                        control={control}
                        name="monthlyExpenses"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    إجمالي المصاريف الشهرية <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="مثال: 3500"
                                            className={inputClassName}
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ريال</span>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-rose-500 text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="utilitiesMonthly"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    فواتير الخدمات الشهرية (كهرباء، ماء...) <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="مثال: 450"
                                            className={inputClassName}
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ريال</span>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-rose-500 text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* 2. Housing & Accommodations */}
            <div className="bg-slate-50/50 p-4 sm:p-5 rounded-[1.5rem] border border-slate-100/80 shadow-sm">
                <SectionHeader title="الوضع السكني والإيجارات" icon={Home} />
                
                <FormField
                    control={control}
                    name="housingType"
                    render={({ field }) => (
                        <FormItem className="mb-5">
                            <FormLabel className="text-[13px] font-bold text-slate-700 mb-2.5 block">
                                نوع السكن الحالي <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
                                    {[
                                        { val: 0, label: "ملك" },
                                        { val: 1, label: "إيجار" },
                                        { val: 2, label: "استضافة" },
                                        { val: 3, label: "سكن طوارئ" },
                                        { val: 4, label: "أخرى" },
                                    ].map((opt) => {
                                        const isActive = field.value === opt.val;
                                        return (
                                            <div
                                                key={opt.val}
                                                onClick={() => field.onChange(opt.val)}
                                                className={cn(
                                                    "cursor-pointer text-center py-2.5 px-3 rounded-lg border-2 font-bold text-[13px] transition-all duration-200 select-none",
                                                    isActive
                                                        ? "bg-warm-green/10 border-warm-green text-warm-green shadow-[0_2px_10px_rgba(134,181,65,0.1)]"
                                                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50/80"
                                                )}
                                            >
                                                {opt.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </FormControl>
                            <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                    )}
                />

                {/* Show Rent only if housing is Rented (1) */}
                {housingType === 1 && (
                    <FormField
                        control={control}
                        name="rentMonthly"
                        render={({ field }) => (
                            <FormItem className="pt-2 animate-in fade-in slide-in-from-top-2">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    قيمة الإيجار الشهري <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative md:max-w-sm">
                                        <Input
                                            type="number"
                                            placeholder="أدخل قيمة الإيجار"
                                            className={inputClassName}
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ريال</span>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-rose-500 text-xs" />
                            </FormItem>
                        )}
                    />
                )}
            </div>

            {/* 3. Support & Commitments (Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Social Support Block */}
                <div className="bg-slate-50/50 p-4 sm:p-5 rounded-[1.5rem] border border-slate-100/80 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Building2 className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-[14px] font-black text-slate-800">الضمان الاجتماعي</h4>
                        </div>
                        <FormField
                            control={control}
                            name="registeredSocialSupport"
                            render={({ field }) => (
                                <FormItem className="flex items-center m-0 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-blue-500 scale-90"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    {registeredSocialSupport && (
                        <FormField
                            control={control}
                            name="socialSupportAmount"
                            render={({ field }) => (
                                <FormItem className="mt-auto animate-in fade-in zoom-in-95">
                                    <FormLabel className="text-[12px] font-bold text-slate-600">القيمة الشهرية للدعم</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                className={cn(inputClassName, "focus:ring-blue-500/10 focus:border-blue-500/40")}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={e => field.onChange(e.target.valueAsNumber || null)}
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">ريال</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-rose-500" />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {/* Other Commitments Block */}
                <div className="bg-slate-50/50 p-4 sm:p-5 rounded-[1.5rem] border border-slate-100/80 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Receipt className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-[14px] font-black text-slate-800">التزامات وقروض</h4>
                        </div>
                        <FormField
                            control={control}
                            name="hasOtherCommitments"
                            render={({ field }) => (
                                <FormItem className="flex items-center m-0 space-y-0">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-purple-500 scale-90"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    {hasOtherCommitments && (
                        <div className="grid grid-cols-2 gap-3 mt-auto animate-in fade-in zoom-in-95">
                            <FormField
                                control={control}
                                name="otherCommitmentsType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-600">نوع الالتزام</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="قرض، أقساط..."
                                                className={cn(inputClassName, "focus:ring-purple-500/10 focus:border-purple-500/40")}
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-rose-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="otherCommitmentsAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-slate-600">القيمة الشهرية</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className={cn(inputClassName, "focus:ring-purple-500/10 focus:border-purple-500/40 pr-3 pl-10")}
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={e => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">ريال</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-rose-500" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
