"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { logger } from "@/lib/logger";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api/config";

export interface ChatMessage {
    role: "user" | "model";
    content: string;
    progress?: {
        message: string;
        step: number;
        total_steps: number;
    };
    confirmation?: {
        confirmation_id: string;
        tool_name: string;
        message: string;
        parameters?: any;
    };
    planning?: {
        message: string;
        tool_calls: string[];
    };
}

interface UseStreamingChatOptions {
    /** Full SSE endpoint URL */
    apiUrl: string;
    /** localStorage key for message persistence */
    storageKey?: string;
    /** Dynamic connection options */
    session_id?: string;
    family_id?: string;
    access_token?: string;
}

const STORAGE_KEY = "aoun_chat_messages";

function encode(data: string): string {
    try { return btoa(unescape(encodeURIComponent(data))); } catch { return data; }
}
function decode(data: string): string {
    try { return decodeURIComponent(escape(atob(data))); } catch { return data; }
}

function loadMessages(key: string): ChatMessage[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return [];
        return JSON.parse(decode(stored)) as ChatMessage[];
    } catch {
        return [];
    }
}

function saveMessages(key: string, messages: ChatMessage[]) {
    if (typeof window === "undefined") return;
    try {
        const toSave = messages.slice(-50);
        localStorage.setItem(key, encode(JSON.stringify(toSave)));
    } catch {
        // noop
    }
}

