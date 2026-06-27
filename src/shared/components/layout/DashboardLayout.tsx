"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Search, UserCircle, Menu, X, Moon, Sun } from "lucide-react";
import { useAuthContext } from "@/shared/providers";
import { useTheme } from "next-themes";
import { Input } from "@/shared/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { FamilySidebar, FamilySidebarContent } from "./FamilySidebar";
import { OrganizationSidebar, OrganizationSidebarContent } from "./OrganizationSidebar";
import { DonorSidebar, DonorSidebarContent } from "./DonorSidebar";
import { Breadcrumb } from "../common/Breadcrumb";
import { NotificationsPopover } from '@/features/notifications/components/NotificationsPopover';
import { MobileBottomNav } from "./MobileBottomNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hidden sm:flex">
        <Moon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted dark:hover:bg-slate-800 hover:text-foreground dark:hover:text-slate-200 transition-colors hidden sm:flex"
      aria-label="تبديل المظهر"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-background flex lg:flex-row flex-col overflow-hidden transition-colors duration-300" dir="rtl">
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
  const statusColor = (userType === 'family' && user?.isVerified) || userType === 'donor' ? "text-primary" : "text-muted-foreground";
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
    <header className="h-20 bg-card/60 dark:bg-background/80 backdrop-blur-2xl border-b border-border/60 dark:border-border shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] dark:shadow-none flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30 pt-2 w-full transition-colors duration-300">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile search is now the primary left-aligned action for mobile if we remove the hamburger */}

        <button 
          aria-label="بحث"
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted dark:hover:bg-slate-800 transition-colors"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="relative w-64 focus-within:w-full max-w-md group hidden sm:block transition-all duration-300">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
          <Input
            placeholder="ابحث عن طلبات، مستندات..."
            className="ps-11 pe-16 h-11 w-full bg-muted/80 dark:bg-slate-900/50 backdrop-blur-sm border border-border dark:border-slate-800 focus:bg-card dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-start text-sm font-medium rounded-2xl dark:text-white"
          />
          <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10 pointer-events-none">
             <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-border dark:border-slate-800 bg-card dark:bg-slate-900 px-2 text-[10px] font-medium text-muted-foreground shadow-sm">
               <span className="text-xs">⌘</span>K
             </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationsPopover userType={userType} />
        </div>

        <div className="w-[1px] h-8 bg-muted/50 hidden xs:block"></div>

        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 sm:gap-4 cursor-pointer group px-1 sm:px-2 py-1.5 rounded-2xl hover:bg-muted transition-all active:scale-95 border border-transparent hover:border-border">
              <div className="text-end hidden md:block">
                <p className="text-sm font-black text-foreground leading-none mb-1">{user?.name || "تحميل..."}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                    {userStatus}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[15px] bg-muted/50 flex items-center justify-center border-2 border-border shadow-sm ring-1 ring-slate-100 group-hover:ring-primary/20 transition-all overflow-hidden scale-100 group-hover:scale-105">
                 {user ? (
                     <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                         {user.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "أ"}
                     </div>
                 ) : (
                    <UserCircle className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                 )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "المستخدم"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${userType}/profile`} className="cursor-pointer w-full flex items-center">
                <UserIcon className="ml-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${userType}/settings`} className="cursor-pointer w-full flex items-center">
                <Settings className="ml-2 h-4 w-4" />
                <span>الإعدادات</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer w-full flex items-center" onClick={() => {
              // TODO: Implement actual logout
              window.location.href = '/login';
            }}>
              <LogOut className="ml-2 h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    {/* Mobile search overlay */}
    {mobileSearchOpen && (
      <div className="fixed inset-x-0 top-0 h-24 bg-card/95 backdrop-blur-xl z-[100] flex items-center px-4 gap-3 border-b shadow-sm sm:hidden animate-in slide-in-from-top-4">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="ابحث..." 
            autoFocus 
            className="ps-10 h-12 w-full bg-muted border-transparent focus:bg-card focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-sm font-bold rounded-2xl" 
          />
        </div>
        <button 
          onClick={() => setMobileSearchOpen(false)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted"
        >
          <X className="w-5 h-5 text-muted-foreground" />
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
