"use client";

import { useMemo, useState } from "react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { useAssociationRequests } from "@/features/associations";
import { RequestStatus } from "@/features/associations/types";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import {
	AlertCircle,
	Calendar,
	Inbox,
	Brain,
	Clock,
	Coins,
	Stethoscope,
	UtensilsCrossed,
	Home,
	GraduationCap,
	CreditCard,
	HelpCircle,
	ChevronLeft,
	Search,
	X,
	RefreshCw,
	ArrowUpDown,
	Flame,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow, isAfter, subDays } from "date-fns";
import { ar } from "date-fns/locale";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { cn } from "@/shared/utils";

/* ============================================================
 * Types
 * ============================================================ */
type NeedLevel = "High" | "Medium" | "Low" | null | undefined;

interface AssociationRequest {
	id: string | number;
	familyName?: string;
	familyHeadName?: string;
	description?: string | null;
	createdAt?: string | null;
	requestType?: string;
	aiNeedLevel?: NeedLevel;
	aiConfidence?: number | null;
	needScore?: number | null;
	priorityLevel?: string | number | boolean | null;
}

type SortKey = "newest" | "oldest" | "urgency";

/* ============================================================
 * Config maps
 * ============================================================ */
const NEED_LEVEL_CONFIG = {
	High: {
		label: "عالي",
		color: "text-red-600",
		bg: "bg-red-50",
		border: "border-red-100",
		accent: "bg-red-500",
		ring: "ring-red-500/20",
		weight: 3,
	},
	Medium: {
		label: "متوسط",
		color: "text-amber-600",
		bg: "bg-amber-50",
		border: "border-amber-100",
		accent: "bg-amber-500",
		ring: "ring-amber-500/20",
		weight: 2,
	},
	Low: {
		label: "منخفض",
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-100",
		accent: "bg-emerald-500",
		ring: "ring-emerald-500/20",
		weight: 1,
	},
	Unknown: {
		label: "غير محدد",
		color: "text-slate-500",
		bg: "bg-slate-50",
		border: "border-slate-100",
		accent: "bg-slate-400",
		ring: "ring-slate-400/20",
		weight: 0,
	},
} as const;

const getNeedLevelConfig = (level: NeedLevel) => {
	if (level === "High") return NEED_LEVEL_CONFIG.High;
	if (level === "Medium") return NEED_LEVEL_CONFIG.Medium;
	if (level === "Low") return NEED_LEVEL_CONFIG.Low;
	return NEED_LEVEL_CONFIG.Unknown;
};

const CATEGORY_MAP: Record<
	string,
	{ label: string; icon: typeof Calendar; color: string; bg: string }
