"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { RequestFormData } from "../schemas/requestSchema";
import { YesNoToggle } from "../ui/YesNoToggle";

interface Step3HealthProps {
    control: Control<RequestFormData>;
    hasInsurance: boolean;
    hasDisability: boolean;
    hasChronicDisease: boolean;
}

const inputCls = "h-11 rounded-xl border border-border bg-card hover:border-slate-300 focus:ring-2 focus:ring-warm-green/15 focus:border-warm-green/50 shadow-sm px-4 font-medium transition-all placeholder:text-muted-foreground";

export function Step3Health({ control, hasInsurance, hasDisability, hasChronicDisease }: Step3HealthProps) {
    return (
        <div className="space-y-5">

            {/* Insurance */}
            <FormField
                control={control}
                name="hasInsurance"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] font-bold text-foreground mb-2.5 inline-block">
                            هل يوجد تأمين طبي؟ <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <YesNoToggle value={field.value} onChange={field.onChange} />
                        <FormMessage className="mt-2" />
                    </FormItem>
                )}
            />

            {hasInsurance && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormField
                        control={control}
                        name="insuranceType"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-foreground mb-1.5 inline-block">
                                    نوع التأمين الطبي <span className="text-rose-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="مثل: تأمين صحي شامل، تأمين خاص..."
                                        className={inputCls}
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}

            <div className="w-full h-px bg-muted/50" />

            {/* Disability */}
            <FormField
                control={control}
                name="hasDisability"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] font-bold text-foreground mb-2.5 inline-block">
                            هل يوجد أي إعاقة؟ <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <YesNoToggle value={field.value} onChange={field.onChange} />
                        <FormMessage className="mt-2" />
                    </FormItem>
                )}
            />

            {hasDisability && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormField
                        control={control}
                        name="disabilityType"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-foreground mb-1.5 inline-block">
                                    نوع الإعاقة <span className="text-rose-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="يرجى توضيح نوع الإعاقة بدقة..."
                                        className={inputCls}
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}

            <div className="w-full h-px bg-muted/50" />

            {/* Chronic Disease */}
            <FormField
                control={control}
                name="hasChronicDisease"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] font-bold text-foreground mb-2.5 inline-block">
                            هل يوجد أمراض مزمنة؟ <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <YesNoToggle value={field.value} onChange={field.onChange} />
                        <FormMessage className="mt-2" />
                    </FormItem>
                )}
            />

            {hasChronicDisease && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormField
                        control={control}
                        name="chronicDiseaseType"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-foreground mb-1.5 inline-block">
                                    نوع المرض المزمن <span className="text-rose-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="مثل: السكري، الضغط، الربو..."
                                        className={inputCls}
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}

            <div className="w-full h-px bg-muted/50" />

            {/* Medical Cost */}
            <FormField
                control={control}
                name="medicalCostMonthly"
                render={({ field }) => (
                    <FormItem className="text-start">
                        <FormLabel className="text-[13px] font-bold text-foreground mb-1.5 inline-block">
                            متوسط التكلفة الشهرية للعلاج {hasChronicDisease && <span className="text-rose-500 mr-1">*</span>}
                        </FormLabel>
                        <FormControl>
                            <div className="relative max-w-xs">
                                <Input type="number" className={`${inputCls} pl-14`} {...field} value={field.value ?? ""} />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">ج.م</span>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
