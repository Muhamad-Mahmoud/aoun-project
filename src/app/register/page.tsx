import React, { Suspense } from "react";
import { AuthWrapper } from "@/features/auth/components/shared/AuthWrapper";
import { ROUTES } from "@/shared/constants/routes";
import { Loader2 } from "lucide-react";
import { RegisterFormContent } from "@/features/auth/components/register/RegisterFormContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "إنشاء حساب جديد | عون",
    description: "ابدأ رحلتك معنا اليوم وساهم في بناء مجتمع أفضل عبر منصة عون",
};

export default function RegisterPage() {
    return (
        <AuthWrapper
            title="إنشاء حساب جديد"
            description="ابدأ رحلتك معنا اليوم وساهم في بناء مجتمع أفضل"
            footerText="لديك حساب بالفعل؟"
            footerLinkText="تسجيل الدخول"
            footerLinkHref={ROUTES.AUTH.LOGIN}
        >
            <Suspense fallback={
                <div className="space-y-12 py-12 text-center flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                    <p className="text-slate-500 font-medium mt-4">جاري تحميل واجهة التسجيل...</p>
                </div>
            }>
                <RegisterFormContent />
            </Suspense>
        </AuthWrapper>
    );
}
