import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../api/notificationsApi";
import { NotificationDto } from "../types";
import { toast } from "sonner";
import { BellRing, MessageSquare, CheckCircle2 } from "lucide-react";

function playNotificationSound(isMessage: boolean) {
    try {
        if (typeof window === 'undefined') return;
        
        // We use actual high-quality, calm audio files for a premium feel
        const soundFile = isMessage ? '/sounds/message.wav' : '/sounds/notification.wav';
        const audio = new window.Audio(soundFile);
        
        // Play the sound gently
        audio.volume = 0.6;
        audio.play().catch(e => console.warn("Audio play prevented by browser:", e));
    } catch (e) {
        console.warn("Could not play sound", e);
    }
}

export function useNotifications(userType: string) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (err) {
            console.error("Failed to fetch unread count", err);
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMyNotifications(1, 10);
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        
        let newConnection: HubConnection | null = null;
        let isSubscribed = true;

        const setupConnection = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const data = await response.json();
                const token = data.token;

                if (!isSubscribed) return;

                newConnection = new HubConnectionBuilder()
                    .withUrl('/api/proxy/hubs/notifications', {
                        accessTokenFactory: () => token || '',
                        transport: 4 // signalR.HttpTransportType.LongPolling = 4
                    })
                    .configureLogging(LogLevel.Information)
                    .withAutomaticReconnect()
                    .build();

                newConnection.on("ReceiveNotification", (notification: NotificationDto) => {
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    
                    const isMessage = (notification.title + " " + notification.body).toLowerCase().includes("رسالة") || (notification.title + " " + notification.body).toLowerCase().includes("رد");
                    
                    // Guaranteed real WAV sound (calm and premium)
                    playNotificationSound(isMessage);
                    
                    toast(notification.title, {
                        description: notification.body,
                        position: "bottom-left",
                        duration: 5000,
                        icon: (
                            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100 shadow-sm ml-3">
                                {isMessage ? (
                                    <MessageSquare className="w-4 h-4 text-teal-600" />
                                ) : (
                                    <BellRing className="w-4 h-4 text-teal-600" />
                                )}
                            </div>
                        ),
                    });

                    if (typeof document !== 'undefined' && document.hidden && 'Notification' in window && Notification.permission === 'granted') {
                        new Notification(notification.title, { body: notification.body, icon: '/favicon.ico' });
                    }
                    
                    // Dispatch a global event so active chat windows can refresh immediately
                    if (isMessage && notification.relatedRequestId) {
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('chatMessageReceived', { 
                                detail: { requestId: notification.relatedRequestId } 
                            }));
                        }
                    }
                });

                await newConnection.start();
                console.log("SignalR Notifications Connected.");
                
                if (isSubscribed) {
                    setConnection(newConnection);
                } else {
                    newConnection.stop();
                }
            } catch (err) {
                console.error("SignalR Notifications Connection Error: ", err);
            }
        };

        setupConnection();

        return () => {
            isSubscribed = false;
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [fetchUnreadCount]);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    const handleMarkAsRead = async (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleNotificationClick = (notification: NotificationDto) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }
        
        setIsOpen(false);

        if (notification.relatedRequestId) {
            if (notification.type === 'Chat') {
                if (userType === 'family') {
                    router.push(`/dashboard/family/messages?requestId=${notification.relatedRequestId}`);
                } else if (userType === 'organization') {
                    router.push(`/dashboard/organization/messages?requestId=${notification.relatedRequestId}`);
                }
            } else {
                if (userType === 'family') {
                    router.push(`/dashboard/family/requests/${notification.relatedRequestId}`);
                } else if (userType === 'organization') {
                    router.push(`/dashboard/organization?request=${notification.relatedRequestId}`);
                }
            }
        }
    };

    return {
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        loading,
        handleMarkAsRead,
        handleMarkAllAsRead,
        handleNotificationClick,
    };
}
