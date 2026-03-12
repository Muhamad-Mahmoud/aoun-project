"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/shared/providers";
import { Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";
import { Button } from "@/shared/ui/button";

/**
 * Dashboard Root Page
 * Redirects users to the appropriate dashboard based on their role
 */
export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthContext();
    const [hasRedirected, setHasRedirected] = useState(false);
    const [timeout, setTimeout] = useState(false);

    // Set a timeout to prevent infinite loading - max 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeout(true);
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Prevent multiple redirects
        if (hasRedirected) return;

        // Wait for auth to load
        if (isLoading) return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            logger.warn('Dashboard: Not authenticated, redirecting to login');
            setHasRedirected(true);
            router.push("/login");
            return;
        }

        // If no user data, check for timeout
        if (!user) {
            if (timeout) {
                logger.error('Dashboard: Timeout waiting for user data');
            }
            return;
        }

        // Determine dashboard based on role
        const role = user.role?.toLowerCase() || "";
        logger.debug('Dashboard: User role:', { role, userObject: user });

        // Check if organization/association/charity
        const isOrganization = role.includes('organization') ||
            role.includes('association') ||
            role.includes('charity') ||
            role.includes('org') ||
            role.includes('جمعية') ||
            role.includes('مؤسسة');

        setHasRedirected(true);

        if (isOrganization) {
            logger.debug('Redirecting to organization dashboard');
            router.replace("/dashboard/organization");
        } else {
            logger.debug('Redirecting to family dashboard');
            router.replace("/dashboard/family");
        }
    }, [isLoading, isAuthenticated, user, hasRedirected, timeout, router]);

    if (!isLoading && isAuthenticated && !user && timeout) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 px-6">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">تعذر تحميل بيانات الحساب</h1>
                    <p className="mt-3 text-sm text-slate-500">
                        الجلسة ما زالت موجودة، لكن تعذر جلب بيانات المستخدم الآن. أعد المحاولة بدل التوجيه الخاطئ إلى لوحة غير مناسبة.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <Button onClick={() => router.refresh()}>
                            إعادة المحاولة
                        </Button>
                        <Button variant="outline" onClick={() => router.replace("/")}>
                            العودة للرئيسية
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state while determining redirect
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-slate-500 font-bold">جاري التوجيه...</p>
                {timeout && <p className="text-xs text-red-500">انتظر قليلاً...</p>}
            </div>
        </div>
    );
}
