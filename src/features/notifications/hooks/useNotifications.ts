import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HubConnectionBuilder, LogLevel, HubConnection } from "@microsoft/signalr";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../api/notificationsApi";
import { NotificationDto } from "../types";

export function useNotifications(userType: string) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState<HubConnection | null>(null);

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

    // Initial load and SignalR connection
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
