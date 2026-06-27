// Request History Table Component
"use client";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { List, Search, ChevronLeft } from "lucide-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { cn } from "@/shared/utils";

export interface RequestHistoryItem {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    amount: string;
    date: string;
}

export interface StatusConfig {
    label: string;
    color: string;
}

interface RequestHistoryTableProps {
    requests: RequestHistoryItem[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    categoryIcons: Record<string, LucideIcon>;
    statusConfig: Record<string, StatusConfig>;
}

export function RequestHistoryTable({
    requests,
    searchTerm,
    onSearchChange,
    categoryIcons,
    statusConfig,
}: RequestHistoryTableProps) {
    return (
        <Card className="text-start border border-border/80 shadow-sm shadow-slate-200/20 bg-card rounded-[24px] overflow-hidden">
            {/* Header portion */}
            <div className="border-b border-border/80 px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
                <h3 className="font-black text-foreground flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <List className="w-4 h-4 text-primary" />
                    </div>
                    سجل الطلبات
                </h3>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ابحث بالاسم، التصنيف أو الحالة..."
                        className="ps-10 h-11 text-start bg-card border-border focus-visible:ring-primary/20 rounded-xl font-medium text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid-based List Header (Desktop Only) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 sm:px-8 py-4 bg-muted/80 border-b border-border text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                <div className="col-span-5 md:col-span-4">تفاصيل الطلب</div>
                <div className="col-span-3 md:col-span-4 hidden md:block">الوصف</div>
                <div className="col-span-4 md:col-span-3">الحالة والمبلغ</div>
                <div className="col-span-3 md:col-span-1 text-center">إجراء</div>
            </div>

            <div className="divide-y divide-slate-100/80">
                {requests.length > 0 ? (
                    requests.map((req) => {
                        const Icon = categoryIcons[req.category] || List;
                        const status = statusConfig[req.status] || { label: req.status, color: "bg-muted text-muted-foreground" };

                        return (
                            <Link 
                                href={`/dashboard/family/requests/${req.id.replace('REQ-', '')}`}
                                key={req.id}
                                className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-4 sm:px-8 py-5 hover:bg-muted/60 transition-colors items-center group even:bg-muted/30"
                            >
                                {/* Column 1: Title & Icon */}
                                <div className="sm:col-span-5 md:col-span-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[14px] bg-muted/50 flex items-center justify-center shrink-0 border border-border/50 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                                        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="font-black text-foreground text-sm truncate group-hover:text-primary transition-colors">{req.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{req.id}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-xs font-bold text-muted-foreground">{req.category}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Description (Desktop) */}
                                <div className="hidden md:block md:col-span-4 text-start">
                                    <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                        {req.description}
                                    </p>
                                </div>

                                {/* Column 3: Status & Amount */}
                                <div className="sm:col-span-4 md:col-span-3 flex flex-row sm:flex-col justify-between sm:justify-center items-start gap-2">
                                    <Badge variant="outline" className={cn("text-[11px] px-3 py-1 font-black rounded-full border shadow-sm", status.color)}>
                                        {status.label}
                                    </Badge>
                                    <div className="text-end sm:text-start flex flex-col gap-0.5 mt-1">
                                        <span className="font-black text-foreground text-sm">{req.amount}</span>
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{req.date}</span>
                                    </div>
                                </div>

                                {/* Column 4: Action */}
                                <div className="sm:col-span-3 md:col-span-1 flex justify-end sm:justify-center">
                                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                                        <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="py-12">
                        <EmptyState
                            icon={Search}
                            title="لا توجد نتائج"
                            description="لم نتمكن من العثور على أي طلبات تطابق معايير البحث الخاصة بك."
                            className="border-none bg-transparent"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
}
