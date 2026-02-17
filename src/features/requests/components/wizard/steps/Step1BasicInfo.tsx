"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/utils";
import { RequestFormData } from "../schemas/requestSchema";
import { RequestCategory } from "../types";

interface Step1BasicInfoProps {
    control: Control<RequestFormData>;
    selectedRequestType: number;
    categories: RequestCategory[];
}

export function Step1BasicInfo({ control, selectedRequestType, categories }: Step1BasicInfoProps) {
    return (
        <div className="space-y-8">
            {/* Request Type Selection */}
            <FormField
                control={control}
                name="requestType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <div className="w-1 h-3.5 bg-warm-green rounded-full" />
                            تصنيف المساعدة <span className="text-red-500 mr-1">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.value}
                                    onClick={() => field.onChange(cat.value)}
                                    className={cn(
                                        "relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 text-center flex flex-col items-center",
                                        selectedRequestType === cat.value
                                            ? `${cat.border} ${cat.bg} shadow-md`
                                            : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
                                        <cat.icon
                                            className={cn(
                                                "w-5 h-5",
                                                selectedRequestType === cat.value ? cat.color : "text-slate-300"
                                            )}
                                        />
                                    </div>
                                    <p
                                        className={cn(
                                            "font-bold text-[11px]",
                                            selectedRequestType === cat.value ? "text-slate-900" : "text-slate-400"
                                        )}
                                    >
                                        {cat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Other Request Type (conditional) */}
            {selectedRequestType === 6 && (
                <FormField
                    control={control}
                    name="otherRequestType"
                    render={({ field }) => (
                        <FormItem className="text-start">
                            <FormLabel className="text-xs font-bold text-slate-700">
                                نوع المساعدة الأخرى <span className="text-red-500 mr-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="وصف موجز..."
                                    className="rounded-xl min-h-[80px]"
                                    {...field}
                                    value={field.value ?? ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {/* Description */}
            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem className="text-start">
                        <FormLabel className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-1 h-3.5 bg-warm-green rounded-full" />
                            شرح الحالة بالتفصيل <span className="text-red-500 mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="اشرح حالتك هنا بالتفصيل (متى بدأت المشكلة، ما هي الاحتياجات الأساسية، إلخ...)"
                                className="min-h-[150px] text-base rounded-2xl p-5 border-slate-100 bg-slate-50/30 font-medium"
                                {...field}
                                value={field.value ?? ""}
                            />
                        </FormControl>
                        <div className="text-left text-[10px] text-slate-400 mt-1">
                            {(field.value?.length || 0)} / 2000 حرف
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
