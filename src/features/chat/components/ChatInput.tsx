"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/shared/utils";

interface ChatInputProps {
    onSend: (message: string) => void;
    onCancel: () => void;
    onClear: () => void;
    isStreaming: boolean;
    hasMessages: boolean;
}

export function ChatInput({ onSend, onCancel, isStreaming }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
    }, [input]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isStreaming) return;
        onSend(input.trim());
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const canSend = input.trim().length > 0 && !isStreaming;

    return (
        <div className="px-6 pb-6 pt-2 bg-gradient-to-t from-background via-background to-transparent">
            <form onSubmit={handleSubmit} className="relative">
                <div className={cn(
                    "flex items-end gap-3 rounded-[24px] border-2 bg-background px-5 pt-3 pb-3 transition-all duration-300",
                    "border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/40 focus-within:border-primary/60",
                    "focus-within:ring-8 focus-within:ring-primary/5 focus-within:shadow-[0_12px_40px_rgb(var(--warm-green)/0.1)]"
                )}>
                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اكتب رسالتك هنا..."
                        disabled={isStreaming}
                        dir="rtl"
                        rows={1}
                        className={cn(
                            "flex-1 resize-none bg-transparent border-none outline-none ring-0",
                            "text-[13.5px] leading-relaxed text-foreground placeholder:text-muted-foreground/40",
                            "disabled:opacity-40 max-h-[130px] scrollbar-hide py-0.5"
                        )}
                    />

                    {/* Action button */}
                    {isStreaming ? (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                            title="إيقاف"
                        >
                            <Square className="w-3.5 h-3.5 fill-current" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!canSend}
                            className={cn(
                                "flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                                canSend
                                    ? "bg-primary text-white hover:bg-warm-green-dark shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95"
                                    : "bg-muted/50 text-muted-foreground/30 cursor-not-allowed"
                            )}
                            title="إرسال"
                        >
                            <Send className="w-4 h-4 rotate-180" />
                        </button>
                    )}
                </div>
            </form>

            <p className="text-center text-[11px] text-muted-foreground/35 font-medium mt-2">
                المساعد الذكي قد يُخطئ أحياناً · تحقق من المعلومات المهمة
            </p>
        </div>
    );
}
