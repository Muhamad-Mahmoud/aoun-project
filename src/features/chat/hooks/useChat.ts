import { useState, useEffect, useCallback, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { chatApi, ChatMessageDto } from '../api/chatApi';
import { mergeMessages, type ChatMessage } from '../utils/chatMerge';
import { useAuthContext } from '@/shared/providers';

export type { ChatMessage };
export { mergeMessages };

const RECONNECT_DELAYS = [0, 2000, 5000, 10_000, 30_000];

export function useChat(assistanceRequestId: number) {
    const { user } = useAuthContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [historyFor, setHistoryFor] = useState<number | null>(null);
    // Derived loading flag (avoids synchronous setState inside effects).
    const isLoading = historyFor !== assistanceRequestId;
    const [isConnected, setIsConnected] = useState(false);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const typingThrottleRef = useRef(0);
    const currentRequestRef = useRef(assistanceRequestId);

    // Keep the ref in sync without writing during render (react-hooks/refs).
    useEffect(() => {
        currentRequestRef.current = assistanceRequestId;
    }, [assistanceRequestId]);

    const markReadIfNeeded = useCallback(
        (list: ChatMessageDto[]) => {
            if (!user) return;
            const hasUnread = list.some((m) => !m.isRead && m.senderId !== user.id);
            if (hasUnread) chatApi.markAsRead(assistanceRequestId).catch(() => {});
        },
        [assistanceRequestId, user],
    );

    const refetch = useCallback(async () => {
        try {
            const data = await chatApi.getMessages(assistanceRequestId);
            setMessages((prev) => mergeMessages(prev, data));
            markReadIfNeeded(data);
        } catch {
            // Keep stale messages on failure (offline-friendly).
        }
    }, [assistanceRequestId, markReadIfNeeded]);

    // Initial history load
    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        chatApi
            .getMessages(assistanceRequestId)
            .then((data) => {
                if (cancelled) return;
                setMessages((prev) => mergeMessages(prev, data));
                markReadIfNeeded(data);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setHistoryFor(assistanceRequestId);
            });
        return () => {
            cancelled = true;
        };
    }, [assistanceRequestId, user, markReadIfNeeded]);

    // Single SignalR connection (StrictMode-safe via connectionRef + aborted flag).
    // No fixed-interval polling: refetch only on reconnect + tab-visible (stale-while-reconnect).
    useEffect(() => {
        if (!user) return;
        let aborted = false;

        const handleReceiveMessage = (message: ChatMessageDto) => {
            if (currentRequestRef.current !== assistanceRequestId) return;
            if (message.assistanceRequestId !== assistanceRequestId) return;
            setMessages((prev) => {
                // Dedupe by server id
                if (prev.some((m) => !m.pending && m.id === message.id)) return prev;
                // Reconcile an optimistic temp (same sender + text) with the server echo
                const tempIdx = prev.findIndex(
                    (m) => m.pending && m.senderId === message.senderId && m.message === message.message,
                );
                if (tempIdx >= 0) {
                    const next = [...prev];
                    next[tempIdx] = { ...message };
                    return next;
                }
                return [...prev, { ...message }];
            });
            if (message.senderId !== user.id) {
                setIsOtherTyping(false);
                chatApi.markAsRead(assistanceRequestId).catch(() => {});
            }
        };

        const handleUserTyping = (userId: string, isTyping: boolean) => {
            if (userId === user.id) return;
            setIsOtherTyping(isTyping);
            if (isTyping) {
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 5000);
            }
        };

        const connect = async () => {
            try {
                // Reuse existing connection for a new request group
                if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
                    await connectionRef.current.invoke('JoinRequestChatGroup', assistanceRequestId);
                    setIsConnected(true);
                    connectionRef.current.on('ReceiveMessage', handleReceiveMessage);
                    connectionRef.current.on('UserTyping', handleUserTyping);
                    return () => {
                        connectionRef.current?.invoke('LeaveRequestChatGroup', assistanceRequestId).catch(() => {});
                        connectionRef.current?.off('ReceiveMessage', handleReceiveMessage);
                        connectionRef.current?.off('UserTyping', handleUserTyping);
                    };
                }

                const sessionRes = await fetch('/api/auth/session');
                const { token } = await sessionRes.json().catch(() => ({ token: '' }));
                if (aborted) return;

                const hub = new signalR.HubConnectionBuilder()
                    .withUrl('/api/proxy/hubs/chat', {
                        accessTokenFactory: () => token || '',
                        // Force LongPolling so the edge proxy can handle it (no WebSocket upgrade needed)
                        transport: signalR.HttpTransportType.LongPolling,
                    })
                    .withAutomaticReconnect(RECONNECT_DELAYS)
                    .build();

                hub.onclose(() => {
                    if (!aborted) setIsConnected(false);
                });
                hub.onreconnecting(() => {
                    if (!aborted) setIsConnected(false);
                });
                hub.onreconnected(async () => {
                    if (aborted) return;
                    setIsConnected(true);
                    try {
                        await hub.invoke('JoinRequestChatGroup', currentRequestRef.current);
                    } catch {
                        // Will retry on next reconnect cycle
                    }
                    // Single refetch to heal missed messages (instead of interval polling)
                    try {
                        const data = await chatApi.getMessages(currentRequestRef.current);
                        setMessages((prev) => mergeMessages(prev, data));
                    } catch {
                        // ignore
                    }
                });

                hub.on('ReceiveMessage', handleReceiveMessage);
                hub.on('UserTyping', handleUserTyping);

                await hub.start();
                if (aborted) {
                    await hub.stop().catch(() => {});
                    return;
                }

                connectionRef.current = hub;
                await hub.invoke('JoinRequestChatGroup', assistanceRequestId);
                if (!aborted) setIsConnected(true);
            } catch {
                if (!aborted) setIsConnected(false);
            }
        };

        connect();

        // Heal-on-visible: refetch once when tab becomes visible (missed-message healing without polling)
        const onVisible = () => {
            if (document.visibilityState === 'visible') refetch();
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            aborted = true;
            document.removeEventListener('visibilitychange', onVisible);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            const hub = connectionRef.current;
            if (hub) {
                hub.invoke('LeaveRequestChatGroup', assistanceRequestId).catch(() => {});
                hub.off('ReceiveMessage', handleReceiveMessage);
                hub.off('UserTyping', handleUserTyping);
                // Keep shared connection alive for other hooks; only stop if no listeners remain.
                // Here: stop is safe because each useChat owns its lifecycle per request view.
                hub.stop()
                    .then(() => {
                        if (connectionRef.current === hub) connectionRef.current = null;
                        setIsConnected(false);
                    })
                    .catch(() => {});
            }
        };
    }, [user, assistanceRequestId, refetch]);

    const sendMessage = useCallback(
        async (text: string): Promise<boolean> => {
            const trimmed = text.trim();
            if (!trimmed || !user) return false;

            const clientId = crypto.randomUUID();
            const optimistic: ChatMessage = {
                id: -Date.now(),
                assistanceRequestId,
                senderId: user.id,
                senderName: user.name ?? '',
                message: trimmed,
                createdAt: new Date().toISOString(),
                isRead: true,
                clientId,
                pending: true,
            };
            setMessages((prev) => [...prev, optimistic]);

            // Prefer SignalR; server echo reconciles the optimistic row via ReceiveMessage.
            const hub = connectionRef.current;
            if (hub?.state === signalR.HubConnectionState.Connected) {
                try {
                    await hub.invoke('SendMessage', { assistanceRequestId, message: trimmed, clientMessageId: clientId });
                    return true;
                } catch {
                    // Fall through to REST fallback below
                }
            }

            // REST fallback (offline / hub down): replace optimistic row with the real one.
            try {
                const real = await chatApi.sendMessage({ assistanceRequestId, message: trimmed });
                setMessages((prev) =>
                    prev.map((m) => (m.clientId === clientId ? { ...real } : m)),
                );
                return true;
            } catch {
                setMessages((prev) =>
                    prev.map((m) => (m.clientId === clientId ? { ...m, pending: false, failed: true } : m)),
                );
                return false;
            }
        },
        [assistanceRequestId, user],
    );

    /** Retry a failed optimistic message. */
    const retryMessage = useCallback(
        async (clientId: string): Promise<boolean> => {
            const msg = messages.find((m) => m.clientId === clientId);
            if (!msg) return false;
            setMessages((prev) => prev.filter((m) => m.clientId !== clientId));
            return sendMessage(msg.message);
        },
        [messages, sendMessage],
    );

    const sendTypingStatus = useCallback(
        async (isTyping: boolean) => {
            // Throttle typing events: at most 1 per 1.5s, plus trailing "stopped" event.
            const now = Date.now();
            if (isTyping && now - typingThrottleRef.current < 1500) return;
            typingThrottleRef.current = now;
            const hub = connectionRef.current;
            if (hub?.state === signalR.HubConnectionState.Connected) {
                try {
                    await hub.invoke('SendTypingStatus', assistanceRequestId, isTyping);
                } catch {
                    // Typing presence is best-effort; never surface to the user.
                }
            }
        },
        [assistanceRequestId],
    );

    return {
        messages,
        isLoading,
        isConnected,
        isOtherTyping,
        sendMessage,
        retryMessage,
        refresh: refetch,
        sendTypingStatus,
    };
}
