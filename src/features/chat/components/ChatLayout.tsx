"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { chatApi, ChatThreadDto } from "../api/chatApi";
import { ChatComponent } from "./ChatComponent";
import { MessageSquare, Search, User as UserIcon, Loader2, Info } from "lucide-react";
import { formatRelativeTime } from "@/shared/utils";

export function ChatLayout() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const initialRequestId = searchParams.get("requestId");

    const [threads, setThreads] = useState<ChatThreadDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
        initialRequestId ? parseInt(initialRequestId, 10) : null
    );

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const reqIdParam = initialRequestId ? parseInt(initialRequestId, 10) : undefined;
                const data = await chatApi.getChatThreads(reqIdParam);
                setThreads(data);
            } catch (error) {
                console.error("Failed to load chat threads:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchThreads();
    }, [initialRequestId]);

    const handleSelectThread = (requestId: number) => {
        setSelectedRequestId(requestId);
        // Update URL without reloading
        const newUrl = `${pathname}?requestId=${requestId}`;
        window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    };

    const filteredThreads = threads.filter(t => 
        t.otherPartyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.requestTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full w-full bg-white lg:rounded-3xl overflow-hidden relative">
            {/* Sidebar / Threads List */}
            <div className={`w-full lg:w-80 border-l border-slate-100 bg-slate-50/50 flex flex-col shrink-0 ${selectedRequestId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-5 border-b border-slate-100 bg-white">
                    <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-secondary" />
                        المحادثات
                    </h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="ابحث في المحادثات..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pr-9 pl-4 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-secondary/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="w-6 h-6 animate-spin text-secondary opacity-50" />
                        </div>
                    ) : filteredThreads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                            <p className="text-sm">لا توجد محادثات</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredThreads.map(thread => (
                                <button
                                    key={thread.assistanceRequestId}
                                    onClick={() => handleSelectThread(thread.assistanceRequestId)}
                                    className={`w-full text-right p-4 transition-all hover:bg-white flex items-start gap-3 ${
                                        selectedRequestId === thread.assistanceRequestId 
                                            ? 'bg-white shadow-[inset_-4px_0_0_0_#10B981]' 
                                            : ''
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <UserIcon className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm text-slate-800 truncate">
                                                {thread.otherPartyName}
                                            </h4>
                                            {thread.lastMessageDate && (
                                                <span className="text-[10px] text-slate-400 shrink-0 mr-2">
                                                    {formatRelativeTime(thread.lastMessageDate)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1 truncate">
                                            {thread.requestTitle}
                                        </p>
                                        <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                                            {thread.lastMessage || (thread.hasMessages ? "ملف مرفق" : "لا توجد رسائل بعد")}
                                        </p>
                                    </div>
                                    {thread.unreadCount > 0 && (
                                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-2">
                                            <span className="text-[10px] font-bold text-white">{thread.unreadCount}</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 bg-white relative ${selectedRequestId ? 'flex' : 'hidden lg:flex'} flex-col`}>
                {selectedRequestId ? (
                    <ChatComponent 
                        key={selectedRequestId} 
                        assistanceRequestId={selectedRequestId} 
                        isStandalone 
                        otherPartyName={threads.find(t => t.assistanceRequestId === selectedRequestId)?.otherPartyName}
                        onBack={() => {
                            setSelectedRequestId(null);
                            const newUrl = pathname;
                            window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600 mb-2">مرحباً بك في المحادثات</h3>
                        <p className="text-sm">اختر محادثة من القائمة الجانبية للبدء</p>
                    </div>
                )}
            </div>
        </div>
    );
}
