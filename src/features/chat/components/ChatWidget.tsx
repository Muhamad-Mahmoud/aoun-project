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
        <div 
            className="fixed bottom-6 left-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none" 
            dir="rtl"
            style={{ left: '24px', right: 'auto', bottom: '24px' }}
            data-widget="global-chat"
        >
            {/* Chat Window Overlay - Conditionally rendered to ensure it doesn't block when closed */}
            <div
                className={cn(
                    "w-[92vw] sm:w-[420px] h-[600px] max-h-[80vh] bg-background/95 backdrop-blur-xl rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden transition-all duration-500 origin-bottom-left",
                    isOpen 
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto block" 
                        : "opacity-0 scale-90 translate-y-10 pointer-events-none invisible pointer-events-none h-0 w-0"
                )}
            >
                {isOpen && <ChatWindow className="border-none shadow-none bg-transparent h-full" />}
            </div>

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className={cn(
                    "group relative w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 overflow-hidden ring-4 ring-white/10 pointer-events-auto shrink-0",
                    isOpen
                        ? "bg-muted text-foreground"
                        : "bg-primary/90 backdrop-blur-md text-white hover:bg-warm-green-dark hover:opacity-100 hover:shadow-primary/40 hover:-translate-y-1.5"
                )}
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
        </div>
    );
}