export function useStreamingChat({
    apiUrl,
    storageKey = STORAGE_KEY,
    session_id,
    family_id,
    access_token
}: UseStreamingChatOptions) {
    const [messages, setMessages] = useState<ChatMessage[]>(() =>
        loadMessages(storageKey)
    );
    const [isStreaming, setIsStreaming] = useState(false);
    const [chatMode, setChatMode] = useState<"chat" | "agent">("agent");
    const abortRef = useRef<AbortController | null>(null);
    const messagesRef = useRef<ChatMessage[]>(messages);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        saveMessages(storageKey, messages);
    }, [messages, storageKey]);

    const sendMessage = useCallback(
        async (userMessage: string, skipAddingUserMessage = false, customHistory?: {role: string, content: string}[]) => {
            if (!userMessage.trim() || isStreaming) return;

            if (!skipAddingUserMessage) {
                const userMsg: ChatMessage = { role: "user", content: userMessage };
                setMessages((prev) => [...prev, userMsg]);
            }
            setMessages((prev) => [...prev, { role: "model", content: "" }]);

            setIsStreaming(true);
            abortRef.current = new AbortController();

            // Extract just the core fields to prevent schema corruption
            const history = customHistory || messagesRef.current.slice(-20).map(m => ({ 
                role: m.role, 
                content: m.content 
            }));

            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": "dev-awn-ai-service-key-2026",
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        history: history,
                        session_id: session_id || "guest-session",
                        mode: chatMode,
                        family_id: family_id || "",
                        access_token: access_token || ""
                    }),
                    signal: abortRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const reader = response.body!.getReader();
                const decoder = new TextDecoder("utf-8");
                let fullText = "";
                let buffer = "";

                const flush = (text: string) => {
                    if (!text) return;
                    const sanitized = text.replace(/[\u{1F5B3}\u{1F5B4}\u{1F5B5}\u{1F5B6}\u{1F5B7}\u{1F5B8}\u{1F5B9}\u{1F5BA}]/gu, "");
                    if (!sanitized) return;

                    fullText += sanitized;
                    setMessages((prev) => {
                        const updated = [...prev];
                        const lastMsg = updated[updated.length - 1];
                        updated[updated.length - 1] = { ...lastMsg, content: fullText };
                        return updated;
                    });
                };

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() ?? "";

                    for (const line of lines) {
                        const raw = line.replace(/\r$/, "");

                        if (raw === "data: [DONE]") break;
                        if (raw.startsWith("data: [ERROR]")) {
                            logger.warn("Stream error received");
                            break;
                        }
                        if (!raw.startsWith("data: ")) continue;

                        const jsonStr = raw.slice(6);
                        if (!jsonStr) continue;

                        let content: any = null;
                        let isJson = false;

                        try {
                            content = JSON.parse(jsonStr);
                            isJson = true;
                        } catch {
                            content = jsonStr;
                        }

                        if (isJson && content && typeof content === 'object') {
                            if (content.type === 'agent_planning') {
                                setMessages((prev) => {
                                    const updated = [...prev];
                                    const lastMsg = updated[updated.length - 1];
                                    updated[updated.length - 1] = { 
                                        ...lastMsg, 
                                        planning: content 
                                    };
                                    return updated;
                                });
                                continue;
                            }
                            if (content.type === 'confirmation_request') {
                                setMessages((prev) => {
                                    const updated = [...prev];
                                    const lastMsg = updated[updated.length - 1];
                                    updated[updated.length - 1] = { 
                                        ...lastMsg, 
                                        confirmation: content 
                                    };
                                    return updated;
                                });
                                continue;
                            }
                            if (content.type === 'agent_progress') {
                                setMessages((prev) => {
                                    const updated = [...prev];
                                    const lastMsg = updated[updated.length - 1];
                                    updated[updated.length - 1] = { 
                                        ...lastMsg, 
                                        progress: content 
                                    };
                                    return updated;
                                });
                                continue;
                            }
                        }

                        let textStr = isJson && typeof content === 'string' ? content : (isJson ? JSON.stringify(content) : content);

                        const tokens = textStr.match(/[\s\S]{1,4}/g) || [];
                        for (const token of tokens) {
                            if (abortRef.current?.signal.aborted) break;
                            flush(token);
                            await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 20));
                        }
                    }
                }
            } catch (error: unknown) {
                const err = error as Error;
                if (err.name !== "AbortError") {
                    logger.error("Streaming failed", err);
                    setMessages((prev) => {
                        const updated = [...prev];
                        const last = updated[updated.length - 1];
                        updated[updated.length - 1] = {
                            ...last,
                            role: "model",
                            content: "عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى.",
                        };
                        return updated;
                    });
                }
            } finally {
                setIsStreaming(false);
                abortRef.current = null;
            }
        },
        [apiUrl, isStreaming, chatMode, session_id, family_id, access_token],
    );

    const cancelStream = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    const clearChat = useCallback(() => {
        setMessages([]);
        try { localStorage.removeItem(storageKey); } catch { /* noop */ }
    }, [storageKey]);

    /**
     * Calls the real /api/ai/chat/confirm endpoint via the proxy gateway.
     * After approval, re-sends the last user message so the agent continues
     * executing the now-approved tool.
     */
    const confirmAction = useCallback(
        async (confirmationId: string, approved: boolean) => {
            const endpoint = API_ENDPOINTS.ai.chatConfirm;
            const url = `${endpoint}?confirmation_id=${encodeURIComponent(confirmationId)}&approved=${approved}`;

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    logger.error(`Confirmation API call failed: ${res.status}`);
                    return;
                }

                logger.info(`Confirmation ${approved ? "approved" : "rejected"} for ID: ${confirmationId}`);

                if (approved) {
                    // Send an explicit approval message from the user
                    // We keep the history intact so the LLM sees the confirmation flow.
                    
                    let paramsText = "";
                    
                    // 1. Remove the confirmation object from the last AI message so the buttons disappear from UI
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastModelMsgIndex = newMessages.length - 1;
                        if (newMessages[lastModelMsgIndex].role === "model" && newMessages[lastModelMsgIndex].confirmation) {
                            const conf = newMessages[lastModelMsgIndex].confirmation;
                            if (conf?.parameters) {
                                const cleanParams = { ...conf.parameters };
                                delete cleanParams.thought_process;
                                paramsText = JSON.stringify(cleanParams);
                            }
                            const { confirmation, ...msgWithoutConfirmation } = newMessages[lastModelMsgIndex];
                            newMessages[lastModelMsgIndex] = msgWithoutConfirmation;
                        }
                        return newMessages;
                    });

                    // 2. The user confirmed, so we simulate the user typing "نعم" with the context args!
                    // This perfectly matches the prompt's instruction: "كلمات التأكيد: «نعم»... → استدعِ الأداة فوراً"
                    // And by injecting the args, the LLM doesn't forget the context of the internal tools it ran previously!
                    const userMsg = paramsText 
                        ? `نعم، أوافق على تنفيذ العملية بالمعطيات التالية: ${paramsText}` 
                        : "نعم، أوافق";
                    await sendMessage(userMsg, false);

                } else {
                    // Rejection — just append a system note, do not re-trigger
                    setMessages((prev) => [
                        ...prev,
                        { role: "model", content: "❌ تم رفض العملية. يمكنك طلب شيء آخر أو توضيح ما تريد." },
                    ]);
                }
            } catch (err) {
                logger.error("confirmAction fetch failed", err as Error);
            }
        },
        [sendMessage]
    );

    return { messages, isStreaming, chatMode, setChatMode, sendMessage, cancelStream, clearChat, confirmAction };
}
