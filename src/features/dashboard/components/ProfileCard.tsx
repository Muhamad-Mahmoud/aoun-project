// Profile Card Component
"use client";

import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Users, Settings } from "lucide-react";
import Link from "next/link";

interface ProfileCardProps {
    familyName: string;
    location: string;
    completionPercentage: number;
    isVerified?: boolean;
}

export function ProfileCard({
    familyName,
    location,
    completionPercentage,
    isVerified = false
}: ProfileCardProps) {
    return (
        <Card className="overflow-hidden border-2 border-primary/10 text-center">
            <div className="bg-primary/5 p-6 relative">
                <div className="absolute top-0 start-0 p-4">
                    {isVerified && (
                        <Badge variant="secondary" className="bg-card/50 backdrop-blur-sm hover:bg-card/80">
                            موثق ✓
                        </Badge>
                    )}
                </div>
                <div className="w-20 h-20 bg-card rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-border shadow-lg">
                    <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-1">{familyName}</h3>
                <p className="text-xs text-muted-foreground">{location}</p>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <div className="flex flex-row-reverse justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-bold text-xs">اكتمال الملف</span>
                        <span className="font-black text-primary text-xs">{completionPercentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all ms-auto"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                    <div className="mt-3 flex gap-2">
                        <Button variant="outline" className="w-full text-xs h-8" asChild>
                            <Link href="/settings">
                                <Settings className="w-3 h-3 ms-2" />
                                الإعدادات
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
