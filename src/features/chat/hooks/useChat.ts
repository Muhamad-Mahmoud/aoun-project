import { useState, useEffect, useCallback, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { chatApi, ChatMessageDto } from '../api/chatApi';
import { useAuthContext } from '@/shared/providers';

export function useChat(assistanceRequestId: number) {
    const { user } = useAuthContext();
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch initial messages
    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        chatApi.getMessages(assistanceRequestId)
            .then(data => {
                setMessages(data);
                const hasUnread = data.some(m => !m.isRead && m.senderId !== user.id);
                if (hasUnread) chatApi.markAsRead(assistanceRequestId).catch(console.error);
            })
            .catch(err => console.error("Failed to load chat messages", err))
            .finally(() => setIsLoading(false));
    }, [assistanceRequestId, user]);

    // Setup SignalR connection - using ref to survive StrictMode double-invoke
    useEffect(() => {
        if (!user) return;

        // If already connected, just join the group for this request
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            connectionRef.current.invoke('JoinRequestChatGroup', assistanceRequestId).catch(console.error);
            setIsConnected(true);

            const handleReceiveMessage = (message: ChatMessageDto) => {
                setMessages(prev => [...prev, message]);
                if (user && message.senderId !== user.id) {
                    setIsOtherTyping(false); // Stop typing when message received
                    chatApi.markAsRead(assistanceRequestId).catch(console.error);
                }
            };

            const handleUserTyping = (userId: string, isTyping: boolean) => {
                if (user && userId !== user.id) {
                    setIsOtherTyping(isTyping);
                    // Auto-reset typing after 5 seconds of inactivity
                    if (isTyping) {
                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 5000);
                    }
                }
            };

            connectionRef.current.on('ReceiveMessage', handleReceiveMessage);
            connectionRef.current.on('UserTyping', handleUserTyping);
            
            return () => {
                connectionRef.current?.invoke('LeaveRequestChatGroup', assistanceRequestId).catch(console.error);
                connectionRef.current?.off('ReceiveMessage', handleReceiveMessage);
                connectionRef.current?.off('UserTyping', handleUserTyping);
            };
        }

        let aborted = false;

        const connect = async () => {
            try {
                const sessionRes = await fetch('/api/auth/session');
                const { token } = await sessionRes.json();

                if (aborted) return;

                const hub = new signalR.HubConnectionBuilder()
                    .withUrl('/api/proxy/hubs/chat', {
                        accessTokenFactory: () => token || '',
                        // Force LongPolling so the proxy can handle it (no WebSocket upgrade needed)
                        transport: signalR.HttpTransportType.LongPolling,
                    })
                    .withAutomaticReconnect()
                    .build();

                hub.onclose(() => setIsConnected(false));
                hub.onreconnecting(() => setIsConnected(false));
                hub.onreconnected(() => setIsConnected(true));

                await hub.start();
                if (aborted) { hub.stop(); return; }

                connectionRef.current = hub;
                console.log('ChatHub connected via LongPolling');

                await hub.invoke('JoinRequestChatGroup', assistanceRequestId);
                setIsConnected(true);

                const handleReceiveMessage = (message: ChatMessageDto) => {
                    setMessages(prev => [...prev, message]);
                    if (user && message.senderId !== user.id) {
                        setIsOtherTyping(false);
                        chatApi.markAsRead(assistanceRequestId).catch(console.error);
                    }
                };

                const handleUserTyping = (userId: string, isTyping: boolean) => {
                    if (user && userId !== user.id) {
                        setIsOtherTyping(isTyping);
                        if (isTyping) {
                            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                            typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 5000);
                        }
                    }
                };

                hub.on('ReceiveMessage', handleReceiveMessage);
                hub.on('UserTyping', handleUserTyping);

            } catch (err) {
                if (!aborted) {
                    console.error('ChatHub connection failed:', err);
                    setIsConnected(false);
                }
            }
        };

        connect();

        return () => {
            aborted = true;
            if (connectionRef.current) {
                connectionRef.current.invoke('LeaveRequestChatGroup', assistanceRequestId).catch(console.error);
                connectionRef.current.off('ReceiveMessage');
                connectionRef.current.off('UserTyping');
                connectionRef.current.stop().then(() => {
                    connectionRef.current = null;
                    setIsConnected(false);
                });
            }
        };
    }, [user, assistanceRequestId]);

    const sendMessage = useCallback(async (text: string): Promise<boolean> => {
        // Try SignalR first
        const hub = connectionRef.current;
        if (hub?.state === signalR.HubConnectionState.Connected) {
            try {
                await hub.invoke('SendMessage', { assistanceRequestId, message: text });
                return true;
            } catch (err) {
                console.error('SignalR send failed, will not fall back:', err);
                return false;
            }
        }

        // Fallback: send via REST API if SignalR is not ready
        console.warn('SignalR not connected, sending via REST API');
        try {
            const newMsg = await chatApi.sendMessage({ assistanceRequestId, message: text });
            setMessages(prev => [...prev, newMsg]);
            return true;
        } catch (err) {
            console.error('REST API send also failed:', err);
            return false;
        }
    }, [assistanceRequestId]);

    const sendTypingStatus = useCallback(async (isTyping: boolean) => {
        const hub = connectionRef.current;
        if (hub?.state === signalR.HubConnectionState.Connected) {
            try {
                await hub.invoke('SendTypingStatus', assistanceRequestId, isTyping);
            } catch (err) {
                console.error('Failed to send typing status:', err);
            }
        }
    }, [assistanceRequestId]);

    return {
        messages,
        isLoading,
        isConnected,
        isOtherTyping,
        sendMessage,
        sendTypingStatus,
    };
}
