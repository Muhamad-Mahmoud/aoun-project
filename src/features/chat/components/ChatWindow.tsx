"use client";

import React, { useRef, useEffect } from "react";
import { useStreamingChat } from "@/shared/hooks";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api/config";
import { ChatHeader } from "./ChatHeader";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { Bot, MessageSquare, HelpCircle, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
    { label: "كيف تعمل منصة عون؟", icon: HelpCircle },
    { label: "كيف أقدم طلب مساعدة؟", icon: MessageSquare },
    { label: "ما هي خطوات التسجيل؟", icon: FileText },
];

interface ChatWindowProps {
    className?: string;
    onClose?: () => void;
}

export function ChatWindow({ className, onClose }: ChatWindowProps) {
    const { user, token } = useAuth();
    const apiUrl = API_ENDPOINTS.ai.chatStream;
    const { messages, isStreaming, chatMode, setChatMode, sendMessage, cancelStream, clearChat, confirmAction } =
        useStreamingChat({ 
            apiUrl,
            session_id: user?.id,
            family_id: user?.id, // assuming family_id maps to user.id for family accounts
            access_token: token || undefined
        });

    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollFAB, setShowScrollFAB] = React.useState(false);
    const hasMessages = messages.length > 0;

    const scrollToBottom = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
        setShowScrollFAB(isScrolledUp);
    };

    useEffect(() => {
        // Auto scroll on new messages if not scrolled up
        if (!showScrollFAB) {
            const node = scrollRef.current;
            if (!node) return;
            const frame = window.requestAnimationFrame(() => {
                node.scrollTop = node.scrollHeight;
            });
            return () => window.cancelAnimationFrame(frame);
        }
    }, [messages, showScrollFAB]);

    return (
        <div className={cn("flex flex-col h-full bg-slate-50 relative rounded-2xl border border-slate-200 shadow-lg overflow-hidden", className)}>
            {/* Subtle AI background watermark / glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <ChatHeader 
                onClear={clearChat} 
                hasMessages={hasMessages} 
                onClose={onClose} 
            />

            {/* Messages */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 sm:px-5 py-6 scroll-smooth relative z-10 scrollbar-hide"
            >
                {!hasMessages ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-8 relative z-10">
                        {/* Glowing Icon */}
                        <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary via-primary/90 to-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgb(var(--primary)/0.2)] border-2 border-white/40 group">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                            <div className="absolute inset-0 rounded-[32px] bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                            <Bot className="w-12 h-12 text-white drop-shadow-lg relative z-10 animate-bounce" style={{ animationDuration: '3s' }} />
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">
                                أهلاً، كيف يمكنني مساعدتك؟
                            </h3>
                            <p className="text-[15px] font-medium text-slate-500 max-w-sm leading-relaxed">
                                المساعد الذكي (Aoun AI) جاهز للإجابة على استفساراتك حول المنصة وتقديم الدعم الفوري
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
                                onAction={sendMessage}
                                onConfirm={confirmAction}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Scroll-to-bottom FAB */}
            <AnimatePresence>
                {showScrollFAB && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-[90px] right-6 z-20"
                    >
                        <button 
                            onClick={scrollToBottom}
                            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-slate-600 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center justify-center hover:bg-slate-50 hover:text-primary transition-all active:scale-95 group"
                            aria-label="النزول لأسفل"
                        >
                            <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <ChatInput
                onSend={sendMessage}
                onCancel={cancelStream}
                isStreaming={isStreaming}
            />
        </div>
    );
}
