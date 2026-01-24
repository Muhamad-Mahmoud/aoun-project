// Custom Hook for Family Dashboard Data and Logic
"use client";

import { useState, useMemo } from "react";
import {
    Clock,
    CheckCircle2,
    FileText,
    DollarSign,
    Stethoscope,
    GraduationCap,
    UtensilsCrossed,
    Home,
    Eye,
    Edit2,
    Upload,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { StatItem } from "../components/StatsCard";
import { Task } from "../components/TasksCard";
import { RequestHistoryItem, StatusConfig } from "../components/RequestHistoryTable";
import { TimelineItem } from "@/shared/components/common/Timeline";
import { Step } from "@/shared/components/common/StepIndicator";

// Types
interface PrimaryAction {
    label: string;
    icon: LucideIcon;
    href: string;
}

interface ActiveRequestData {
    id: string;
    title: string;
    category: string;
    location: string;
    status: string;
    urgencyReason: string;
    requestedAmount: string;
    attachmentsCount: number;
    priority: string;
    currentStep: number;
    totalSteps: number;
    nextAction: string;
    nextActionDescription: string;
    lastModified: string;
    createdDaysAgo: number;
}

export function useFamilyDashboard() {
    // State
    const [hasActiveRequest] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const requestStatus: string = "PENDING";

    // Primary Action based on status
    const getPrimaryAction = (): PrimaryAction => {
        switch (requestStatus) {
            case "NEEDS_DOCUMENTS":
                return { label: "استكمال المستندات", icon: Upload, href: "/dashboard/family/requests/REQ-2024-001/documents" };
            case "PENDING":
                return { label: "متابعة الحالة", icon: Eye, href: "/dashboard/family/requests/REQ-2024-001" };
            case "VERIFIED":
                return { label: "تعديل الطلب", icon: Edit2, href: "/dashboard/family/requests/REQ-2024-001/edit" };
            default:
                return { label: "عرض التفاصيل", icon: Eye, href: "/dashboard/family/requests/REQ-2024-001" };
        }
    };

    const primaryAction = getPrimaryAction();

    // Stats Data
    const stats: StatItem[] = [
        {
            label: "إجمالي الطلبات",
            value: "3",
            change: "+1",
            trend: "up",
            icon: FileText,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            label: "طلبات مكتملة",
            value: "2",
            change: "67%",
            trend: "neutral",
            icon: CheckCircle2,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            label: "مساعدات مستلمة",
            value: "45,500",
            change: "ج.م",
            trend: "up",
            icon: DollarSign,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            label: "متوسط الرد",
            value: "48",
            change: "ساعة",
            trend: "down",
            icon: Clock,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

    // Active Request Data
    const activeRequest: ActiveRequestData = {
        id: "REQ-2024-001",
        title: "مساعدة في عملية قسطرة قلب",
        category: "رعاية صحية",
        location: "القاهرة، عين شمس",
        status: "PENDING",
        urgencyReason: "موعد الجراحة المقرر: 15 فبراير (مستشفى الدمرداش)",
        requestedAmount: "25,000 ج.م",
        attachmentsCount: 3,
        priority: "عاجل جداً",
        currentStep: 1,
        totalSteps: 4,
        nextAction: "مطلوب منك الآن",
        nextActionDescription: "جاري مراجعة قرار العلاج على نفقة الدولة المرفق. سيتم الرد خلال 24 ساعة.",
        lastModified: "أمس",
        createdDaysAgo: 4,
    };

    // Progress Steps
    const progressSteps: Step[] = [
        { label: "استقبال", done: true },
        { label: "مراجعة", done: false },
        { label: "بحث ميداني", done: false },
        { label: "صرف", done: false },
    ];

    // Recent Activities
    const recentActivities: TimelineItem[] = [
        { text: "تم استلام قرار العلاج على نفقة الدولة", time: "منذ ساعتين", type: "success" },
        { text: "الطلب قيد المراجعة الفنية", time: "منذ 5 ساعات", type: "info" },
        { text: "تم تقديم الطلب", time: "أمس", type: "default" },
    ];

    // Request History
    const requestsHistory: RequestHistoryItem[] = [
        {
            id: "REQ-2023-085",
            title: "مساعدة تعليمية",
            description: "مصاريف دراسية للفصل الدراسي الثاني",
            category: "تعليم",
            status: "completed",
            amount: "5,000 ج.م",
            date: "نوفمبر 2023",
        },
        {
            id: "REQ-2023-054",
            title: "سلة غذائية",
            description: "سلة غذاء رمضان 2023",
            category: "غذاء",
            status: "completed",
            amount: "2,500 ج.م",
            date: "مارس 2023",
        },
        {
            id: "REQ-2023-021",
            title: "إيجار شهري",
            description: "مساعدة في سداد إيجار 3 شهور متأخرة",
            category: "سكن",
            status: "rejected",
            amount: "4,500 ج.م",
            date: "يناير 2023",
        },
    ];

    // Category Icons
    const categoryIcons: Record<string, LucideIcon> = {
        "تعليم": GraduationCap,
        "غذاء": UtensilsCrossed,
        "سكن": Home,
        "رعاية صحية": Stethoscope,
    };

    // Status Config
    const statusConfig: Record<string, StatusConfig> = {
        completed: { label: "مكتمل", color: "text-green-700 bg-green-50 border-green-200" },
        rejected: { label: "مرفوض", color: "text-red-700 bg-red-50 border-red-200" },
        pending: { label: "قيد المراجعة", color: "text-amber-700 bg-amber-50 border-amber-200" },
        in_progress: { label: "قيد التنفيذ", color: "text-blue-700 bg-blue-50 border-blue-200" },
    };

    // Tasks
    const tasks: Task[] = [
        { text: "تحديث بحث الحالة الاجتماعية", done: false, href: "/settings", urgent: false },
        { text: "توثيق عقد الإيجار", done: true, href: null, urgent: false },
        { text: "إضافة الرقم القومي للزوجة", done: false, href: "/settings", urgent: true, deadline: "مطلوب لاستكمال الملف" },
    ];

    // Profile Data
    const profile = {
        familyName: "عائلة أ. محمد إبراهيم",
        location: "عين شمس، القاهرة",
        completionPercentage: 85,
        isVerified: true,
    };

    // Filtered History
    const filteredHistory = useMemo(() => {
        if (!searchTerm) return requestsHistory;
        return requestsHistory.filter(
            (req) =>
                req.title.includes(searchTerm) ||
                req.description.includes(searchTerm) ||
                req.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, requestsHistory]);

    return {
        // State
        hasActiveRequest,
        searchTerm,
        setSearchTerm,
        requestStatus,

        // Actions
        primaryAction,

        // Data
        stats,
        activeRequest,
        progressSteps,
        recentActivities,
        tasks,
        profile,
        filteredHistory,

        // Config
        categoryIcons,
        statusConfig,
    };
}
