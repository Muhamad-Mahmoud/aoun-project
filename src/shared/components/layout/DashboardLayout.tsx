"use client";

import React from 'react';
import { Bell, Search, UserCircle, Menu } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { FamilySidebar, FamilySidebarContent } from "./FamilySidebar";
import { OrganizationSidebar, OrganizationSidebarContent } from "./OrganizationSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-muted/30 flex lg:flex-row flex-col overflow-hidden" dir="rtl">
      {/* Sidebar is rendered inside the pages for now to maintain context, 
          but we ensure the main container is a flexbox. */}
      {children}
    </div>
  );
}

// Optional TopBar to be used inside Dashboards
export function DashboardTopBar({ userType }: { userType: string }) {
  const SidebarContent = userType === "family" ? FamilySidebarContent : OrganizationSidebarContent;

  return (
    <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20 pt-4">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="القائمة الجانبية"
              className="lg:hidden w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 active:scale-90 transition-all border border-slate-100 shadow-sm"
            >
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-none w-80 shadow-2xl" dir="rtl">
            <SidebarContent />
          </SheetContent>
        </Sheet>

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
          <button
            aria-label="التنبيهات"
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl relative transition-all active:scale-90 group"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
            <span className="absolute top-2 sm:top-3 end-2 sm:end-3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-rose-500 rounded-full border-2 border-white ring-4 ring-rose-500/10"></span>
          </button>
        </div>

        <div className="w-[1px] h-8 bg-slate-100 hidden xs:block"></div>

        <div className="flex items-center gap-2 sm:gap-4 cursor-pointer group px-1 sm:px-2 py-1.5 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
          <div className="text-end hidden md:block">
            <p className="text-sm font-black text-slate-900 leading-none mb-1">محمد أحمد</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{userType === 'family' ? 'حساب أسرة' : 'حساب جمعية'}</p>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[15px] bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-primary/20 transition-all overflow-hidden">
            <UserCircle className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
