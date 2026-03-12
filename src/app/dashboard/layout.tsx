"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/shared/providers";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const redirect = pathname || "/dashboard";
            router.replace(`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(redirect)}`);
        }
    }, [isLoading, isAuthenticated, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-slate-500 font-bold">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Return null while redirecting to avoid flashing protected content
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    );
}
