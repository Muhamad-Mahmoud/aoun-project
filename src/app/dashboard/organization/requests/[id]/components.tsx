"use client";

import { useState } from "react";
import {
	AlertCircle,
	CheckCircle2,
	XCircle,
	Download,
	FileText,
	Bot,
	FileJson2,
	ChevronDown,
	ChevronUp,
	Sparkles,
} from "lucide-react";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/utils";

/* ============================================================
 * Timeline Components
 * ============================================================ */
export function TimelineStep({
	label,
	active,
	done,
	variant = "success",
}: {
	label: string;
	active?: boolean;
	done?: boolean;
	variant?: "success" | "danger";
}) {
	const dotColor = done
		? variant === "danger"
			? "bg-red-400"
			: "bg-warm-green"
		: active
			? "bg-amber-400"
			: "bg-white/20";

	return (
		<div className="flex items-center gap-2 min-w-0">
			<div className="relative shrink-0">
				{active && (
					<div
						className={cn(
							"absolute inset-0 rounded-full blur-md animate-pulse",
							dotColor,
						)}
						aria-hidden
					/>
				)}
				<div className={cn("relative w-2.5 h-2.5 rounded-full", dotColor)} />
			</div>
			<span
				className={cn(
					"text-[11px] sm:text-xs font-bold whitespace-nowrap",
					done || active ? "text-white" : "text-white/40",
				)}
			>
				{label}
			</span>
		</div>
	);
}

export function TimelineConnector({ done }: { done?: boolean }) {
	return (
		<div className="flex-1 h-px min-w-[20px] bg-gradient-to-l from-white/5 via-white/15 to-white/5 relative">
			{done && (
				<div className="absolute inset-0 bg-gradient-to-l from-warm-green/40 via-warm-green/60 to-warm-green/40" />
			)}
		</div>
	);
}

/* ============================================================
 * Radial Score Component
 * ============================================================ */
export function RadialScore({ value }: { value: number }) {
	const score = Math.max(0, Math.min(100, value));
	const radius = 52;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (score / 100) * circumference;

	const color =
		score >= 70
			? "stroke-red-400"
			: score >= 40
				? "stroke-amber-400"
				: "stroke-emerald-400";

	const label =
		score >= 70 ? "عالي" : score >= 40 ? "متوسط" : score > 0 ? "منخفض" : "—";

	return (
		<div
			className="relative w-36 h-36"
			role="img"
			aria-label={`نتيجة الاحتياج ${score} من 100`}
		>
			<svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
				{/* Track */}
				<circle
					cx="60"
					cy="60"
					r={radius}
					fill="none"
					strokeWidth="8"
					className="stroke-white/10"
				/>
				{/* Progress */}
				<circle
					cx="60"
					cy="60"
					r={radius}
					fill="none"
					strokeWidth="8"
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					className={cn(color, "transition-all duration-1000 ease-out")}
					style={{
						filter: "drop-shadow(0 0 8px currentColor)",
					}}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-4xl font-black text-white tabular-nums leading-none">
					{score}
				</span>
				<span className="text-[10px] text-white/50 font-bold mt-1">
					من 100
				</span>
				<span
					className={cn(
						"text-xs font-bold mt-1.5 px-2 py-0.5 rounded-full",
						score >= 70
							? "bg-red-400/20 text-red-300"
							: score >= 40
								? "bg-amber-400/20 text-amber-300"
								: "bg-emerald-400/20 text-emerald-300",
					)}
				>
					{label}
				</span>
			</div>
		</div>
	);
}

/* ============================================================
 * Section Card Component
 * ============================================================ */
export function SectionCard({
	title,
	icon: Icon,
	iconBg,
	iconColor,
	divider,
	topAccent,
	compact,
	children,
}: {
	title: string;
	icon: typeof FileText;
	iconBg: string;
	iconColor: string;
	divider?: boolean;
	topAccent?: string;
	compact?: boolean;
	children: React.ReactNode;
}) {
	return (
		<Card
			className={cn(
				"p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow",
				topAccent && `border-t-4 ${topAccent}`,
			)}
		>
			<h3
				className={cn(
					"font-bold flex items-center gap-2.5 text-slate-900",
					compact ? "text-base mb-4" : "text-lg mb-5",
					divider && "border-b pb-4",
				)}
			>
				<div className={cn("p-2 rounded-lg", iconBg)}>
					<Icon className={cn("w-5 h-5", iconColor)} />
				</div>
				{title}
			</h3>
			{children}
		</Card>
	);
}

/* ============================================================
 * Info Item Component
 * ============================================================ */
export function InfoItem({
	label,
	value,
	vertical = false,
	mono = false,
	fullWidth = false,
}: {
	label: string;
	value: string | null | undefined;
	vertical?: boolean;
	mono?: boolean;
	fullWidth?: boolean;
}) {
	const display = value && value !== "" ? value : "—";
	return (
		<div className={cn("flex flex-col", fullWidth && "sm:col-span-2")}>
			<span className="text-xs text-slate-500 mb-1 font-medium">{label}</span>
			<span
				className={cn(
					"font-bold text-sm text-slate-800",
					mono && "font-mono tabular-nums",
				)}
				dir={mono ? "ltr" : undefined}
			>
				{display}
			</span>
		</div>
	);
}

