"use client";

import React, { useEffect } from 'react';
import { useAdminData } from '@/features/admin';
import { Users, Building, FileText, CheckCircle, Clock, XCircle, BrainCircuit, Activity, BarChart3, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
    const { analytics, loading, fetchAnalytics } = useAdminData();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading || !analytics) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium animate-pulse">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    const mainStats = [
        { title: 'إجمالي المستخدمين', value: analytics.totalUsers, icon: Users, trend: "+12%", trendUp: true, color: 'text-primary', bg: 'bg-primary/10' },
        { title: 'إجمالي الجمعيات', value: analytics.totalAssociations, icon: Building, trend: "+4%", trendUp: true, color: 'text-teal-500', bg: 'bg-teal-50' },
        { title: 'إجمالي الطلبات', value: analytics.totalRequests, icon: FileText, trend: "+28%", trendUp: true, color: 'text-primary', bg: 'bg-emerald-50' },
        { title: 'معدل الأتمتة', value: '84%', icon: BrainCircuit, trend: "+2%", trendUp: true, color: 'text-primary', bg: 'bg-primary/10' },
    ];

    const requestStats = [
        { title: 'قيد الانتظار', value: analytics.pendingRequests, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
        { title: 'الطلبات المقبولة', value: analytics.approvedRequests, icon: CheckCircle, color: 'text-primary', bg: 'bg-emerald-50' },
        { title: 'الطلبات المرفوضة', value: analytics.rejectedRequests, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
        { title: 'تم التقييم بـ AI', value: analytics.totalAiAnalyses, icon: Activity, color: 'text-primary', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">مركز تحكم النظام</h1>
                        <p className="text-sm text-muted-foreground mt-1">نظرة عامة ومؤشرات الأداء الرئيسية للمنصة</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-lg border border-border">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        النظام يعمل بكفاءة
                    </span>
                </div>
            </div>

            {/* Main KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, idx) => (
                    <div key={idx} className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${stat.bg} ${stat.color} group-hover:scale-110 duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendUp ? 'bg-primary/10 text-primary' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black text-foreground mb-1">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</h3>
                        <p className="text-sm font-semibold text-muted-foreground">{stat.title}</p>
                    </div>
                ))}
            </div>
            
            {/* Secondary Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Requests Breakdown */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                        <h2 className="text-lg font-bold text-foreground">حالة الطلبات</h2>
                    </div>
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-slate-100">
                        {requestStats.map((stat, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold text-foreground">{stat.title}</span>
                                </div>
                                <span className="font-bold text-foreground">{stat.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                        <h2 className="text-lg font-bold text-foreground">نشاط النظام المباشر</h2>
                    </div>
                    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 h-[340px] flex flex-col relative overflow-hidden">
                        {/* Abstract Mock Chart Visualization */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-8 z-10">
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground mb-1">النمو الأسبوعي</h3>
                                <p className="text-2xl font-black text-foreground">+1,240 <span className="text-sm font-medium text-primary">+15.3%</span></p>
                            </div>
                            <BarChart3 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-2 z-10">
                            {[40, 70, 45, 90, 65, 85, 100, 60, 80, 50, 75, 95].map((height, i) => (
                                <div key={i} className="w-full relative group flex justify-center">
                                    <div 
                                        className="w-full max-w-[32px] bg-emerald-100 rounded-t-sm group-hover:bg-emerald-200 transition-colors relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm"
                                            style={{ height: `${height * 0.7}%` }}
                                        ></div>
                                    </div>
                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded whitespace-nowrap shadow-lg">
                                        القيمة: {height * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs font-bold text-muted-foreground border-t border-border pt-3 z-10">
                            <span>يناير</span>
                            <span>فبراير</span>
                            <span>مارس</span>
                            <span>أبريل</span>
                            <span>مايو</span>
                            <span>يونيو</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