> = {
	Financial: { label: "مالية", icon: Coins, color: "text-blue-600", bg: "bg-blue-50" },
	Medical: { label: "صحية", icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50" },
	Food: { label: "غذائية", icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-50" },
	Housing: { label: "سكن", icon: Home, color: "text-sky-600", bg: "bg-sky-50" },
	Education: { label: "تعليم", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
	Utilities: { label: "فواتير", icon: CreditCard, color: "text-pink-600", bg: "bg-pink-50" },
	Other: { label: "أخرى", icon: HelpCircle, color: "text-slate-600", bg: "bg-slate-100" },
};

/* ============================================================
 * Page
 * ============================================================ */
export default function OrganizationPendingPage() {
	const hookResult = useAssociationRequests({ status: RequestStatus.Pending });
	const requests = (hookResult.requests ?? []) as AssociationRequest[];
	const { isLoading, error } = hookResult;
	// Optional refetch — supported if hook exposes it
	const refetch = (hookResult as { refetch?: () => void }).refetch;

	const [searchQuery, setSearchQuery] = useState("");
	const [sortKey, setSortKey] = useState<SortKey>("urgency");
	const [needLevelFilter, setNeedLevelFilter] = useState<"" | "High" | "Medium" | "Low">("");

	/* ---------- Stats breakdown ---------- */
	const stats = useMemo(() => {
		const breakdown = { High: 0, Medium: 0, Low: 0, Unknown: 0 };
		requests.forEach((r) => {
			const key = r.aiNeedLevel ?? "Unknown";
			breakdown[key as keyof typeof breakdown] =
				(breakdown[key as keyof typeof breakdown] || 0) + 1;
		});
		return breakdown;
	}, [requests]);

	/* ---------- Filtered + sorted ---------- */
	const visibleRequests = useMemo(() => {
		let list = [...requests];

		if (needLevelFilter) {
			list = list.filter((r) => r.aiNeedLevel === needLevelFilter);
		}

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(r) =>
					(r.familyName || "").toLowerCase().includes(q) ||
					(r.familyHeadName || "").toLowerCase().includes(q) ||
					(r.description || "").toLowerCase().includes(q) ||
					String(r.id).includes(q),
			);
		}

		const tsOf = (r: AssociationRequest) =>
			r.createdAt ? new Date(r.createdAt).getTime() : 0;

		list.sort((a, b) => {
			if (sortKey === "newest") return tsOf(b) - tsOf(a);
			if (sortKey === "oldest") return tsOf(a) - tsOf(b);
			// urgency: need level desc, then newest
			const wa = getNeedLevelConfig(a.aiNeedLevel).weight;
			const wb = getNeedLevelConfig(b.aiNeedLevel).weight;
			if (wa !== wb) return wb - wa;
			return tsOf(b) - tsOf(a);
		});

		return list;
	}, [requests, searchQuery, sortKey, needLevelFilter]);

	const handleRefresh = () => {
		if (refetch) refetch();
		else if (typeof window !== "undefined") window.location.reload();
	};

	const hasActiveFilters = !!searchQuery || !!needLevelFilter;

	return (
		<DashboardLayout>
			<OrganizationSidebar />
			<div
				className="flex-1 flex flex-col h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white"
				dir="rtl"
			>
				<DashboardTopBar userType="organization" />
				<main className="py-6 sm:py-8">
					<div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
						{/* ===== Header ===== */}
						<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2.5">
									<div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
										<Clock className="w-5 h-5 text-amber-500" />
									</div>
									<h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
										طلبات قيد المراجعة
									</h1>
								</div>
								<p className="text-slate-500 font-medium text-sm sm:text-base">
									راجع الطلبات الجديدة الواردة للجمعية ورتّبها حسب الأولوية.
								</p>
							</div>

							<div className="flex items-center gap-2">
								{!isLoading && requests.length > 0 && (
									<div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
										<Clock className="w-4 h-4 text-amber-500" />
										<span className="font-black text-slate-700">
											{requests.length}
										</span>
										<span className="text-slate-400 font-medium text-sm">
											طلب
										</span>
									</div>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={handleRefresh}
									disabled={isLoading}
									aria-label="تحديث القائمة"
									className="h-10 w-10 p-0 rounded-xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50"
								>
									<RefreshCw
										className={cn(
											"w-4 h-4 text-slate-500",
											isLoading && "animate-spin",
										)}
									/>
								</Button>
							</div>
						</div>

						{/* ===== Stats Breakdown ===== */}
						{!isLoading && requests.length > 0 && (
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								<StatPill
									label="عالي الأولوية"
									value={stats.High}
									icon={Flame}
									color="text-red-600"
									bg="bg-red-50"
									border="border-red-100"
									active={needLevelFilter === "High"}
									onClick={() =>
										setNeedLevelFilter(needLevelFilter === "High" ? "" : "High")
									}
								/>
								<StatPill
									label="متوسط الأولوية"
									value={stats.Medium}
									icon={TrendingUp}
									color="text-amber-600"
									bg="bg-amber-50"
									border="border-amber-100"
									active={needLevelFilter === "Medium"}
									onClick={() =>
										setNeedLevelFilter(
											needLevelFilter === "Medium" ? "" : "Medium",
										)
									}
								/>
								<StatPill
									label="منخفض الأولوية"
									value={stats.Low}
									icon={Zap}
									color="text-emerald-600"
									bg="bg-emerald-50"
									border="border-emerald-100"
									active={needLevelFilter === "Low"}
									onClick={() =>
										setNeedLevelFilter(needLevelFilter === "Low" ? "" : "Low")
									}
								/>
								<StatPill
									label="غير محدد"
									value={stats.Unknown}
									icon={HelpCircle}
									color="text-slate-600"
									bg="bg-slate-50"
									border="border-slate-100"
								/>
							</div>
						)}

						{/* ===== Toolbar: Search + Sort ===== */}
						{!isLoading && requests.length > 0 && (
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="relative flex-1">
									<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="ابحث باسم الأسرة أو الوصف أو الرقم..."
										aria-label="بحث في الطلبات"
										className="w-full h-11 pr-10 pl-10 text-sm font-medium rounded-xl border border-slate-100 bg-white shadow-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-warm-green/20 focus:border-warm-green/40 transition-all"
									/>
									{searchQuery && (
										<button
											type="button"
											onClick={() => setSearchQuery("")}
											aria-label="مسح البحث"
											className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
								<div className="relative inline-flex items-center">
									<ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									<select
										value={sortKey}
										onChange={(e) => setSortKey(e.target.value as SortKey)}
										aria-label="ترتيب الطلبات"
										className="appearance-none w-full sm:w-56 h-11 pr-10 pl-4 text-sm font-bold rounded-xl border border-slate-100 bg-white shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-warm-green/20 focus:border-warm-green/40 transition-all cursor-pointer"
									>
										<option value="urgency">الأكثر إلحاحاً</option>
										<option value="newest">الأحدث أولاً</option>
										<option value="oldest">الأقدم أولاً</option>
									</select>
								</div>
							</div>
						)}

						{/* ===== Body ===== */}
						{isLoading ? (
							<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<RequestCardSkeleton key={i} />
								))}
							</div>
						) : error ? (
							<Card className="p-8 text-center border-red-200 bg-red-50 rounded-2xl flex flex-col items-center gap-4">
								<div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
									<AlertCircle className="w-8 h-8 text-red-500" />
								</div>
								<div>
									<p className="text-red-700 font-bold text-base">
										حدث خطأ أثناء تحميل الطلبات
									</p>
									<p className="text-red-500 text-sm mt-1">{String(error)}</p>
								</div>
								<Button
									onClick={handleRefresh}
									className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-10 px-5 font-bold text-sm"
								>
									<RefreshCw className="w-4 h-4 ml-2" />
									إعادة المحاولة
								</Button>
							</Card>
						) : requests.length === 0 ? (
							<EmptyState
								icon={Inbox}
								title="لا توجد طلبات معلقة"
								description="لا توجد طلبات قيد المراجعة حالياً. سنُعلمك فور وصول طلبات جديدة."
							/>
						) : visibleRequests.length === 0 ? (
							<Card className="p-10 text-center border-dashed border-2 border-slate-200 rounded-2xl bg-white">
								<div className="flex flex-col items-center gap-4">
									<div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center">
										<Search className="w-10 h-10 text-slate-300" />
									</div>
									<div>
										<p className="text-lg font-bold text-slate-700">
											لا توجد نتائج
										</p>
										<p className="text-sm text-slate-400 mt-1">
											جرّب تغيير مصطلح البحث أو إزالة الفلاتر.
										</p>
									</div>
									{hasActiveFilters && (
										<Button
											variant="outline"
											onClick={() => {
												setSearchQuery("");
												setNeedLevelFilter("");
											}}
											className="rounded-xl h-10 px-5 font-bold text-sm"
										>
											<X className="w-4 h-4 ml-2" />
											مسح الفلاتر
										</Button>
									)}
								</div>
							</Card>
						) : (
							<div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
								{visibleRequests.map((request, i) => (
									<RequestCard
										key={request.id}
										request={request}
										animationDelay={i * 50}
									/>
								))}
							</div>
						)}
					</div>
				</main>
			</div>
		</DashboardLayout>
	);
}

/* ============================================================
 * StatPill
 * ============================================================ */
function StatPill({
	label,
	value,
	icon: Icon,
	color,
	bg,
	border,
	active,
	onClick,
}: {
	label: string;
	value: number;
	icon: typeof Calendar;
	color: string;
	bg: string;
	border: string;
	active?: boolean;
	onClick?: () => void;
}) {
	const Component = onClick ? "button" : "div";
	return (
		<Component
			onClick={onClick}
			type={onClick ? "button" : undefined}
			aria-pressed={onClick ? !!active : undefined}
			className={cn(
				"flex items-center gap-3 p-3 sm:p-4 rounded-2xl border bg-white shadow-sm transition-all text-right",
				onClick && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
				active && "ring-2 ring-warm-green/30 border-warm-green/40",
				!active && border,
			)}
		>
			<div
				className={cn(
					"w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
					bg,
				)}
			>
				<Icon className={cn("w-5 h-5", color)} />
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-baseline gap-1">
					<span className="text-xl font-black text-slate-900">{value}</span>
				</div>
				<p className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">
					{label}
				</p>
			</div>
		</Component>
	);
}

/* ============================================================
 * Skeleton
 * ============================================================ */
function RequestCardSkeleton() {
	return (
		<Card className="rounded-2xl border-slate-100 overflow-hidden animate-pulse">
			<div className="h-1 bg-slate-100" />
			<div className="p-5 sm:p-6 space-y-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3 flex-1">
						<div className="w-11 h-11 rounded-xl bg-slate-100 shrink-0" />
						<div className="flex-1 space-y-2">
							<div className="h-4 w-32 bg-slate-100 rounded" />
							<div className="h-3 w-24 bg-slate-50 rounded" />
						</div>
					</div>
					<div className="h-6 w-20 bg-slate-100 rounded-full" />
				</div>
				<div className="space-y-2">
					<div className="h-3 w-full bg-slate-50 rounded" />
					<div className="h-3 w-2/3 bg-slate-50 rounded" />
				</div>
				<div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
					<div className="flex gap-2">
						<div className="h-6 w-14 bg-slate-50 rounded-lg" />
						<div className="h-6 w-14 bg-slate-50 rounded-lg" />
					</div>
					<div className="h-9 w-24 bg-slate-100 rounded-xl" />
				</div>
			</div>
		</Card>
	);
}

/* ============================================================
 * RequestCard
 * ============================================================ */
function RequestCard({
	request,
	animationDelay = 0,
}: {
	request: AssociationRequest;
	animationDelay?: number;
}) {
	const needConfig = getNeedLevelConfig(request.aiNeedLevel);
	const category =
		(request.requestType && CATEGORY_MAP[request.requestType]) ||
		CATEGORY_MAP.Other;
	const CategoryIcon = category.icon;
	const isHighNeed = request.aiNeedLevel === "High";
	const isUrgent = !!request.priorityLevel;

	const createdDate = request.createdAt ? new Date(request.createdAt) : null;
	const isRecent =
		createdDate && isAfter(createdDate, subDays(new Date(), 2));
	const dateLabel = createdDate
		? isRecent
			? formatDistanceToNow(createdDate, { addSuffix: true, locale: ar })
			: format(createdDate, "dd MMMM yyyy", { locale: ar })
		: "تاريخ غير معروف";

	const detailsHref = `/dashboard/organization/requests/${request.id}`;
	const familyTitle =
		request.familyName || request.familyHeadName || "أسرة غير معروفة";

	return (
		<Card
			className={cn(
				"group relative rounded-2xl border bg-white shadow-sm transition-all duration-300 overflow-hidden",
				"hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5",
				"animate-in fade-in slide-in-from-bottom-2 duration-500",
				isHighNeed
					? "border-red-200/70 shadow-red-100/40"
					: "border-slate-200/80",
			)}
			style={{ animationDelay: `${animationDelay}ms`, animationFillMode: "both" }}
		>
			{/* Top accent bar */}
			<div className={cn("h-1 w-full", needConfig.accent)} aria-hidden />

			{/* Whole-card click target */}
			<Link
				href={detailsHref}
				aria-label={`عرض تفاصيل طلب ${familyTitle}`}
				className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/40 rounded-2xl"
			/>

			<div className="relative z-10 p-5 sm:p-6 space-y-4 pointer-events-none">
				{/* Header row */}
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3 min-w-0">
						<div
							className={cn(
								"w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
								category.bg,
							)}
						>
							<CategoryIcon className={cn("w-5 h-5", category.color)} />
						</div>
						<div className="min-w-0">
							<h3 className="font-bold text-base text-slate-900 truncate">
								{familyTitle}
							</h3>
							<div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
								<Calendar className="w-3 h-3 shrink-0" />
								<span className="truncate">{dateLabel}</span>
							</div>
						</div>
					</div>

					<span
						role="status"
						className="shrink-0 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-[11px] font-bold rounded-full"
					>
						<span
							className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"
							aria-hidden
						/>
						قيد المراجعة
					</span>
				</div>

				{/* High-need banner */}
				{isHighNeed && (
					<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-l from-red-50 to-red-50/50 border border-red-100">
						<Flame className="w-4 h-4 text-red-500 shrink-0" />
						<span className="text-[12px] font-bold text-red-700">
							احتياج عالي - عاجل
						</span>
					</div>
				)}

				{/* Description */}
				<p className="text-sm text-slate-600 leading-relaxed line-clamp-2 min-h-[2.5rem]">
					{request.description || "لا يوجد وصف"}
				</p>

				{/* Footer */}
				<div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
					<div className="flex items-center gap-1.5 flex-wrap">
						<span
							className={cn(
								"inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg",
								category.bg,
								category.color,
							)}
						>
							<CategoryIcon className="w-3 h-3" />
							{category.label}
						</span>
						{isUrgent && (
							<span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100">
								<AlertCircle className="w-3 h-3" />
								عاجل
							</span>
						)}
						{request.aiNeedLevel && (
							<span
								className={cn(
									"inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border",
									needConfig.bg,
									needConfig.color,
									needConfig.border,
								)}
							>
								<Brain className="w-3 h-3" />
								{needConfig.label}
								{request.needScore != null && (
									<span className="opacity-60 text-[10px]">
										({request.needScore <= 1 ? Math.round(request.needScore * 100) : Math.round(request.needScore)}%)
									</span>
								)}
							</span>
						)}
					</div>

					{/* Visual button — actual click handled by overlay Link */}
					<Button
						size="sm"
						tabIndex={-1}
						className="pointer-events-none h-9 px-4 rounded-xl bg-warm-green text-white font-bold text-xs shadow-sm shadow-warm-green/20 group-hover:bg-warm-green/90 transition-colors shrink-0"
					>
						التفاصيل
						<ChevronLeft className="w-3.5 h-3.5 mr-1 transition-transform group-hover:-translate-x-0.5" />
					</Button>
				</div>
			</div>
		</Card>
	);
}
