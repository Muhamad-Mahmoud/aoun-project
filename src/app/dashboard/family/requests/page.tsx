"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/shared/ui/alert-dialog";
import {
	Plus,
	FileText,
	Clock,
	AlertCircle,
	Loader2,
	ChevronLeft,
	ChevronRight,
	Ban,
	MapPin,
	RefreshCw,
	Inbox,
	Search,
	Paperclip,
	X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/utils";
import { getRequests, cancelRequest } from "@/features/requests/api/requestsApi";
import {
	statusConfig,
	statusFilters,
	categoryConfig,
	resolveStatus,
	resolveCategory,
} from "@/features/requests/config/requestConfig";
import type { AidRequest, PagedResponse } from "@/features/requests/types";
import { toast } from "sonner";

export default function FamilyRequestsPage() {
	const [requests, setRequests] = useState<AidRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [cancellingId, setCancellingId] = useState<string | number | null>(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [statusFilter, setStatusFilter] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [cancelDialogId, setCancelDialogId] = useState<string | number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	/* ---------- Data fetch ---------- */
	const fetchRequests = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const result: PagedResponse<AidRequest> = await getRequests({
				pageNumber,
				pageSize,
				status: statusFilter || undefined,
			});
			setRequests(result.items || []);
			setTotalPages(result.totalPages || 1);
			setTotalCount(result.totalCount || 0);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "فشل تحميل الطلبات";
			setError(message);
			setRequests([]);
		} finally {
			setLoading(false);
		}
	}, [pageNumber, pageSize, statusFilter]);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

	/* ---------- Client-side search filter ---------- */
	const filteredRequests = useMemo(() => {
		if (!searchQuery.trim()) return requests;
		const q = searchQuery.toLowerCase();
		return requests.filter(
			(req) =>
				(req.description || "").toLowerCase().includes(q) ||
				(req.title || "").toLowerCase().includes(q) ||
				(req.location || "").toLowerCase().includes(q) ||
				String(req.id).includes(q),
		);
	}, [requests, searchQuery]);

	/* ---------- Cancel ---------- */
	const handleCancel = async (id: string | number) => {
		try {
			setCancellingId(id);
			setCancelDialogId(null);
			await cancelRequest(id);
			toast.success("تم إلغاء الطلب بنجاح");
			fetchRequests();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "فشل إلغاء الطلب";
			toast.error(message);
		} finally {
			setCancellingId(null);
		}
	};

	/* ---------- Helpers ---------- */
	const getStatusDisplay = (status: number | string) => {
		const key = resolveStatus(status);
		const config = statusConfig[key] || statusConfig.PENDING;
		const Icon = config.icon;
		return (
			<Badge
				variant="outline"
				className={cn(
					"text-[11px] font-bold border px-3 py-1 rounded-full gap-1.5",
					config.bg,
					config.color,
				)}
			>
				<Icon className="w-3 h-3" />
				{config.label}
			</Badge>
		);
	};

	const getCategoryBadge = (requestType?: string | number) => {
		if (requestType == null) return null;
		const cat =
			categoryConfig[resolveCategory(requestType)] || categoryConfig["Other"];
		const CatIcon = cat.icon;
		return (
			<div
				className={cn(
					"flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-transparent",
					cat.bg,
				)}
			>
				<CatIcon className={cn("w-3 h-3", cat.color)} />
				<span className={cn("text-[10px] font-bold", cat.color)}>
					{cat.label}
				</span>
			</div>
		);
	};

	const canCancel = (status: number | string) => {
		const s = resolveStatus(status);
		return s === "PENDING" || s === "VERIFIED";
	};

	const getStatusAccent = (status: number | string) => {
		const key = resolveStatus(status);
		const accents: Record<string, string> = {
			PENDING: "bg-amber-400",
			VERIFIED: "bg-blue-500",
			IN_PROGRESS: "bg-sky-500",
			COMPLETED: "bg-emerald-500",
			REJECTED: "bg-red-500",
			CANCELLED: "bg-gray-400",
		};
		return accents[key] || "bg-gray-400";
	};

	/* ---------- Counts (current page only, with hint) ---------- */
	const statusCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		requests.forEach((req) => {
			const key = resolveStatus(req.status);
			counts[key] = (counts[key] || 0) + 1;
		});
		return counts;
	}, [requests]);

	/* ---------- Pagination numbers (responsive) ---------- */
	const pageNumbers = useMemo(() => {
		const pages: number[] = [];
		const maxVisible =
			typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;
		let start = Math.max(1, pageNumber - Math.floor(maxVisible / 2));
		const end = Math.min(totalPages, start + maxVisible - 1);
		if (end - start < maxVisible - 1) {
			start = Math.max(1, end - maxVisible + 1);
		}
		for (let i = start; i <= end; i++) pages.push(i);
		return pages;
	}, [pageNumber, totalPages]);

	/* ---------- Render ---------- */
	return (
		<>
			<DashboardLayout>
				<FamilySidebar />
				<div
					className="flex-1 flex flex-col h-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white"
					dir="rtl"
				>
					<DashboardTopBar userType="family" />
					<main className="p-4 sm:p-6 lg:p-8 relative z-10">
						<div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
							{/* ===== Header ===== */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div>
									<h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
										طلباتي
									</h1>
									<p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">
										تابع حالة طلباتك الحالية والسابقة
									</p>
								</div>
								<Button
									asChild
									className="bg-warm-green hover:bg-warm-green/90 rounded-xl h-12 px-6 font-bold shadow-lg shadow-warm-green/20 transition-all hover:shadow-xl hover:shadow-warm-green/30 sm:hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
								>
									<Link
										href="/dashboard/family/requests/new"
										className="flex items-center justify-center gap-2"
									>
										<Plus className="w-5 h-5" />
										طلب جديد
									</Link>
								</Button>
							</div>

							{/* ===== Stats Bar + Search ===== */}
							<div className="flex flex-col sm:flex-row sm:items-center gap-3">
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
										<FileText className="w-4 h-4 text-warm-green" />
										<span className="font-black text-slate-700">
											{totalCount}
										</span>
										<span className="text-slate-400 font-medium text-sm">
											طلب
										</span>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={fetchRequests}
										disabled={loading}
										aria-label="تحديث الطلبات"
										className="rounded-xl hover:bg-white h-10 w-10 p-0 shrink-0"
									>
										<RefreshCw
											className={cn("w-4 h-4", loading && "animate-spin")}
										/>
									</Button>
								</div>

								{/* Search Input */}
								<div className="relative flex-1 sm:max-w-sm sm:mr-auto">
									<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
									<input
										type="text"
										placeholder="ابحث بالوصف أو الرقم..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										aria-label="بحث في الطلبات"
										className="w-full h-10 pr-10 pl-9 text-sm font-medium rounded-xl border border-slate-100 bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-warm-green/20 focus:border-warm-green/40 transition-all"
									/>
									{searchQuery && (
										<button
											type="button"
											onClick={() => setSearchQuery("")}
											aria-label="مسح البحث"
											className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/40 transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
							</div>

							{/* ===== Status Filter Tabs ===== */}
							<div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
								<div
									className="flex gap-2 min-w-max"
									role="tablist"
									aria-label="فلترة حسب الحالة"
								>
									{statusFilters.map((filter) => {
										const isActive = statusFilter === filter.value;
										const count =
											filter.value === ""
												? totalCount
												: statusCounts[filter.value] || 0;
										return (
											<button
												key={filter.value}
												role="tab"
												aria-selected={isActive}
												onClick={() => {
													setStatusFilter(filter.value);
													setPageNumber(1);
												}}
												className={cn(
													"px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border whitespace-nowrap flex items-center gap-2",
													"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-green/40",
													isActive
														? "bg-warm-green text-white border-warm-green shadow-md shadow-warm-green/20"
														: "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50",
												)}
											>
												{filter.label}
												{!loading && count > 0 && (
													<span
														className={cn(
															"text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
															isActive
																? "bg-white/20 text-white"
																: "bg-slate-100 text-slate-400",
														)}
													>
														{count}
													</span>
												)}
											</button>
										);
									})}
								</div>
							</div>

							{/* ===== Error State ===== */}
							{error && (
								<Card className="p-4 sm:p-6 border-red-200 bg-red-50 rounded-2xl">
									<div className="flex flex-col sm:flex-row sm:items-center gap-3 text-red-600">
										<div className="flex items-center gap-3 flex-1">
											<AlertCircle className="w-5 h-5 shrink-0" />
											<p className="text-sm font-bold flex-1">{error}</p>
										</div>
										<Button
											size="sm"
											variant="outline"
											onClick={fetchRequests}
											className="rounded-xl border-red-200 text-red-600 hover:bg-red-100 w-full sm:w-auto"
										>
											إعادة المحاولة
										</Button>
									</div>
								</Card>
							)}

							{/* ===== Loading Skeletons ===== */}
							{loading && (
								<div className="space-y-4">
									{[1, 2, 3].map((i) => (
										<Card
											key={i}
											className="p-5 rounded-2xl border-slate-100 overflow-hidden"
										>
											<div className="flex items-start gap-4">
												<Skeleton className="w-1 h-16 rounded-full shrink-0" />
												<div className="flex-1 space-y-3">
													<div className="flex items-center gap-2">
														<Skeleton className="h-5 w-16 rounded-full" />
														<Skeleton className="h-5 w-20 rounded-full" />
													</div>
													<Skeleton className="h-4 w-2/3" />
													<Skeleton className="h-3 w-1/3" />
												</div>
												<Skeleton className="hidden sm:block w-20 h-8 rounded-xl" />
											</div>
										</Card>
									))}
								</div>
							)}

							{/* ===== Requests List ===== */}
							{!loading && !error && (
								<>
									{filteredRequests.length === 0 ? (
										<Card className="p-8 sm:p-12 text-center border-dashed border-2 border-slate-200 rounded-2xl bg-white">
											<div className="flex flex-col items-center gap-4">
												<div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
													{searchQuery ? (
														<Search className="w-10 h-10 text-slate-300" />
													) : (
														<Inbox className="w-10 h-10 text-slate-300" />
													)}
												</div>
												<div>
													<p className="text-lg font-bold text-slate-700">
														{searchQuery
															? "لا توجد نتائج"
															: statusFilter
																? "لا توجد طلبات بهذه الحالة"
																: "لا توجد طلبات بعد"}
													</p>
													<p className="text-sm text-slate-400 mt-1">
														{searchQuery
															? `لا توجد طلبات تطابق "${searchQuery}"`
															: statusFilter
																? "جرّب اختيار حالة أخرى"
																: "ابدأ بتقديم طلب مساعدة جديد"}
													</p>
												</div>
												{!searchQuery && !statusFilter && (
													<Button
														asChild
														className="bg-warm-green hover:bg-warm-green/90 rounded-xl h-11 px-6 font-bold mt-2 shadow-lg shadow-warm-green/20"
													>
														<Link href="/dashboard/family/requests/new">
															<Plus className="w-4 h-4 ml-2" />
															تقديم طلب جديد
														</Link>
													</Button>
												)}
												{searchQuery && (
													<Button
														variant="outline"
														onClick={() => setSearchQuery("")}
														className="rounded-xl h-10 px-5 font-bold text-sm"
													>
														<X className="w-4 h-4 ml-2" />
														مسح البحث
													</Button>
												)}
												{statusFilter && !searchQuery && (
													<Button
														variant="outline"
														onClick={() => {
															setStatusFilter("");
															setPageNumber(1);
														}}
														className="rounded-xl h-10 px-5 font-bold text-sm"
													>
														عرض كل الطلبات
													</Button>
												)}
											</div>
										</Card>
									) : (
										<div className="space-y-3">
											{filteredRequests.map((req, index) => (
												<Card
													key={req.id}
													className="animate-fade-slide-up rounded-2xl border-slate-100 bg-white hover:shadow-lg hover:border-slate-200 transition-shadow duration-300 group overflow-hidden"
													style={{ animationDelay: `${index * 60}ms` }}
												>
													<div className="flex">
														{/* Status Accent Strip */}
														<div
															className={cn(
																"w-1 shrink-0 rounded-r-full",
																getStatusAccent(req.status),
															)}
															aria-hidden
														/>
														<div className="flex-1 p-4 sm:p-5">
															<div className="flex flex-col sm:flex-row sm:items-center gap-4">
																{/* Info */}
																<div className="flex-1 min-w-0 space-y-2.5">
																	<div className="flex items-center gap-2 flex-wrap">
																		<Badge
																			variant="outline"
																			className="text-[10px] font-black text-slate-400 border-slate-200 px-2 py-0.5 rounded-md"
																		>
																			#{req.id}
																		</Badge>
																		{getStatusDisplay(req.status)}
																		{getCategoryBadge(req.requestType)}
																		{req.attachments &&
																			req.attachments.length > 0 && (
																				<div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
																					<Paperclip className="w-3 h-3 text-slate-400" />
																					<span className="text-[10px] font-bold text-slate-400">
																						{req.attachments.length}
																					</span>
																				</div>
																			)}
																	</div>
																	<p className="text-sm font-bold text-slate-800 leading-relaxed line-clamp-2">
																		{req.description ||
																			req.title ||
																			"طلب مساعدة"}
																	</p>
																	<div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-400 font-medium flex-wrap">
																		{req.location && (
																			<span className="flex items-center gap-1 min-w-0">
																				<MapPin className="w-3 h-3 shrink-0" />
																				<span className="truncate max-w-[160px]">
																					{req.location}
																				</span>
																			</span>
																		)}
																		<span className="flex items-center gap-1">
																			<Clock className="w-3 h-3" />
																			{req.createdAt
																				? new Date(
																						req.createdAt,
																					).toLocaleDateString("ar-EG", {
																						year: "numeric",
																						month: "short",
																						day: "numeric",
																					})
																				: "—"}
																		</span>
																	</div>
																</div>

																{/* Actions */}
																<div className="flex items-stretch gap-2 shrink-0 w-full sm:w-auto">
																	{canCancel(req.status) && (
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() =>
																				setCancelDialogId(req.id)
																			}
																			disabled={cancellingId === req.id}
																			className="rounded-xl text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-10 sm:h-9 px-4 text-xs font-bold flex-1 sm:flex-none"
																		>
																			{cancellingId === req.id ? (
																				<Loader2 className="w-3 h-3 animate-spin ml-1" />
																			) : (
																				<Ban className="w-3 h-3 ml-1" />
																			)}
																			إلغاء
																		</Button>
																	)}
																	<Button
																		variant="ghost"
																		size="sm"
																		asChild
																		className="rounded-xl bg-slate-50 sm:bg-transparent hover:bg-warm-green/10 hover:text-warm-green h-10 sm:h-9 px-4 text-xs font-bold text-slate-600 flex-1 sm:flex-none"
																	>
																		<Link
																			href={`/dashboard/family/requests/${req.id}`}
																			className="flex items-center justify-center"
																		>
																			التفاصيل
																			<ChevronLeft className="w-3 h-3 mr-1" />
																		</Link>
																	</Button>
																</div>
															</div>
														</div>
													</div>
												</Card>
											))}
										</div>
									)}

									{/* ===== Pagination ===== */}
									{totalPages > 1 && (
										<div className="flex items-center justify-center gap-1.5 pt-4 flex-wrap">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setPageNumber((prev) => Math.max(prev - 1, 1))
												}
												disabled={pageNumber <= 1}
												aria-label="الصفحة السابقة"
												className="rounded-xl h-9 w-9 p-0 font-bold text-xs"
											>
												<ChevronRight className="w-4 h-4" />
											</Button>

											{pageNumbers[0] > 1 && (
												<>
													<Button
														variant="outline"
														size="sm"
														onClick={() => setPageNumber(1)}
														className="rounded-xl h-9 w-9 p-0 font-bold text-xs"
													>
														1
													</Button>
													{pageNumbers[0] > 2 && (
														<span className="text-slate-300 text-xs px-1">
															…
														</span>
													)}
												</>
											)}

											{pageNumbers.map((p) => (
												<Button
													key={p}
													variant={p === pageNumber ? "default" : "outline"}
													size="sm"
													onClick={() => setPageNumber(p)}
													aria-current={p === pageNumber ? "page" : undefined}
													className={cn(
														"rounded-xl h-9 w-9 p-0 font-bold text-xs transition-all",
														p === pageNumber &&
															"bg-warm-green hover:bg-warm-green/90 text-white shadow-md shadow-warm-green/20",
													)}
												>
													{p}
												</Button>
											))}

											{pageNumbers[pageNumbers.length - 1] < totalPages && (
												<>
													{pageNumbers[pageNumbers.length - 1] <
														totalPages - 1 && (
														<span className="text-slate-300 text-xs px-1">
															…
														</span>
													)}
													<Button
														variant="outline"
														size="sm"
														onClick={() => setPageNumber(totalPages)}
														className="rounded-xl h-9 w-9 p-0 font-bold text-xs"
													>
														{totalPages}
													</Button>
												</>
											)}

											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setPageNumber((prev) =>
														Math.min(prev + 1, totalPages),
													)
												}
												disabled={pageNumber >= totalPages}
												aria-label="الصفحة التالية"
												className="rounded-xl h-9 w-9 p-0 font-bold text-xs"
											>
												<ChevronLeft className="w-4 h-4" />
											</Button>
										</div>
									)}
								</>
							)}
						</div>
					</main>
				</div>
			</DashboardLayout>

			{/* ===== Cancel Confirmation Dialog ===== */}
			<AlertDialog
				open={cancelDialogId !== null}
				onOpenChange={(open) => !open && setCancelDialogId(null)}
			>
				<AlertDialogContent
					className="rounded-2xl border-0 shadow-2xl sm:max-w-md"
					dir="rtl"
				>
					<AlertDialogHeader className="items-center text-center gap-4">
						<div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
							<AlertCircle className="w-8 h-8 text-red-500" />
						</div>
						<AlertDialogTitle className="text-xl font-black text-slate-900">
							تأكيد إلغاء الطلب
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500 font-medium leading-relaxed">
							هل أنت متأكد من إلغاء هذا الطلب؟{" "}
							<span className="text-red-400 font-bold block mt-1">
								لا يمكن التراجع عن هذا الإجراء بعد التأكيد.
							</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-col-reverse sm:flex-row-reverse gap-3 pt-2">
						<AlertDialogAction
							onClick={() =>
								cancelDialogId !== null && handleCancel(cancelDialogId)
							}
							className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 px-6 font-bold text-sm flex-1"
						>
							<Ban className="w-4 h-4 ml-2" />
							نعم، إلغاء الطلب
						</AlertDialogAction>
						<AlertDialogCancel className="rounded-xl h-11 px-6 font-bold text-sm flex-1 border-slate-200 mt-0">
							تراجع
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
