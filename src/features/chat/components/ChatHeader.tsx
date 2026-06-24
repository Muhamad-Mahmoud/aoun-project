"use client";

import React from "react";
import { Bot, Trash2, X, Sparkles, CircleDot } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils";

interface ChatHeaderProps {
    onClear: () => void;
    hasMessages: boolean;
    onClose?: () => void;
}

export function ChatHeader({ onClear, hasMessages, onClose }: ChatHeaderProps) {
    return (
        <div className="flex flex-col border-b border-slate-100 bg-white/95 backdrop-blur-xl sticky top-0 z-10 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                {/* Left: Identity */}
                <div className="flex items-center gap-3 w-full">
                    {/* Glowing Circular Avatar */}
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 border-2 border-white">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
                        {/* Online dot */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    </div>

                    <div className="flex flex-col justify-center overflow-hidden">
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-[15px] sm:text-[16px] font-black text-slate-900 truncate">
                                المساعد الذكي
                            </h2>
                            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                        </div>
                        <p className="text-[11px] sm:text-[12px] font-bold text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            متصل وجاهز للمساعدة
                        </p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {hasMessages && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClear}
                            aria-label="مسح المحادثة"
                            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full h-9 w-9 p-0 shrink-0 transition-colors"
                            title="مسح المحادثة"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-full h-9 px-4 flex items-center gap-2 font-bold text-xs transition-all border border-slate-200 shadow-sm"
                            title="إغلاق المحادثة والعودة"
                        >
                            <span className="hidden sm:inline">إغلاق</span>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

        </div>
    );
}
