"use client";

import React, { useEffect, useState } from 'react';
import { useAdminData } from '@/features/admin';
import { adminApi } from '@/features/admin/api/adminApi';
import { Building2, XCircle, CheckCircle2, Search, Activity, LogIn } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { useAuthContext } from '@/shared/providers';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminAssociationsPage() {
    const { associations, loading, fetchAssociations, toggleAssociationStatus } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    const { login, token } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        fetchAssociations();
    }, [fetchAssociations]);

    const filteredAssociations = associations.filter(assoc => 
        assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assoc.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        const action = currentStatus ? 'حظر' : 'تفعيل';
        if (confirm(`هل أنت متأكد أنك تريد ${action} هذه الجمعية؟`)) {
            await toggleAssociationStatus(id);
            toast.success(`تم ${action} الجمعية بنجاح`);
        }
    };

    const handleImpersonate = async (userId: string | undefined, assocName: string) => {
        if (!userId) {
            toast.error('لا يوجد حساب مستخدم مرتبط بهذه الجمعية');
            return;
        }

        try {
            toast.loading('جاري تسجيل الدخول...');
            const response = await adminApi.impersonateUser(userId);
            
            // Backup current admin token if not already impersonating
            if (!localStorage.getItem('original_admin_token') && token) {
                localStorage.setItem('original_admin_token', token);
            }
            
            await login(response.token, response.refreshToken, response.user);
            toast.dismiss();
            toast.success(`تم تسجيل الدخول كجمعية ${assocName}`);
            
            router.push('/dashboard');
        } catch (error) {
            toast.dismiss();
            toast.error('فشل تسجيل الدخول كـ هذه الجمعية');
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground mb-2">إدارة الجمعيات</h1>
                    <p className="text-muted-foreground">عرض الجمعيات المسجلة والتحكم في صلاحياتها</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ابحث باسم الجمعية أو البريد..."
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
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">الجمعية</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">القدرة الاستيعابية</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">تاريخ الانضمام</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">الطلبات المعالجة</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-muted-foreground">الحالة</th>
                                <th className="px-6 py-4 text-end text-sm font-black text-muted-foreground">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            جاري التحميل...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAssociations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground font-bold">لا توجد جمعيات مطابقة للبحث.</td>
                                </tr>
                            ) : (
                                filteredAssociations.map((assoc) => (
                                    <tr key={assoc.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{assoc.name}</p>
                                                    <p className="text-sm text-muted-foreground">{assoc.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-foreground bg-slate-100 px-3 py-1 rounded-full">
                                                {assoc.capacity ? `${assoc.capacity} أسرة/شهر` : 'غير محدد'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                            {new Date(assoc.createdAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                <Activity className="w-4 h-4 text-primary" />
                                                {assoc.handledRequestsCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {assoc.isActive ? (
                                                    <span className="flex items-center gap-1.5 text-primary bg-primary/10 text-xs font-bold px-2.5 py-1 rounded-full border border-primary\/20">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> نشط
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-destructive bg-destructive\/10 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                                                        <XCircle className="w-3.5 h-3.5" /> محظور
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleImpersonate(assoc.userId, assoc.name)}
                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-100 transition-colors"
                                                    title="تسجيل الدخول كـ هذه الجمعية"
                                                >
                                                    <LogIn className="w-4 h-4" />
                                                    دخول كـ
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(assoc.id, assoc.isActive)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                                        assoc.isActive 
                                                            ? 'bg-destructive\/10 text-destructive hover:bg-red-100 border border-red-100' 
                                                            : 'bg-primary/10 text-primary hover:bg-emerald-100 border border-primary\/20'
                                                    }`}
                                                >
                                                    {assoc.isActive ? 'إيقاف الجمعية' : 'تفعيل الجمعية'}
                                                </button>
                                            </div>
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
