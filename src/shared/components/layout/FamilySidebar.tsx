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
