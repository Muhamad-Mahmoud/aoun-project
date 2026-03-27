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
import Image from "next/image";
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
        // Only observe sections on the homepage — no sections exist on other pages
        if (pathname !== "/") return;

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
    }, [pathname]);

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
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm shadow-slate-100/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex h-[72px] items-center justify-between gap-8 relative">

                    {/* Logo */}
                    <Link
                        href="/"
                        aria-label="العودة للصفحة الرئيسية"
                        className="flex items-center gap-3 group transition-opacity hover:opacity-85"
                        onClick={(e) => handleNavClick(e, "/")}
                    >
                        <Image
                            src="/logo.png"
                            alt="عون - منصة العون للأسر المحتاجة"
                            width={131}
                            height={46}
                            priority
                            sizes="131px"
                            className="h-14 w-auto object-contain transition-[transform,opacity] duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-label={`انتقل إلى ${item.label}`}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className={`text-[15px] font-medium transition-[color,transform] duration-200 relative group ${isActive(item.href)
                                    ? "text-warm-green"
                                    : "text-foreground/70 hover:text-warm-green"
                                    }`}
                            >
                                {item.label}
                                <span
                                    className={`absolute -bottom-[22px] inset-x-0 h-[3px] bg-warm-green transition-[width] duration-300 ${isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                ></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Action Buttons / User Menu - HIDDEN ON LG and below to prevent overlap */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-24 h-10 bg-muted/60 animate-pulse rounded-lg" />
                                <div className="w-24 h-10 bg-muted/60 animate-pulse rounded-lg" />
                            </div>
                        ) : isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-12 rounded-full pl-2 pr-4 hover:bg-muted/50 border border-transparent hover:border-border transition-[background-color,border-color,transform] group">
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
                                        className="font-medium text-[15px] px-5 h-11 rounded-xl border border-border hover:border-warm-green hover:bg-warm-green/5 hover:text-warm-green transition-all duration-250"
                                    >
                                        تسجيل الدخول
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="font-semibold text-[15px] px-6 h-11 rounded-xl bg-warm-green hover:bg-warm-green-light shadow-lg shadow-warm-green/20 hover:shadow-warm-green/30 hover:-translate-y-0.5 transition-[background-color,box-shadow,transform] duration-250">
                                        حساب جديد
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`lg:hidden p-2.5 hover:bg-muted/50 rounded-lg transition-all duration-300 ${isMenuOpen ? 'bg-muted/50' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="فتح القائمة"
                    >
                        {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
                    </button>

                    {/* Mobile Menu Dropdown (Compact) */}
                    {isMenuOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-4 w-[280px] z-50 lg:hidden flex flex-col bg-popover/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl animate-in slide-in-from-top-2 fade-in duration-200 origin-top">

                            {/* Menu Links */}
                            <nav className="flex flex-col p-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`text-base font-bold px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${isActive(item.href)
                                                ? "bg-warm-green/10 text-warm-green"
                                                : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                                            }`}
                                        onClick={(e) => handleNavClick(e, item.href)}
                                    >
                                        {item.label}
                                        {isActive(item.href) && <div className="w-1.5 h-1.5 rounded-full bg-warm-green" />}
                                    </Link>
                                ))}
                            </nav>

                            <div className="h-[1px] bg-border/50 mx-4" />

                            {/* Menu Footer - Auth Logic */}
                            <div className="p-4 flex flex-col gap-3">
                                {isLoading ? (
                                    <div className="h-10 bg-muted/60 animate-pulse rounded-xl w-full" />
                                ) : isAuthenticated && user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-2 py-1 mb-1">
                                            <Avatar className="h-8 w-8 border border-border">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                                                <AvatarFallback>{getInitials()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-bold text-sm truncate">{user.name}</span>
                                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                            </div>
                                        </div>

                                        <Link href={dashboardUrl} onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full h-10 font-bold rounded-xl bg-primary text-white hover:bg-primary/90 shadow-sm">
                                                <LayoutDashboard className="ml-2 h-4 w-4" />
                                                لوحة التحكم
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="outline"
                                            className="w-full h-10 font-bold rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            تسجيل الخروج
                                        </Button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button
                                                variant="outline"
                                                className="w-full h-10 font-bold rounded-xl border-border/60 hover:bg-muted/50"
                                            >
                                                تسجيل الدخول
                                            </Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full h-10 font-bold rounded-xl bg-warm-green hover:bg-warm-green-light shadow-md shadow-warm-green/20">
                                                حساب جديد
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
