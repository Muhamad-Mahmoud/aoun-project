"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/shared/providers";
import { Loader2 } from "lucide-react";

/**
 * Dashboard Root Page
 * Redirects users to the appropriate dashboard based on their role
 */
export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthContext();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        // Prevent multiple redirects
        if (hasRedirected) return;

        // Wait for auth to load
        if (isLoading) return;

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            setHasRedirected(true);
            router.push("/login");
            return;
        }

        // If no user data, wait
        if (!user) return;

        // Determine dashboard based on role
        const role = user.role?.toLowerCase() || "";

        // Check if organization/association/charity
        const isOrganization = role.includes('organization') ||
            role.includes('association') ||
            role.includes('charity') ||
            role.includes('org') ||
            role.includes('جمعية') ||
            role.includes('مؤسسة');

        setHasRedirected(true);

        if (isOrganization) {
            router.replace("/dashboard/organization");
        } else {
            router.replace("/dashboard/family");
        }
    }, [isLoading, isAuthenticated, user, hasRedirected]);

    // Show loading state while determining redirect
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-slate-500 font-bold">جاري التوجيه...</p>
            </div>
        </div>
    );
}
