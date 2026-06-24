"use client";

import React from 'react';
import { DashboardLayout, DashboardTopBar } from '@/shared/components/layout/DashboardLayout';
import { DonorSidebar } from '@/shared/components/layout/DonorSidebar';

export default function DonorLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            <DonorSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <DashboardTopBar userType="donor" />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </DashboardLayout>
    );
}