/* ============================================================
 * Attachment Item Component
 * ============================================================ */
export function AttachmentItem({ file }: { file: any }) {
	const [expanded, setExpanded] = useState(false);
	const ocrStatus = file.aiOcrStatus as string | undefined;
	const hasOcrPayload = !!(file.aiOcrDataJson || file.aiErrorMessage);

	const ocrBadge =
		ocrStatus === "Completed"
			? { bg: "bg-emerald-100", text: "text-emerald-700", label: "تم" }
			: ocrStatus === "Failed"
				? { bg: "bg-red-100", text: "text-red-700", label: "فشل" }
				: ocrStatus
					? { bg: "bg-amber-100", text: "text-amber-700", label: "جاري" }
					: null;

	return (
		<div className="border border-slate-100 rounded-xl overflow-hidden group hover:border-warm-green/30 transition-colors bg-white">
			<div className="flex items-center gap-3 p-3">
				<a
					href={file.filePath}
					target="_blank"
					rel="noopener noreferrer"
					className="bg-warm-green/10 p-2 rounded-md text-warm-green group-hover:bg-warm-green group-hover:text-white transition-colors shrink-0"
					aria-label={`تحميل ${file.fileName}`}
				>
					<Download className="w-4 h-4" />
				</a>
				<div className="overflow-hidden flex-1 min-w-0">
					<p
						className="text-sm font-medium truncate text-left"
						dir="ltr"
						title={file.fileName}
					>
						{file.fileName}
					</p>
					<div className="flex items-center gap-2 mt-0.5">
						<p className="text-xs text-slate-500 truncate">
							{file.fileType}
						</p>
						{ocrBadge && (
							<span
								className={cn(
									"text-[10px] px-1.5 py-0.5 rounded font-bold",
									ocrBadge.bg,
									ocrBadge.text,
								)}
							>
								OCR: {ocrBadge.label}
							</span>
						)}
					</div>
				</div>
				{hasOcrPayload && (
					<button
						type="button"
						onClick={() => setExpanded((v) => !v)}
						aria-expanded={expanded}
						aria-label={
							expanded
								? "إخفاء البيانات المستخرجة"
								: "عرض البيانات المستخرجة"
						}
						className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
					>
						{expanded ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</button>
				)}
			</div>

			{hasOcrPayload && expanded && (
				<div className="bg-slate-50 border-t border-slate-100 p-3 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
					{file.aiErrorMessage ? (
						<div className="text-red-600 flex items-start gap-1.5">
							<AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
							<span className="font-medium">
								فشل الـ OCR: {file.aiErrorMessage}
							</span>
						</div>
					) : (
						file.aiOcrDataJson && (
							<>
								<div className="flex items-center gap-1.5 text-slate-500 font-bold mb-2">
									<FileJson2 className="w-3.5 h-3.5" />
									<span>
										البيانات المستخرجة آلياً (
										{file.aiOcrMethod || "AI Vision"})
									</span>
								</div>
								<pre
									className="bg-slate-900 text-slate-200 p-2.5 rounded-lg text-[10px] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner font-mono text-left max-h-60 overflow-y-auto"
									dir="ltr"
								>
									{tryFormatJson(file.aiOcrDataJson)}
								</pre>
							</>
						)
					)}
				</div>
			)}
		</div>
	);
}

/* ============================================================
 * Detail Skeleton Component
 * ============================================================ */
export function DetailSkeleton() {
	return (
		<div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full animate-pulse">
			<div className="flex items-center justify-between mb-6">
				<div className="h-10 w-10 bg-slate-100 rounded-xl" />
				<div className="h-10 w-24 bg-slate-100 rounded-xl hidden sm:block" />
			</div>
			<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
				<div className="space-y-2">
					<div className="h-8 w-56 bg-slate-100 rounded-lg" />
					<div className="h-4 w-40 bg-slate-50 rounded" />
				</div>
				<div className="h-10 w-32 bg-slate-100 rounded-xl" />
			</div>
			<div className="grid lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<Card className="p-6 rounded-2xl space-y-4 border-slate-100">
						<div className="h-5 w-32 bg-slate-100 rounded" />
						<div className="grid sm:grid-cols-2 gap-3">
							<div className="h-12 bg-slate-50 rounded-xl" />
							<div className="h-12 bg-slate-50 rounded-xl" />
						</div>
					</Card>
					<Card className="p-6 rounded-2xl space-y-4 border-slate-100">
						<div className="h-5 w-40 bg-slate-100 rounded" />
						<div className="h-24 bg-slate-50 rounded-xl" />
					</Card>
				</div>
				<div className="space-y-6">
					<Card className="p-6 rounded-2xl space-y-3 bg-slate-100/50 border-0">
						<div className="h-5 w-32 bg-slate-200 rounded" />
						<div className="h-2.5 w-full bg-slate-200 rounded-full" />
						<div className="h-12 bg-slate-200/60 rounded-lg" />
					</Card>
				</div>
			</div>
		</div>
	);
}

/* ============================================================
 * Utility Functions
 * ============================================================ */
export function tryFormatJson(value: string) {
	try {
		return JSON.stringify(JSON.parse(value), null, 2);
	} catch {
		return value;
	}
}
