"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { RequestFormData } from "../schemas/requestSchema";
import { cn } from "@/shared/utils";

interface Step3HealthProps {
    control: Control<RequestFormData>;
    hasInsurance: boolean;
    hasDisability: boolean;
    hasChronicDisease: boolean;
}

export function Step3Health({ control, hasInsurance, hasDisability, hasChronicDisease }: Step3HealthProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Insurance Toggle */}
                <FormField
                    control={control}
                    name="hasInsurance"
                    render={({ field }) => {
                        const isSelected = (val: boolean) => field.value === val;
                        return (
                            <FormItem>
                                <FormLabel className="text-[13px] font-bold text-slate-700 mb-3 inline-block">
                                    هل يوجد تأمين طبي؟ <span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                                    <div 
                                        onClick={() => field.onChange(true)}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                            isSelected(true) ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(true) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className={cn("font-bold text-[14px]", isSelected(true) ? "text-emerald-700" : "text-slate-600")}>نعم، يوجد</span>
                                        {isSelected(true) && <svg className="w-4 h-4 text-emerald-500 absolute left-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>

                                    <div 
                                        onClick={() => field.onChange(false)}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                            isSelected(false) ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(false) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                        <span className={cn("font-bold text-[14px]", isSelected(false) ? "text-emerald-700" : "text-slate-600")}>لا يوجد</span>
                                        {isSelected(false) && <svg className="w-4 h-4 text-emerald-500 absolute left-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                </div>
                                <FormMessage className="mt-2" />
                            </FormItem>
                        );
                    }}
                />
                
                {hasInsurance && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-2">
                        <FormField
                            control={control}
                            name="insuranceType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        نوع التأمين الطبي <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="مثل: تأمين صحي شامل، تأمين خاص..."
                                            className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300 placeholder:text-slate-400"
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

                <div className="w-full h-px bg-slate-100 my-6" />

                {/* Disability Toggle */}
                <FormField
                    control={control}
                    name="hasDisability"
                    render={({ field }) => {
                        const isSelected = (val: boolean) => field.value === val;
                        return (
                            <FormItem>
                                <FormLabel className="text-[13px] font-bold text-slate-700 mb-3 inline-block">
                                    هل يوجد أي إعاقة؟ <span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                                    <div 
                                        onClick={() => field.onChange(true)}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                            isSelected(true) ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(true) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className={cn("font-bold text-[14px]", isSelected(true) ? "text-emerald-700" : "text-slate-600")}>نعم، يوجد</span>
                                        {isSelected(true) && <svg className="w-4 h-4 text-emerald-500 absolute left-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>

                                    <div 
                                        onClick={() => field.onChange(false)}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                            isSelected(false) ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(false) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                        <span className={cn("font-bold text-[14px]", isSelected(false) ? "text-emerald-700" : "text-slate-600")}>لا يوجد</span>
                                        {isSelected(false) && <svg className="w-4 h-4 text-emerald-500 absolute left-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                </div>
                                <FormMessage className="mt-2" />
                            </FormItem>
                        );
                    }}
                />
                
                {hasDisability && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-2">
                        <FormField
                            control={control}
                            name="disabilityType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        نوع الإعاقة <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="يرجى توضيح نوع الإعاقة بدقة..."
                                            className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300 placeholder:text-slate-400"
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

                <div className="w-full h-px bg-slate-100 my-6" />

                {/* Chronic Disease Toggle */}
                <FormField
                    control={control}
                    name="hasChronicDisease"
                    render={({ field }) => {
                        const isSelected = (val: boolean) => field.value === val;
                        return (
                            <FormItem>
                                <FormLabel className="text-[13px] font-bold text-slate-700 mb-3 inline-block">
                                    هل يوجد أمراض مزمنة؟ <span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                                    <div 
                                        onClick={() => field.onChange(true)}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                            isSelected(true) ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(true) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className={cn("font-bold text-[14px]", isSelected(true) ? "text-emerald-700" : "text-slate-600")}>نعم، يوجد</span>
                                        {isSelected(true) && <svg className="w-4 h-4 text-emerald-500 absolute left-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>

                                    <div 
                                        onClick={() => field.onChange(false)}
                                        className={cn(
                                            "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                            isSelected(false) ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(false) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                        <span className={cn("font-bold text-[14px]", isSelected(false) ? "text-emerald-700" : "text-slate-600")}>لا يوجد</span>
                                        {isSelected(false) && <svg className="w-4 h-4 text-emerald-500 absolute left-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                </div>
                                <FormMessage className="mt-2" />
                            </FormItem>
                        );
                    }}
                />
                
                {hasChronicDisease && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-2">
                        <FormField
                            control={control}
                            name="chronicDiseaseType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        نوع المرض المزمن <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="مثل: السكري، الضغط، الربو..."
                                            className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300 placeholder:text-slate-400"
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
            </div>

            <div className="w-full h-px bg-slate-100 my-6" />

            {/* Medical Cost */}
            <FormField
                control={control}
                name="medicalCostMonthly"
                render={({ field }) => (
                    <FormItem className="text-start">
                        <FormLabel className="text-[13px] font-bold text-slate-700 mb-2 inline-block">
                            متوسط التكلفة الشهرية للعلاج {hasChronicDisease && <span className="text-red-500 ml-1">*</span>}
                        </FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type="number" className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 pr-14 font-medium transition-all duration-300" {...field} value={field.value ?? ""} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">ج.م</span>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
