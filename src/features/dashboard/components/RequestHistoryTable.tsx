// Request History Table Component
"use client";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { List, Search, ChevronLeft } from "lucide-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

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
        <Card className="text-start">
            <div className="border-b border-border px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                    <List className="w-4 h-4 text-muted-foreground" />
                    سجل الطلبات
                </h3>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="بحث..."
                        className="ps-9 h-9 text-start"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="divide-y divide-border">
                {requests.length > 0 ? (
                    requests.map((req) => {
                        const Icon = categoryIcons[req.category] || List;
                        const status = statusConfig[req.status];

                        return (
                            <div
                                key={req.id}
                                className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-muted-foreground/10 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-foreground text-sm truncate">{req.title}</h4>
                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 font-medium ${status.color}`}>
                                            {status.label}
                                        </Badge>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground font-medium truncate">{req.description}</p>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-start hidden sm:flex">
                                    <div className="text-end sm:text-start">
                                        <p className="font-bold text-slate-900">{req.amount}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold">{req.date}</p>
                                    </div>
                                </div>

                                <Button variant="ghost" size="icon" className="shrink-0 self-end sm:self-center" asChild>
                                    <Link href={`/dashboard/family/requests/${req.id}`}>
                                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                                    </Link>
                                </Button>

                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-muted-foreground">
                        لا توجد نتائج تطابق بحثك
                    </div>
                )}
            </div>
        </Card>
    );
}
