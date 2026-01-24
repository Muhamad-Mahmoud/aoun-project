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
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-primary/10 text-start">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-colors" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-warm-green/10 rounded-full blur-[40px]" />

            <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-black">{title}</h3>
                    <p className="text-sm text-slate-400 font-bold leading-relaxed mt-2 opacity-80">
                        {description}
                    </p>
                </div>
                <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary-light text-white font-black rounded-xl shadow-lg shadow-primary/20"
                    onClick={onContactClick}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
