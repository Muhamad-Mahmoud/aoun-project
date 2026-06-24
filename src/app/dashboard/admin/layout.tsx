"use client";

import React, { useState } from 'react';
import { AdminSidebar, AdminSidebarContent } from '@/shared/components/layout/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Menu, Search, UserCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden" dir="rtl">
            <AdminSidebar />
            
            <div className="flex-1 lg:ms-72 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-500">
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-0 border-none w-80 bg-slate-950" dir="rtl">
                                <AdminSidebarContent />
                            </SheetContent>
                        </Sheet>
                        
                        <div className="relative w-full max-w-md hidden sm:block">
                            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="ابحث في الإدارة..."
                                className="ps-10 h-10 bg-slate-100 border-transparent focus:bg-white rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-end hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none">مدير النظام</p>
                            <p className="text-[10px] text-slate-500 uppercase">Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                            AD
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
