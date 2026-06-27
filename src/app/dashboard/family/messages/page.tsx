"use client";

import React from "react";
import { ChatLayout } from "@/features/chat/components/ChatLayout";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";

export default function FamilyMessagesPage() {
    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-muted" dir="rtl">
                <DashboardTopBar userType="family" />
                <main className="flex-1 overflow-hidden p-4 sm:p-6 pb-0 flex flex-col">
                    <div className="flex-1 overflow-hidden bg-card rounded-t-2xl border-x border-t border-border shadow-sm mt-4 lg:mt-0">
                        <ChatLayout />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
