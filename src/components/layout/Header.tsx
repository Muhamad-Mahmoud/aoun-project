"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const user = null;
    const userRole = "guest";
    const signOut = () => console.log("Sign out");

    const guestNav = [
        { label: "الرئيسية", href: "/" },
        { label: "الحالات", href: "/cases" },
        { label: "الإحصائيات", href: "/statistics" },
    ];

    const familyNav = [
        { label: "الصفحة الرئيسية", href: "/" },
        { label: "طلباتي", href: "/dashboard/family" },
        { label: "تعديل البيانات", href: "/dashboard/family/profile" },
    ];

    const orgNav = [
        { label: "الحالات", href: "/dashboard/organization" },
        { label: "نظام التوصية", href: "/dashboard/organization" },
        { label: "الإحصائيات", href: "/dashboard/organization" },
    ];

    const adminNav = [
        { label: "لوحة التحكم", href: "/dashboard/admin" },
        { label: "المستخدمين", href: "/dashboard/admin/users" },
        { label: "الإحصائيات", href: "/dashboard/admin" },
    ];

    const navItems = userRole === "family" ? familyNav : userRole === "organization" ? orgNav : userRole === "admin" ? adminNav : guestNav;

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 border-b border-border/50 shadow-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo - Egyptian Colors */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                            <span className="text-white font-bold text-xl">ع</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-l from-primary to-foreground bg-clip-text text-transparent">عون</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-base font-medium text-foreground/70 hover:text-primary transition-all duration-300 relative group"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <Button variant="destructive" onClick={signOut} className="font-semibold px-6 h-11 rounded-xl">
                                تسجيل الخروج
                            </Button>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="font-semibold px-6 h-11 rounded-xl hover:bg-primary/5">
                                        تسجيل الدخول
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="font-semibold px-6 h-11 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                                        حساب جديد
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2.5 hover:bg-muted rounded-xl transition-all duration-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-foreground" />
                        ) : (
                            <Menu className="w-6 h-6 text-foreground" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-6 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-border/50">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-base font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-300 py-3 px-4 rounded-xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 pt-6 mt-4 border-t border-border/50">
                                {!user && (
                                    <>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="outline" className="w-full font-semibold h-12 rounded-xl border-2">
                                                تسجيل الدخول
                                            </Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full font-semibold h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                                حساب جديد
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                {user && (
                                    <Button variant="destructive" onClick={() => { signOut(); setIsMenuOpen(false); }} className="w-full font-semibold h-12 rounded-xl">
                                        تسجيل الخروج
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
