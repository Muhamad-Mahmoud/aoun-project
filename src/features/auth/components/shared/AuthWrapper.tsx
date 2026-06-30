import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";

interface AuthWrapperProps {
    children: React.ReactNode;
    title: React.ReactNode;
    description?: string;
    footerText?: string;
    footerLinkText?: string;
    footerLinkHref?: string;
    showLogo?: boolean;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
    children,
    title,
    description,
    footerText,
    footerLinkText,
    footerLinkHref,
}) => {
    return (
        <div className="flex h-screen w-full bg-white font-cairo overflow-hidden flex-row-reverse">
            {/* Right Side: Form Area (Scrollable) */}
            <div className="flex-1 h-full flex flex-col relative min-w-0 bg-white overflow-y-auto custom-scrollbar">
                {/* Back Link */}
                <div className="absolute top-8 right-8 z-20">
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 text-slate-400 hover:text-[#12a17b] transition-all font-bold text-[13px] opacity-80 hover:opacity-100"
                    >
                        <Image src="/logo-new.webp" alt="" width={20} height={10} className="h-4 w-auto grayscale group-hover:grayscale-0 transition-all opacity-70" />
                        العودة للرئيسية
                        <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-16">
                    <div className="w-full max-w-[540px] animate-fade-in py-8">
                        <div className="text-center mb-10">
                            <h1 className="text-[38px] leading-[1.2] font-black text-[#0F4C4A] tracking-tight transition-all">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-[15px] leading-relaxed text-slate-500 font-normal mt-4 px-4">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Form Content */}
                        <div className="relative">
                            {children}
                        </div>

                        {/* Footer Section - Design System Spacing (20px) */}
                        {(footerText || footerLinkText) && (
                            <div className="text-center mt-5">
                                <span className="text-slate-400 font-medium text-sm">{footerText} </span>
                                {footerLinkText && footerLinkHref && (
                                    <Link
                                        href={footerLinkHref}
                                        className="text-[#12a17b] hover:text-[#0F4C4A] font-extrabold text-sm hover:underline underline-offset-4 transition-all"
                                    >
                                        {footerLinkText}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Left Side: Hero Area (Fixed) */}
            <div className="hidden lg:flex lg:w-[45%] h-full relative bg-[#0F4C4A] overflow-hidden items-center justify-center border-l border-white/5">
                {/* Visual Elements */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Glows */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#12a17b]/20 rounded-full blur-[100px] -ml-48 -mt-48" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#12a17b]/15 rounded-full blur-[100px] -mr-48 -mb-48" />

                <div className="relative z-10 w-full text-center px-16 space-y-12">
                    {/* Logo Panel */}
                    <div className="flex justify-center flex-col items-center gap-12">
                        <Link href="/" className="hover:scale-105 transition-transform duration-500">
                            <Image
                                src="/logo-new.webp"
                                alt="عون"
                                width={224}
                                height={112}
                                priority
                                className="h-28 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Text Content */}
                    <div className="text-center mt-12 mb-16 relative z-10 px-8">
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f58a1f] animate-pulse" />
                            منصة إنسانية ذكية
                        </div>
                        <h2 className="text-[42px] font-black tracking-tight text-white mb-6 leading-[1.4]">
                            معاً نصنع <span className="text-[#f58a1f]">الأمل</span>
                            <br />
                            ونبني <span className="text-[#f58a1f]">المستقبل.</span>
                        </h2>
                        <p className="text-[16px] leading-loose text-white/80 max-w-md mx-auto">
                            انضم إلى آلاف المتطوعين والجمعيات الخيرية في مصر.
                            <br />
                            نضمن وصول مساعدتك لمستحقيها بشفافية تامة.
                        </p>

                        <div className="mt-10">
                            <Button
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full h-[48px] px-8 text-sm font-semibold transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] group"
                            >
                                <ArrowRight className="ml-2 h-4 w-4 stroke-[1.5] group-hover:-translate-x-1 transition-transform" />
                                تعرف أكثر على عون
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Copyright Footer */}
                <div className="absolute bottom-8 text-white/50 text-xs font-bold tracking-wider">
                    © 2026 منصة عون - جميع الحقوق محفوظة
                </div>
            </div>
        </div>
    );
};
