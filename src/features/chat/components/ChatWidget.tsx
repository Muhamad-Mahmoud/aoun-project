"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/shared/utils";
import { ChatWindow } from "./ChatWindow";

/**
 * Global Chat Widget
 * Returns a React Fragment so the `dynamic()` wrapper only wraps these children tightly.
 */
export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(false);

    // Initial badge pop
    useEffect(() => {
        const timer = setTimeout(() => setShowBadge(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Manage body scroll lock when chat is open - ONLY on mobile/tablet
    useEffect(() => {
        const isMobileOrTablet = window.innerWidth < 1024; // Tailwind 'lg' breakpoint
        
        if (isOpen && isMobileOrTablet) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden"; // for older iOS Safari
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setShowBadge(false);
    };

    return (
        <>
            {/* Backdrop Overlay - Mobile/Tablet only. Completely unmounts when closed. */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity block lg:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                    data-widget="chat-backdrop"
                />
            )}

            {/* Chat Window - strictly separated from button to avoid nested wrapper bugs */}
            {isOpen && (
                <div
                    className="fixed bottom-[88px] sm:bottom-[104px] left-6 z-[9999] w-[92vw] sm:w-[420px] h-[min(600px,80vh)] max-h-[80vh] bg-background/95 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden flex flex-col pointer-events-auto"
                    dir="rtl"
                    data-widget="global-chat-window"
                >
                    <ChatWindow onClose={toggleChat} className="border-none shadow-none bg-transparent h-full" />
                </div>
            )}

            {/* Toggle Button - fixed to bottom-left *exactly* where it should be */}
            <div 
                className={cn(
                    "fixed bottom-6 left-6 pointer-events-auto flex items-end justify-end",
                    isOpen ? "z-[9999]" : "z-50"
                )}
                data-widget="global-chat-button-wrapper"
            >
                <button
                    onClick={toggleChat}
                    data-widget="global-chat-button"
                    className={cn(
                        "group w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 overflow-hidden ring-4 ring-white/10 shrink-0 relative select-none",
                        isOpen
                            ? "bg-muted text-foreground"
                            : "bg-primary/90 backdrop-blur-md text-white hover:bg-warm-green-dark hover:shadow-primary/40 hover:-translate-y-1.5"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />

                    {isOpen ? (
                        <X className="w-7 h-7 relative z-10 pointer-events-none" />
                    ) : (
                        <div className="relative pointer-events-none">
                            <MessageCircle className="w-8 h-8 fill-current opacity-30 absolute -inset-0.5 scale-110 blur-[2px]" />
                            <MessageCircle className="w-8 h-8 relative z-10 drop-shadow-sm" />
                            {showBadge && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive border-2 border-primary rounded-full animate-pulse shadow-sm" />
                            )}
                        </div>
                    )}

                    {!isOpen && (
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 pointer-events-none" />
                    )}
                </button>
            </div>
        </>
    );
}
