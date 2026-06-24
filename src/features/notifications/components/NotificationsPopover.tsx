"use client";

import React from "react";
import { Bell, CheckCircle2, Circle, Loader2, BellRing } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPopover({ userType }: { userType: string }) {
    const {
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        loading,
        handleMarkAsRead,
        handleMarkAllAsRead,
        handleNotificationClick,
    } = useNotifications(userType);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    aria-label="التنبيهات"
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl relative transition-all active:scale-90 group outline-none"
                >
                    <Bell className={cn("w-5 h-5 sm:w-6 sm:h-6 transition-colors", unreadCount > 0 ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 sm:top-3 end-2 sm:end-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white ring-4 ring-rose-500/10 flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[380px] p-0 rounded-2xl shadow-xl border-slate-100 z-50" align="end" sideOffset={8} dir="rtl" collisionPadding={16}>
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BellRing className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-black text-slate-800">الإشعارات</h3>
                        {unreadCount > 0 && (
                            <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} جديد
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-8 px-2 text-[11px] font-bold text-slate-500 hover:text-primary">
                            <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                            تحديد الكل كمقروء
                        </Button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="p-8 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <p className="text-xs font-medium">جاري التحميل...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-10 flex flex-col items-center justify-center text-slate-400 gap-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-slate-300" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-600 text-sm">لا توجد إشعارات</p>
                                <p className="text-xs text-slate-400 mt-1">أنت على اطلاع بكل جديد!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "p-4 border-b border-slate-50 transition-colors cursor-pointer flex gap-3 relative overflow-hidden group",
                                        notification.isRead ? "hover:bg-slate-50" : "bg-primary/5 hover:bg-primary/10"
                                    )}
                                >
                                    {!notification.isRead && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-sm font-bold truncate", notification.isRead ? "text-slate-700" : "text-slate-900")}>
                                            {notification.title}
                                        </p>
                                        <p className={cn("text-xs mt-1 line-clamp-2", notification.isRead ? "text-slate-500" : "text-slate-600 font-medium")}>
                                            {notification.body}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                            {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-primary/40 hover:text-primary transition-colors shrink-0 self-center opacity-0 group-hover:opacity-100"
                                            title="تحديد كمقروء"
                                        >
                                            <Circle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
