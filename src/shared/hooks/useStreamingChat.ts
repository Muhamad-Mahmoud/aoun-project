"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { logger } from "@/lib/logger";

export interface ChatMessage {
    role: "user" | "model";
    content: string;
}

interface UseStreamingChatOptions {
    /** Full SSE endpoint URL */
    apiUrl: string;
    /** localStorage key for message persistence (default: "chat_messages") */
    storageKey?: string;
}

const STORAGE_KEY = "aoun_chat_messages";

/**
 * Simple Base64 obfuscation to prevent casual plaintext snooping
 * This is NOT encryption — just basic obfuscation for localStorage.
 */
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
        // Keep only last 50 messages to avoid storage bloat
        const toSave = messages.slice(-50);
        localStorage.setItem(key, encode(JSON.stringify(toSave)));
    } catch {
        // Storage full or unavailable — fail silently
    }
}

/**
 * Custom hook for streaming AI chat via Server-Sent Events (SSE).
 * Messages are persisted to localStorage and restored on mount.
 *
 * Backend sends JSON-encoded SSE chunks: data: "text with \\n"
 */
export function useStreamingChat({
    apiUrl,
    storageKey = STORAGE_KEY,
}: UseStreamingChatOptions) {
    const [messages, setMessages] = useState<ChatMessage[]>(() =>
        loadMessages(storageKey)
    );
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const messagesRef = useRef<ChatMessage[]>(messages);

    // Keep ref in sync
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Persist messages to localStorage whenever they change
    useEffect(() => {
        saveMessages(storageKey, messages);
    }, [messages, storageKey]);

    const sendMessage = useCallback(
        async (userMessage: string) => {
            if (!userMessage.trim() || isStreaming) return;

            // 1. Append user message immediately
            const userMsg: ChatMessage = { role: "user", content: userMessage };
            setMessages((prev) => [...prev, userMsg]);

            // 2. Append empty AI placeholder (filled token-by-token)
            setMessages((prev) => [...prev, { role: "model", content: "" }]);

            setIsStreaming(true);
            abortRef.current = new AbortController();

            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: userMessage,
                        history: messagesRef.current.slice(-20),
                    }),
                    signal: abortRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                // 3. Read SSE stream with a line buffer
                const reader = response.body!.getReader();
                const decoder = new TextDecoder("utf-8");
                let fullText = "";
                let buffer = "";

                const flush = (text: string) => {
                    if (!text) return;

                    // Sanitize: filter out suspicious symbols/tokens (e.g. 🖳 or control-like hallucinations)
                    // This regex removes common problematic non-textual symbols while keeping standard emojis
                    const sanitized = text.replace(/[\u{1F5B3}\u{1F5B4}\u{1F5B5}\u{1F5B6}\u{1F5B7}\u{1F5B8}\u{1F5B9}\u{1F5BA}]/gu, "");

                    if (!sanitized) return;

                    fullText += sanitized;
                    setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: "model", content: fullText };
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

                        let content: string;
                        try {
                            content = JSON.parse(jsonStr);
                        } catch {
                            content = jsonStr; // fallback for non-JSON
                        }

                        // تقسيم أي نص كبير (زي الردود المحفوظة في الكاش) لقطع صغيرة من 4 حروف
                        // عشان نضمن إن التأثير يبان دايماً كلمة بكلمة، حتى لو السيرفر بعت الرد كله في لحظة واحدة
                        const tokens = content.match(/[\s\S]{1,4}/g) || [];
                        for (const token of tokens) {
                            // لو المستخدم داس "إيقاف" نوقف الطباعة فوراً
                            if (abortRef.current?.signal.aborted) break;
                            
                            flush(token);
                            
                            // تأخير من 15 ل 35 ملي ثانية بين كل 4 حروف
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
                        updated[updated.length - 1] = {
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
        [apiUrl, isStreaming],
    );

    /** Cancel the current streaming response */
    const cancelStream = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    /** Clear all messages (also clears localStorage) */
    const clearChat = useCallback(() => {
        setMessages([]);
        try { localStorage.removeItem(storageKey); } catch { /* noop */ }
    }, [storageKey]);

    return { messages, isStreaming, sendMessage, cancelStream, clearChat };
}
