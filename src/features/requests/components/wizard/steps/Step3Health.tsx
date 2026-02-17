"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { RequestFormData } from "../schemas/requestSchema";

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
                {/* Insurance */}
                <FormField
                    control={control}
                    name="hasInsurance"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-bold">
                                    هل يوجد تأمين طبي؟ <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                            </div>
                            <FormMessage className="px-4" />
                        </FormItem>
                    )}
                />
                {hasInsurance && (
                    <FormField
                        control={control}
                        name="insuranceType"
                        render={({ field }) => (
                            <FormItem className="text-start px-4">
                                <FormLabel className="text-sm font-bold">
                                    نوع التأمين <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="نوع التأمين"
                                        className="rounded-xl"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Disability */}
                <FormField
                    control={control}
                    name="hasDisability"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-bold">
                                    هل يوجد إعاقة؟ <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                            </div>
                            <FormMessage className="px-4" />
                        </FormItem>
                    )}
                />
                {hasDisability && (
                    <FormField
                        control={control}
                        name="disabilityType"
                        render={({ field }) => (
                            <FormItem className="text-start px-4">
                                <FormLabel className="text-sm font-bold">
                                    نوع الإعاقة <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="نوع الإعاقة"
                                        className="rounded-xl"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Chronic Disease */}
                <FormField
                    control={control}
                    name="hasChronicDisease"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-bold">
                                    هل يوجد مرض مزمن؟ <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                            </div>
                            <FormMessage className="px-4" />
                        </FormItem>
                    )}
                />
                {hasChronicDisease && (
                    <FormField
                        control={control}
                        name="chronicDiseaseType"
                        render={({ field }) => (
                            <FormItem className="text-start px-4">
                                <FormLabel className="text-sm font-bold">
                                    نوع المرض <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="نوع المرض"
                                        className="rounded-xl"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>

            {/* Medical Cost */}
            <FormField
                control={control}
                name="medicalCostMonthly"
                render={({ field }) => (
                    <FormItem className="text-start px-4">
                        <FormLabel className="text-sm font-bold text-slate-700">
                            تكلفة العلاج الشهرية {hasChronicDisease && <span className="text-red-500 mr-1">*</span>}
                        </FormLabel>
                        <FormControl>
                            <Input type="number" className="rounded-xl" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
