// Recent Activity Card Component
"use client";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Timeline, TimelineItem } from "@/shared/components/common/Timeline";

interface RecentActivityCardProps {
    activities: TimelineItem[];
    badgeText?: string;
}

export function RecentActivityCard({ activities, badgeText = "اليوم" }: RecentActivityCardProps) {
    return (
        <Card className="text-end">
            <div className="border-b border-border px-6 py-4 flex flex-row-reverse justify-between items-center bg-muted/10">
                <h3 className="text-sm font-bold text-slate-800">آخر التحديثات</h3>
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">{badgeText}</Badge>
            </div>
            <div className="p-6">
                <Timeline items={activities} />
            </div>
        </Card>
    );
}
