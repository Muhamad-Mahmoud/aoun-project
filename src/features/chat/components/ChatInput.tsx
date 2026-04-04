"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square, Mic } from "lucide-react";
import { cn } from "@/shared/utils";

interface ChatInputProps {
    onSend: (message: string) => void;
    onCancel: () => void;
    isStreaming: boolean;
}

export const ChatInput = React.memo(function ChatInput({ onSend, onCancel, isStreaming }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const transcriptRef = useRef("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        const frame = window.requestAnimationFrame(() => {
            if (!el) return;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
        });

        return () => window.cancelAnimationFrame(frame);
    }, [input]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isStreaming || isListening) return;
        onSend(input.trim());
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const startListening = () => {
        if (typeof window === "undefined") return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("المتصفح لا يدعم التحويل الصوتي للنص. جرّب كروم أو إيدج على سطح المكتب.");
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = "ar-EG";
            recognition.interimResults = true;
            recognition.continuous = false;
            transcriptRef.current = "";

            recognition.onstart = () => setIsListening(true);

            recognition.onresult = (event: any) => {
                let finalText = "";
                let interimText = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalText += transcript + " ";
                    } else {
                        interimText += transcript + " ";
                    }
                }
                const text = (finalText || interimText).trim();
                transcriptRef.current = text;
                setInput(text);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                alert("تعذر تحويل الصوت إلى نص. يرجى المحاولة مرة أخرى أو استخدام الكتابة.");
            };

            recognition.onend = () => {
                setIsListening(false);
                recognitionRef.current = null;
                const text = transcriptRef.current.trim();
                if (text) {
                    onSend(text);
                    setInput("");
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (error: any) {
            console.error("Speech recognition failed:", error);
            alert("تعذر بدء الاستماع. تحقق من إذن الميكروفون ثم حاول مجدداً.");
            setIsListening(false);
        }
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
    };

    const isInputEmpty = input.trim().length === 0;
    const canSendText = !isInputEmpty && !isStreaming && !isListening;

    return (
        <div className="px-6 pb-6 pt-2 bg-gradient-to-t from-background via-background to-transparent">
            <form onSubmit={handleSubmit} className="relative">
                <div className={cn(
                    "flex items-end gap-3 rounded-[24px] border-2 bg-background px-5 pt-3 pb-3 transition-all duration-300",
                    "border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/40 focus-within:border-primary/60",
                    "focus-within:ring-8 focus-within:ring-primary/5 focus-within:shadow-[0_12px_40px_rgb(var(--warm-green)/0.1)]",
                    isListening && "border-destructive/40 ring-8 ring-destructive/10"
                )}>
                    {isListening ? (
                        <div className="flex-1 flex items-center gap-3 py-1.5 h-[38px] transition-opacity duration-300">
                            <div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            <span className="text-[13.5px] font-semibold text-destructive">جاري الاستماع...</span>
                        </div>
                    ) : (
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
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {isStreaming ? (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center bg-muted/60 hover:bg-muted text-foreground/50 hover:text-foreground transition-colors"
                                aria-label="إيقاف الرد"
                                title="إيقاف رد المساعد"
                            >
                                <div className="w-3.5 h-3.5 rounded-sm bg-current" />
                            </button>
                        ) : isListening ? (
                            <button
                                type="button"
                                onClick={stopListening}
                                className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center bg-destructive text-white hover:bg-destructive/90 shadow-md transition-all duration-200"
                                aria-label="إنهاء الاستماع وإرسال"
                                title="إنهاء الاستماع وإرسال"
                            >
                                <Square className="w-4 h-4 fill-current" />
                            </button>
                        ) : isInputEmpty ? (
                            <button
                                type="button"
                                onClick={startListening}
                                className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 bg-muted/50 text-foreground/60 hover:text-foreground hover:bg-muted"
                                aria-label="بدء الاستماع الصوتي"
                            >
                                <Mic className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!canSendText}
                                className={cn(
                                    "flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                                    canSendText
                                        ? "bg-primary text-white hover:bg-warm-green-dark shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95"
                                        : "bg-muted/50 text-muted-foreground/30 cursor-not-allowed"
                                )}
                                title="إرسال"
                                aria-label="إرسال الرسالة"
                            >
                                <Send className="w-4 h-4 rotate-180" />
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <p className="text-center text-[11px] text-muted-foreground/35 font-medium mt-2">
                المساعد الذكي قد يُخطئ أحياناً · تحقق من المعلومات المهمة
            </p>
        </div>
    );
});
