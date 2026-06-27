// Recent Activity Card Component
"use client";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Timeline, TimelineItem } from "@/shared/components/common/Timeline";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Clock } from "lucide-react";

interface RecentActivityCardProps {
    activities: TimelineItem[];
    badgeText?: string;
}

export function RecentActivityCard({ activities, badgeText = "اليوم" }: RecentActivityCardProps) {
    return (
        <Card className="rounded-[24px] border border-border shadow-sm bg-card overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="border-b border-border/80 px-7 py-5 flex justify-between items-center bg-muted/30">
                <h3 className="text-base font-black text-foreground">آخر النشاطات</h3>
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-muted/50 text-muted-foreground hover:bg-slate-200">{badgeText}</Badge>
            </div>
            <div className="p-7 flex-1">
                {activities.length === 0 ? (
                    <EmptyState
                        icon={Clock}
                        title="لا توجد مهام عاجلة حالياً"
                        description="لم يتم تسجيل أي تحديثات في النظام مؤخراً."
                        className="min-h-[250px] border-none bg-transparent"
                    />
                ) : (
                    <Timeline items={activities} />
                )}
            </div>
        </Card>
    );
}
