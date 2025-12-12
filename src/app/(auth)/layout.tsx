import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full flex bg-background font-sans overflow-hidden">

            {/* Image Side - LEFT (Visually) - 30% width */}
            <div className="hidden lg:block w-[30%] relative overflow-hidden h-screen order-2" style={{
                background: 'linear-gradient(to bottom right, hsl(var(--nile-blue)), hsl(var(--nile-blue-light)), hsl(var(--primary)))'
            }}>
                {/* Subtle Mesh Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />

                {/* Soft Glow Effects */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl" style={{
                    backgroundColor: 'hsl(var(--pharaoh-gold) / 0.1)'
                }} />

                {/* Content Overlay */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                    {/* Logo */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 w-fit group">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                                <span className="font-bold text-xl text-white">ع</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">عون</span>
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'hsl(var(--pharaoh-gold))' }}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'hsl(var(--pharaoh-gold))' }}></span>
                            </span>
                            <span className="text-sm font-semibold text-white">منصة إنسانية ذكية</span>
                        </div>

                        <h1 className="text-3xl font-black leading-tight tracking-tight drop-shadow-lg text-white">
                            معاً نصنع <span style={{ color: 'hsl(var(--pharaoh-gold))' }}>الأمل</span>
                            <br />
                            ونبني المستقبل.
                        </h1>

                        <p className="text-sm text-white/90 leading-relaxed font-medium drop-shadow-md">
                            انضم إلى آلاف المتطوعين والجمعيات الخيرية في مصر. نضمن وصول مساعدتك لمستحقيها بشفافية تامة.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="text-sm text-white/60 font-medium">
                        © {new Date().getFullYear()} منصة عون - جميع الحقوق محفوظة
                    </div>
                </div>
            </div>

            {/* Form Side - RIGHT (Visually) - 70% width - Hidden Scrollbar */}
            <div className="w-full lg:w-[70%] flex flex-col relative bg-background h-screen overflow-hidden order-1">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

                {/* Mobile Logo */}
                <div className="absolute top-4 left-4 lg:hidden z-20">
                    <Link href="/" className="font-bold text-xl text-primary">عون.</Link>
                </div>

                {/* Back Link */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 hidden lg:flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group z-20"
                >
                    <ArrowRight className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    العودة للرئيسية
                </Link>

                {/* Form Container - Scrollable with hidden scrollbar */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center px-4 py-8 lg:px-8 lg:py-12 scrollbar-hide">
                    <div className="w-full max-w-[520px] relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
