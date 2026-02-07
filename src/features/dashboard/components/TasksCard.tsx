// Tasks Card Component
"use client";

import { Card } from "@/shared/ui/card";
import { CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils";

export interface Task {
    text: string;
    done: boolean;
    href: string | null;
    urgent: boolean;
    deadline?: string;
}

interface TasksCardProps {
    tasks: Task[];
    title?: string;
}

export function TasksCard({ tasks, title = "إجراءات مطلوبة" }: TasksCardProps) {
    return (
        <Card className="text-start">
            <div className="border-b border-border px-6 py-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-golden-orange" />
                <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            </div>
            <div className="p-4">
                <div className="space-y-2">
                    {tasks.map((task, i) => (
                        <Link
                            key={i}
                            href={task.href || '#'}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-xl transition-all",
                                task.done
                                    ? "bg-muted/30 opacity-70 cursor-default"
                                    : "hover:bg-muted cursor-pointer border border-transparent hover:border-primary/20 bg-white shadow-sm",
                                task.urgent && !task.done && "border-error-light bg-error-light/50 hover:bg-error-light"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-0.5",
                                    task.done ? "bg-primary border-primary" : "border-muted-foreground/30"
                                )}
                            >
                                {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0 text-start">
                                <span
                                    className={cn(
                                        "text-sm font-semibold block truncate",
                                        task.done ? "line-through text-muted-foreground" : "text-slate-900"
                                    )}
                                >
                                    {task.text}
                                </span>
                                {task.urgent && !task.done && task.deadline && (
                                    <span className="text-[10px] text-error font-bold flex items-center gap-1 mt-1 uppercase tracking-wider">
                                        <Zap className="w-3 h-3" />
                                        {task.deadline}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Card>
    );
}

