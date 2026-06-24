"use client";

import React from "react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { ChatWindow } from "@/features/chat/components";
import { useRouter } from "next/navigation";

/**
 * Organization Dashboard — AI Chat Page
 * Streaming chat powered by SSE with the AI backend
 */
export default function OrganizationChatPage() {
    const router = useRouter();

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            
            {/* Mobile: 100% Full Screen Immersive Chat (No Scroll) */}
            <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden" dir="rtl">
                <ChatWindow 
                    className="w-full h-full rounded-none border-none shadow-none" 
                    onClose={() => router.push('/dashboard/organization')}
                />
            </div>

            {/* Desktop: Standard Layout */}
            <div className="hidden lg:flex flex-1 flex-col min-h-0 overflow-hidden bg-slate-50" dir="rtl">
                <DashboardTopBar userType="organization" />
                <div className="flex-1 p-6 min-h-0 overflow-hidden flex flex-col">
                    <ChatWindow className="w-full h-full rounded-2xl border border-slate-200 shadow-lg" />
                </div>
            </div>
        </DashboardLayout>
    );
}
