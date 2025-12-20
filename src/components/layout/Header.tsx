"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Menu, X } from "lucide-react";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const pathname = usePathname();

    const navItems = [
        { label: "الرئيسية", href: "/" },
        { label: "لماذا عون؟", href: "/#why-aoun" },
        { label: "رحلة المساعدة", href: "/#journey" },
        { label: "الأسئلة الشائعة", href: "/#faq" },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.5 }); // 50% visibility required to active

        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const isActive = (href: string) => {
        if (pathname !== "/") return false;
        if (href === "/") return activeSection === "hero";
        return activeSection === href.replace("/#", "");
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setIsMenuOpen(false);
        if (href === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex h-[72px] items-center justify-between gap-8">

                    {/* Logo - Enhanced Size & Prominence */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group transition-opacity hover:opacity-85"
                        onClick={(e) => handleNavClick(e, "/")}
                    >
                        <img
                            src="/logo.png"
                            alt="عون - منصة العون للأسر المحتاجة"
                            className="h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation - Improved Typography & States */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className={`text-[15px] font-medium transition-all duration-200 relative group ${isActive(item.href)
                                    ? "text-warm-green"
                                    : "text-foreground/70 hover:text-warm-green"
                                    }`}
                            >
                                {item.label}
                                <span
                                    className={`absolute -bottom-[22px] left-0 h-[3px] bg-warm-green transition-all duration-300 ${isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                ></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons - Enhanced Design */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                className="font-medium text-[15px] px-5 h-11 rounded-lg border border-border hover:border-warm-green hover:bg-warm-green/5 hover:text-warm-green transition-all duration-250"
                            >
                                تسجيل الدخول
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="font-semibold text-[15px] px-6 h-11 rounded-lg bg-warm-green hover:bg-warm-green-light shadow-lg shadow-warm-green/20 hover:shadow-warm-green/30 hover:-translate-y-0.5 transition-all duration-250">
                                حساب جديد
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button - Hidden when menu is open to avoid double X */}
                    <button
                        className={`lg:hidden p-2.5 hover:bg-muted/50 rounded-lg transition-all duration-300 ${isMenuOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6 text-foreground" />
                    </button>
                </div>

                {/* Mobile Menu - Enhanced */}
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed top-[72px] left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        ></div>

                        {/* Sidebar Menu - Optimized Width for Mobile */}
                        <div className="fixed top-0 right-0 h-[100dvh] w-[60vw] sm:w-[250px] bg-background shadow-2xl z-[70] lg:hidden animate-in slide-in-from-right duration-300 flex flex-col">

                            {/* Menu Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
                                <img
                                    src="/logo.png"
                                    alt="عون - منصة العون للأسر المحتاجة"
                                    className="h-14 w-auto object-contain"
                                />
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors border border-transparent hover:border-border"
                                >
                                    <X className="w-5 h-5 text-foreground" />
                                </button>
                            </div>

                            {/* Menu Content - Scrollable Area */}
                            <nav className="flex-1 overflow-y-auto p-6 min-h-0">
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`text-[16px] font-medium py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-between group ${isActive(item.href)
                                                ? "bg-warm-green/10 text-warm-green border border-warm-green/20"
                                                : "text-foreground/80 hover:text-warm-green hover:bg-warm-green/5 border border-transparent"
                                                }`}
                                            onClick={(e) => handleNavClick(e, item.href)}
                                        >
                                            {item.label}
                                            {isActive(item.href) && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-warm-green" />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </nav>

                            {/* Menu Footer - Auth Buttons - Fixed at Bottom */}
                            <div className="p-6 border-t border-border/50 bg-muted/30 shrink-0">
                                <div className="flex flex-col gap-3">
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button
                                            variant="outline"
                                            className="w-full font-bold text-[15px] h-12 rounded-xl border-2 border-border/60 hover:border-warm-green hover:bg-warm-green/5 hover:text-warm-green"
                                        >
                                            تسجيل الدخول
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full font-bold text-[15px] h-12 rounded-xl bg-warm-green hover:bg-warm-green-light shadow-lg shadow-warm-green/20">
                                            حساب جديد
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
