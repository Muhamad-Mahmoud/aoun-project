"use client";

import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { RequestFormData } from "../schemas/requestSchema";
import { cn } from "@/shared/utils";
import { Check } from "lucide-react";

interface Step2EmploymentProps {
    control: Control<RequestFormData>;
    isWorking: boolean;
}

export function Step2Employment({ control, isWorking }: Step2EmploymentProps) {
    return (
        <div className="space-y-6">
            {/* Residential Location - Always visible */}
            <FormField
                control={control}
                name="location"
                render={({ field }) => (
                    <FormItem className="text-start">
                        <FormLabel className="text-[13px] font-bold text-slate-700">
                            المدينة أو الحي السكني <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="مثال: مدينة نصر، القاهرة"
                                className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300 placeholder:text-slate-400"
                                {...field}
                                value={field.value ?? ""}
                            />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-400 mt-2 font-medium">
                            نحتاج لمعرفة منطقة سكنك الحالية لتوجيه الطلب لأقرب فرع لضمان سرعة الوصول.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="w-full h-px bg-slate-100 my-8" />

            {/* Employment Status Toggle Card */}
            <FormField
                control={control}
                name="isWorking"
                render={({ field }) => {
                    const isSelected = (val: boolean) => field.value === val;
                    return (
                        <FormItem>
                            <FormLabel className="text-[13px] font-bold text-slate-700 mb-3 inline-block">
                                ما هي حالتك المهنية الحالية؟ <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                                {/* Yes Option */}
                                <div 
                                    onClick={() => field.onChange(true)}
                                    className={cn(
                                        "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                        isSelected(true) 
                                            ? "border-emerald-500 bg-emerald-50/50 shadow-sm" 
                                            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                    )}
                                >
                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(true) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                    </div>
                                    <span className={cn("font-bold text-[14px]", isSelected(true) ? "text-emerald-700" : "text-slate-600")}>أعمل حالياً</span>
                                    {isSelected(true) && <Check className="w-4 h-4 text-emerald-500 absolute left-4" strokeWidth={3} />}
                                </div>

                                {/* No Option */}
                                <div 
                                    onClick={() => field.onChange(false)}
                                    className={cn(
                                        "cursor-pointer rounded-xl border-2 px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all duration-300 relative group",
                                        isSelected(false) 
                                            ? "border-emerald-500 bg-emerald-50/50 shadow-sm" 
                                            : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                    )}
                                >
                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0", isSelected(false) ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-400 group-hover:bg-white")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    </div>
                                    <span className={cn("font-bold text-[14px]", isSelected(false) ? "text-emerald-700" : "text-slate-600")}>لا أعمل</span>
                                    {isSelected(false) && <Check className="w-4 h-4 text-emerald-500 absolute left-4" strokeWidth={3} />}
                                </div>
                            </div>
                            <FormMessage className="mt-2" />
                        </FormItem>
                    );
                }}
            />

            {/* Conditional: Employment Details or Unemployment Details */}
            {isWorking ? (
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Working Type: Job Schedule */}
                        <FormField
                            control={control}
                            name="workingType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        نمط العمل <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300">
                                                <SelectValue placeholder="اختر..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                            <SelectItem value="0" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">دوام كامل</SelectItem>
                                            <SelectItem value="1" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">دوام جزئي</SelectItem>
                                            <SelectItem value="2" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">عقد مؤقت</SelectItem>
                                            <SelectItem value="3" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">عمل حر</SelectItem>
                                            <SelectItem value="4" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">متدرب</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Employment Type: Sector */}
                        <FormField
                            control={control}
                            name="employmentType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        القطاع <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300">
                                                <SelectValue placeholder="اختر..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                            <SelectItem value="0" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">قطاع خاص</SelectItem>
                                            <SelectItem value="1" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">قطاع حكومي</SelectItem>
                                            <SelectItem value="2" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">منظمة غير ربحية</SelectItem>
                                            <SelectItem value="3" className="rounded-xl py-3 focus:bg-warm-green/10 focus:text-warm-green cursor-pointer">عمل حر/مستقل</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Job Title */}
                        <FormField
                            control={control}
                            name="jobTitle"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        المسمى الوظيفي <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="مثل: محاسب، عامل..."
                                            className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Company */}
                        <FormField
                            control={control}
                            name="company"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        جهة العمل <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="اسم الشركة أو المحل"
                                            className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Monthly Salary */}
                        <FormField
                            control={control}
                            name="salaryMonthly"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        الراتب الشهري المتوقع <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 pr-14 font-medium transition-all duration-300" {...field} value={field.value ?? ""} />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">ج.م</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Years at Job */}
                        <FormField
                            control={control}
                            name="yearsAtJob"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-[13px] font-bold text-slate-700">
                                        سنوات الخدمة <span className="text-red-500 ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 pr-16 font-medium transition-all duration-300" {...field} value={field.value ?? ""} />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">سنة</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Work Description */}
                    <FormField
                        control={control}
                        name="workDescription"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    وصف طبيعة العمل <span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="اشرح ماذا تفعل في عملك بشكل مبسط..."
                                        className="min-h-[120px] rounded-[1.5rem] p-6 border-0 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:ring-4 focus:ring-warm-green/10 shadow-inner font-medium transition-all duration-300"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Work Location */}
                    <FormField
                        control={control}
                        name="workLocation"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    مكان العمل
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="مثال: وسط البلد، المعادي..."
                                        className="h-12 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-warm-green/10 focus:border-warm-green/40 shadow-sm px-4 font-medium transition-all duration-300"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ) : (
                <div className="space-y-4 pt-2">
                    {/* Unemployment Reason */}
                    <FormField
                        control={control}
                        name="unEmploymentReason"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    سبب عدم العمل <span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="min-h-[120px] rounded-[1.5rem] p-6 border-0 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:ring-4 focus:ring-red-500/10 shadow-inner font-medium transition-all duration-300"
                                        placeholder="اذكر سبب عدم توافر عمل حالياً لتساعدنا في فهم حالتك..."
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Estimated Income */}
                    <FormField
                        control={control}
                        name="estimatedIncomeMonthly"
                        render={({ field }) => (
                            <FormItem className="text-start">
                                <FormLabel className="text-[13px] font-bold text-slate-700">
                                    الدخل الشهري المتوقع <span className="text-red-500 ml-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="number" className="h-14 rounded-2xl border-0 bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:ring-4 focus:ring-red-500/10 shadow-inner px-5 pr-14 font-medium transition-all duration-300" {...field} value={field.value ?? ""} />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">ج.م</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Job Search Preferences (Styled as big buttons) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <FormField
                            control={control}
                            name="isLookingForJob"
                            render={({ field }) => (
                                <FormItem>
                                    <div 
                                        onClick={() => field.onChange(!field.value)}
                                        className={cn(
                                            "cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                                            field.value 
                                                ? "border-sky-500 bg-sky-500/5 text-sky-700 shadow-sm"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all", field.value ? "bg-sky-500 border-sky-500 text-white" : "border-slate-300 bg-white")}>
                                            {field.value && <Check className="w-4 h-4" />}
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
                                            "cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
                                            field.value 
                                                ? "border-purple-500 bg-purple-500/5 text-purple-700 shadow-sm"
                                                : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all", field.value ? "bg-purple-500 border-purple-500 text-white" : "border-slate-300 bg-white")}>
                                            {field.value && <Check className="w-4 h-4" />}
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
