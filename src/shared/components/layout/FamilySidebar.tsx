"use client";

import React from "react";
import { logger } from "@/lib/logger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  MessageCircle,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { useAuthContext } from "@/shared/providers";

const navItems = [
  { id: "dashboard", label: "لوحة التحكم", href: "/dashboard/family", icon: LayoutDashboard },
  { id: "requests", label: "طلباتي", href: "/dashboard/family/requests", icon: FileText },
  { id: "new-request", label: "طلب جديد", href: "/dashboard/family/requests/new", icon: PlusCircle },
  { id: "chat", label: "المساعد الذكي", href: "/dashboard/family/chat", icon: MessageCircle },
  { id: "messages", label: "الرسائل المباشرة", href: "/dashboard/family/messages", icon: MessageSquare },
  { id: "profile", label: "الملف الشخصي", href: "/dashboard/family/profile", icon: User },
  { id: "settings", label: "الإعدادات", href: "/dashboard/family/settings", icon: Settings },
];

export function FamilySidebarContent({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { user, updateUser, logout } = useAuthContext();
  const [profile, setProfile] = React.useState<{ firstName?: string; lastName?: string; isVerified?: boolean } | null>(null);
  const [pendingCount, setPendingCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getFamilyProfile, getFamilyStatistics } = await import("@/features/families/api/familiesApi");
        const [profileData, statsData] = await Promise.all([
          getFamilyProfile().catch(() => null),
          getFamilyStatistics().catch(() => null)
        ]);
        if (profileData) {
            setProfile(profileData);
            // Sync Auth context with the latest name from profile API
            const fullName = `${profileData.firstName} ${profileData.lastName}`;
            if (user && (user.name !== fullName || user.isVerified !== profileData.isVerified)) {
                updateUser({ ...user, name: fullName, isVerified: profileData.isVerified });
            }
        }
        if (statsData) setPendingCount(statsData.pendingRequests || 0);
      } catch (error) {
        logger.warn("Failed to fetch data for sidebar");
      }
    };
    fetchData();
  }, []);

  const userName = profile ? `${profile.firstName} ${profile.lastName}` : "تحميل...";
  const userStatus = profile?.isVerified ? "حساب مفعل" : "حساب أسرة";
  const userInitials = profile 
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() 
    : (user?.name?.[0] || "أ");

  return (
    <div className="flex flex-col h-full bg-white relative z-20 overflow-hidden">
      {/* Logo area */}
      <div className={cn("py-8 border-b border-border/50 flex items-center transition-all duration-300", isCollapsed ? "px-0 justify-center h-[96px]" : "px-8 h-[96px]")}>
        <Link href="/" className="flex items-center justify-center">
          {isCollapsed ? (
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                 <span className="text-primary font-black text-xl">ع</span>
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
          const badge = item.id === "requests" ? pendingCount : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
                isCollapsed && "justify-center"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-family-pill"
                  className="absolute start-0 top-2 bottom-2 w-1 bg-primary rounded-e-full"
                />
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300 shrink-0",
                  isActive ? "bg-primary text-white shadow-md scale-110" : "bg-slate-50 group-hover:bg-primary/10 group-hover:text-primary",
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
              
              {/* Badge & Active Indicator Wrapper */}
              <div className="flex items-center gap-2">
                {badge > 0 && (
                  <span className={cn(
                    "min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-black shrink-0 transition-all",
                    isActive ? "bg-primary text-white" : "bg-destructive text-white group-hover:bg-primary group-hover:text-white"
                  )}>
                    {badge}
                  </span>
                )}
                {!isCollapsed && isActive && <ChevronLeft className="w-4 h-4 shrink-0" />}
              </div>
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
            <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {userInitials}
            </div>
            {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate whitespace-nowrap">{userName}</p>
                  <p className={`text-[10px] font-medium uppercase tracking-wider whitespace-nowrap ${profile?.isVerified ? "text-emerald-600" : "text-slate-400"}`}>
                    {userStatus}
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FamilySidebar() {
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
        className="absolute top-10 -start-4 w-8 h-8 rounded-full border border-slate-200 bg-white shadow-sm z-50 hover:bg-slate-50 hover:text-primary transition-transform"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 ml-0.5" /> : <ChevronLeft className="w-4 h-4 mr-0.5" />}
      </Button>
      <FamilySidebarContent isCollapsed={isCollapsed} />
    </aside>
  );
}

export function FamilyBottomSheetMenu() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const [profile, setProfile] = React.useState<{ firstName?: string; lastName?: string; isVerified?: boolean } | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getFamilyProfile } = await import("@/features/families/api/familiesApi");
        const profileData = await getFamilyProfile().catch(() => null);
        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  const userName = profile ? `${profile.firstName} ${profile.lastName}` : (user?.name || "تحميل...");
  const userStatus = profile?.isVerified ? "حساب مفعل" : "حساب أسرة";
  const userInitials = profile 
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() 
    : (user?.name?.[0] || "أ");

  const sheetItems = [
    { label: "الرسائل المباشرة", href: "/dashboard/family/messages", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "الملف الشخصي", href: "/dashboard/family/profile", icon: User, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "الإعدادات", href: "/dashboard/family/settings", icon: Settings, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="flex flex-col bg-white pb-8 pt-3 rounded-t-[32px] relative overflow-hidden">
      {/* Top Drag Handle */}
      <div className="w-12 h-1.5 bg-slate-200/80 rounded-full mx-auto mb-6" />
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-white -z-10" />

      {/* Profile Header (Centered) */}
      <div className="px-6 mb-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/20 to-blue-500/20 flex items-center justify-center border-4 border-white shadow-xl shadow-primary/5 mb-4 relative">
          <span className="text-3xl font-black text-slate-800">{userInitials}</span>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className={cn("w-4 h-4 rounded-full animate-pulse", profile?.isVerified ? "bg-emerald-500" : "bg-amber-500")} />
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">{userName}</h2>
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm",
          profile?.isVerified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          {profile?.isVerified && <User className="w-3.5 h-3.5" />}
          {userStatus}
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
