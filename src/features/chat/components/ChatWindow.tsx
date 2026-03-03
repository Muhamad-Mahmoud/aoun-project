"use client";

import React, { useRef, useEffect } from "react";
import { useStreamingChat } from "@/shared/hooks";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api/config";
import { ChatHeader } from "./ChatHeader";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { Bot, MessageSquare, HelpCircle, FileText } from "lucide-react";
import { cn } from "@/shared/utils";

const SUGGESTIONS = [
    { label: "كيف تعمل منصة عون؟", icon: HelpCircle },
    { label: "كيف أقدم طلب مساعدة؟", icon: MessageSquare },
    { label: "ما هي خطوات التسجيل؟", icon: FileText },
];

interface ChatWindowProps {
    className?: string;
}

export function ChatWindow({ className }: ChatWindowProps) {
    const apiUrl = `${API_CONFIG.aiBaseURL}${API_ENDPOINTS.ai.chatStream}`;
    const { messages, isStreaming, sendMessage, cancelStream, clearChat } =
        useStreamingChat({ apiUrl });

    const scrollRef = useRef<HTMLDivElement>(null);
    const hasMessages = messages.length > 0;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div className={cn("flex flex-col h-full bg-background rounded-2xl border border-border/50 shadow-md overflow-hidden", className)}>
            {/* Header */}
            <ChatHeader onClear={clearChat} hasMessages={hasMessages} />

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-6 scroll-smooth"
            >
                {!hasMessages ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-8">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-warm-green-pale flex items-center justify-center border border-primary/10">
                            <Bot className="w-10 h-10 text-primary/40" />
                        </div>

                        <div>
                            <h3 className="text-lg font-extrabold text-foreground mb-1">
                                أهلاً، كيف يمكنني مساعدتك؟
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                                اسألني عن خدمات منصة عون وأنا هنا للمساعدة
                            </p>
                        </div>

                        {/* Suggestion pills */}
                        <div className="flex flex-col gap-2 w-full max-w-sm">
                            {SUGGESTIONS.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <button
                                        key={s.label}
                                        onClick={() => sendMessage(s.label)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-card hover:bg-muted/50 hover:border-primary/25 text-sm font-semibold text-foreground/80 hover:text-foreground transition-all duration-200 text-start"
                                    >
                                        <Icon className="w-4 h-4 text-primary/50 flex-shrink-0" />
                                        {s.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Message list */
                    <div className="max-w-4xl mx-auto space-y-7 pb-4">
                        {messages.map((msg, i) => (
                            <ChatBubble
                                key={i}
                                message={msg}
                                isLast={i === messages.length - 1}
                                isStreaming={isStreaming}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Input */}
            <ChatInput
                onSend={sendMessage}
                onCancel={cancelStream}
                onClear={clearChat}
                isStreaming={isStreaming}
                hasMessages={hasMessages}
            />
        </div>
    );
}
