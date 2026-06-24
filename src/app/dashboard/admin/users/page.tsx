"use client";

import React, { useEffect, useState } from 'react';
import { useAdminData } from '@/features/admin';
import { adminApi } from '@/features/admin/api/adminApi';
import { ShieldCheck, UserX, CheckCircle2, User, Search, LogIn } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { useAuthContext } from '@/shared/providers';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const { users, loading, fetchUsers, toggleUserStatus } = useAdminData();
    const [searchTerm, setSearchTerm] = useState('');
    const { login, token } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = async (id: string, currentStatus: boolean, userType: string) => {
        if (userType === 'Admin') {
            toast.error('لا يمكن حظر مدير النظام');
            return;
        }

        const action = currentStatus ? 'حظر' : 'تفعيل';
        if (confirm(`هل أنت متأكد أنك تريد ${action} هذا المستخدم؟`)) {
            await toggleUserStatus(id);
            toast.success(`تم ${action} المستخدم بنجاح`);
        }
    };

    const handleImpersonate = async (userId: string, userType: string) => {
        if (userType === 'Admin') {
            toast.error('لا يمكن تسجيل الدخول كمدير نظام آخر');
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
            toast.success(`تم تسجيل الدخول كـ ${response.user.name}`);
            
            router.push('/dashboard');
        } catch (error) {
            toast.dismiss();
            toast.error('فشل تسجيل الدخول كـ هذا المستخدم');
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">إدارة المستخدمين</h1>
                    <p className="text-slate-500">عرض جميع المستخدمين والتحكم في حالات الحسابات</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="ابحث بالاسم أو البريد..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ps-10 h-12 bg-white border-slate-200 focus:bg-white rounded-xl"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-start text-sm font-black text-slate-500">المستخدم</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-slate-500">النوع</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-slate-500">تاريخ التسجيل</th>
                                <th className="px-6 py-4 text-start text-sm font-black text-slate-500">الحالة</th>
                                <th className="px-6 py-4 text-end text-sm font-black text-slate-500">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            جاري التحميل...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">لا يوجد مستخدمين مطابقين للبحث.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                user.userType === 'Admin' ? 'bg-primary/10 text-primary' :
                                                user.userType === 'Family' ? 'bg-amber-500/10 text-amber-600' :
                                                'bg-emerald-500/10 text-emerald-600'
                                            }`}>
                                                {user.userType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.isActive ? (
                                                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> نشط
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-red-600 bg-red-50 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                                                        <UserX className="w-3.5 h-3.5" /> محظور
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.userType !== 'Admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleImpersonate(user.id, user.userType)}
                                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-100 transition-colors"
                                                            title="تسجيل الدخول كـ هذا المستخدم"
                                                        >
                                                            <LogIn className="w-4 h-4" />
                                                            دخول كـ
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id, user.isActive, user.userType)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                                                user.isActive 
                                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                                                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                                                            }`}
                                                        >
                                                            {user.isActive ? 'حظر' : 'تفعيل'}
                                                        </button>
                                                    </>
                                                )}
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
