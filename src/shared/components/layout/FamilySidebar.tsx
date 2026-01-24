"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Settings,
  LogOut,
  ChevronLeft
} from "lucide-react";

import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";

const navItems = [
  { label: "لوحة التحكم", href: "/dashboard/family", icon: LayoutDashboard },
  { label: "طلباتي", href: "/dashboard/family/requests", icon: FileText },
  { label: "طلب جديد", href: "/dashboard/family/requests/new", icon: PlusCircle },
  { label: "الملف الشخصي", href: "/dashboard/family/profile", icon: User },
  { label: "الإعدادات", href: "/dashboard/family/settings", icon: Settings },
];

export function FamilySidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo area */}
      <div className="px-8 py-10">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95 duration-300">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <img src="/logo.png" alt="عون" className="h-8 w-auto" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">عون</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">القائمة الرئيسية</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group relative",
                isActive
                  ? "bg-primary text-white shadow-xl shadow-primary/20 translate-x-1"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse ps-2" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-6 border-t border-slate-50 mt-auto bg-slate-50/30">
        <div className="flex items-center gap-3 p-4 rounded-[2rem] bg-white shadow-sm border border-slate-100 group hover:shadow-md transition-shadow duration-300">
          <div className="w-12 h-12 rounded-2xl bg-warm-green/10 flex items-center justify-center text-warm-green font-black text-lg border border-warm-green/20">
            أم
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate">أسرة محمد علي</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">حساب مفعل</p>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FamilySidebar() {
  return (
    <aside className="w-80 bg-white border-e border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen overflow-hidden z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <FamilySidebarContent />
    </aside>
  );
}
