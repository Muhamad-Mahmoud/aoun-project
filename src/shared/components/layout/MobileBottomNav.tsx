"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Plus,
  MessageCircle,
  MessageSquare,
  Search,
  HeartHandshake,
  Compass,
  User,
  Menu,
  Inbox
} from "lucide-react";
import { cn } from "@/shared/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { FamilySidebarContent, FamilyBottomSheetMenu } from "./FamilySidebar";
import { OrganizationSidebarContent, OrganizationBottomSheetMenu } from "./OrganizationSidebar";
import { DonorSidebarContent } from "./DonorSidebar";

export function MobileBottomNav({ userType }: { userType: string }) {
  const pathname = usePathname();

  let navItems: any[] = [];
  let SidebarContent: any = null;
  let isBottomSheet = false;

  if (userType === "family") {
    SidebarContent = FamilyBottomSheetMenu;
    isBottomSheet = true;
    navItems = [
      { id: "home", label: "الرئيسية", href: "/dashboard/family", icon: LayoutDashboard },
      { id: "requests", label: "طلباتي", href: "/dashboard/family/requests", icon: FileText },
      { id: "add", label: "طلب جديد", href: "/dashboard/family/requests/new", icon: Plus },
      { id: "chat", label: "المساعد", href: "/dashboard/family/chat", icon: MessageCircle },
      { id: "menu", label: "المزيد", icon: Menu, isMenu: true },
    ];
  } else if (userType === "organization") {
    SidebarContent = OrganizationBottomSheetMenu;
    isBottomSheet = true;
    navItems = [
      { id: "home", label: "الرئيسية", href: "/dashboard/organization", icon: LayoutDashboard },
      { id: "pending", label: "الطلبات", href: "/dashboard/organization/pending", icon: Inbox },
      { id: "campaigns", label: "الحملات", href: "/dashboard/organization/campaigns", icon: Search },
      { id: "messages", label: "الرسائل", href: "/dashboard/organization/messages", icon: MessageSquare },
      { id: "menu", label: "المزيد", icon: Menu, isMenu: true },
    ];
  } else if (userType === "donor") {
    SidebarContent = DonorSidebarContent;
    navItems = [
      { id: "home", label: "الرئيسية", href: "/dashboard/donor", icon: LayoutDashboard },
      { id: "explore", label: "تصفح", href: "/explore", icon: Compass },
      { id: "profile", label: "الملف", href: "/dashboard/donor/profile", icon: User },
      { id: "menu", label: "المزيد", icon: Menu, isMenu: true },
    ];
  }

  if (navItems.length === 0) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-4 pt-4 pointer-events-none">
      {/* Background blur container to give floating island effect */}
      <div className="mx-auto w-full max-w-[400px] bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-3xl flex items-center justify-between px-2 py-2 pointer-events-auto relative">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href && !item.isMenu;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.id}
                href={item.href!}
                className="flex flex-col items-center justify-end flex-1 shrink-0 group relative"
              >
                <div className="absolute -top-6 z-20 w-[56px] h-[56px] rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/40 bg-gradient-to-tr from-primary to-primary/80 transition-transform active:scale-95 duration-300 border-[5px] border-white ring-1 ring-slate-100/50">
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                {/* Invisible placeholder to push text down to align with others */}
                <div className="w-8 h-8 shrink-0 mb-1" />
                <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{item.label}</span>
              </Link>
            );
          }

          if (item.isMenu) {
            return (
              <Sheet key={item.id}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center justify-end flex-1 shrink-0 group relative focus:outline-none">
                    <div className="w-8 h-8 mb-1 rounded-2xl flex items-center justify-center text-slate-400 group-active:scale-95 group-hover:bg-slate-50 transition-all duration-300 relative z-10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 transition-colors duration-300 whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                </SheetTrigger>
                {isBottomSheet ? (
                    <SheetContent side="bottom" className="p-0 border-none rounded-t-[32px] overflow-hidden shadow-2xl bg-transparent [&>button]:hidden" dir="rtl">
                      {SidebarContent && <SidebarContent />}
                    </SheetContent>
                ) : (
                    <SheetContent side="right" className="p-0 border-none w-[260px] shadow-2xl rounded-l-3xl overflow-hidden" dir="rtl">
                      {SidebarContent && <SidebarContent />}
                    </SheetContent>
                )}
              </Sheet>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href!}
              className="flex flex-col items-center justify-end flex-1 shrink-0 group relative"
            >
              <div className={cn(
                "w-8 h-8 mb-1 rounded-2xl flex items-center justify-center group-active:scale-95 transition-all duration-300 relative z-10",
                isActive ? "text-primary" : "text-slate-400 group-hover:bg-slate-50"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-bubble"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold transition-colors duration-300 whitespace-nowrap",
                isActive ? "text-primary" : "text-slate-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
