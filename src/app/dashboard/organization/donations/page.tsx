"use client";

import React, { useEffect, useState } from "react";
import { donationsApi, DonationDto } from "@/features/donations/api/donationsApi";
import { formatRelativeTime } from "@/shared/utils";
import { CheckCircle, Clock, HeartHandshake, PackageOpen } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";

export default function OrganizationDonationsPage() {
    const [donations, setDonations] = useState<DonationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState<number | null>(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setIsLoading(true);
        try {
            const data = await donationsApi.getMyAssociationDonations();
            setDonations(data);
        } catch (error) {
            console.error("Failed to fetch donations", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDonation = async (id: number) => {
        if (!confirm("هل أنت متأكد من استلام هذا التبرع؟ هذا الإجراء سيضيف المبلغ إلى الحملة الخاصة به.")) return;
        
        setIsConfirming(id);
        try {
            await donationsApi.confirmDonation(id);
            setDonations(prev => prev.map(d => d.id === id ? { ...d, status: "Confirmed" } : d));
        } catch (error) {
            console.error("Failed to confirm donation", error);
            alert("حدث خطأ أثناء تأكيد التبرع");
        } finally {
            setIsConfirming(null);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50" dir="rtl">
                    <DashboardTopBar userType="organization" />
                    <main className="flex-1">
                        <div className="flex justify-center items-center h-64">
                            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </main>
                </div>
            </DashboardLayout>
        );
    }

    const pendingDonations = donations.filter(d => d.status === "Pending");
    const confirmedDonations = donations.filter(d => d.status === "Confirmed");

    return (
            <DashboardLayout>
                <OrganizationSidebar />
                <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50" dir="rtl">
                    <DashboardTopBar userType="organization" />
                    <main className="flex-1 lg:pb-8">
                        <div className="space-y-4 md:space-y-6 max-w-6xl mx-auto p-3 sm:p-6 lg:p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 bg-secondary/10 rounded-2xl flex items-center justify-center">
                                        <HeartHandshake className="w-5 h-5 md:w-7 md:h-7 text-secondary" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg md:text-2xl font-black text-slate-900">إدارة التبرعات الواردة</h1>
                                        <p className="text-[11px] md:text-sm text-slate-500 mt-0.5">تابع وتأكد من استلام تبرعات المتبرعين لحملاتك</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 md:gap-4">
                                    <div className="text-center flex-1 md:flex-none px-2 py-2 md:px-4 md:py-3 bg-amber-50 rounded-xl border border-amber-100">
                                        <p className="text-amber-600 text-[10px] md:text-sm font-bold">بانتظار التأكيد</p>
                                        <p className="text-base md:text-xl font-black text-amber-700">{pendingDonations.length}</p>
                                    </div>
                                    <div className="text-center flex-1 md:flex-none px-2 py-2 md:px-4 md:py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <p className="text-emerald-600 text-[10px] md:text-sm font-bold">تم الاستلام</p>
                                        <p className="text-base md:text-xl font-black text-emerald-700">{confirmedDonations.length}</p>
                                    </div>
                                </div>
                            </div>

                            {donations.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <PackageOpen className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد تبرعات حتى الآن</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        لم يتم تسجيل أي تبرعات لحملاتك بعد. سيظهر المتبرعون هنا بمجرد التبرع.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full text-right min-w-[600px]">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-4 md:px-6 py-4 text-sm font-bold text-slate-600 whitespace-nowrap">المتبرع</th>
                                                    <th className="px-4 md:px-6 py-4 text-sm font-bold text-slate-600 whitespace-nowrap">التبرع</th>
                                                    <th className="px-4 md:px-6 py-4 text-sm font-bold text-slate-600 whitespace-nowrap">الحملة</th>
                                                    <th className="px-4 md:px-6 py-4 text-sm font-bold text-slate-600 whitespace-nowrap">التاريخ</th>
                                                    <th className="px-4 md:px-6 py-4 text-sm font-bold text-slate-600 whitespace-nowrap">الحالة / إجراء</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {donations.map((donation) => (
                                                    <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                            <p className="font-bold text-slate-900">{donation.donorName}</p>
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                            {donation.amount ? (
                                                                <p className="font-black text-secondary">{donation.amount} ج.م</p>
                                                            ) : (
                                                                <p className="font-bold text-slate-700">تبرع عيني</p>
                                                            )}
                                                            {donation.inKindItems && (
                                                                <p className="text-xs text-slate-500 mt-1 max-w-[150px] truncate" title={donation.inKindItems}>{donation.inKindItems}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                            <p className="text-sm font-bold text-slate-700 max-w-[200px] truncate" title={donation.campaignTitle}>
                                                                {donation.campaignTitle}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                            <p className="text-sm text-slate-500">{formatRelativeTime(donation.createdAt)}</p>
                                                        </td>
                                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                            {donation.status === "Confirmed" ? (
                                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    تم الاستلام
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-3">
                                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-bold border border-amber-200">
                                                                        <Clock className="w-4 h-4" />
                                                                        بانتظار التأكيد
                                                                    </div>
                                                                    <Button 
                                                                        size="sm" 
                                                                        onClick={() => handleConfirmDonation(donation.id)}
                                                                        disabled={isConfirming === donation.id}
                                                                    >
                                                                        {isConfirming === donation.id ? "جاري التأكيد..." : "تأكيد الاستلام"}
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </DashboardLayout>
    );
}

