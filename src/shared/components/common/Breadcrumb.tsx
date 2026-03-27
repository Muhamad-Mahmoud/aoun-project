"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/shared/utils";

const routeLabels: Record<string, string> = {
    'dashboard': 'لوحة التحكم',
    'family': 'الأسرة',
    'organization': 'الجمعية',
    'requests': 'الطلبات',
    'new': 'طلب جديد',
    'profile': 'الملف الشخصي',
    'settings': 'الإعدادات',
    'pending': 'الطلبات المعلقة',
    'approved': 'المعتمدة',
    'team': 'فريق العمل',
    'chat': 'المساعد الذكي',
};

export function Breadcrumb({ className }: { className?: string }) {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(p => p);

    // If we are at the root or just /dashboard without sub-paths, don't show complex breadcrumb
    if (paths.length <= 1) return null;

    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs font-medium text-slate-500", className)}>
            <div className="flex items-center gap-1.5">
                <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Home className="w-3.5 h-3.5" />
                </Link>
                {paths.map((path, index) => {
                    const isLast = index === paths.length - 1;
                    const href = `/${paths.slice(0, index + 1).join('/')}`;
                    const label = routeLabels[path] || path;

                    // Skip the first "dashboard" segment if followed by family/org, as we use Home icon for it
                    if (index === 0 && path === 'dashboard') return null;

                    return (
                        <div key={path} className="flex items-center gap-1.5">
                            <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
                            {isLast ? (
                                <span className="text-slate-900 font-bold" aria-current="page">
                                    {label}
                                </span>
                            ) : (
                                <Link href={href} className="hover:text-primary transition-colors">
                                    {label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
