"use client";

import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { RequestFormData } from "../schemas/requestSchema";

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
                        <FormLabel className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-1 h-3.5 bg-warm-green rounded-full" />
                            المدينة أو الحي السكني <span className="text-red-500 mr-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="مثال: مدينة نصر، القاهرة"
                                className="rounded-xl h-12"
                                {...field}
                                value={field.value ?? ""}
                            />
                        </FormControl>
                        <FormDescription className="text-[10px]">
                            نحتاج لمعرفة منطقة سكنك الحالية لتوجيه الطلب لاقرب فرع.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Employment Status Checkbox */}
            <FormField
                control={control}
                name="isWorking"
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
                                هل تعمل حالياً؟ <span className="text-red-500 mr-1">*</span>
                            </FormLabel>
                        </div>
                        <FormMessage className="px-4" />
                    </FormItem>
                )}
            />

            {/* Conditional: Employment Details or Unemployment Details */}
            {isWorking ? (
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Working Type */}
                        <FormField
                            control={control}
                            name="workingType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-xs font-bold text-slate-700">
                                        نوع العمل <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="اختر..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">قطاع حكومي</SelectItem>
                                            <SelectItem value="2">قطاع خاص</SelectItem>
                                            <SelectItem value="3">عمل حر</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Employment Type */}
                        <FormField
                            control={control}
                            name="employmentType"
                            render={({ field }) => (
                                <FormItem className="text-start">
                                    <FormLabel className="text-xs font-bold text-slate-700">
                                        طبيعة التوظيف <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString() ?? ""}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="اختر..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">دوام كامل</SelectItem>
                                            <SelectItem value="2">دوام جزئي</SelectItem>
                                            <SelectItem value="3">عقد مؤقت</SelectItem>
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
                                    <FormLabel className="text-xs font-bold text-slate-700">
                                        المسمى الوظيفي <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="مثل: محاسب، عامل..."
                                            className="rounded-xl"
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
                                    <FormLabel className="text-xs font-bold text-slate-700">
                                        جهة العمل <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="اسم الشركة أو المحل"
                                            className="rounded-xl"
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
                                    <FormLabel className="text-xs font-bold text-slate-700">
                                        الراتب الشهري <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" className="rounded-xl" {...field} value={field.value ?? ""} />
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
                                    <FormLabel className="text-xs font-bold text-slate-700">
                                        سنوات الخدمة <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" className="rounded-xl" {...field} value={field.value ?? ""} />
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
                                <FormLabel className="text-xs font-bold text-slate-700">
                                    وصف طبيعة العمل <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="اشرح ماذا تفعل في عملك..."
                                        className="rounded-xl min-h-[80px]"
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
                                <FormLabel className="text-xs font-bold text-slate-700">
                                    سبب عدم العمل <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="rounded-xl"
                                        placeholder="اذكر سبب عدم توافر عمل حالياً"
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
                                <FormLabel className="text-xs font-bold text-slate-700">
                                    الدخل الشهري المتوقع <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type="number" className="rounded-xl" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Job Search Preferences */}
                    <div className="flex gap-6 p-4 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                        <FormField
                            control={control}
                            name="isLookingForJob"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={!!field.value}
                                            onCheckedChange={(checked) => field.onChange(checked === true)}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-xs font-bold cursor-pointer">أبحث عن وظيفة</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="needsTraining"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={!!field.value}
                                            onCheckedChange={(checked) => field.onChange(checked === true)}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-xs font-bold cursor-pointer">أحتاج لتدريب مهني</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
