"use client";

import React, { useEffect } from 'react';
import { useDonations } from '@/features/donations';
import { Heart, Clock, CheckCircle2, PackageOpen } from 'lucide-react';
import Link from 'next/link';

export default function DonorDashboardPage() {
    const { loading, myDonations, fetchMyDonations } = useDonations();

    useEffect(() => {
        fetchMyDonations();
    }, [fetchMyDonations]);

    const totalMoney = myDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const inKindCount = myDonations.filter(d => d.inKindItems).length;

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">مرحباً بك يا فاعل الخير</h1>
                <p className="text-slate-500">متابعة تبرعاتك وحملات الخير التي شاركت فيها.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Heart className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-bold mb-1">إجمالي التبرعات المالية</p>
                    <h3 className="text-3xl font-black text-slate-900">{totalMoney.toLocaleString()} <span className="text-lg">ج.م</span></h3>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <PackageOpen className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-bold mb-1">مرات التبرع العيني</p>
                    <h3 className="text-3xl font-black text-slate-900">{inKindCount} <span className="text-lg">مرة</span></h3>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">سجل التبرعات</h2>
                    <Link href="/explore" className="text-sm font-bold text-primary hover:underline">
                        تصفح حملات جديدة
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : myDonations.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                        <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">لم تقم بأي تبرعات بعد</h3>
                        <p className="text-slate-500">ابدأ الآن بدعم الأسر المتعففة عبر حملات الجمعيات.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myDonations.map(donation => (
                            <div key={donation.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${donation.amount ? 'bg-primary/10 text-primary' : 'bg-amber-50 text-amber-600'}`}>
                                        {donation.amount ? <span className="font-bold">ج.م</span> : <PackageOpen className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">{donation.campaignTitle}</h4>
                                        <p className="text-sm text-slate-500">
                                            {donation.amount ? `تبرع مالي بقيمة ${donation.amount.toLocaleString()} ج.م` : `تبرع عيني: ${donation.inKindItems}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    {donation.status === 'Confirmed' ? (
                                        <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold">
                                            <CheckCircle2 className="w-4 h-4" /> تم التأكيد
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold">
                                            <Clock className="w-4 h-4" /> قيد التأكيد
                                        </span>
                                    )}
                                    <p className="text-xs text-slate-400 mt-2 font-medium">
                                        {new Date(donation.createdAt).toLocaleDateString('ar-EG')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
