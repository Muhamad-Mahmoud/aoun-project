"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateFamilyProfile } from "../api/familiesApi";
import type { FamilyProfile } from "../types";
import { Button } from "@/shared/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

const profileSchema = z.object({
    firstName: z.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
    lastName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح"),
    country: z.string().min(2, "الدولة مطلوبة"),
    governorate: z.string().min(2, "المحافظة مطلوبة"),
    city: z.string().min(2, "المدينة مطلوبة"),
    neighborhood: z.string().min(2, "الحي مطلوب"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface FamilyProfileFormProps {
    initialData: FamilyProfile;
    onCancel: () => void;
    onSuccess: (updatedProfile: FamilyProfile) => void;
}

export function FamilyProfileForm({ initialData, onCancel, onSuccess }: FamilyProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: initialData.firstName,
            lastName: initialData.lastName,
            phone: initialData.phone,
            country: initialData.country,
            governorate: initialData.governorate,
            city: initialData.city,
            neighborhood: initialData.neighborhood,
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSubmitting(true);
        try {
            const updated = await updateFamilyProfile({
                ...data,
                headNationalId: initialData.headNationalId,
                email: initialData.email,
            });
            toast.success("تم تحديث الملف الشخصي بنجاح");
            onSuccess(updated);
        } catch (error) {
            logger.error("Failed to update profile:", error);
            toast.error("فشل تحديث الملف الشخصي");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم الأول</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>اسم العائلة</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>رقم الهاتف</FormLabel>
                                <FormControl>
                                    <Input {...field} dir="ltr" className="text-right" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الدولة</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="governorate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>المحافظة</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>المدينة</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الحي / المنطقة</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                حفظ التغييرات
                            </>
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        <X className="mr-2 h-4 w-4" />
                        إلغاء
                    </Button>
                </div>
            </form>
        </Form>
    );
}
