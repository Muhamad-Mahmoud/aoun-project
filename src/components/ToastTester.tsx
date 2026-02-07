"use client";

import { Button } from "@/shared/ui/button";
import { toast } from "sonner";

export default function ToastTester() {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-4 bg-white shadow-xl rounded-xl border border-gray-200">
            <h3 className="font-bold text-center mb-2">اختبار الإشعارات</h3>
            <Button
                onClick={() => toast.success("تم العملية بنجاح", { description: "هذا نص تجريبي للتأكد من الشكل" })}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
                نجاح
            </Button>
            <Button
                onClick={() => toast.error("حدث خطأ ما", { description: "البريد الإلكتروني مستخدم بالفعل، يرجى تسجيل الدخول" })}
                variant="destructive"
            >
                خطأ (تجربة المشكلة)
            </Button>
            <Button
                onClick={() => toast.warning("تنبيه هام", { description: "يرجى الانتباه لهذه الملحوظة" })}
                className="bg-amber-500 hover:bg-amber-600 text-white"
            >
                تحذير
            </Button>
            <Button
                onClick={() => toast.info("معلومة جديدة", { description: "تم تحديث البيانات بنجاح" })}
                className="bg-blue-500 hover:bg-blue-600 text-white"
            >
                معلومة
            </Button>
        </div>
    );
}
