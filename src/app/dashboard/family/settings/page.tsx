"use client";

import React, { useState } from "react";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { ChangePasswordForm } from "@/features/settings/components/ChangePasswordForm";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { 
    Shield, 
    Bell, 
    Settings2, 
    Smartphone, 
    Laptop, 
    LogOut, 
    Mail, 
    MessageSquare, 
    FileText,
    Globe,
    Moon,
    Download,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/shared/utils";
import { toast } from "sonner";

type TabKey = "security" | "notifications" | "preferences";

export default function FamilySettingsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("security");

    const tabs = [
        { id: "security", label: "الأمان والدخول", icon: Shield },
        { id: "notifications", label: "الإشعارات", icon: Bell },
        { id: "preferences", label: "تفضيلات النظام", icon: Settings2 },
    ] as const;

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-muted/50" dir="rtl">
                <DashboardTopBar userType="family" />
                
                <main className="flex-1 p-4 md:p-8 lg:pb-8">
                    <div className="max-w-5xl mx-auto">
                        
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">إعدادات الحساب</h1>
                            <p className="text-muted-foreground font-medium text-sm md:text-base">
                                إدارة أمان حسابك، الإشعارات، وتفضيلات الواجهة الخاصة بك.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
                            {/* Sidebar Tabs */}
                            <div className="w-full md:w-64 shrink-0 -mx-4 px-4 md:mx-0 md:px-0">
                                <div className="flex md:flex-col gap-2.5 overflow-x-auto pb-4 md:pb-0 scrollbar-hide snap-x">
                                    {tabs.map((tab) => {
                                        const isActive = activeTab === tab.id;
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap snap-center shrink-0",
                                                    isActive 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                                        : "bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border"
                                                )}
                                            >
                                                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 min-w-0">
                                {activeTab === "security" && <SecuritySettings />}
                                {activeTab === "notifications" && <NotificationSettings />}
                                {activeTab === "preferences" && <PreferencesSettings />}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

// --------------------------------------------------------
// Security Settings Tab
// --------------------------------------------------------
function SecuritySettings() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Change Password Component */}
            <ChangePasswordForm />

            {/* 2-Factor Authentication */}
            <Card className="p-5 sm:p-6 md:p-8 border border-border shadow-sm rounded-3xl bg-card overflow-hidden relative">
                <div className="flex items-start justify-between gap-4 relative z-10">
                    <div className="flex gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-foreground mb-1">التحقق بخطوتين (2FA)</h3>
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed max-w-lg">
                                إضافة طبقة حماية إضافية لحسابك من خلال إرسال رمز تحقق إلى بريدك الإلكتروني عند تسجيل الدخول من جهاز جديد.
                            </p>
                        </div>
                    </div>
                    <Switch 
                        checked={twoFactorEnabled} 
                        onCheckedChange={setTwoFactorEnabled} 
                        className="data-[state=checked]:bg-primary shrink-0 mt-1"
                    />
                </div>
                {twoFactorEnabled && (
                    <div className="mt-6 pt-5 border-t border-border flex items-center gap-2 text-sm font-bold text-primary bg-emerald-50/50 p-4 rounded-xl animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        تم تفعيل التحقق بخطوتين بنجاح. سيتم إرسال رمز التحقق لبريدك الإلكتروني عند الدخول القادم.
                    </div>
                )}
            </Card>

            {/* Active Sessions */}
            <Card className="p-5 sm:p-6 md:p-8 border border-border shadow-sm rounded-3xl bg-card">
                <h3 className="text-base sm:text-lg font-black text-foreground mb-4 sm:mb-6">الأجهزة المتصلة</h3>
                
                <div className="space-y-3 sm:space-y-4">
                    {/* Current Device */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted border border-border gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm text-muted-foreground shrink-0">
                                <Laptop className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground text-sm">Windows • Chrome</p>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground mt-1">
                                    <span className="text-primary font-bold">نشط الآن</span>
                                    <span>•</span>
                                    <span>القاهرة، مصر</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hidden sm:flex shrink-0" disabled>
                            هذا الجهاز
                        </Button>
                    </div>

                    {/* Other Device */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-card border border-border transition-colors hover:border-border gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-foreground text-sm truncate">iPhone 13 Pro • Safari</p>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-muted-foreground mt-1 flex-wrap">
                                    <span>أمس، 10:30 م</span>
                                    <span>•</span>
                                    <span>القاهرة، مصر</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 gap-2 h-9 sm:h-auto py-2 shrink-0 self-end sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
                            <LogOut className="w-3.5 h-3.5" />
                            <span>تسجيل خروج</span>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// --------------------------------------------------------
// Notification Settings Tab
// --------------------------------------------------------
function NotificationSettings() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-6 md:p-8 border border-border shadow-sm rounded-3xl bg-card">
                <h3 className="text-lg font-black text-foreground mb-6">إشعارات النظام والمنصة</h3>
                <div className="space-y-6">
                    <NotificationToggle 
                        icon={FileText} 
                        title="تحديثات الطلبات" 
                        description="تلقي إشعار فور تغير حالة طلباتك أو عند استلام قرار من الجمعية." 
                        defaultChecked={true}
                    />
                    <div className="h-px w-full bg-muted/50" />
                    <NotificationToggle 
                        icon={MessageSquare} 
                        title="رسائل المساعد (الدردشة)" 
                        description="إشعارات بالرسائل الجديدة من الذكاء الاصطناعي أو من ممثل الجمعية." 
                        defaultChecked={true}
                    />
                </div>
            </Card>

            <Card className="p-6 md:p-8 border border-border shadow-sm rounded-3xl bg-card">
                <h3 className="text-lg font-black text-foreground mb-6">تنبيهات البريد الإلكتروني</h3>
                <div className="space-y-6">
                    <NotificationToggle 
                        icon={Mail} 
                        title="العروض والحملات الجديدة" 
                        description="تلقي تنبيه عند وجود حملات خيرية جديدة قد تكون مهتماً بها." 
                        defaultChecked={false}
                    />
                    <div className="h-px w-full bg-muted/50" />
                    <NotificationToggle 
                        icon={Shield} 
                        title="تنبيهات الأمان الحساسة" 
                        description="رسائل بريدية عند الدخول من جهاز جديد أو محاولات الدخول الفاشلة." 
                        defaultChecked={true}
                        disabled={true} // Forcing this to be true for security
                    />
                </div>
            </Card>
        </div>
    );
}

function NotificationToggle({ 
    icon: Icon, 
    title, 
    description, 
    defaultChecked,
    disabled = false 
}: { 
    icon: any, 
    title: string, 
    description: string, 
    defaultChecked: boolean,
    disabled?: boolean
}) {
    const [checked, setChecked] = useState(defaultChecked);
    
    const handleToggle = (val: boolean) => {
        setChecked(val);
        toast.success("تم الحفظ", {
            description: "تم تحديث إعدادات الإشعارات بنجاح."
        });
    };

    return (
        <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                    <h4 className="font-bold text-foreground text-sm mb-1">{title}</h4>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-[280px] sm:max-w-sm">{description}</p>
                </div>
            </div>
            <Switch 
                checked={checked} 
                onCheckedChange={handleToggle} 
                disabled={disabled}
                className="data-[state=checked]:bg-primary shrink-0 mt-1"
            />
        </div>
    );
}

// --------------------------------------------------------
// Preferences Settings Tab
// --------------------------------------------------------
function PreferencesSettings() {
    const handleComingSoon = () => {
        toast.info("ميزة قادمة", {
            description: "هذه الميزة ستكون متاحة قريباً في الإصدار القادم من النظام.",
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-5 sm:p-6 md:p-8 border border-border shadow-sm rounded-3xl bg-card">
                <h3 className="text-base sm:text-lg font-black text-foreground mb-4 sm:mb-6">تخصيص الواجهة</h3>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Language */}
                    <div className="space-y-2.5 sm:space-y-3">
                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            لغة النظام
                        </label>
                        <select 
                            onChange={handleComingSoon}
                            className="w-full h-11 sm:h-12 bg-muted border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                        >
                            <option value="ar">العربية (الافتراضية)</option>
                            <option value="en">English (قريباً)</option>
                        </select>
                    </div>

                    {/* Theme */}
                    <div className="space-y-2.5 sm:space-y-3">
                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            مظهر التطبيق
                        </label>
                        <select 
                            onChange={handleComingSoon}
                            className="w-full h-11 sm:h-12 bg-muted border border-border rounded-xl px-4 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                        >
                            <option value="light">فاتح (Light)</option>
                            <option value="dark">داكن (Dark) - قريباً</option>
                            <option value="system">حسب النظام</option>
                        </select>
                    </div>
                </div>
            </Card>

            <Card className="p-5 sm:p-6 md:p-8 border border-border shadow-sm rounded-3xl bg-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                    <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground mb-1.5 sm:mb-2">بيانات حسابك</h3>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground sm:max-w-lg leading-relaxed">
                            يمكنك طلب نسخة كاملة من بياناتك تشمل الطلبات السابقة، الرسائل، والمستندات المرفوعة في ملف مضغوط.
                        </p>
                    </div>
                    <Button 
                        onClick={handleComingSoon}
                        className="shrink-0 h-11 sm:h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg gap-2 w-full md:w-auto mt-2 md:mt-0"
                    >
                        <Download className="w-4 h-4" />
                        تصدير البيانات
                    </Button>
                </div>
            </Card>
        </div>
    );
}

