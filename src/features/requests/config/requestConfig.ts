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
    PENDING:      { label: "قيد المراجعة",  icon: Clock,        color: "text-amber-600",   bg: "bg-primary/10 border-amber-200" },
    INREVIEW:     { label: "تحت المراجعة", icon: Loader2,       color: "text-blue-600",    bg: "bg-blue-50 border-blue-200" },
    APPROVED:     { label: "معتمد",         icon: CheckCircle2, color: "text-primary",      bg: "bg-primary/10 border-primary/30" },
    COMPLETED:    { label: "مكتمل",         icon: CheckCircle2, color: "text-emerald-600",  bg: "bg-emerald-50 border-emerald-200" },
    REJECTED:     { label: "مرفوض",         icon: XCircle,      color: "text-red-600",      bg: "bg-red-50 border-red-200" },
    CANCELLED:    { label: "ملغي",           icon: Ban,          color: "text-gray-500",     bg: "bg-gray-50 border-gray-200" },
    // Legacy keys kept for backward compat
    VERIFIED:     { label: "تم التحقق",    icon: CheckCircle2,  color: "text-primary",      bg: "bg-primary/10 border-primary/30" },
    IN_PROGRESS:  { label: "جاري التنفيذ", icon: Loader2,       color: "text-teal-600",    bg: "bg-teal-50 border-teal-200" },
};

export const statusNumericMap: Record<number, string> = {
    0: "PENDING",    // Pending
    1: "INREVIEW",  // InReview
    2: "APPROVED",  // Approved
    3: "REJECTED",  // Rejected
    4: "COMPLETED", // Completed
    5: "CANCELLED", // Cancelled
};

/** Safely resolve a status (number or string) to a statusConfig key. */
export function resolveStatus(status: number | string | undefined | null): string {
    if (typeof status === "number") return statusNumericMap[status] ?? "PENDING";
    if (typeof status === "string") {
        // Normalize camelCase backend strings to uppercase keys
        const normalized = status.trim();
        if (normalized === "InReview")  return "INREVIEW";
        if (normalized === "Approved")  return "APPROVED";
        if (normalized === "Pending")   return "PENDING";
        if (normalized === "Rejected")  return "REJECTED";
        if (normalized === "Completed") return "COMPLETED";
        if (normalized === "Cancelled") return "CANCELLED";
        return normalized.toUpperCase();
    }
    return "PENDING";
}

/** Status filter tabs for the list page. */
export const statusFilters = [
    { value: "",           label: "الكل" },
    { value: "Pending",    label: "قيد المراجعة" },
    { value: "InReview",   label: "تحت المراجعة" },
    { value: "Approved",   label: "معتمد" },
    { value: "Completed",  label: "مكتمل" },
    { value: "Rejected",   label: "مرفوض" },
    { value: "Cancelled",  label: "ملغي" },
];

/** Safely resolve a requestType to string for backward compatibility */
export function resolveCategory(requestType: string | number | undefined | null): string {
    if (typeof requestType === "string") {
        const t = requestType.trim().toLowerCase();
        if (t === "financial" || t === "finance") return "Financial";
        if (t === "medical" || t === "health" || t === "healthcare") return "Medical";
        if (t === "food") return "Food";
        if (t === "housing" || t === "home") return "Housing";
        if (t === "education") return "Education";
        if (t === "utilities" || t === "bills") return "Utilities";
        if (t === "other" || t === "general support") return "Other";
        return requestType;
    }
    if (typeof requestType === "number") {
        const legacyMap: Record<number, string> = {
            0: "Financial", 1: "Medical", 2: "Food", 3: "Housing",
            4: "Education", 5: "Utilities", 6: "Other"
        };
        return legacyMap[requestType] ?? "Other";
    }
    return "Other";
}

// ===== Category =====
export interface CategoryDisplayConfig {
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}

export const categoryConfig: Record<string, CategoryDisplayConfig> = {
    "Financial": { label: "مالية",   icon: Coins,            color: "text-primary",    bg: "bg-blue-50" },
    "Medical": { label: "صحية",    icon: Stethoscope,      color: "text-primary", bg: "bg-emerald-50" },
    "Food": { label: "غذائية",     icon: UtensilsCrossed,  color: "text-orange-600",  bg: "bg-orange-50" },
    "Housing": { label: "سكن",    icon: Home,             color: "text-teal-600",     bg: "bg-teal-50" },
    "Education": { label: "تعليم",          icon: GraduationCap,    color: "text-amber-600",  bg: "bg-primary/10" },
    "Utilities": { label: "فواتير",  icon: CreditCard,       color: "text-red-600",     bg: "bg-red-50" },
    "Other": { label: "أخرى",          icon: HelpCircle,       color: "text-gray-600",    bg: "bg-gray-50" },
};

// ===== Enum label maps =====
export const housingLabels: Record<string, string> = {
    "Owned": "ملك", "Rented": "إيجار", "Provided": "استضافة/إيواء", "Other": "أخرى",
};

export const workingTypeLabels: Record<number, string> = {
    0: "دوام كامل",
    1: "دوام جزئي",
    2: "عقد مؤقت",
    3: "عمل حر",
    4: "متدرب",
};

export const employmentTypeLabels: Record<number, string> = {
    0: "قطاع خاص",
    1: "قطاع حكومي",
    2: "منظمة غير ربحية",
    3: "عمل حر/مستقل",
};
