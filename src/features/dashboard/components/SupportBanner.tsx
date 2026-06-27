// Support Banner Component
"use client";

import { Button } from "@/shared/ui/button";
import { MessageCircle } from "lucide-react";

interface SupportBannerProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onContactClick?: () => void;
}

export function SupportBanner({
    title = "مركز المساعدة",
    description = "واجهت مشكلة؟ فريقنا موجود لخدمتك 24/7",
    buttonText = "بدء محادثة",
    onContactClick,
}: SupportBannerProps) {
    return (
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden text-start border border-border/5">
            <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-card/5 rounded-2xl flex items-center justify-center border border-border/10">
                    <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-2">
                        {description}
                    </p>
                </div>
                <Button
                    size="lg"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                    onClick={onContactClick}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
