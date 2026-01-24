"use client";

import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { RequestHistoryTable } from "@/features/dashboard/components/RequestHistoryTable";
import { FileText, Clock, CheckCircle } from "lucide-react";
import React, { useState } from "react";

export default function FamilyRequestsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const mockRequests = [
        {
            id: "REQ-2024-001",
            title: "مساعدة في علاج طبي",
            description: "طلب مساعدة لإجراء عملية جراحية بالعين",
            category: "Health",
            status: "approved",
            amount: "٥٠٠٠ ج.م",
            date: "١٥ يناير ٢٠٢٤"
        }
    ];

    const categoryIcons = {
        "Health": Clock,
        "Food": FileText,
        "Education": CheckCircle
    };

    const statusConfig = {
        "approved": { label: "تمت الموافقة", color: "text-green-600 bg-green-50" },
        "pending": { label: "قيد المراجعة", color: "text-orange-600 bg-orange-50" },
        "rejected": { label: "مرفوض", color: "text-red-600 bg-red-50" }
    };

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <DashboardTopBar userType="family" />
                <main className="p-8">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">طلباتي</h1>
                            <p className="text-muted-foreground">تابع حالة طلباتك الحالية والسابقة.</p>
                        </div>

                        <RequestHistoryTable
                            requests={mockRequests}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            categoryIcons={categoryIcons}
                            statusConfig={statusConfig}
                        />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
