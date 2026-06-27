const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app', 'dashboard', 'organization', 'pending', 'page.tsx');

const content = `"use client";

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
    ArrowUpRight
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
		label: "أولوية قصوى",
		color: "text-rose-600",
		bg: "bg-rose-50",
		border: "border-rose-200",
		accent: "bg-rose-500",
		ring: "ring-rose-500/20",
		weight: 3,
	},
	Medium: {
		label: "أولوية متوسطة",
		color: "text-amber-600",
		bg: "bg-amber-50",
		border: "border-amber-200",
		accent: "bg-amber-500",
		ring: "ring-amber-500/20",
		weight: 2,
	},
	Low: {
		label: "أولوية عادية",
		color: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		accent: "bg-emerald-500",
		ring: "ring-emerald-500/20",
		weight: 1,
	},
	Unknown: {
		label: "غير محدد",
		color: "text-slate-500",
		bg: "bg-slate-50",
		border: "border-slate-200",
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
	Financial: { label: "إعانة مالية", icon: Coins, color: "text-teal-600", bg: "bg-teal-50" },
	Medical: { label: "رعاية صحية", icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50" },
	Food: { label: "مواد غذائية", icon: UtensilsCrossed, color: "text-amber-600", bg: "bg-amber-50" },
	Housing: { label: "دعم سكني", icon: Home, color: "text-sky-600", bg: "bg-sky-50" },
	Education: { label: "دعم تعليمي", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50" },
	Utilities: { label: "سداد فواتير", icon: CreditCard, color: "text-rose-600", bg: "bg-rose-50" },
	Other: { label: "طلب عام", icon: HelpCircle, color: "text-slate-600", bg: "bg-slate-100" },
};

/* ============================================================
 * Page
 * ============================================================ */
export default function OrganizationPendingPage() {
	const hookResult = useAssociationRequests({ status: RequestStatus.Pending });
	const requests = (hookResult.requests ?? []) as AssociationRequest[];
	const { isLoading, error } = hookResult;
	const refetch = (hookResult as { refetch?: () => void }).refetch;

	const [searchQuery, setSearchQuery] = useState("");
	const [sortKey, setSortKey] = useState<SortKey>("urgency");
	const [needLevelFilter, setNeedLevelFilter] = useState<"" | "High" | "Medium" | "Low">("");

	const stats = useMemo(() => {
		const breakdown = { High: 0, Medium: 0, Low: 0, Unknown: 0 };
		requests.forEach((r) => {
			const key = r.aiNeedLevel ?? "Unknown";
			breakdown[key as keyof typeof breakdown] =
				(breakdown[key as keyof typeof breakdown] || 0) + 1;
		});
		return breakdown;
	}, [requests]);

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
				className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8FAFC]"
				dir="rtl"
			>
				<DashboardTopBar userType="organization" />
				<main className="py-8 sm:py-10">
					<div className="space-y-8 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
						{/* ===== Header ===== */}
						<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex items-center justify-center">
										<Inbox className="w-6 h-6 text-slate-700" />
									</div>
									<h1 className="text-3xl font-black tracking-tight text-slate-900">
										الطلبات الواردة
									</h1>
								</div>
								<p className="text-slate-500 font-medium text-base max-w-2xl">
									استعرض الطلبات الجديدة، قيّم مدى إلحاحها باستخدام الذكاء الاصطناعي، واتخذ القرار المناسب لتقديم العون.
								</p>
							</div>

							<div className="flex items-center gap-3">
								{!isLoading && requests.length > 0 && (
									<div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
										<div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
										<span className="font-black text-slate-700 text-lg leading-none">
											{requests.length}
										</span>
										<span className="text-slate-500 font-medium text-sm leading-none">
											طلب بانتظارك
										</span>
									</div>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={handleRefresh}
									disabled={isLoading}
									className="h-11 w-11 p-0 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-700"
								>
									<RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
								</Button>
							</div>
						</div>

						{/* ===== Stats Breakdown ===== */}
						{!isLoading && requests.length > 0 && (
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<StatPill
									label="أولوية قصوى"
									value={stats.High}
									icon={Flame}
									colorClass="text-rose-600"
									bgClass="bg-rose-50"
									borderClass="border-rose-200/60"
									active={needLevelFilter === "High"}
									onClick={() => setNeedLevelFilter(needLevelFilter === "High" ? "" : "High")}
								/>
								<StatPill
									label="أولوية متوسطة"
									value={stats.Medium}
									icon={TrendingUp}
									colorClass="text-amber-600"
									bgClass="bg-amber-50"
									borderClass="border-amber-200/60"
									active={needLevelFilter === "Medium"}
									onClick={() => setNeedLevelFilter(needLevelFilter === "Medium" ? "" : "Medium")}
								/>
								<StatPill
									label="أولوية عادية"
									value={stats.Low}
									icon={Zap}
									colorClass="text-emerald-600"
									bgClass="bg-emerald-50"
									borderClass="border-emerald-200/60"
									active={needLevelFilter === "Low"}
									onClick={() => setNeedLevelFilter(needLevelFilter === "Low" ? "" : "Low")}
								/>
								<StatPill
									label="غير مصنف بعد"
									value={stats.Unknown}
									icon={HelpCircle}
									colorClass="text-slate-500"
									bgClass="bg-slate-100"
									borderClass="border-slate-200/60"
									active={needLevelFilter === "Unknown"}
									onClick={() => setNeedLevelFilter(needLevelFilter === "Unknown" ? "" : "Unknown")}
								/>
							</div>
						)}

						{/* ===== Toolbar: Search + Sort ===== */}
						{!isLoading && requests.length > 0 && (
							<div className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm">
								<div className="relative flex-1">
									<Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="ابحث برقم الطلب، أو اسم الأسرة..."
										className="w-full h-12 pr-12 pl-12 text-sm font-medium rounded-xl border-none bg-transparent placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-all text-slate-700"
									/>
									{searchQuery && (
										<button
											type="button"
											onClick={() => setSearchQuery("")}
											className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
								<div className="w-px h-8 bg-slate-200 self-center hidden sm:block" />
								<div className="relative inline-flex items-center min-w-[200px]">
									<ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									<select
										value={sortKey}
										onChange={(e) => setSortKey(e.target.value as SortKey)}
										className="appearance-none w-full h-12 pr-11 pl-4 text-sm font-bold rounded-xl border-none bg-transparent text-slate-700 focus:outline-none focus:ring-0 transition-all cursor-pointer"
									>
										<option value="urgency">تصنيف: الأكثر إلحاحاً</option>
										<option value="newest">تصنيف: الأحدث وروداً</option>
										<option value="oldest">تصنيف: الأقدم وروداً</option>
									</select>
								</div>
							</div>
						)}

						{/* ===== Body ===== */}
						{isLoading ? (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<RequestCardSkeleton key={i} />
								))}
							</div>
						) : error ? (
							<Card className="p-10 text-center border-rose-200 bg-rose-50 rounded-3xl flex flex-col items-center gap-5">
								<div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">
									<AlertCircle className="w-10 h-10 text-rose-500" />
								</div>
								<div>
									<p className="text-rose-800 font-black text-xl mb-2">
										تعذر الوصول للبيانات
									</p>
									<p className="text-rose-600/80 text-sm">{String(error)}</p>
								</div>
								<Button
									onClick={handleRefresh}
									className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 px-8 font-bold text-sm shadow-sm"
								>
									<RefreshCw className="w-4 h-4 ml-2" />
									إعادة المحاولة
								</Button>
							</Card>
						) : requests.length === 0 ? (
							<EmptyState
								icon={Inbox}
								title="لا توجد طلبات معلقة"
								description="صندوق الوارد فارغ حالياً. سنعلمك فور ورود أي طلبات جديدة من الأسر."
								className="bg-white border-dashed border-2 py-20 rounded-3xl"
							/>
						) : visibleRequests.length === 0 ? (
							<Card className="p-16 text-center border-dashed border-2 border-slate-200 rounded-3xl bg-transparent shadow-none">
								<div className="flex flex-col items-center gap-5">
									<div className="w-24 h-24 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
										<Search className="w-10 h-10 text-slate-300" />
									</div>
									<div>
										<p className="text-xl font-black text-slate-700">
											لا توجد نتائج مطابقة
										</p>
										<p className="text-slate-500 mt-2 font-medium">
											لم نعثر على أي طلب يطابق شروط البحث أو التصفية الحالية.
										</p>
									</div>
									{hasActiveFilters && (
										<Button
											variant="outline"
											onClick={() => {
												setSearchQuery("");
												setNeedLevelFilter("");
											}}
											className="rounded-xl h-11 px-6 font-bold text-sm mt-2"
										>
											<X className="w-4 h-4 ml-2" />
											تفريغ خيارات البحث
										</Button>
									)}
								</div>
							</Card>
						) : (
							<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
	colorClass,
	bgClass,
	borderClass,
	active,
	onClick,
}: {
	label: string;
	value: number;
	icon: any;
	colorClass: string;
	bgClass: string;
	borderClass: string;
	active?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"relative group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 text-right overflow-hidden bg-white",
				active 
					? \`\${borderClass} ring-2 ring-slate-900/5 shadow-md -translate-y-0.5\` 
					: "border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5"
			)}
		>
			<div className="flex items-start justify-between w-full mb-4">
				<div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", bgClass)}>
					<Icon className={cn("w-5 h-5", colorClass)} />
				</div>
				{active && (
					<div className="w-2 h-2 rounded-full bg-slate-900 absolute top-6 left-6 animate-in fade-in zoom-in" />
				)}
			</div>
			<div>
				<h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{value}</h4>
				<p className="text-sm font-bold text-slate-500">{label}</p>
			</div>
            {/* Soft background glow */}
            <div className={cn("absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity", bgClass, active ? "opacity-40" : "group-hover:opacity-30")} />
		</button>
	);
}

/* ============================================================
 * Skeleton
 * ============================================================ */
function RequestCardSkeleton() {
	return (
		<Card className="rounded-3xl border-slate-200/60 p-6 overflow-hidden animate-pulse bg-white">
			<div className="flex items-start justify-between gap-4 mb-6">
				<div className="flex items-center gap-3 flex-1">
					<div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
					<div className="space-y-2.5 flex-1">
						<div className="h-4 w-3/4 bg-slate-100 rounded-md" />
						<div className="h-3 w-1/2 bg-slate-50 rounded-md" />
					</div>
				</div>
			</div>
			<div className="space-y-3 mb-6">
				<div className="h-3 w-full bg-slate-50 rounded-md" />
				<div className="h-3 w-5/6 bg-slate-50 rounded-md" />
			</div>
			<div className="flex items-center justify-between pt-4 border-t border-slate-100">
				<div className="flex gap-2">
					<div className="h-7 w-20 bg-slate-50 rounded-lg" />
					<div className="h-7 w-24 bg-slate-50 rounded-lg" />
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
	const category = (request.requestType && CATEGORY_MAP[request.requestType]) || CATEGORY_MAP.Other;
	const CategoryIcon = category.icon;
	const isHighNeed = request.aiNeedLevel === "High";

	const createdDate = request.createdAt ? new Date(request.createdAt) : null;
	const dateLabel = createdDate
		? isAfter(createdDate, subDays(new Date(), 2))
			? formatDistanceToNow(createdDate, { addSuffix: true, locale: ar })
			: format(createdDate, "dd MMMM yyyy", { locale: ar })
		: "تاريخ غير معروف";

	const familyTitle = request.familyName || request.familyHeadName || "ملف أسرة غير مكتمل";

	return (
		<Card
			className={cn(
				"group relative rounded-3xl bg-white border transition-all duration-500 overflow-hidden flex flex-col",
				"hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1",
				"animate-in fade-in slide-in-from-bottom-4",
				isHighNeed ? "border-rose-200/60" : "border-slate-200/60"
			)}
			style={{ animationDelay: \`\${animationDelay}ms\`, animationFillMode: "both" }}
		>
			<Link
				href={\`/dashboard/organization/requests/\${request.id}\`}
				className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-3xl"
			/>

			{/* Left accent line instead of top border */}
			<div className={cn("absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300", needConfig.accent, isHighNeed ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />

			<div className="p-6 flex-1 flex flex-col pointer-events-none relative z-0">
				{/* Header */}
				<div className="flex items-start justify-between gap-4 mb-4">
					<div className="flex items-center gap-3.5 min-w-0">
						<div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/50", category.bg)}>
							<CategoryIcon className={cn("w-6 h-6", category.color)} />
						</div>
						<div className="min-w-0">
							<h3 className="font-black text-lg text-slate-900 truncate">
								{familyTitle}
							</h3>
							<div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mt-1">
								<Clock className="w-3.5 h-3.5 shrink-0" />
								<span className="truncate">{dateLabel}</span>
							</div>
						</div>
					</div>
                    
					<span className="shrink-0 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/60 px-3 py-1.5 text-[11px] font-bold rounded-full">
						<span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
						بانتظار المراجعة
					</span>
				</div>

				{/* Description */}
				<p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2 min-h-[2.5rem] mb-6">
					{request.description || "لم يتم توفير تفاصيل إضافية لهذا الطلب."}
				</p>

				{/* Footer / Meta */}
				<div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
					<div className="flex flex-wrap items-center gap-2">
						{request.aiNeedLevel && (
							<span className={cn(
								"inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border",
								needConfig.bg, needConfig.color, needConfig.border
							)}>
								<Brain className="w-3.5 h-3.5" />
								{needConfig.label}
                                {request.needScore != null && (
                                    <span className="opacity-70 text-[10px] ml-0.5 font-black">
                                        {request.needScore <= 1 ? Math.round(request.needScore * 100) : Math.round(request.needScore)}%
                                    </span>
                                )}
							</span>
						)}
					</div>

					<div className="flex items-center gap-1 text-slate-400 font-bold text-xs group-hover:text-slate-900 transition-colors">
						استعراض
						<ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</div>
				</div>
			</div>
		</Card>
	);
}
`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Pending requests page rewritten successfully!');
