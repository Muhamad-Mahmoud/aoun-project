"use client";

import React, { useEffect, useState } from 'react';
import { useAdminData } from '@/features/admin';
import { FileText, Search, Activity, HelpCircle, GraduationCap, Home, Heart, Stethoscope, Coins, CreditCard } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { resolveStatus, statusConfig, categoryConfig, resolveCategory } from '@/features/requests/config/requestConfig';
import Link from 'next/link';

export default function AdminRequestsPage() {
    const { requests, loading, fetchRequests } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Format requests safely
    const formattedRequests = Array.isArray(requests) ? requests.map(req => {
        const statusKey = resolveStatus(req.status);
        const categoryKey = resolveCategory(req.requestType);
        
        return {
            ...req,
            statusLabel: statusConfig[statusKey]?.label || 'غير معروف',
            statusColor: statusConfig[statusKey]?.color || 'bg-slate-100 text-foreground border-border',
            categoryLabel: categoryConfig[categoryKey]?.label || 'عام',
        };
    }) : [];

    const filteredRequests = formattedRequests.filter(req => 
        (req.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (req.categoryLabel?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (req.statusLabel?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">جميع الطلبات</h1>
                    <p className="text-muted-foreground">متابعة كافة طلبات المساعدة المقدمة للنظام</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ابحث في الطلبات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ps-10 h-12 bg-card border-border focus:bg-card rounded-xl"
                    />
                </div>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">الطلب</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">الفئة</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">تاريخ التقديم</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">الحالة</th>
                                <th className="px-6 py-4 text-end text-sm font-black text-muted-foreground">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            جاري التحميل...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground font-bold">لا توجد طلبات مطابقة للبحث.</td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-muted-foreground">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground max-w-xs truncate">
                                                        {req.description || 'طلب مساعدة'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">رقم: {req.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-foreground bg-slate-100 px-3 py-1 rounded-full">
                                                {req.categoryLabel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                            {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${req.statusColor}`}>
                                                {req.statusLabel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            {/* Note: Admin might just view it or manage it depending on features */}
                                            <Link href={`/dashboard/admin/requests/${req.id}`}>
                                                <button className="px-4 py-2 rounded-xl text-sm font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-100 transition-colors">
                                                    عرض التفاصيل
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
