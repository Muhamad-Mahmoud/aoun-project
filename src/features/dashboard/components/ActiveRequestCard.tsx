"use client";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { MapPin, Clock, Paperclip, FileText } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

export interface ActiveRequest {
    id: string;
    title: string;
    category: string;
    location: string;
    status: string;
    requestedAmount: string;
    attachmentsCount: number;
    priority: string;
    currentStep: number;
    totalSteps: number;
    nextAction: string;
    nextActionDescription: string;
    lastModified: string;
    createdDaysAgo: number;
}

interface PrimaryAction {
    label: string;
    icon: LucideIcon;
    href: string;
}

interface ActiveRequestCardProps {
    request: ActiveRequest;
    primaryAction: PrimaryAction;
    steps?: { label: string; done: boolean }[];
}

export function ActiveRequestCard({ request, primaryAction }: ActiveRequestCardProps) {
    const getStatusAccent = (status: string) => {
        if (status.includes("مكتمل") || status === "COMPLETED") return "bg-emerald-500";
        if (status.includes("جاري") || status === "IN_PROGRESS") return "bg-blue-500";
        if (status.includes("مرفوض") || status === "REJECTED") return "bg-red-500";
        if (status.includes("قيد") || status === "PENDING") return "bg-amber-400";
        return "bg-gray-400";
    };

    const getStatusBadgeStyle = (status: string) => {
        if (status.includes("مكتمل") || status === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status.includes("جاري") || status === "IN_PROGRESS") return "bg-blue-50 text-blue-700 border-blue-200";
        if (status.includes("مرفوض") || status === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
        if (status.includes("قيد") || status === "PENDING") return "bg-amber-50 text-amber-700 border-amber-200";
        return "bg-slate-50 text-slate-700 border-slate-200";
    };

    return (
        <Card className="animate-fade-slide-up rounded-2xl border-slate-100 bg-white hover:shadow-lg hover:border-slate-200 transition-shadow duration-300 group overflow-hidden">
            <div className="flex">
                {/* Status Accent Strip */}
                <div
                    className={cn("w-1 shrink-0 rounded-r-full", getStatusAccent(request.status))}
                    aria-hidden
                />
                <div className="flex-1 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                    variant="outline"
                                    className="text-[10px] font-black text-slate-400 border-slate-200 px-2 py-0.5 rounded-md"
                                >
                                    #{request.id}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-[11px] font-bold border px-3 py-1 rounded-full gap-1.5",
                                        getStatusBadgeStyle(request.status)
                                    )}
                                >
                                    {request.status}
                                </Badge>
                                {request.attachmentsCount > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
                                        <Paperclip className="w-3 h-3 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {request.attachmentsCount}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-relaxed line-clamp-2">
                                {request.title}
                            </p>
                            <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-400 font-medium flex-wrap">
                                {request.location && (
                                    <span className="flex items-center gap-1 min-w-0">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span className="truncate max-w-[160px]">
                                            {request.location}
                                        </span>
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    منذ {request.createdDaysAgo} أيام
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex w-full sm:w-auto mt-4 sm:mt-0">
                            <Button
                                asChild
                                className="w-full sm:w-auto h-10 px-4 rounded-lg bg-warm-green hover:bg-warm-green/90 text-white font-bold text-sm transition-all active:scale-95"
                            >
                                <Link href={primaryAction.href}>
                                    <primaryAction.icon className="w-4 h-4 ml-2" />
                                    {primaryAction.label}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
