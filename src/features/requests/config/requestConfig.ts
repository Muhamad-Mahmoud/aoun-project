/**
 * Shared request configuration — status, category, helper maps
 * Used by both list page and details page.
 */

import {
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Ban,
    Coins,
    Stethoscope,
    UtensilsCrossed,
    Home,
    GraduationCap,
    CreditCard,
    HelpCircle,
    type LucideIcon,
} from "lucide-react";

// ===== Status =====
export interface StatusDisplayConfig {
    label: string;
    color: string;
    bg: string;
    icon: LucideIcon;
}

export const statusConfig: Record<string, StatusDisplayConfig> = {
    PENDING:      { label: "قيد المراجعة", icon: Clock,        color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
    VERIFIED:     { label: "تم التحقق",   icon: CheckCircle2,  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
    IN_PROGRESS:  { label: "جاري التنفيذ", icon: Loader2,      color: "text-sky-600",    bg: "bg-sky-50 border-sky-200" },
    COMPLETED:    { label: "مكتمل",       icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    REJECTED:     { label: "مرفوض",       icon: XCircle,       color: "text-red-600",    bg: "bg-red-50 border-red-200" },
    CANCELLED:    { label: "ملغي",        icon: Ban,           color: "text-gray-500",   bg: "bg-gray-50 border-gray-200" },
};

export const statusNumericMap: Record<number, string> = {
    0: "PENDING",
    1: "VERIFIED",
    2: "IN_PROGRESS",
    3: "COMPLETED",
    4: "REJECTED",
    5: "CANCELLED",
};

/** Safely resolve a status (number or string) to a statusConfig key. */
export function resolveStatus(status: number | string | undefined | null): string {
    if (typeof status === "number") return statusNumericMap[status] ?? "PENDING";
    if (typeof status === "string") return status.toUpperCase();
    return "PENDING";
}

/** Status filter tabs for the list page. */
export const statusFilters = [
    { value: "",           label: "الكل" },
    { value: "PENDING",    label: "قيد المراجعة" },
    { value: "IN_PROGRESS", label: "جاري التنفيذ" },
    { value: "COMPLETED",  label: "مكتمل" },
    { value: "REJECTED",   label: "مرفوض" },
    { value: "CANCELLED",  label: "ملغي" },
];

// ===== Category =====
export interface CategoryDisplayConfig {
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}

export const categoryConfig: Record<number, CategoryDisplayConfig> = {
    0: { label: "مساعدة مالية",   icon: Coins,            color: "text-blue-600",    bg: "bg-blue-50" },
    1: { label: "رعاية صحية",    icon: Stethoscope,      color: "text-emerald-600", bg: "bg-emerald-50" },
    2: { label: "دعم غذائي",     icon: UtensilsCrossed,  color: "text-orange-600",  bg: "bg-orange-50" },
    3: { label: "سكن وإيواء",    icon: Home,             color: "text-sky-600",     bg: "bg-sky-50" },
    4: { label: "تعليم",          icon: GraduationCap,    color: "text-purple-600",  bg: "bg-purple-50" },
    5: { label: "فواتير وخدمات",  icon: CreditCard,       color: "text-red-600",     bg: "bg-red-50" },
    6: { label: "أخرى",          icon: HelpCircle,       color: "text-gray-600",    bg: "bg-gray-50" },
};

// ===== Enum label maps =====
export const housingLabels: Record<number, string> = {
    0: "ملك", 1: "إيجار", 2: "مستضاف", 3: "إيواء اضطراري", 4: "أخرى",
};

export const workingTypeLabels: Record<number, string> = {
    1: "قطاع حكومي", 2: "قطاع خاص", 3: "عمل حر",
};

export const employmentTypeLabels: Record<number, string> = {
    1: "دوام كامل", 2: "دوام جزئي", 3: "عقد مؤقت",
};
