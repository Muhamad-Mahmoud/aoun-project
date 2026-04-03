"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Square, Mic } from "lucide-react";
import { cn } from "@/shared/utils";

interface ChatInputProps {
    onSend: (message: string) => void;
    onSendVoice?: (audioBlob: Blob) => void;
    onCancel: () => void;
    onClear: () => void;
    isStreaming: boolean;
    hasMessages: boolean;
}

export const ChatInput = React.memo(function ChatInput({ onSend, onSendVoice, onCancel, isStreaming }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isPreparingRecord, setIsPreparingRecord] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

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
        if (!input.trim() || isStreaming || isRecording || isPreparingRecord) return;
        onSend(input.trim());
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const startRecording = async () => {
        try {
            setIsPreparingRecord(true);
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("تعذر الوصول للميكروفون. المتصفح يحتاج إلى اتصال آمن (HTTPS) أو غير مدعوم.");
                setIsPreparingRecord(false);
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                if (onSendVoice && audioChunksRef.current.length > 0) {
                    onSendVoice(audioBlob);
                }
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error: any) {
            console.error("Error accessing microphone:", error);
            if (error.name === "NotAllowedError" || error.message?.includes("Permission denied")) {
                alert("المتصفح يمنع الوصول للميكروفون لأنك رفضت الصلاحية مسبقاً أو بسبب إعدادات الخصوصية (في Brave Shields أو الويندوز). \nيرجى الضغط على القفل بجوار الرابط والسماح بالميكروفون، أو مراجعة إعدادات الويندوز.");
            } else if (error.name === "NotFoundError" || error.message?.includes("Requested device not found")) {
                alert("لم يتم العثور على ميكروفون متصل بجهازك. يرجى توصيل ميكروفون والمحاولة مرة أخرى.");
            } else {
                alert(`حدث خطأ أثناء الوصول للميكروفون: ${error.message || error.name || "غير معروف"}`);
            }
            setIsRecording(false);
        } finally {
            setIsPreparingRecord(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const isInputEmpty = input.trim().length === 0;
    const canSendText = !isInputEmpty && !isStreaming && !isRecording && !isPreparingRecord;

    return (
        <div className="px-6 pb-6 pt-2 bg-gradient-to-t from-background via-background to-transparent">
            <form onSubmit={handleSubmit} className="relative">
                <div className={cn(
                    "flex items-end gap-3 rounded-[24px] border-2 bg-background px-5 pt-3 pb-3 transition-all duration-300",
                    "border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/40 focus-within:border-primary/60",
                    "focus-within:ring-8 focus-within:ring-primary/5 focus-within:shadow-[0_12px_40px_rgb(var(--warm-green)/0.1)]",
                    isRecording && "border-destructive/40 ring-8 ring-destructive/10"
                )}>
                    {isRecording ? (
                        <div className="flex-1 flex items-center gap-3 py-1.5 h-[38px] transition-opacity duration-300">
                            <div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            <span className="text-[13.5px] font-semibold text-destructive">جاري التسجيل...</span>
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
                                {/* Different visual for 'Stop Generation' vs 'Stop Recording' */}
                                <div className="w-3.5 h-3.5 rounded-sm bg-current" />
                            </button>
                        ) : isRecording ? (
                            <button
                                type="button"
                                onClick={stopRecording}
                                className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center bg-destructive text-white hover:bg-destructive/90 shadow-md transition-all duration-200"
                                aria-label="إنهاء التسجيل وإرسال"
                                title="إنهاء التسجيل وإرسال"
                            >
                                <Square className="w-4 h-4 fill-current" />
                            </button>
                        ) : isInputEmpty ? (
                                // Show Mic button if empty
                                <button
                                    type="button"
                                    onClick={startRecording}
                                    className="flex-shrink-0 mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 bg-muted/50 text-foreground/60 hover:text-foreground hover:bg-muted"
                                    aria-label="بدء التسجيل الصوتي"
                                >
                                    <Mic className="w-4 h-4" />
                                </button>
                        ) : (
                            // Show Send button if typed
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
