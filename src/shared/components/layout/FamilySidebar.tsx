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
  MessageCircle
} from "lucide-react";

import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";

const navItems = [
  { label: "لوحة التحكم", href: "/dashboard/family", icon: LayoutDashboard },
  { label: "طلباتي", href: "/dashboard/family/requests", icon: FileText },
  { label: "طلب جديد", href: "/dashboard/family/requests/new", icon: PlusCircle },
  { label: "المساعد الذكي", href: "/dashboard/family/chat", icon: MessageCircle },
  { label: "الملف الشخصي", href: "/dashboard/family/profile", icon: User },
  { label: "الإعدادات", href: "/dashboard/family/settings", icon: Settings },
];

export function FamilySidebarContent() {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<{ firstName?: string; lastName?: string; isVerified?: boolean } | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { getFamilyProfile } = await import("@/features/families/api/familiesApi");
        const data = await getFamilyProfile();
        setProfile(data);
      } catch (error) {
        logger.warn("Failed to fetch profile for sidebar");
      }
    };
    fetchProfile();
  }, []);

  const userName = profile ? `${profile.firstName} ${profile.lastName}` : "تحميل...";
  const userStatus = profile?.isVerified ? "حساب مفعل" : "حساب أسرة";
  const userInitials = profile?.firstName?.[0] || "أ";

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
                  ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
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
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{userName}</p>
              <p className={`text-[10px] font-medium uppercase tracking-wider ${profile?.isVerified ? "text-emerald-600" : "text-slate-400"}`}>
                {userStatus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FamilySidebar() {
  return (
    <aside className="w-80 bg-white border-e border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen overflow-hidden">
      <FamilySidebarContent />
    </aside>
  );
}

