"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAssociationProfile, UpdateAssociationProfileRequest, AssociationProfileDto } from "@/features/associations";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface EditProfileDialogProps {
    profile: AssociationProfileDto;
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
    const { updateProfile } = useAssociationProfile();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [name, setName] = useState(profile.name || "");
    const [capacity, setCapacity] = useState(profile.capacity?.toString() || "");
    const [coverageNotes, setCoverageNotes] = useState(profile.coverageNotes || "");
    const [paymentInstructions, setPaymentInstructions] = useState(profile.paymentInstructions || "");

    useEffect(() => {
        if (open) {
            setName(profile.name || "");
            setCapacity(profile.capacity?.toString() || "");
            setCoverageNotes(profile.coverageNotes || "");
            setPaymentInstructions(profile.paymentInstructions || "");
        }
    }, [open, profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data: UpdateAssociationProfileRequest = {
                name: name.trim(),
                capacity: capacity ? parseInt(capacity) : null,
                coverageNotes: coverageNotes.trim() || null,
                paymentInstructions: paymentInstructions.trim() || null,
            };
            await updateProfile(data);
            toast.success("تم تحديث بيانات الجمعية بنجاح");
            setOpen(false);
        } catch (error) {
            toast.error("حدث خطأ أثناء حفظ التعديلات");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Pencil className="w-4 h-4" />
                    تعديل الملف الشخصي
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl" dir="rtl">
                <DialogHeader>
                    <DialogTitle>تعديل بيانات الجمعية</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-right">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">اسم الجمعية</label>
                        <Input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="أدخل اسم الجمعية"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold">وسائل وطرق الدفع (للتبرعات)</label>
                        <textarea
                            value={paymentInstructions}
                            onChange={(e) => setPaymentInstructions(e.target.value)}
                            placeholder="مثال: فودافون كاش 010... / رقم الحساب البنكي..."
                            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground">ستظهر هذه المعلومات للمتبرعين عند محاولتهم التبرع لأي حملة تابعة لجمعيتكم.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold">الطاقة الاستيعابية للأسر (اختياري)</label>
                        <Input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="عدد الأسر..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold">ملاحظات التغطية الجغرافية (اختياري)</label>
                        <Input
                            value={coverageNotes}
                            onChange={(e) => setCoverageNotes(e.target.value)}
                            placeholder="مثال: تغطي مناطق شمال القاهرة"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
