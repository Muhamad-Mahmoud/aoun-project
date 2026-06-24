"use client";

import React, { useEffect } from 'react';
import { useAdminData } from '@/features/admin';
import { Users, Building, FileText, CheckCircle, Clock, XCircle, BrainCircuit } from 'lucide-react';

export default function AdminDashboardPage() {
    const { analytics, loading, fetchAnalytics } = useAdminData();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading || !analytics) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const statCards = [
        { title: 'إجمالي المستخدمين', value: analytics.totalUsers, icon: Users, color: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'إجمالي الجمعيات', value: analytics.totalAssociations, icon: Building, color: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'إجمالي الطلبات', value: analytics.totalRequests, icon: FileText, color: 'bg-violet-500', text: 'text-violet-500', bg: 'bg-violet-500/10' },
        { title: 'الطلبات المكتملة (AI)', value: analytics.totalAiAnalyses, icon: BrainCircuit, color: 'bg-fuchsia-500', text: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
        { title: 'قيد الانتظار', value: analytics.pendingRequests, icon: Clock, color: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10' },
        { title: 'الطلبات المقبولة', value: analytics.approvedRequests, icon: CheckCircle, color: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'الطلبات المرفوضة', value: analytics.rejectedRequests, icon: XCircle, color: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">لوحة التحكم</h1>
                <p className="text-slate-500">نظرة عامة على إحصائيات النظام بالكامل</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-bold mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-black text-slate-900">{stat.value.toLocaleString()}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.text}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <ActivityIcon className="w-5 h-5 text-primary" />
                    نشاط النظام
                </h2>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <p className="text-slate-400 font-bold">منطقة مخصصة للرسوم البيانية (Charts) قريباً...</p>
                </div>
            </div>
        </div>
    );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
