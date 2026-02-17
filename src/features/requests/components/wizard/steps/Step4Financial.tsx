"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { RequestFormData } from "../schemas/requestSchema";

interface Step4FinancialProps {
    control: Control<RequestFormData>;
    hasOtherCommitments: boolean;
    registeredSocialSupport: boolean;
    housingType: number;
}

export function Step4Financial({ control, hasOtherCommitments, registeredSocialSupport, housingType }: Step4FinancialProps) {
    const isRent = housingType === 1;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Housing Type */}
                <FormField
                    control={control}
                    name="housingType"
                    render={({ field }) => (
                        <FormItem className="text-start col-span-full">
                            <FormLabel className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <div className="w-1 h-3.5 bg-warm-green rounded-full" />
                                نوع السكن <span className="text-red-500 mr-1">*</span>
                            </FormLabel>
                            <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                value={field.value?.toString() ?? ""}
                            >
                                <SelectTrigger className="rounded-xl h-12">
                                    <SelectValue placeholder="اختر نوع السكن" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">ملك</SelectItem>
                                    <SelectItem value="1">إيجار</SelectItem>
                                    <SelectItem value="2">مستضاف</SelectItem>
                                    <SelectItem value="3">إيواء اضطراري</SelectItem>
                                    <SelectItem value="4">أخرى</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Has Car */}
                <FormField
                    control={control}
                    name="hasCar"
                    render={({ field }) => (
                        <FormItem className="space-y-2 col-span-full">
                            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-bold text-slate-800">
                                    هل تمتلك سيارة؟ <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                            </div>
                            <FormMessage className="px-4" />
                        </FormItem>
                    )}
                />

                {/* Monthly Expenses */}
                <FormField
                    control={control}
                    name="monthlyExpenses"
                    render={({ field }) => (
                        <FormItem className="text-start">
                            <FormLabel className="text-xs font-bold text-slate-700">المصاريف الشهرية الكلية</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="المبلغ بالجنيه" className="rounded-xl h-11" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Monthly Rent */}
                <FormField
                    control={control}
                    name="rentMonthly"
                    render={({ field }) => (
                        <FormItem className="text-start">
                            <FormLabel className="text-xs font-bold text-slate-700">
                                الإيجار الشهري {isRent && <span className="text-red-500 mr-1">*</span>}
                            </FormLabel>
                            <FormControl>
                                <Input type="number" className="rounded-xl h-11" placeholder="المبلغ بالجنيه" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Other Commitments Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <FormField
                    control={control}
                    name="hasOtherCommitments"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-bold text-slate-800">
                                    عليك التزامات أو ديون أخرى؟ <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                            </div>
                            <FormMessage className="px-4" />
                        </FormItem>
                    )}
                />
                
                {hasOtherCommitments && (
                    <div className="flex gap-4 px-4 bg-slate-50 p-4 rounded-xl">
                        <FormField
                            control={control}
                            name="otherCommitmentsType"
                            render={({ field }) => (
                                <FormItem className="flex-1 shrink-0">
                                    <FormLabel className="text-xs font-bold mb-2 block text-slate-700">
                                        نوع الالتزام <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="مثال: دين شخصي"
                                            className="rounded-xl h-10"
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
                            name="otherCommitmentsAmount"
                            render={({ field }) => (
                                <FormItem className="w-32 shrink-0">
                                    <FormLabel className="text-xs font-bold mb-2 block text-slate-700">
                                        المبلغ <span className="text-red-500 mr-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="00"
                                            className="rounded-xl h-10"
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

                {/* Social Support */}
                <FormField
                    control={control}
                    name="registeredSocialSupport"
                    render={({ field }) => (
                        <FormItem className="space-y-2 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-bold text-slate-800">
                                    مسجل في الدعم الاجتماعي؟ <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                            </div>
                            <FormMessage className="px-4" />
                        </FormItem>
                    )}
                />
                {registeredSocialSupport && (
                    <FormField
                        control={control}
                        name="socialSupportAmount"
                        render={({ field }) => (
                            <FormItem className="px-4 bg-slate-50 p-4 rounded-xl">
                                <FormLabel className="text-xs font-bold mb-2 block text-slate-700">
                                    مبلغ الدعم الشهري <span className="text-red-500 mr-1">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="المبلغ بالجنيه"
                                        className="rounded-xl h-10"
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

            {/* Other Aid Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <FormLabel className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-1 h-3.5 bg-warm-green rounded-full" />
                    هل تتلقى مساعدات من جهات أخرى؟ (جمعيات / أفراد)
                </FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                    {/* Provider */}
                    <FormField
                        control={control}
                        name="otherAidProviders"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-700">الجهة المقدمة للمساعدة</FormLabel>
                                <FormControl>
                                    <Input placeholder="اسم الجمعية / الشخص" className="rounded-xl" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Type */}
                    <FormField
                        control={control}
                        name="otherAidType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-700">نوع المساعدة</FormLabel>
                                <FormControl>
                                    <Input placeholder="مالية / عينية / ..." className="rounded-xl" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Amount */}
                    <FormField
                        control={control}
                        name="otherAidAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-700">مبلغ المساعدة (تقريبي)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="00" className="rounded-xl" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
