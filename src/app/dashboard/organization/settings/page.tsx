"use client";

import React, { useState } from "react";
import { DashboardLayout, DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
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
    Heart, 
    FileText,
    Globe,
    Moon,
    Download,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/shared/utils";
import { toast } from "sonner";

type TabKey = "security" | "notifications" | "preferences";

export default function OrganizationSettingsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("security");

    const tabs = [
        { id: "security", label: "الأمان والدخول", icon: Shield },
        { id: "notifications", label: "الإشعارات", icon: Bell },
        { id: "preferences", label: "تفضيلات النظام", icon: Settings2 },
    ] as const;

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50/50" dir="rtl">
                <DashboardTopBar userType="organization" />
                
                <main className="flex-1 p-4 md:p-8 lg:pb-8">
                    <div className="max-w-5xl mx-auto">
                        
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">إعدادات الحساب</h1>
                            <p className="text-slate-500 font-medium text-sm md:text-base">
                                إدارة أمان حسابك، الإشعارات، وتفضيلات الواجهة بشكل كامل.
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
                                                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100"
                                                )}
                                            >
                                                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
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
            <Card className="p-5 sm:p-6 md:p-8 border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden relative">
                <div className="flex items-start justify-between gap-4 relative z-10">
                    <div className="flex gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">التحقق بخطوتين (2FA)</h3>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-lg">
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
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-sm font-bold text-primary bg-emerald-50/50 p-4 rounded-xl animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        تم تفعيل التحقق بخطوتين بنجاح. سيتم إرسال رمز التحقق لبريدك الإلكتروني عند الدخول القادم.
                    </div>
                )}
            </Card>

            {/* Active Sessions */}
            <Card className="p-5 sm:p-6 md:p-8 border border-slate-100 shadow-sm rounded-3xl bg-white">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 sm:mb-6">الأجهزة المتصلة</h3>
                
                <div className="space-y-3 sm:space-y-4">
                    {/* Current Device */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-600 shrink-0">
                                <Laptop className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Windows • Chrome</p>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
                                    <span className="text-primary font-bold">نشط الآن</span>
                                    <span>•</span>
                                    <span>القاهرة، مصر</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700 hidden sm:flex shrink-0" disabled>
                            هذا الجهاز
                        </Button>
                    </div>

                    {/* Other Device */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 transition-colors hover:border-slate-200 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-sm truncate">iPhone 13 Pro • Safari</p>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-slate-500 mt-1 flex-wrap">
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
            <Card className="p-6 md:p-8 border border-slate-100 shadow-sm rounded-3xl bg-white">
                <h3 className="text-lg font-black text-slate-900 mb-6">إشعارات النظام والمنصة</h3>
                <div className="space-y-6">
                    <NotificationToggle 
                        icon={FileText} 
                        title="الطلبات الجديدة" 
                        description="تلقي إشعار فور تقديم أسرة محتاجة لطلب مساعدة جديد للجمعية." 
                        defaultChecked={true}
                    />
                    <div className="h-px w-full bg-slate-100" />
                    <NotificationToggle 
                        icon={Heart} 
                        title="التبرعات الواردة" 
                        description="تلقي تنبيه عند تأكيد استلام أو تحويل تبرع جديد لإحدى حملات الجمعية." 
                        defaultChecked={true}
                    />
                    <div className="h-px w-full bg-slate-100" />
                    <NotificationToggle 
                        icon={MessageSquare} 
                        title="رسائل المحادثات" 
                        description="إشعارات بالرسائل الجديدة المستلمة من الأسر في صندوق الوارد." 
                        defaultChecked={true}
                    />
                </div>
            </Card>

            <Card className="p-6 md:p-8 border border-slate-100 shadow-sm rounded-3xl bg-white">
                <h3 className="text-lg font-black text-slate-900 mb-6">تنبيهات البريد الإلكتروني</h3>
                <div className="space-y-6">
                    <NotificationToggle 
                        icon={Mail} 
                        title="ملخص أسبوعي" 
                        description="تلقي بريد إلكتروني أسبوعي يلخص نشاط الجمعية وإحصائيات الطلبات والتبرعات." 
                        defaultChecked={false}
                    />
                    <div className="h-px w-full bg-slate-100" />
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
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[280px] sm:max-w-sm">{description}</p>
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
            <Card className="p-5 sm:p-6 md:p-8 border border-slate-100 shadow-sm rounded-3xl bg-white">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 sm:mb-6">تخصيص الواجهة</h3>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Language */}
                    <div className="space-y-2.5 sm:space-y-3">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            لغة النظام
                        </label>
                        <select 
                            onChange={handleComingSoon}
                            className="w-full h-11 sm:h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                        >
                            <option value="ar">العربية (الافتراضية)</option>
                            <option value="en">English (قريباً)</option>
                        </select>
                    </div>

                    {/* Theme */}
                    <div className="space-y-2.5 sm:space-y-3">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            مظهر التطبيق
                        </label>
                        <select 
                            onChange={handleComingSoon}
                            className="w-full h-11 sm:h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                        >
                            <option value="light">فاتح (Light)</option>
                            <option value="dark">داكن (Dark) - قريباً</option>
                            <option value="system">حسب النظام</option>
                        </select>
                    </div>
                </div>
            </Card>

            <Card className="p-5 sm:p-6 md:p-8 border border-slate-100 shadow-sm rounded-3xl bg-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                    <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5 sm:mb-2">بيانات الجمعية وسجل النشاطات</h3>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 sm:max-w-lg leading-relaxed">
                            يمكنك طلب نسخة كاملة من بيانات الجمعية تشمل سجل التبرعات، الطلبات المؤرشفة، وتقارير الإنجاز في ملف مضغوط.
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
