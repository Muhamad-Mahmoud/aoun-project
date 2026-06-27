"use client";

import React from "react";
import { Bell, CheckCircle2, Loader2, BellRing, Clock, MessageSquare, ArrowUpRight, Sparkles, Zap } from "lucide-react";
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

    // Helper to assign dynamic icons based on notification text
    const getIconInfo = (title: string, body: string) => {
        const text = (title + " " + body).toLowerCase();
        if (text.includes("رد") || text.includes("رسالة")) return { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200/60" };
        if (text.includes("موافقة") || text.includes("نجاح") || text.includes("تم")) return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200/60" };
        if (text.includes("عاجل") || text.includes("هام")) return { icon: Zap, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200/60" };
        return { icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200/60" };
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    aria-label="التنبيهات"
                    className="relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 outline-none group bg-card border border-border/60 shadow-sm hover:shadow-md hover:bg-muted"
                >
                    <Bell className={cn("w-5 h-5 transition-transform duration-300 group-hover:rotate-12", unreadCount > 0 ? "text-foreground" : "text-muted-foreground")} />
                    {unreadCount > 0 && (
                        <>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-border z-10" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-ping z-0 opacity-75" />
                        </>
                    )}
                </button>
            </PopoverTrigger>
            
            <PopoverContent 
                className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 rounded-3xl shadow-2xl shadow-slate-900/10 border-border/60 overflow-hidden bg-card/95 backdrop-blur-xl z-50" 
                align="end" 
                sideOffset={12} 
                dir="rtl" 
                collisionPadding={16}
            >
                {/* Header */}
                <div className="relative px-6 py-5 border-b border-border bg-card">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-100/60 shadow-sm relative overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-100/40 to-emerald-50/40" />
                                <BellRing className="w-5 h-5 text-teal-600 relative z-10 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-foreground tracking-tight leading-none mb-1.5">الإشعارات</h3>
                                <p className="text-xs font-bold text-muted-foreground">
                                    {unreadCount > 0 ? `لديك ${unreadCount} إشعارات جديدة` : "أنت على اطلاع بكل جديد!"}
                                </p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleMarkAllAsRead} 
                                className="h-9 px-3 text-xs font-bold text-muted-foreground hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
                            >
                                <CheckCircle2 className="w-4 h-4 ml-1.5" />
                                تحديد كـ مقروء
                            </Button>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[420px] overflow-y-auto overscroll-contain bg-muted/50">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                            <p className="text-sm font-bold text-muted-foreground">جاري تحميل الإشعارات...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-muted/50 border-4 border-border shadow-sm flex items-center justify-center mb-5">
                                <Bell className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-black text-foreground text-lg mb-1.5">صندوق الإشعارات فارغ</p>
                            <p className="text-sm font-medium text-muted-foreground max-w-[200px] leading-relaxed">أنت على اطلاع دائم. سنعلمك فور ورود أي تحديث.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification, index) => {
                                const { icon: Icon, color, bg, border } = getIconInfo(notification.title, notification.body);
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={cn(
                                            "relative group p-5 border-b border-border/60 transition-all duration-300 cursor-pointer flex gap-4 hover:bg-card",
                                            notification.isRead ? "opacity-60 hover:opacity-100 bg-transparent" : "bg-card"
                                        )}
                                        style={{ animationFillMode: "both" }}
                                    >
                                        {/* Unread Indicator Bar */}
                                        {!notification.isRead && (
                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-violet-600 rounded-l-full shadow-[0_0_12px_rgba(124,58,237,0.6)]" />
                                        )}

                                        {/* Icon */}
                                        <div className="shrink-0 relative">
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3", bg, border)}>
                                                <Icon className={cn("w-5 h-5", color)} />
                                            </div>
                                            {!notification.isRead && (
                                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-border rounded-full z-10 animate-in zoom-in" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 py-0.5">
                                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                                <p className={cn("text-sm font-black truncate transition-colors", notification.isRead ? "text-muted-foreground" : "text-foreground group-hover:text-teal-700")}>
                                                    {notification.title}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground whitespace-nowrap shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed">
                                                {notification.body}
                                            </p>
                                        </div>

                                        {/* Mark as read button */}
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(notification.id, e);
                                                }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card shadow-sm border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all z-10 translate-x-2 group-hover:translate-x-0"
                                                title="تحديد كمقروء"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-2 bg-card border-t border-border text-center">
                        <Button variant="ghost" className="w-full text-xs font-black text-muted-foreground hover:text-teal-700 hover:bg-teal-50 rounded-xl h-11 transition-colors">
                            عرض كافة الإشعارات
                            <ArrowUpRight className="w-4 h-4 mr-1.5 opacity-70" />
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
