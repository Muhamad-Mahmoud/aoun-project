import React from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";

interface DashboardSkeletonProps {
    sidebar: React.ReactNode;
    userType: "family" | "organization" | "admin";
}

export function DashboardSkeleton({ sidebar, userType }: DashboardSkeletonProps) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
            {sidebar}
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto w-full">
                <DashboardTopBar userType={userType} />
                <main className="page-section animate-in fade-in duration-700">
                    {/* Header */}
                    <div className="mb-6 space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-5 w-96" />
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-2xl" shimmer />
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid gap-6 lg:grid-cols-12 mt-10">
                        {/* Main Area */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Charts Wrapper */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-[350px] rounded-3xl" shimmer />
                            </div>
                            
                            {/* Data/Table Wrapper */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-20 rounded-2xl" shimmer />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar/Secondary Area */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-[250px] rounded-3xl" shimmer />
                            </div>
                            
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-[400px] rounded-3xl" shimmer />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
