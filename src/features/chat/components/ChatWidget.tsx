"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { cn } from "@/shared/utils";
import { ChatWindow } from "./ChatWindow";

/**
 * Global Chat Widget
 * Floating toggleable chat available across all pages.
 */
export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(false);

    // Show a subtle badge after a short delay to grab attention (Landing only feel)
    useEffect(() => {
        const timer = setTimeout(() => setShowBadge(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setShowBadge(false);
    };

    return (
        <>
            {/* Chat Window Overlay */}
            <div
                className={cn(
                    "fixed bottom-[88px] sm:bottom-[104px] w-[92vw] sm:w-[420px] h-[min(600px,80vh)] max-h-[80vh] bg-background/95 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden transition-all duration-500 flex flex-col",
                    isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto visible z-[60]"
                        : "opacity-0 translate-y-10 pointer-events-none invisible -z-50"
                )}
                dir="rtl"
                style={{ left: "24px", right: "auto" }}
                data-widget="global-chat-window"
            >
                <ChatWindow onClose={toggleChat} className="border-none shadow-none bg-transparent h-full" />
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                data-widget="global-chat-button"
                className={cn(
                    "fixed bottom-6 z-[9999] group w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 overflow-hidden ring-4 ring-white/10 shrink-0 pointer-events-auto",
                    isOpen
                        ? "bg-muted text-foreground"
                        : "bg-primary/90 backdrop-blur-md text-white hover:bg-warm-green-dark hover:opacity-100 hover:shadow-primary/40 hover:-translate-y-1.5"
                )}
                style={{ left: '24px', right: 'auto' }}
            >
                {/* Internal Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />

                {isOpen ? (
                    <X className="w-7 h-7 relative z-10" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="w-8 h-8 fill-current opacity-30 absolute -inset-0.5 scale-110 blur-[2px]" />
                        <MessageCircle className="w-8 h-8 relative z-10 drop-shadow-sm" />
                        
                        {/* Notification Badge */}
                        {showBadge && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive border-2 border-primary rounded-full animate-pulse shadow-sm" />
                        )}
                    </div>
                )}
                
                {/* Subtle Shine Animation */}
                {!isOpen && (
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
                )}
            </button>
        </>
    );
}
