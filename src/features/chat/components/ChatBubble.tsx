"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { sanitizeUrl } from "@/lib/security/sanitize";
import { Bot, User, CheckCircle2, XCircle, ChevronDown, BrainCircuit } from "lucide-react";
import { cn } from "@/shared/utils";
import type { ChatMessage } from "@/shared/hooks";

interface ChatBubbleProps {
    message: ChatMessage;
    isLast: boolean;
    isStreaming: boolean;
    onAction?: (actionText: string) => void;
    onConfirm?: (confirmationId: string, approved: boolean) => void;
}

export const ChatBubble = React.memo(function ChatBubble({ message, isLast, isStreaming, onAction, onConfirm }: ChatBubbleProps) {
    const isUser = message.role === "user";
    const showCursor = isLast && !isUser && isStreaming;
    const showDots = !isUser && !message.content && isStreaming;
    
    // Manage local state to show 'loading' on buttons or disable them after clicking
    const [actionTaken, setActionTaken] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // State for the "Show more" AI thought process
    const [isThoughtOpen, setIsThoughtOpen] = useState(false);

    const handleConfirm = async () => {
        if (actionTaken || actionLoading) return;
        const confId = message.confirmation?.confirmation_id;
        if (!confId) return;
        setActionLoading(true);
        if (onConfirm) {
            await onConfirm(confId, true);
        }
        setActionTaken(true);
        setActionLoading(false);
    };

    const handleReject = async () => {
        if (actionTaken || actionLoading) return;
        const confId = message.confirmation?.confirmation_id;
        if (!confId) return;
        setActionLoading(true);
        if (onConfirm) {
            await onConfirm(confId, false);
        }
        setActionTaken(true);
        setActionLoading(false);
    };

    /* ─── User message (Anchored to Right in RTL) ─── */
    if (isUser) {
        return (
            <div className="flex justify-start items-end gap-3">
                {/* Avatar on the far Right */}
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-0.5 border border-primary/5">
                    <User className="w-4.5 h-4.5 text-primary/70" />
                </div>
                <div className="max-w-[85%] bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-[14px] leading-[1.8] shadow-md shadow-primary/10 whitespace-pre-wrap">
                    {message.content}
                </div>
            </div>
        );
    }

    /* ─── AI message (Anchored to Left in RTL) ─── */
    return (
        <div className="flex justify-end items-end gap-3 group/ai">
            <div className="max-w-[85%] bg-gradient-to-br from-white to-slate-50/90 border border-primary/20 rounded-2xl rounded-tl-sm shadow-[0_4px_20px_rgb(var(--primary)/0.08)] px-6 py-5 hover:shadow-[0_8px_30px_rgb(var(--primary)/0.12)] transition-all duration-500 relative overflow-hidden">
                {/* Subtle top-light effect */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                
                {showDots ? (
                    /* Loading dots */
                    <div className="flex items-center gap-1.5 py-0.5">
                        <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:140ms]" />
                        <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:280ms]" />
                    </div>
                ) : (
                    /* Markdown content */
                    <div className="text-[13.5px] text-foreground/85 leading-[1.9]">
                        {message.progress && (
                            <div className={cn(
                                "flex items-center justify-between mb-4 px-4 py-3 rounded-xl border transition-all duration-300",
                                (isStreaming && isLast) 
                                    ? "bg-primary/5 border-primary/10" 
                                    : "bg-emerald-50/50 border-emerald-100"
                            )}>
                                <div className="flex items-center gap-3">
                                    {(isStreaming && isLast) ? (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:0ms]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:150ms]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:300ms]" />
                                        </div>
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    )}
                                    <span className={cn(
                                        "text-[12.5px] font-bold",
                                        (isStreaming && isLast) ? "text-primary/80" : "text-emerald-700"
                                    )}>
                                        {(isStreaming && isLast) ? message.progress.message : "تم التنفيذ بنجاح"}
                                    </span>
                                </div>
                                <span className={cn(
                                    "text-[11px] font-semibold px-2 py-0.5 rounded-md",
                                    (isStreaming && isLast) 
                                        ? "text-primary/50 bg-primary/5" 
                                        : "text-primary bg-emerald-100/50"
                                )}>
                                    {(isStreaming && isLast) 
                                        ? `خطوة ${message.progress.step}/${message.progress.total_steps}`
                                        : "مكتمل"
                                    }
                                </span>
                            </div>
                        )}

                        {/* Collapsible Thought Process (Like an Agent's Thought Block) */}
                        {message.planning && (
                            <div className="mb-4 border border-border/60 rounded-xl bg-muted/50 overflow-hidden transition-all shadow-sm">
                                <button 
                                    onClick={() => setIsThoughtOpen(!isThoughtOpen)}
                                    className="w-full flex items-center justify-between px-4 py-2.5 bg-card/50 hover:bg-card transition-colors"
                                    title="عرض طريقة تفكير المساعد الذكي"
                                >
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className={cn(
                                            "w-4 h-4 transition-colors", 
                                            isStreaming ? "text-primary animate-pulse" : "text-primary"
                                        )} />
                                        <span className="text-[12.5px] font-bold text-foreground">
                                            {isStreaming ? "جاري التحليل والتفكير..." : "تفاصيل العملية وطريقة التفكير"}
                                        </span>
                                    </div>
                                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", isThoughtOpen && "rotate-180")} />
                                </button>
                                
                                {isThoughtOpen && (
                                    <div className="px-4 py-3 border-t border-border text-[12.5px] leading-relaxed text-muted-foreground font-medium bg-muted/80">
                                        {/* The AI's internal thought text */}
                                        {message.planning.message && (
                                            <div className="mb-3 whitespace-pre-wrap opacity-90 border-r-2 border-primary/20 pr-3">
                                                {message.planning.message}
                                            </div>
                                        )}

                                        {/* Tool Usage Badges */}
                                        {message.planning.tool_calls && message.planning.tool_calls.length > 0 && (
                                            <div className="flex flex-col gap-1.5 mt-2">
                                                <span className="text-[11px] font-bold text-muted-foreground">الأدوات المستخدمة:</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {message.planning.tool_calls.map((tool, idx) => (
                                                        <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card text-[10.5px] font-mono text-muted-foreground shadow-sm">
                                                            <Bot className="w-3 h-3 opacity-60 text-primary" />
                                                            {tool}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSanitize]}
                            urlTransform={sanitizeUrl}
                            components={{
                                p: ({ children }) => (
                                    <p className="mb-3.5 last:mb-0">{children}</p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-extrabold text-foreground">{children}</strong>
                                ),
                                em: ({ children }) => (
                                    <em className="text-primary/80 font-semibold not-italic">{children}</em>
                                ),
                                h1: ({ children }) => (
                                    <div className="mt-5 mb-2.5 first:mt-0 pb-2 border-b border-border/40">
                                        <h3 className="text-[15px] font-extrabold text-foreground">{children}</h3>
                                    </div>
                                ),
                                h2: ({ children }) => (
                                    <div className="mt-4 mb-2 first:mt-0">
                                        <h4 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                                            <span className="w-0.5 h-4 rounded-full bg-primary inline-block" />
                                            {children}
                                        </h4>
                                    </div>
                                ),
                                h3: ({ children }) => (
                                    <h5 className="text-[13.5px] font-bold text-foreground mt-3 mb-1.5 first:mt-0">{children}</h5>
                                ),
                                ul: ({ children }) => (
                                    <ul className="my-3 space-y-2">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="my-3 space-y-2.5 list-none">{children}</ol>
                                ),
                                li: ({ children, ...props }) => {
                                    const ordered = (props as Record<string, unknown>).ordered as boolean;
                                    const index = (props as Record<string, unknown>).index as number;
                                    if (ordered) {
                                        return (
                                            <li className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/8 text-primary text-xs font-extrabold flex items-center justify-center mt-[2px] border border-primary/10">
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1 leading-[1.9]">{children}</span>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li className="flex items-start gap-2">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 mt-[10px]" />
                                            <span className="flex-1">{children}</span>
                                        </li>
                                    );
                                },
                                a: ({ href, children }) => (
                                    <a
                                        href={sanitizeUrl(href)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-semibold underline underline-offset-2 decoration-primary/30 hover:decoration-primary/70 transition-colors"
                                    >
                                        {children}
                                    </a>
                                ),
                                code: ({ children, className }) => {
                                    if (className?.includes("language-")) {
                                        return (
                                            <pre className="my-3 p-3.5 rounded-xl bg-slate-950 text-slate-200 text-xs overflow-x-auto border border-slate-800" dir="ltr">
                                                <code className="font-mono">{children}</code>
                                            </pre>
                                        );
                                    }
                                    return (
                                        <code className="px-1.5 py-0.5 rounded-md bg-muted text-foreground text-[12px] font-mono border border-border/60" dir="ltr">
                                            {children}
                                        </code>
                                    );
                                },
                                blockquote: ({ children }) => (
                                    <blockquote className="my-3 border-s-2 border-primary/30 ps-4 text-muted-foreground bg-muted/30 py-2.5 pe-3 rounded-e-xl text-[13px]">
                                        {children}
                                    </blockquote>
                                ),
                                hr: () => (
                                    <hr className="my-4 border-border/40" />
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>

                        {showCursor && (
                            <span className="inline-block w-[2px] h-[1em] bg-primary ms-0.5 align-text-bottom animate-pulse" />
                        )}

                        {/* Additional Tool Confirmation UI */}
                        {message.confirmation && isLast && !isStreaming && (
                            <div className="mt-5 pt-4 border-t border-border/50">
                                <div className="p-4 bg-primary/10/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className="text-lg mt-0.5">⚠️</span>
                                        <div>
                                            <p className="font-bold text-sm text-foreground/90 mb-1">
                                                يطلب المساعد تأكيدك قبل تنفيذ هذا الإجراء:
                                            </p>
                                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                                {message.confirmation.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            id={`confirm-approve-${message.confirmation.confirmation_id}`}
                                            onClick={handleConfirm}
                                            disabled={actionTaken || actionLoading}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[13px] transition-all",
                                                actionTaken || actionLoading
                                                    ? "bg-primary/50 text-white shadow-none cursor-not-allowed" 
                                                    : "bg-primary text-white hover:bg-primary/85 shadow-md hover:shadow-primary/20"
                                            )}
                                        >
                                            {actionLoading ? (
                                                <span className="w-3.5 h-3.5 border-2 border-border/50 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4" />
                                            )}
                                            نعم، أوافق
                                        </button>
                                        <button
                                            id={`confirm-reject-${message.confirmation.confirmation_id}`}
                                            onClick={handleReject}
                                            disabled={actionTaken || actionLoading}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[13px] transition-all",
                                                actionTaken || actionLoading
                                                    ? "bg-destructive/30 text-destructive/60 shadow-none cursor-not-allowed" 
                                                    : "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                                            )}
                                        >
                                            <XCircle className="w-4 h-4" />
                                            لا، تراجع
                                        </button>
                                        {actionTaken && (
                                            <span className="text-xs text-muted-foreground ms-1">
                                                ✓ تم اتخاذ القرار
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Avatar on the far Left */}
            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary via-primary/90 to-emerald-500 flex items-center justify-center shadow-md shadow-primary/20 mb-0.5 border-2 border-border relative">
                {/* Pulsing ring behind the bot icon */}
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white z-10" />
            </div>
        </div>
    );
});
