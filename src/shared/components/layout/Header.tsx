"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	Menu,
	X,
	LogOut,
	User,
	LayoutDashboard,
	Settings,
	ChevronDown,
} from "lucide-react";
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
import { useAuthContext } from "@/shared/providers";

type NavItem = { label: string; href: string; sectionId?: string };

const NAV_ITEMS: NavItem[] = [
	{ label: "الرئيسية", href: "/", sectionId: "hero" },
	{ label: "حملات التبرع", href: "/explore" },
	{ label: "لماذا عون؟", href: "/#why-aoun", sectionId: "why-aoun" },
	{ label: "رحلة المساعدة", href: "/#journey", sectionId: "journey" },
	{ label: "الأسئلة الشائعة", href: "/#faq", sectionId: "faq" },
];

const ORG_ROLE_KEYWORDS = [
	"organization",
	"association",
	"charity",
	"org",
	"جمعية",
	"مؤسسة",
];

// Header heights (kept in one place so menu offsets stay in sync)
const HEADER_H_DEFAULT = 76;
const HEADER_H_SCROLLED = 64;

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeSection, setActiveSection] = useState("hero");
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();
	const { user, isAuthenticated, logout, isLoading } = useAuthContext();

	const navItems = useMemo(() => NAV_ITEMS, []);
	const headerH = isScrolled ? HEADER_H_SCROLLED : HEADER_H_DEFAULT;

	/* ---------- Scroll-aware shrink ---------- */
	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	/* ---------- Active-section detection ---------- */
	useEffect(() => {
		if (pathname !== "/") return;

		let lockUntil = 0;
		const setLock = (ms: number) => (lockUntil = Date.now() + ms);
		(window as any).__headerSetLock = setLock; // exposed for click handler

		const computeActive = () => {
			if (Date.now() < lockUntil) return;
			const triggerY = (isScrolled ? HEADER_H_SCROLLED : HEADER_H_DEFAULT) + 24;
			const sections = Array.from(
				document.querySelectorAll<HTMLElement>("section[id]"),
			);
			if (sections.length === 0) return;

			if (window.scrollY < 10) {
				setActiveSection(sections[0].id);
				return;
			}
			const nearBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 4;
			if (nearBottom) {
				setActiveSection(sections[sections.length - 1].id);
				return;
			}

			let current = sections[0].id;
			for (const s of sections) {
				const top = s.getBoundingClientRect().top;
				if (top - triggerY <= 0) current = s.id;
				else break;
			}
			setActiveSection(current);
		};

		let raf = 0;
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				raf = 0;
				computeActive();
			});
		};

		computeActive();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", computeActive);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", computeActive);
			if (raf) cancelAnimationFrame(raf);
			delete (window as any).__headerSetLock;
		};
	}, [pathname, isScrolled]);

	/* ---------- Lock body scroll when mobile menu is open ---------- */
	useEffect(() => {
		if (!isMenuOpen) return;
		const { body, documentElement } = document;
		const scrollBarGap = window.innerWidth - documentElement.clientWidth;
		const prevOverflow = body.style.overflow;
		const prevPaddingRight = body.style.paddingRight;
		body.style.overflow = "hidden";
		if (scrollBarGap > 0) body.style.paddingRight = `${scrollBarGap}px`;
		return () => {
			body.style.overflow = prevOverflow;
			body.style.paddingRight = prevPaddingRight;
		};
	}, [isMenuOpen]);

	/* ---------- Escape to close mobile menu ---------- */
	useEffect(() => {
		if (!isMenuOpen) return;
		const onKey = (e: KeyboardEvent) =>
			e.key === "Escape" && setIsMenuOpen(false);
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [isMenuOpen]);

	/* ---------- Auto-close menu when switching to desktop ---------- */
	useEffect(() => {
		if (!isMenuOpen) return;
		const mq = window.matchMedia("(min-width: 1024px)");
		const handler = (e: MediaQueryListEvent) => {
			if (e.matches) setIsMenuOpen(false);
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [isMenuOpen]);

	/* ---------- Helpers ---------- */
	const isActive = useCallback(
		(item: NavItem) => {
			if (pathname === "/") {
				return activeSection === (item.sectionId ?? "");
			}
			
			if (item.href !== "/" && !item.href.startsWith("/#")) {
				return pathname.startsWith(item.href);
			}

			return false;
		},
		[pathname, activeSection],
	);

	const handleNavClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
			setIsMenuOpen(false);
			(window as any).__headerSetLock?.(800);

			if (pathname === "/" && item.sectionId) {
				e.preventDefault();
				setActiveSection(item.sectionId);
				if (item.sectionId === "hero" || item.href === "/") {
					window.scrollTo({ top: 0, behavior: "smooth" });
				} else {
					const el = document.getElementById(item.sectionId);
					if (el) {
						const y =
							el.getBoundingClientRect().top +
							window.scrollY -
							headerH -
							8;
						window.scrollTo({ top: y, behavior: "smooth" });
					}
				}
			}
		},
		[pathname, headerH],
	);

	const dashboardUrl = useMemo(() => {
		if (!user) return "/";
		const role = user.role?.toLowerCase() ?? "";
		const isOrg = ORG_ROLE_KEYWORDS.some((k) => role.includes(k));
		const isAdmin = role.includes('admin') || role.includes('أدمن');
		const isDonor = role.includes('donor') || role.includes('فاعل خير') || role.includes('متبرع');

		if (isAdmin) return "/dashboard/admin";
		if (isDonor) return "/dashboard/donor";
		if (isOrg) return "/dashboard/organization";
		return "/dashboard/family";
	}, [user]);

	const initials = useMemo(() => {
		if (!user?.name) return "U";
		return user.name
			.split(" ")
			.slice(0, 2)
			.map((p) => p[0])
			.join("")
			.toUpperCase();
	}, [user?.name]);

	const displayName = user?.name?.split(" ")[0] ?? "User";

	const dropdownLinks = [
		{ href: dashboardUrl, label: "لوحة التحكم", icon: LayoutDashboard },
		{ href: `${dashboardUrl}/profile`, label: "الملف الشخصي", icon: User },
		{ href: `${dashboardUrl}/settings`, label: "الإعدادات", icon: Settings },
	];

	/* ---------- Render ---------- */
	return (
		<>
			<header
				dir="rtl"
				className={[
					"sticky top-0 z-50 w-full transition-[height,background-color,box-shadow,backdrop-filter,color] duration-500",
					isScrolled
						? "bg-white/90 backdrop-blur-2xl shadow-md shadow-slate-200/40 border-b border-slate-200/70 text-foreground"
						: "bg-transparent border-transparent shadow-none text-white",
				].join(" ")}
			>
				<div className="container mx-auto px-8 lg:px-16">
					<div
						className="flex items-center justify-between gap-8 relative transition-[height] duration-300"
						style={{ height: `${headerH}px` }}
					>
						{/* Logo */}
						<Link
							href="/"
							aria-label="العودة للصفحة الرئيسية"
							className="flex items-center gap-3 group transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/40 rounded-lg"
							onClick={(e) => handleNavClick(e, navItems[0])}
						>
							<Image
								src="/logo.png"
								alt="عون - منصة العون للأسر المحتاجة"
								width={131}
								height={46}
								priority
								sizes="131px"
								className={[
									"w-auto object-contain transition-[height,transform] duration-300 group-hover:scale-[1.04]",
									isScrolled ? "h-12" : "h-14",
								].join(" ")}
							/>
						</Link>

						{/* Desktop Nav */}
						<nav
							className="hidden lg:flex items-center gap-3"
							aria-label="الرئيسية"
						>
							{navItems.map((item) => {
								const active = isActive(item);
								return (
									<Link
										key={item.href}
										href={item.href}
										aria-current={active ? "page" : undefined}
										aria-label={`انتقل إلى ${item.label}`}
										onClick={(e) => handleNavClick(e, item)}
										className={[
											"relative px-4 py-2 rounded-xl text-[15px] font-medium",
											"transition-[color,background-color] duration-200",
											"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/40",
											active
												? (isScrolled ? "text-warm-green" : "text-white drop-shadow-md")
												: (isScrolled ? "text-foreground/70 hover:text-warm-green hover:bg-warm-green/5" : "text-white/80 hover:text-white hover:bg-white/10 drop-shadow-sm"),
										].join(" ")}
									>
										<span className="relative">
											{item.label}
											<span
												aria-hidden
												className={[
													"pointer-events-none absolute -bottom-1 inset-x-0 h-[2px] rounded-full bg-warm-green",
													"origin-center transition-transform duration-300 ease-out",
													active ? "scale-x-100" : "scale-x-0",
												].join(" ")}
											/>
										</span>
									</Link>
								);
							})}
						</nav>

						{/* Desktop Actions */}
						<div className="hidden lg:flex items-center gap-3">
							{isLoading ? (
								<div className="flex items-center gap-3" aria-busy="true">
									<div className="w-24 h-10 bg-muted/60 animate-pulse rounded-xl" />
									<div className="w-28 h-10 bg-muted/60 animate-pulse rounded-xl" />
								</div>
							) : isAuthenticated && user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="relative h-12 rounded-full pr-2 pl-4 hover:bg-muted/50 border border-transparent hover:border-border transition group"
										>
											<div className="flex items-center gap-3 flex-row-reverse">
												<span className="relative">
													<Avatar className="h-9 w-9 border border-border shadow-sm group-hover:scale-105 transition-transform">
														<AvatarImage
															src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
																user.name,
															)}`}
															alt={user.name}
														/>
														<AvatarFallback>{initials}</AvatarFallback>
													</Avatar>
													<span
														aria-hidden
														className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white"
													/>
												</span>
												<span className="text-sm font-bold leading-none max-w-[160px] truncate">
													{displayName}
												</span>
												<ChevronDown className={`w-4 h-4 group-hover:text-foreground group-data-[state=open]:rotate-180 transition ${isScrolled ? 'text-muted-foreground' : 'text-white/80'}`} />
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-64"
										align="end"
										sideOffset={10}
									>
										<DropdownMenuLabel className="font-normal">
											<div className="flex flex-col gap-1 text-right">
												<p className="text-sm font-bold leading-none truncate">
													{user.name}
												</p>
												<p className="text-xs leading-none text-muted-foreground truncate">
													{user.email}
												</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{dropdownLinks.map(({ href, label, icon: Icon }) => (
											<DropdownMenuItem key={href} asChild>
												<Link
													href={href}
													prefetch
													className="w-full flex items-center cursor-pointer flex-row-reverse"
												>
													<Icon className="mr-2 h-4 w-4" />
													<span>{label}</span>
												</Link>
											</DropdownMenuItem>
										))}
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
											onClick={() => logout()}
										>
											<div className="flex items-center flex-row-reverse w-full">
												<LogOut className="mr-2 h-4 w-4" />
												<span>تسجيل الخروج</span>
											</div>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<>
									<div className="w-px h-6 bg-border mx-1" aria-hidden />
									<Link href="/login" prefetch>
										<Button
											variant="ghost"
											className={`font-medium text-[15px] px-5 h-11 rounded-xl border transition ${isScrolled ? 'border-border hover:border-warm-green hover:bg-warm-green/5 hover:text-warm-green text-foreground' : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm'}`}
										>
											تسجيل الدخول
										</Button>
									</Link>
									<Link href="/register" prefetch>
										<Button
											className="relative overflow-hidden font-semibold text-[15px] px-6 h-11 rounded-xl
                                 bg-gradient-to-l from-warm-green to-warm-green-light
                                 shadow-lg shadow-warm-green/25 hover:shadow-warm-green/40
                                 hover:-translate-y-0.5 active:translate-y-0
                                 transition-[box-shadow,transform] duration-250"
										>
											<span className="relative z-10">حساب جديد</span>
										</Button>
									</Link>
								</>
							)}
						</div>

						{/* Mobile menu button */}
						<button
							type="button"
							className={[
								"lg:hidden p-2.5 rounded-lg transition-all duration-300 relative z-[60]",
								"hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/40",
								isMenuOpen ? "bg-muted/50" : "",
							].join(" ")}
							onClick={() => setIsMenuOpen((v) => !v)}
							aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
							aria-expanded={isMenuOpen}
							aria-controls="mobile-menu"
						>
							<span className="relative block w-6 h-6">
								<Menu
									className={[
										"absolute inset-0 w-6 h-6 transition-all duration-300",
										isScrolled ? "text-foreground" : "text-white drop-shadow-md",
										isMenuOpen
											? "opacity-0 rotate-90 scale-75"
											: "opacity-100 rotate-0 scale-100",
									].join(" ")}
								/>
								<X
									className={[
										"absolute inset-0 w-6 h-6 transition-all duration-300",
										isScrolled ? "text-foreground" : "text-white drop-shadow-md",
										isMenuOpen
											? "opacity-100 rotate-0 scale-100"
											: "opacity-0 -rotate-90 scale-75",
									].join(" ")}
								/>
							</span>
						</button>
					</div>
				</div>
			</header>

			{/* Mobile menu — full-screen sheet */}
			<div
				id="mobile-menu"
				className={[
					"lg:hidden fixed inset-0 z-40 transition-opacity duration-300",
					isMenuOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none",
				].join(" ")}
				aria-hidden={!isMenuOpen}
			>
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
					onClick={() => setIsMenuOpen(false)}
				/>

				{/* Sheet */}
				<div
					dir="rtl"
					role="dialog"
					aria-modal="true"
					aria-label="القائمة المتنقلة"
					style={{
						top: `${headerH + 8}px`,
						maxHeight: `calc(100dvh - ${headerH + 24}px)`,
					}}
					className={[
						"absolute inset-x-4 overflow-y-auto overscroll-contain",
						"bg-white shadow-2xl shadow-black/25 rounded-3xl border-2 border-warm-green/40",
						"transition-[transform,opacity] duration-300 origin-top",
						isMenuOpen
							? "translate-y-0 opacity-100"
							: "-translate-y-3 opacity-0",
					].join(" ")}
				>
					{/* Nav links */}
					<nav
						className="flex flex-col p-4 space-y-3"
						aria-label="القائمة المتنقلة"
					>
						{navItems.map((item, i) => {
							const active = isActive(item);
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={(e) => handleNavClick(e, item)}
									aria-current={active ? "page" : undefined}
									style={{
										animationDelay: `${i * 40}ms`,
										animationFillMode: "both",
									}}
									className={[
										"text-base font-medium px-4 py-2 rounded-lg transition-all",
										"animate-in fade-in slide-in-from-top-1 duration-300",
										"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/40",
										active
											? "text-warm-green font-semibold"
											: "text-slate-500 hover:text-slate-700",
									].join(" ")}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>

					<div className="h-px bg-slate-200 mx-4 my-3" />

					{/* Auth section */}
					<div className="p-4 flex flex-col gap-2">
						{isLoading ? (
							<>
								<div className="h-11 bg-muted/60 animate-pulse rounded-full w-full" />
								<div className="h-11 bg-muted/60 animate-pulse rounded-full w-full" />
							</>
						) : isAuthenticated && user ? (
							<>
								{/* User card */}
								<div className="flex items-center gap-3 flex-row-reverse p-3 rounded-2xl bg-slate-50 mb-1">
									<Avatar className="h-11 w-11 border border-border shadow-sm">
										<AvatarImage
											src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
												user.name,
											)}`}
											alt={user.name}
										/>
										<AvatarFallback>{initials}</AvatarFallback>
									</Avatar>
									<div className="flex flex-col text-right min-w-0 flex-1">
										<span className="text-sm font-bold truncate">
											{user.name}
										</span>
										<span className="text-xs text-muted-foreground truncate">
											{user.email}
										</span>
									</div>
								</div>

								{dropdownLinks.map(({ href, label, icon: Icon }) => (
									<Link
										key={href}
										href={href}
										prefetch
										onClick={() => setIsMenuOpen(false)}
										className="flex items-center justify-between flex-row-reverse w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-700 hover:border-warm-green hover:text-warm-green hover:bg-warm-green/5 transition-all font-medium text-[15px]"
									>
										<span>{label}</span>
										<Icon className="h-4 w-4" />
									</Link>
								))}

								<button
									type="button"
									onClick={() => {
										logout();
										setIsMenuOpen(false);
									}}
									className="flex items-center justify-between flex-row-reverse w-full h-11 px-4 rounded-xl border border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 transition-all font-semibold text-[15px] mt-1"
								>
									<span>تسجيل الخروج</span>
									<LogOut className="h-4 w-4" />
								</button>
							</>
						) : (
							<div className="grid grid-cols-2 gap-2">
								<Link
									href="/login"
									prefetch
									onClick={() => setIsMenuOpen(false)}
									className="flex items-center justify-center w-full h-11 font-semibold rounded-full border-2 border-slate-300 text-slate-700 hover:border-warm-green hover:text-warm-green transition-all text-[15px]"
								>
									تسجيل الدخول
								</Link>
								<Link
									href="/register"
									prefetch
									onClick={() => setIsMenuOpen(false)}
									className="flex items-center justify-center w-full h-11 font-semibold rounded-full bg-warm-green hover:bg-warm-green-light text-white shadow-md shadow-warm-green/20 transition-all text-[15px]"
								>
									حساب جديد
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}