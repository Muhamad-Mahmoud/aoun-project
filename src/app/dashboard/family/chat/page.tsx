"use client";

import React from "react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { ChatWindow } from "@/features/chat/components";

/**
 * Family Dashboard — AI Chat Page
 * Streaming chat powered by SSE with the Gemini AI backend
 */
export default function ChatPage() {
    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden" dir="rtl">
                <DashboardTopBar userType="family" />
                <div className="flex-1 p-4 lg:p-6 min-h-0 overflow-hidden">
                    <ChatWindow />
                </div>
            </div>
        </DashboardLayout>
    );
}
