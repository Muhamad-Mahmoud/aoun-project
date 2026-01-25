import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthWrapper } from "@/features/auth/components/shared/AuthWrapper";
import { ROUTES } from "@/shared/constants/routes";

export default function LoginPage() {
    return (
        <AuthWrapper
            title="مرحباً بعودتك"
            description="سجل الدخول للمتابعة والوصول إلى لوحة التحكم الخاصة بك"
            footerText="ليس لديك حساب؟"
            footerLinkText="إنشاء حساب جديد"
            footerLinkHref={ROUTES.AUTH.REGISTER}
        >
            <LoginForm />
        </AuthWrapper>
    );
}
