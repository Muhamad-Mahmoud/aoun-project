"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Inbox,
  CheckCircle2,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  HeartHandshake,
  MessageSquare,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { useAuthContext } from "@/shared/providers";

const navItems = [
  { label: "لوحة التحكم", href: "/dashboard/organization", icon: LayoutDashboard },
  { label: "المساعد الذكي", href: "/dashboard/organization/chat", icon: MessageCircle },
  { label: "إدارة الحملات", href: "/dashboard/organization/campaigns", icon: Search },
  { label: "التبرعات الواردة", href: "/dashboard/organization/donations", icon: HeartHandshake },
  { label: "التواصل المباشر", href: "/dashboard/organization/messages", icon: MessageSquare },
  { label: "طلبات تحتاج مراجعة", href: "/dashboard/organization/pending", icon: Inbox },
  { label: "الحالات المعتمدة", href: "/dashboard/organization/approved", icon: CheckCircle2 },
  { label: "ملف الجمعية", href: "/dashboard/organization/profile", icon: Building2 },
  { label: "الإعدادات", href: "/dashboard/organization/settings", icon: Settings },
];

export function OrganizationSidebarContent({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { user, updateUser, logout } = useAuthContext();
  const [profile, setProfile] = React.useState<{ name?: string; isActive?: boolean } | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getAssociationProfile } = await import("@/features/associations/api/associationsApi");
        const profileData = await getAssociationProfile().catch(() => null);
        if (profileData) {
          setProfile(profileData);
          if (user && user.name !== profileData.name) {
            updateUser({ ...user, name: profileData.name });
          }
        }
      } catch (error) {
        // Silently fail or log for debug
      }
    };
    fetchData();
  }, []);

  const orgName = profile?.name || user?.name || "تحميل...";
  const orgInitials = orgName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "ج";
  
  return (
    <div className="flex flex-col h-full bg-white relative z-20 overflow-hidden">
      {/* Logo area */}
      <div className={cn("py-8 border-b border-border/50 flex items-center transition-all duration-300", isCollapsed ? "px-0 justify-center h-[96px]" : "px-8 h-[96px]")}>
        <Link href="/" className="flex items-center justify-center">
          {isCollapsed ? (
             <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                 <span className="text-secondary font-black text-xl">ع</span>
             </div>
          ) : (
             <Image src="/logo.png" alt="عون" width={96} height={48} className="h-12 w-auto shrink-0" />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative",
                isActive
                  ? "bg-secondary/10 text-secondary"
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
                isCollapsed && "justify-center"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-org-pill"
                  className="absolute start-0 top-2 bottom-2 w-1 bg-secondary rounded-e-full"
                />
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300 shrink-0",
                  isActive ? "bg-secondary text-white shadow-md scale-110" : "bg-slate-50 group-hover:bg-secondary/10 group-hover:text-secondary",
                  isCollapsed && "mx-auto"
                )}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
                {!isCollapsed && (
                    <span className={cn(
                      "text-sm transition-all duration-300 whitespace-nowrap",
                      isActive ? "font-black" : "font-bold"
                    )}>{item.label}</span>
                )}
              </div>
              {!isCollapsed && isActive && <ChevronLeft className="w-4 h-4 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className={cn("border-t border-border mt-auto transition-all duration-300 shrink-0", isCollapsed ? "p-4" : "p-6")}>
        <Button
          variant="ghost"
          onClick={() => logout()}
          className={cn("w-full h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl font-bold transition-all", isCollapsed ? "justify-center px-0 shrink-0" : "justify-start gap-3")}
          title={isCollapsed ? "تسجيل الخروج" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">تسجيل الخروج</span>}
        </Button>
        <div className={cn("mt-4 rounded-xl bg-muted/50 border border-border transition-all duration-300 mx-auto", isCollapsed ? "p-2 w-fit shrink-0" : "p-4")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary font-black text-sm">
              {orgInitials}
            </div>
            {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate whitespace-nowrap">{orgName}</p>
                  <p className="text-[10px] text-slate-500 font-bold whitespace-nowrap">جهة معتمدة</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrganizationSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside className={cn(
        "bg-white border-e border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 z-30 shrink-0 relative", 
        isCollapsed ? "w-[100px]" : "w-80"
    )}>
      <Button 
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        className="absolute top-10 -start-4 w-8 h-8 rounded-full border border-slate-200 bg-white shadow-sm z-50 hover:bg-slate-50 hover:text-secondary transition-transform"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 ml-0.5" /> : <ChevronLeft className="w-4 h-4 mr-0.5" />}
      </Button>
      <OrganizationSidebarContent isCollapsed={isCollapsed} />
    </aside>
  );
}

export function OrganizationBottomSheetMenu() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const [profile, setProfile] = React.useState<{ name?: string; isActive?: boolean } | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getAssociationProfile } = await import("@/features/associations/api/associationsApi");
        const profileData = await getAssociationProfile().catch(() => null);
        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  const orgName = profile?.name || user?.name || "تحميل...";
  const orgInitials = orgName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "ج";

  const sheetItems = [
    { label: "إدارة الحملات", href: "/dashboard/organization/campaigns", icon: Search, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "الحالات المعتمدة", href: "/dashboard/organization/approved", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "ملف الجمعية", href: "/dashboard/organization/profile", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "الإعدادات", href: "/dashboard/organization/settings", icon: Settings, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="flex flex-col bg-white pb-8 pt-3 rounded-t-[32px] relative overflow-hidden">
      {/* Top Drag Handle */}
      <div className="w-12 h-1.5 bg-slate-200/80 rounded-full mx-auto mb-6" />
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-white -z-10" />

      {/* Profile Header (Centered) */}
      <div className="px-6 mb-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-white shadow-xl shadow-primary/5 mb-4 relative">
          <span className="text-3xl font-black text-slate-800">{orgInitials}</span>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">{orgName}</h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          جهة معتمدة
        </span>
      </div>

      {/* Menu Links (iOS Settings Style) */}
      <div className="px-4">
        <div className="bg-slate-50/50 rounded-[24px] border border-slate-100/60 p-2 space-y-1 shadow-sm">
          {sheetItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-2xl transition-all duration-300",
                  isActive ? "bg-white shadow-sm ring-1 ring-slate-100" : "hover:bg-white/60 active:bg-slate-100"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-[14px] flex items-center justify-center shadow-sm",
                  item.bg, item.color
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold flex-1 text-slate-700 text-[15px]">{item.label}</span>
                <ChevronLeft className="w-5 h-5 text-slate-300" />
              </Link>
            );
          })}
        </div>

        {/* Logout Action */}
        <div className="mt-4 bg-red-50/30 rounded-[24px] border border-red-100/50 p-2 shadow-sm">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-red-50 active:bg-red-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-[14px] bg-red-100 text-red-600 flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-black flex-1 text-start text-red-600 text-[15px]">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
}
