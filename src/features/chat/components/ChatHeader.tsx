"use client";

import React from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ChatHeaderProps {
    onClear: () => void;
    hasMessages: boolean;
}

export function ChatHeader({ onClear, hasMessages }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card">
            {/* Left: Identity */}
            <div className="flex items-center gap-3.5">
                {/* Icon */}
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-warm-green-dark flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="w-5 h-5 text-white" />
                    {/* Online dot */}
                    <span className="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card shadow-sm" />
                </div>

                <div>
                    <h2 className="text-[15px] font-extrabold text-foreground leading-tight tracking-tight">
                        المساعد الذكي
                    </h2>
                    <p className="text-[11.5px] text-muted-foreground/70 font-medium leading-tight mt-0.5">
                        متاح دائماً · مدعوم بالذكاء الاصطناعي
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            {hasMessages && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/60 rounded-xl gap-1.5 text-xs font-semibold h-8 px-3"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    محادثة جديدة
                </Button>
            )}
        </div>
    );
}
