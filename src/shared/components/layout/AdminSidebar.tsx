import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Users, Building, Activity, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/shared/utils';

export function AdminSidebarContent() {
    const pathname = usePathname();

    const navigation = [
        { name: 'نظرة عامة', href: '/dashboard/admin', icon: Activity },
        { name: 'المستخدمين', href: '/dashboard/admin/users', icon: Users },
        { name: 'الجمعيات', href: '/dashboard/admin/associations', icon: Building },
        { name: 'جميع الطلبات', href: '/dashboard/admin/requests', icon: FileText },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-300 w-full" dir="rtl">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold text-white">لوحة الإدارة</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive 
                                    ? "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20" 
                                    : "hover:bg-slate-900 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-200",
                                isActive ? "text-primary scale-110" : "text-slate-500 group-hover:text-slate-300"
                            )} />
                            <span>{item.name}</span>
                            {isActive && (
                                <div className="absolute right-0 w-1.5 h-6 bg-primary rounded-l-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">AD</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">مدير النظام</p>
                            <p className="text-xs text-slate-500">admin@aoun.com</p>
                        </div>
                    </div>
                    <Link href="/auth/login" className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-bold">
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <div className="hidden lg:flex w-72 flex-col fixed inset-y-0 start-0 z-50 border-l border-slate-800">
            <AdminSidebarContent />
        </div>
    );
}
