import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
                        className="group flex items-center gap-2 text-slate-400 hover:text-primary transition-all font-bold text-sm"
                    >
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        العودة للرئيسية
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-16">
                    <div className="w-full max-w-[620px] space-y-6 animate-fade-in py-8">
                        {/* Header Section */}
                        <div className="text-center space-y-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-lg text-slate-500 font-bold leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>

                        {/* Form Content */}
                        <div className="relative">
                            {children}
                        </div>

                        {/* Footer Section */}
                        {(footerText || footerLinkText) && (
                            <div className="text-center pt-6 border-t border-slate-50">
                                <span className="text-slate-400 font-bold text-base">{footerText} </span>
                                {footerLinkText && footerLinkHref && (
                                    <Link
                                        href={footerLinkHref}
                                        className="text-primary hover:text-primary/80 font-black text-base hover:underline underline-offset-8 transition-all"
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
            <div className="hidden lg:flex lg:w-[40%] h-full relative bg-[#0e1525] overflow-hidden items-center justify-center border-l border-white/5">
                {/* Visual Elements */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                {/* Glows */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -ml-48 -mt-48" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mb-48" />

                <div className="relative z-10 w-full text-center px-16 space-y-12">
                    {/* Logo Panel */}
                    <div className="flex justify-center flex-col items-center gap-12">
                        <Link href="/" className="hover:scale-105 transition-transform duration-500">
                            <img
                                src="/logo.png"
                                alt="عون"
                                className="h-28 w-auto"
                            />
                        </Link>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-xs font-black">
                            <span className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
                            منصة إنسانية ذكية
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-5xl font-black text-white leading-[1.3] tracking-tight">
                            معاً نصنع <span className="text-primary">الأمل</span>
                            <br />
                            ونبني المستقبل.
                        </h2>
                        <p className="text-lg text-slate-400 font-bold leading-relaxed max-w-sm mx-auto opacity-80">
                            انضم إلى آلاف المتطوعين والجمعيات الخيرية في مصر. نضمن وصول مساعدتك لمستحقيها بشفافية تامة.
                        </p>
                    </div>
                </div>

                {/* Copyright Footer */}
                <div className="absolute bottom-8 text-slate-500 text-xs font-bold tracking-wider">
                    © 2026 منصة عون - جميع الحقوق محفوظة
                </div>
            </div>
        </div>
    );
};
