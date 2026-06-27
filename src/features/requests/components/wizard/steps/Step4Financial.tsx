import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { RequestFormData } from "../schemas/requestSchema";
import { Wallet, Receipt, Home, Building2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { SectionCard } from "../ui/SectionCard";

interface Step4FinancialProps {
    control: Control<RequestFormData>;
    registeredSocialSupport: boolean;
    housingType: string;
    hasOtherCommitments: boolean;
}

const inputCls = "h-11 rounded-xl border border-border bg-card hover:border-slate-300 focus:ring-2 focus:ring-warm-green/15 focus:border-warm-green/50 shadow-sm transition-all px-4 text-[14px] font-medium placeholder:text-muted-foreground";

export function Step4Financial({ control, registeredSocialSupport, housingType, hasOtherCommitments }: Step4FinancialProps) {
    return (
        <div className="space-y-5">

            {/* 1. Basic Expenses */}
            <SectionCard title="المصروفات الأساسية" icon={Wallet}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="monthlyExpenses"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[13px] font-bold text-foreground">
                                    إجمالي المصاريف الشهرية <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="number" placeholder="مثال: 3500" className={inputCls} {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">جنيه</span>
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
                                <FormLabel className="text-[13px] font-bold text-foreground">
                                    فواتير الخدمات الشهرية <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="number" placeholder="مثال: 450" className={inputCls} {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">جنيه</span>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-rose-500 text-xs" />
                            </FormItem>
                        )}
                    />
                </div>
            </SectionCard>

            {/* 2. Housing */}
            <SectionCard title="الوضع السكني" icon={Home}>
                <FormField
                    control={control}
                    name="housingType"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel className="text-[13px] font-bold text-foreground mb-2 block">
                                نوع السكن <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { val: "Owned", label: "ملك" },
                                        { val: "Rented", label: "إيجار" },
                                        { val: "Provided", label: "استضافة/إيواء" },
                                        { val: "Other", label: "أخرى" },
                                    ].map((opt) => {
                                        const isActive = field.value === opt.val;
                                        return (
                                            <div
                                                key={opt.val}
                                                onClick={() => field.onChange(opt.val)}
                                                className={cn(
                                                    "cursor-pointer py-2 px-4 rounded-lg border-2 font-bold text-[13px] transition-all duration-200 select-none",
                                                    isActive
                                                        ? "bg-warm-green/10 border-warm-green text-warm-green"
                                                        : "bg-card border-border text-muted-foreground hover:border-slate-300 hover:bg-muted"
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

                {housingType === "Rented" && (
                    <FormField
                        control={control}
                        name="rentMonthly"
                        render={({ field }) => (
                            <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <FormLabel className="text-[13px] font-bold text-foreground">
                                    قيمة الإيجار الشهري <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative max-w-xs">
                                        <Input type="number" placeholder="أدخل قيمة الإيجار" className={inputCls} {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">جنيه</span>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-rose-500 text-xs" />
                            </FormItem>
                        )}
                    />
                )}
            </SectionCard>

            {/* 3. Support & Commitments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Social Support Block */}
                <SectionCard icon={Building2} iconColor="text-teal-500" iconBg="bg-teal-500/10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[14px] font-black text-foreground">الضمان الاجتماعي</span>
                        <FormField
                            control={control}
                            name="registeredSocialSupport"
                            render={({ field }) => (
                                <FormItem className="flex items-center m-0 space-y-0">
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-teal-500" />
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
                                <FormItem className="animate-in fade-in zoom-in-95">
                                    <FormLabel className="text-[12px] font-bold text-muted-foreground">القيمة الشهرية للدعم</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" placeholder="0" className={cn(inputCls, "focus:ring-teal-500/10 focus:border-teal-500/40")} {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || null)} />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">جنيه</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-rose-500" />
                                </FormItem>
                            )}
                        />
                    )}
                </SectionCard>

                {/* Commitments Block */}
                <SectionCard icon={Receipt} iconColor="text-primary" iconBg="bg-primary/100/10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[14px] font-black text-foreground">التزامات وقروض</span>
                        <FormField
                            control={control}
                            name="hasOtherCommitments"
                            render={({ field }) => (
                                <FormItem className="flex items-center m-0 space-y-0">
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary/100" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {hasOtherCommitments && (
                        <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95">
                            <FormField
                                control={control}
                                name="otherCommitmentsType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12px] font-bold text-muted-foreground">نوع الالتزام</FormLabel>
                                        <FormControl>
                                            <Input placeholder="قرض، أقساط..." className={cn(inputCls, "focus:ring-amber-500/10 focus:border-amber-500/40")} {...field} value={field.value ?? ""} />
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
                                        <FormLabel className="text-[12px] font-bold text-muted-foreground">القيمة الشهرية</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" placeholder="0" className={cn(inputCls, "focus:ring-amber-500/10 focus:border-amber-500/40 pl-10")} {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber || null)} />
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground">جنيه</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-rose-500" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}
