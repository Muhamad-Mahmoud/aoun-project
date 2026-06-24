"use client";

import React, { useState } from 'react';
import { Bell, Search, UserCircle, Menu, X } from "lucide-react";
import { useAuthContext } from "@/shared/providers";
import { Input } from "@/shared/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { FamilySidebar, FamilySidebarContent } from "./FamilySidebar";
import { OrganizationSidebar, OrganizationSidebarContent } from "./OrganizationSidebar";
import { DonorSidebar, DonorSidebarContent } from "./DonorSidebar";
import { Breadcrumb } from "../common/Breadcrumb";
import { NotificationsPopover } from '@/features/notifications/components/NotificationsPopover';
import { MobileBottomNav } from "./MobileBottomNav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-muted/30 flex lg:flex-row flex-col overflow-hidden" dir="rtl">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold">
        تخطي إلى المحتوى الرئيسي
      </a>
      {/* Sidebar is rendered inside the pages for now to maintain context, 
          but we ensure the main container is a flexbox. */}
      {children}
    </div>
  );
}

// Optional TopBar to be used inside Dashboards
export function DashboardTopBar({ userType }: { userType: string }) {
  const SidebarContent = userType === "family" ? FamilySidebarContent 
                       : userType === "donor" ? DonorSidebarContent 
                       : OrganizationSidebarContent;

  // Use auth context user data instead of making a duplicate API call
  // (FamilySidebar already fetches the full profile independently)
  const { user } = useAuthContext();
  const userName = user?.name || "تحميل...";
  
  // Dynamic status based on verification and role
  const getStatusLabel = () => {
    if (userType === 'family') {
        return user?.isVerified ? 'حساب موثق' : 'حساب أسرة';
    }
    if (userType === 'donor') {
        return 'متبرع';
    }
    return 'حساب جمعية';
  };
  const userStatus = getStatusLabel();
  const statusColor = (userType === 'family' && user?.isVerified) || userType === 'donor' ? "text-emerald-500" : "text-slate-400";
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
    <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm shadow-slate-100/50 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-20 pt-4 w-full">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile search is now the primary left-aligned action for mobile if we remove the hamburger */}

        <button 
          aria-label="بحث"
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Search className="w-5 h-5 text-slate-400" />
        </button>

        <div className="relative w-full max-w-md group hidden sm:block">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="ابحث عن طلبات، مستندات..."
            className="ps-12 h-12 bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-start text-sm font-bold rounded-2xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-2">
          <NotificationsPopover userType={userType} />
        </div>

        <div className="w-[1px] h-8 bg-slate-100 hidden xs:block"></div>

        <div className="flex items-center gap-2 sm:gap-4 cursor-pointer group px-1 sm:px-2 py-1.5 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 border border-transparent hover:border-slate-100">
          <div className="text-end hidden md:block">
            <p className="text-sm font-black text-slate-900 leading-none mb-1">{user?.name || "تحميل..."}</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                {userStatus}
            </p>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[15px] bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-primary/20 transition-all overflow-hidden scale-100 group-hover:scale-105">
             {user ? (
                 <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                     {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "أ"}
                 </div>
             ) : (
                <UserCircle className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 group-hover:text-primary transition-colors" />
             )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile search overlay */}
    {mobileSearchOpen && (
      <div className="fixed inset-x-0 top-0 h-24 bg-white/95 backdrop-blur-xl z-[100] flex items-center px-4 gap-3 border-b shadow-sm sm:hidden animate-in slide-in-from-top-4">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="ابحث..." 
            autoFocus 
            className="ps-10 h-12 w-full bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-sm font-bold rounded-2xl" 
          />
        </div>
        <button 
          onClick={() => setMobileSearchOpen(false)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>
    )}

    {/* Global Breadcrumb under Header */}
    <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-2 w-full">
      <Breadcrumb />
    </div>

    {/* Mobile Bottom Navigation */}
    <MobileBottomNav userType={userType} />
    </>
  );
}
