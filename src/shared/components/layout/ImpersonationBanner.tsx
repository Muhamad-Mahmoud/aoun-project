"use client";

import React, { useEffect, useState } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function ImpersonationBanner() {
    const { login } = useAuth();
    const router = useRouter();
    const [isImpersonating, setIsImpersonating] = useState(false);

    useEffect(() => {
        // Check if there is an original_admin_token in localStorage
        const adminToken = localStorage.getItem('original_admin_token');
        if (adminToken) {
            setIsImpersonating(true);
        }
    }, []);

    const handleReturnToAdmin = async () => {
        const adminToken = localStorage.getItem('original_admin_token');
        if (adminToken) {
            try {
                // Clear the impersonation state
                localStorage.removeItem('original_admin_token');
                setIsImpersonating(false);
                
                // Log back in as the admin
                await login(adminToken);
                
                // Redirect to admin dashboard
                router.push('/dashboard/admin');
            } catch (error) {
                console.error("Failed to return to admin", error);
            }
        }
    };

    if (!isImpersonating) return null;

    return (
        <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-4 text-sm font-bold shadow-md z-[100] relative" dir="rtl">
            <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>أنت الآن تتصفح النظام بصلاحيات حساب آخر (وضع الإنابة)</span>
            </div>
            <button 
                onClick={handleReturnToAdmin}
                className="bg-black/20 hover:bg-black/30 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-2"
            >
                العودة لمدير النظام
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}
