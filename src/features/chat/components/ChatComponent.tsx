"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "../hooks/useChat";
import { useAuthContext } from "@/shared/providers";
import { Send, User as UserIcon, Loader2, CheckCheck, Paperclip, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ChatComponentProps {
    assistanceRequestId: number;
    isStandalone?: boolean;
    otherPartyName?: string;
    onBack?: () => void;
}

const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
};

const formatDateForSeparator = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "اليوم";
    if (d.toDateString() === yesterday.toDateString()) return "أمس";
    return d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export function ChatComponent({ assistanceRequestId, isStandalone = false, otherPartyName, onBack }: ChatComponentProps) {
    const { user } = useAuthContext();
    const { messages, isLoading, isConnected, isOtherTyping, sendMessage, sendTypingStatus } = useChat(assistanceRequestId);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [showScrollFAB, setShowScrollFAB] = useState(false);
    const [unreadScrollCount, setUnreadScrollCount] = useState(0);
    const prevMessagesLength = useRef(messages.length);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setUnreadScrollCount(0);
        setShowScrollFAB(false);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isScrolledUp = scrollHeight - scrollTop - clientHeight > 120;
        setShowScrollFAB(isScrolledUp);
        if (!isScrolledUp) {
            setUnreadScrollCount(0);
        }
    };

    useEffect(() => {
        if (messages.length > prevMessagesLength.current) {
            if (showScrollFAB) {
                setUnreadScrollCount(prev => prev + (messages.length - prevMessagesLength.current));
            } else {
                scrollToBottom();
            }
        }
        prevMessagesLength.current = messages.length;
    }, [messages, showScrollFAB]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        sendTypingStatus(false);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

        const success = await sendMessage(newMessage);
        if (success) {
            setNewMessage("");
        } else {
            alert("فشل إرسال الرسالة. يرجى التحقق من اتصال الإنترنت أو خادم المحادثة.");
        }
        setIsSending(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        sendTypingStatus(true);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => sendTypingStatus(false), 2000);
    };

    // Group messages by date
    const groupedMessages = useMemo(() => {
        const groups: { date: string; messages: typeof messages }[] = [];
        messages.forEach(msg => {
            const dateStr = formatDateForSeparator(msg.createdAt);
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.date === dateStr) {
                lastGroup.messages.push(msg);
            } else {
                groups.push({ date: dateStr, messages: [msg] });
            }
        });
        return groups;
    }, [messages]);

    return (
        <div className={`flex flex-col bg-slate-50/50 ${isStandalone ? 'h-full rounded-none border-none' : 'h-[600px] rounded-2xl border border-slate-200 shadow-sm'} overflow-hidden relative`}>
            {/* Header */}
            {(!isStandalone || otherPartyName || onBack) && (
                <div className={`shrink-0 px-5 py-4 bg-white/95 backdrop-blur-md flex items-center justify-between border-b border-slate-100 z-10 ${isStandalone ? 'rounded-t-none' : 'rounded-t-2xl'}`}>
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button 
                                onClick={onBack} 
                                title="العودة للقائمة"
                                className="lg:hidden w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        )}
                        <div className="w-11 h-11 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                            <UserIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm md:text-base">
                                {otherPartyName || "التواصل المباشر"}
                            </h3>
                            {otherPartyName && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <p className="text-xs font-medium text-slate-500">متصل الآن</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div 
                className={`flex-1 overflow-y-auto p-4 md:p-6 z-10 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200/80 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent`}
                onScroll={handleScroll}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-secondary opacity-80" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-2">
                            <UserIcon className="w-10 h-10 text-slate-300" />
                        </div>
                        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm max-w-sm">
                            <p className="text-slate-800 font-bold mb-1">لا توجد رسائل حتى الآن</p>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {user?.role === "Association" 
                                    ? "ابدأ المحادثة مع الأسرة للحصول على تفاصيل إضافية عن الطلب."
                                    : "سيقوم ممثل الجمعية بالتواصل معك قريباً."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence initial={false}>
                        {groupedMessages.map((group, groupIdx) => (
                            <div key={groupIdx} className="space-y-3">
                                {/* Date Separator */}
                                <div className="flex justify-center my-6">
                                    <div className="bg-white/80 backdrop-blur-md text-slate-500 font-medium text-xs px-4 py-1.5 rounded-full shadow-sm border border-slate-100/60">
                                        {group.date}
                                    </div>
                                </div>

                                {/* Group Messages */}
                                {group.messages.map((msg, idx) => {
                                    const isMe = msg.senderId === user?.id;
                                    const isFirstInBlock = idx === 0 || group.messages[idx - 1].senderId !== msg.senderId;

                                    return (
                                        <motion.div 
                                            key={msg.id} 
                                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.25, ease: [0.19, 1.0, 0.22, 1.0] }}
                                            className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} ${isFirstInBlock ? 'mt-3' : 'mt-1'}`}
                                        >
                                            {!isMe && isFirstInBlock && (
                                                <span className="text-[11px] font-bold text-slate-500 mb-1 px-1">
                                                    {msg.senderName}
                                                </span>
                                            )}
                                            <div className={`relative px-4 pt-2.5 pb-2 max-w-[85%] md:max-w-[70%] text-[14.5px] leading-relaxed shadow-sm transition-all ${
                                                isMe 
                                                    ? 'bg-secondary text-white' 
                                                    : 'bg-white text-slate-800 border border-slate-100'
                                            } ${
                                                isMe
                                                    ? isFirstInBlock ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl'
                                                    : isFirstInBlock ? 'rounded-2xl rounded-tl-sm' : 'rounded-2xl'
                                            }`}>
                                                <div className="flex flex-wrap items-end justify-end gap-3">
                                                    <span className="whitespace-pre-wrap break-words text-start flex-1" style={{ minWidth: 0 }}>
                                                        {msg.message}
                                                    </span>
                                                    <div className={`flex items-center gap-1 shrink-0 ${isMe ? '-mr-1' : ''} translate-y-[2px]`}>
                                                        <span className={`text-[10px] leading-none ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </span>
                                                        {isMe && (
                                                            <CheckCheck className={`w-[14px] h-[14px] transition-all duration-500 ease-out ${
                                                                msg.isRead 
                                                                    ? 'text-[#53bdeb] scale-110 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]' 
                                                                    : 'text-white/50'
                                                            }`} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                        </AnimatePresence>

                        {/* Typing Indicator */}
                        <AnimatePresence>
                            {isOtherTyping && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                                    className="flex flex-col items-start mt-2"
                                >
                                    <div className="bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 mr-1">
                                        {otherPartyName ? `${otherPartyName} يكتب...` : 'يكتب الآن...'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Floating Scroll-to-bottom FAB */}
            <AnimatePresence>
                {showScrollFAB && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute bottom-24 right-6 z-20"
                    >
                        <Button 
                            onClick={scrollToBottom}
                            size="icon"
                            className="w-10 h-10 rounded-full bg-white text-slate-600 shadow-[0_4px_16px_rgb(0,0,0,0.12)] border border-slate-100 hover:bg-slate-50 relative group transition-transform hover:-translate-y-0.5"
                        >
                            <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-colors" />
                            {unreadScrollCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                    {unreadScrollCount > 99 ? '99+' : unreadScrollCount}
                                </span>
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="shrink-0 p-4 bg-white border-t border-slate-100/80 flex items-center gap-3 z-10 shadow-[0_-4px_20px_rgb(0,0,0,0.02)]">
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl shrink-0 w-11 h-11"
                    disabled={isSending || isLoading || (messages.length === 0 && user?.role === "Family")}
                >
                    <Paperclip className="w-5 h-5" />
                </Button>
                
                <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder={
                            messages.length === 0 && user?.role === "Family"
                                ? "في انتظار رسالة من الجمعية لفتح المحادثة..."
                                : "اكتب رسالتك هنا..."
                        }
                        className="flex-1 h-11 px-4 text-[14.5px] bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary focus:bg-white text-slate-800 disabled:opacity-50 disabled:bg-slate-100 transition-all placeholder:text-slate-400"
                        disabled={isSending || isLoading || (messages.length === 0 && user?.role === "Family")}
                    />
                    <Button 
                        type="submit" 
                        disabled={!newMessage.trim() || isSending || isLoading || (messages.length === 0 && user?.role === "Family")}
                        className="w-11 h-11 p-0 rounded-xl bg-secondary hover:bg-secondary/90 shrink-0 text-white shadow-md shadow-secondary/20 transition-transform active:scale-95 disabled:shadow-none"
                    >
                        {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 ml-0.5" style={{ transform: 'rotate(180deg)' }} />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
