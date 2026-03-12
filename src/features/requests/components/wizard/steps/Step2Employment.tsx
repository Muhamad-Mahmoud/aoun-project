"use client";

import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { RequestFormData } from "../schemas/requestSchema";
import { cn } from "@/shared/utils";
import { Check } from "lucide-react";
import { YesNoToggle } from "../ui/YesNoToggle";

interface Step2EmploymentProps {
    control: Control<RequestFormData>;
    isWorking: boolean;
}

const inputCls = "h-11 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-warm-green/15 focus:border-warm-green/50 shadow-sm px-4 font-medium transition-all placeholder:text-slate-400";
const selectTriggerCls = "h-11 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:ring-2 focus:ring-warm-green/15 focus:border-warm-green/50 shadow-sm px-4 font-medium transition-all";

export function Step2Employment({ control, isWorking }: Step2EmploymentProps) {
    return (
        <div className="space-y-5">
            {/* Location */}
            <FormField
                control={control}
                name="location"
                render={({ field }) => (
                    <FormItem className="text-start">
                        <FormLabel className="text-[13px] font-bold text-slate-700">
                            المدينة أو الحي السكني <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="مثال: مدينة نصر، القاهرة"
                                className={inputCls}
                                {...field}
                                value={field.value ?? ""}
                            />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-400 mt-1.5">
                            نحتاج لمعرفة منطقة سكنك لتوجيه الطلب لأقرب فرع.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="w-full h-px bg-slate-100" />

            {/* Employment Status */}
            <FormField
                control={control}
                name="isWorking"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[13px] font-bold text-slate-700 mb-2.5 inline-block">
                            ما هي حالتك المهنية الحالية؟ <span className="text-rose-500 mr-1">*</span>
                        </FormLabel>
                        <YesNoToggle
                            value={field.value}
                            onChange={field.onChange}
                            yesLabel="أعمل حالياً"
                            noLabel="لا أعمل"
                        />
                        <FormMessage className="mt-2" />
                    </FormItem>
                )}
            />

            {/* Conditional employment details */}
            {isWorking ? (
                <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                            control={control}
                            name="workingType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        نمط العمل <span className="text-rose-500 mr-1">*</span>
                                    </FormLabel>
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                                        <FormControl>
                                            <SelectTrigger className={selectTriggerCls}>
                                                <SelectValue placeholder="اختر..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                            <SelectItem value="0" className="rounded-lg py-2.5 cursor-pointer">دوام كامل</SelectItem>
                                            <SelectItem value="1" className="rounded-lg py-2.5 cursor-pointer">دوام جزئي</SelectItem>
                                            <SelectItem value="2" className="rounded-lg py-2.5 cursor-pointer">عقد مؤقت</SelectItem>
                                            <SelectItem value="3" className="rounded-lg py-2.5 cursor-pointer">عمل حر</SelectItem>
                                            <SelectItem value="4" className="rounded-lg py-2.5 cursor-pointer">متدرب</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="employmentType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        القطاع <span className="text-rose-500 mr-1">*</span>
                                    </FormLabel>
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                                        <FormControl>
                                            <SelectTrigger className={selectTriggerCls}>
                                                <SelectValue placeholder="اختر..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                            <SelectItem value="0" className="rounded-lg py-2.5 cursor-pointer">قطاع خاص</SelectItem>
                                            <SelectItem value="1" className="rounded-lg py-2.5 cursor-pointer">قطاع حكومي</SelectItem>
                                            <SelectItem value="2" className="rounded-lg py-2.5 cursor-pointer">منظمة غير ربحية</SelectItem>
                                            <SelectItem value="3" className="rounded-lg py-2.5 cursor-pointer">عمل حر/مستقل</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                            control={control}
                            name="jobTitle"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        المسمى الوظيفي <span className="text-rose-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثل: محاسب، عامل..." className={inputCls} {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="company"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        جهة العمل <span className="text-rose-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="اسم الشركة أو المحل" className={inputCls} {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="salaryMonthly"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        الراتب الشهري <span className="text-rose-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" className={cn(inputCls, "pl-14")} {...field} value={field.value ?? ""} />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ج.م</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="yearsAtJob"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        سنوات الخدمة <span className="text-rose-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" className={cn(inputCls, "pl-16")} {...field} value={field.value ?? ""} />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">سنة</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={control}
                        name="workDescription"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    وصف طبيعة العمل <span className="text-rose-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="اشرح ماذا تفعل في عملك بشكل مبسط..."
                                        className="min-h-[100px] rounded-xl p-4 border border-slate-200 focus:ring-2 focus:ring-warm-green/15 focus:border-warm-green/50 transition-all resize-none placeholder:text-slate-400"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="workLocation"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    مكان العمل
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="مثال: وسط البلد، المعادي..." className={inputCls} {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ) : (
                <div className="space-y-4 pt-1">
                    <FormField
                        control={control}
                        name="unEmploymentReason"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    سبب عدم العمل <span className="text-rose-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[100px] rounded-xl p-4 border border-slate-200 focus:ring-2 focus:ring-rose-500/10 focus:border-rose-300 transition-all resize-none placeholder:text-slate-400"
                                        placeholder="اذكر سبب عدم توافر عمل حالياً..."
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="estimatedIncomeMonthly"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    الدخل الشهري المتوقع <span className="text-rose-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative max-w-xs">
                                        <Input type="number" className={cn(inputCls, "pl-14")} {...field} value={field.value ?? ""} />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ج.م</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Job search preferences */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                            control={control}
                            name="isLookingForJob"
                            render={({ field }) => (
                                <FormItem>
                                    <div
                                        onClick={() => field.onChange(!field.value)}
                                        className={cn(
                                            "cursor-pointer flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 select-none",
                                            field.value
                                                ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <div className={cn("w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0", field.value ? "bg-sky-500 border-sky-500 text-white" : "border-slate-300 bg-white")}>
                                            {field.value && <Check className="w-3 h-3" />}
                                        </div>
                                        <FormLabel className="text-sm font-bold cursor-pointer m-0">أرغب في البحث عن وظيفة</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="needsTraining"
                            render={({ field }) => (
                                <FormItem>
                                    <div
                                        onClick={() => field.onChange(!field.value)}
                                        className={cn(
                                            "cursor-pointer flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 select-none",
                                            field.value
                                                ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <div className={cn("w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0", field.value ? "bg-purple-500 border-purple-500 text-white" : "border-slate-300 bg-white")}>
                                            {field.value && <Check className="w-3 h-3" />}
                                        </div>
                                        <FormLabel className="text-sm font-bold cursor-pointer m-0">أحتاج لتدريب مهني</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
