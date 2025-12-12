"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button as UiButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    }

    if (isSubmitted) {
        return (
            <Card className="border-border/50 w-full shadow-2xl shadow-primary/10 backdrop-blur-xl bg-card/95 font-sans overflow-hidden">
                <CardHeader className="space-y-1 text-center pb-4 bg-gradient-to-b from-success/5 to-transparent">
                    <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-success">
                        تحقق من بريدك الإلكتروني
                    </CardTitle>
                    <CardDescription className="text-sm">
                        لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-2 pt-4 pb-4">
                    <Link href="/login" className="w-full">
                        <UiButton className="w-full h-11" variant="outline">
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                            العودة لتسجيل الدخول
                        </UiButton>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 w-full shadow-2xl shadow-primary/10 backdrop-blur-xl bg-card/95 font-sans overflow-hidden">
            <CardHeader className="space-y-1 text-center pb-4 bg-gradient-to-b from-primary/5 to-transparent">
                <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                    هل نسيت كلمة المرور؟
                </CardTitle>
                <CardDescription className="text-sm">
                    أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={onSubmit}>
                    <div className="grid gap-5">
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-right w-full block">البريد الإلكتروني</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="bg-background/60 text-left pr-3 pl-9 h-10 text-sm"
                                    dir="ltr"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                        </div>
                        <UiButton className="w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all h-11 text-base" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري الإرسال...
                                </>
                            ) : (
                                <>
                                    <Mail className="ml-2 h-4 w-4" />
                                    إرسال رابط الاستعادة
                                </>
                            )}
                        </UiButton>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t pt-4 pb-4">
                <div className="text-center text-xs">
                    <Link href="/login" className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="ml-2 h-3.5 w-3.5 rotate-180" />
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
