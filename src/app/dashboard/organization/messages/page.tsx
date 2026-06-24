"use client";

import React from "react";
import { ChatLayout } from "@/features/chat/components/ChatLayout";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";

export default function OrganizationMessagesPage() {
    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50" dir="rtl">
                <DashboardTopBar userType="organization" />
                <main className="flex-1 overflow-hidden p-4 sm:p-6 pb-20 lg:pb-0 flex flex-col">
                    <div className="flex-1 overflow-hidden bg-white rounded-t-2xl border-x border-t border-slate-200 shadow-sm mt-4 lg:mt-0">
                        <ChatLayout />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
