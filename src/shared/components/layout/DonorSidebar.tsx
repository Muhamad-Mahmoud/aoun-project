"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { useAuthContext } from "@/shared/providers";

const navItems = [
  { id: "dashboard", label: "لوحة التحكم", href: "/dashboard/donor", icon: LayoutDashboard },
  { id: "explore", label: "تصفح الحملات", href: "/explore", icon: Compass },
  { id: "profile", label: "الملف الشخصي", href: "/dashboard/donor/profile", icon: User },
  { id: "settings", label: "الإعدادات", href: "/dashboard/donor/settings", icon: Settings },
];

export function DonorSidebarContent({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const userName = user?.name || "تحميل...";
  const userStatus = "متبرع";
  const userInitials = user?.name?.[0] || "م";

  return (
    <div className="flex flex-col h-full bg-card relative z-20 overflow-hidden">
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
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-donor-pill"
                  className="absolute start-0 top-2 bottom-2 w-1 bg-primary rounded-e-full"
                />
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300 shrink-0",
                  isActive ? "bg-primary text-white shadow-md scale-110" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary",
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
              
              <div className="flex items-center gap-2">
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
                  <p className="text-[10px] font-medium uppercase tracking-wider whitespace-nowrap text-primary">
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

export function DonorSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside className={cn(
        "bg-card border-e border-border hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 z-30 shrink-0 relative", 
        isCollapsed ? "w-[100px]" : "w-80"
    )}>
      <Button 
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        className="absolute top-10 -start-4 w-8 h-8 rounded-full border border-border bg-card shadow-sm z-50 hover:bg-muted hover:text-primary transition-transform"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 ml-0.5" /> : <ChevronLeft className="w-4 h-4 mr-0.5" />}
      </Button>
      <DonorSidebarContent isCollapsed={isCollapsed} />
    </aside>
  );
}
