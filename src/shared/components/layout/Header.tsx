"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Menu, X, LogOut, User, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { useAuthContext } from "@/shared/providers";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const pathname = usePathname();
    const { user, isAuthenticated, logout, isLoading } = useAuthContext();

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
        }, { threshold: 0.5 });

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

    // Determine Dashboard URL based on role
    const getDashboardUrl = () => {
        if (!user) return "/";

        const role = user.role?.toLowerCase() || "";

        // Check if role is organization/association/charity
        // Support various formats: "organization", "association", "charity", "org", "جمعية", etc.
        const isOrganization = role.includes('organization') ||
            role.includes('association') ||
            role.includes('charity') ||
            role.includes('org') ||
            role.includes('جمعية') ||
            role.includes('مؤسسة');

        if (isOrganization) {
            return "/dashboard/organization";
        }

        return "/dashboard/family";
    };

    const dashboardUrl = getDashboardUrl();

    // Get User Initials
    const getInitials = () => {
        if (!user?.name) return "U";
        return user.name.substring(0, 2).toUpperCase();
    };

    // Get Display Name (Always First Name for consistency)
    const getDisplayName = () => {
        if (!user?.name) return "User";
        return user.name.split(" ")[0];
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex h-[72px] items-center justify-between gap-8">

                    {/* Logo */}
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

                    {/* Desktop Navigation */}
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
                                    className={`absolute -bottom-[22px] inset-x-0 h-[3px] bg-warm-green transition-all duration-300 ${isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                ></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Action Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-24 h-10 bg-muted/60 animate-pulse rounded-lg" />
                                <div className="w-24 h-10 bg-muted/60 animate-pulse rounded-lg" />
                            </div>
                        ) : isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-12 rounded-full pl-2 pr-4 hover:bg-muted/50 border border-transparent hover:border-border transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-border shadow-sm group-hover:scale-105 transition-transform">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                                <AvatarFallback>{getInitials()}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-bold leading-none max-w-[200px] truncate">
                                                {getDisplayName()}
                                            </span>
                                            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64" align="start" sideOffset={8}>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={dashboardUrl} className="w-full flex items-center cursor-pointer">
                                            <LayoutDashboard className="ml-2 h-4 w-4" />
                                            <span>لوحة التحكم</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`${dashboardUrl}/profile`} className="w-full flex items-center cursor-pointer">
                                            <User className="ml-2 h-4 w-4" />
                                            <span>الملف الشخصي</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`${dashboardUrl}/settings`} className="w-full flex items-center cursor-pointer">
                                            <Settings className="ml-2 h-4 w-4" />
                                            <span>الإعدادات</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                        onClick={() => logout()}
                                    >
                                        <LogOut className="ml-2 h-4 w-4" />
                                        <span>تسجيل الخروج</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <div className="w-[1px] h-6 bg-border mx-1" />
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
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`lg:hidden p-2.5 hover:bg-muted/50 rounded-lg transition-all duration-300 ${isMenuOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6 text-foreground" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <>
                        <div
                            className="fixed top-[72px] left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        ></div>

                        <div className="fixed top-0 end-0 h-[100dvh] w-[75vw] sm:w-[300px] bg-background shadow-2xl z-[70] lg:hidden animate-in slide-in-from-inline-end duration-300 flex flex-col">

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

                            {/* Menu Content */}
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

                            {/* Menu Footer - Auth Logic */}
                            <div className="p-6 border-t border-border/50 bg-muted/30 shrink-0">
                                {isLoading ? (
                                    <div className="flex flex-col gap-3 animate-pulse">
                                        <div className="h-12 bg-gray-200 rounded-xl" />
                                        <div className="h-12 bg-gray-200 rounded-xl" />
                                    </div>
                                ) : isAuthenticated && user ? (
                                    <div className="flex flex-col gap-3">
                                        {/* User Info Card */}
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border/60 shadow-sm mb-2">
                                            <Avatar className="h-10 w-10 border border-border">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                                <AvatarFallback>{getInitials()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-bold text-sm truncate">{getDisplayName()}</span>
                                        </div>

                                        <Link href={dashboardUrl} onClick={() => setIsMenuOpen(false)}>
                                            <Button
                                                className="w-full font-bold h-12 rounded-xl bg-primary text-white hover:bg-primary/90"
                                            >
                                                <LayoutDashboard className="ml-2 h-4 w-4" />
                                                لوحة التحكم
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="outline"
                                            className="w-full font-bold h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="ml-2 h-4 w-4" />
                                            تسجيل الخروج
                                        </Button>
                                    </div>
                                ) : (
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
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
