"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Inbox,
  CheckCircle2,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Search
} from "lucide-react";

import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";

const navItems = [
  { label: "لوحة التحكم", href: "/dashboard/organization", icon: LayoutDashboard },
  { label: "طلبات تحتاج مراجعة", href: "/dashboard/organization/pending", icon: Inbox },
  { label: "الحالات المعتمدة", href: "/dashboard/organization/approved", icon: CheckCircle2 },
  { label: "الفريق والمتطوعين", href: "/dashboard/organization/team", icon: Users },
  { label: "ملف الجمعية", href: "/dashboard/organization/profile", icon: Building2 },
  { label: "الإعدادات", href: "/dashboard/organization/settings", icon: Settings },
];

export function OrganizationSidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo area */}
      <div className="p-8 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="عون" width={96} height={48} className="h-12 w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group",
                isActive
                  ? "bg-secondary/10 text-secondary shadow-sm border border-secondary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-secondary text-white" : "bg-muted group-hover:bg-secondary/10 group-hover:text-secondary"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronLeft className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-border mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl font-bold"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </Button>
        <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
              جخ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">جمعية الخير</p>
              <p className="text-[10px] text-muted-foreground">جهة معتمدة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrganizationSidebar() {
  return (
    <aside className="w-80 bg-white border-e border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen overflow-hidden">
      <OrganizationSidebarContent />
    </aside>
  );
}
