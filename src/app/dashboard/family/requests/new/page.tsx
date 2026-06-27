"use client";

import { useState } from "react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { FamilySidebar } from "@/shared/components/layout/FamilySidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { CheckCircle2, ChevronRight, Sparkles, AlertCircle, AlertTriangle } from "lucide-react";
import { RequestWizard } from "@/features/requests/components/RequestWizard";
import Link from "next/link";
import { createRequest } from "@/features/requests/api/requestsApi";
import type { RequestFormData } from "@/features/requests/components/wizard/schemas/requestSchema";
import { toast } from "sonner";
import { ROUTES } from "@/shared/constants/routes";
import { Alert, AlertTitle, AlertDescription } from "@/shared/ui/alert";

export default function NewRequestPage() {
    const [submitted, setSubmitted] = useState(false);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (data: RequestFormData & { attachments?: File[] }) => {
        try {
            setValidationError(null);


            // List of required fields that must have values
            // Based on API specification
            const requiredFields = [
                { key: 'requestType', label: 'نوع الطلب' },
                { key: 'description', label: 'وصف الطلب' },
                { key: 'housingType', label: 'نوع السكن' },
            ];

            const booleanFields = [
                { key: 'isWorking', label: 'حالة التوظيف' },
                { key: 'hasInsurance', label: 'التأمين' },
                { key: 'hasDisability', label: 'الإعاقة' },
                { key: 'hasChronicDisease', label: 'الأمراض المزمنة' },
                { key: 'hasCar', label: 'السيارة' },
                { key: 'hasOtherCommitments', label: 'الالتزامات الأخرى' },
                { key: 'registeredSocialSupport', label: 'الدعم الاجتماعي' },
            ];

            // Check required fields
            const missingFields: string[] = [];
            const dataRecord = data as unknown as Record<string, unknown>;
            requiredFields.forEach(({ key, label }) => {
                const value = dataRecord[key];
                // Don't check for === 0 because numeric enums can have 0 as valid value
                if (value === undefined || value === null || value === '') {
                    missingFields.push(`${label} (${key})`);
                }
            });

            // Check boolean fields have explicit values
            booleanFields.forEach(({ key, label }) => {
                const value = dataRecord[key];
                if (typeof value !== 'boolean') {
                    missingFields.push(`${label} - يجب أن تكون true أو false`);
                }
            });

            if (missingFields.length > 0) {
                const errorMsg = `الحقول المطلوبة التالية غير مكتملة:\n${missingFields.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;
                setValidationError(errorMsg);
                toast.error("❌ يرجى ملء جميع الحقول المطلوبة");
                return;
            }

            // Note: Zod schema uses null for optional numeric fields, but API expects undefined.
            // createRequest handles this conversion internally.
            const response = await createRequest(data as Parameters<typeof createRequest>[0]);

            // If the API call succeeded without throwing, we consider it a success.
            // Some backend frameworks might return PascalCase Id or wrap it differently.
            const newId = response?.id || (response as any)?.Id || (response as any)?.data?.id || (response as any)?.data?.Id;
            
            if (newId) {
                setRequestId(newId.toString());
            }
            
            setSubmitted(true);
            toast.success("تم إرسال طلبك بنجاح");
        } catch (error: unknown) {
            setValidationError(null);

            // Extract the most meaningful error message
            let message = error instanceof Error ? error.message : "فشل إرسال الطلب. يرجى المحاولة مرة أخرى.";

            // Check if it's a validation error message with multiple errors separated by newlines
            if (message.includes(':') && message.includes('\n')) {
                // This is a formatted validation error with multiple errors
                setValidationError(message);
                toast.error("⚠️ يرجى التحقق من الأخطاء المعروضة أدناه");
            }
            // Check for missing required fields from API
            else if (message.includes('مفقودة أو فارغة')) {
                setValidationError(message);
                toast.error("❌ حقول مطلوبة غير موجودة");
            }
            // Check for generic validation error message
            else if (message.includes("validation errors") || message.includes("One or more")) {
                // Validation error but no details - might be a backend message
                setValidationError(message);
                toast.error("❌ حدث خطأ في بيانات النموذج. تحقق من جميع الحقول المطلوبة");
            }
            // If it's the common Entity Framework error but backend added inner exception details
            else if (message.includes("saving the entity changes")) {
                setValidationError(message);
                toast.error("حدث خطأ أثناء الحفظ بقاعدة البيانات، راجع التفاصيل.");
            }
            else if (message.includes("أخطاء التحقق من البيانات")) {
                setValidationError(message);
                toast.error("هناك بيانات تتعارض مع شروط الحفظ، راجع التفاصيل بالأعلى.");
            }
            else {
                setValidationError(message);
                toast.error(message);
            }
        }
    };

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-0 pointer-events-none" />

                <DashboardTopBar userType="family" />

                <main className="p-4 sm:px-10 pt-20 lg:pt-28 relative z-10">
                    <div className="mx-auto max-w-4xl">
                        {!submitted ? (
                            <div className="space-y-5">
                                {/* Compact Page Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h1 className="text-[22px] font-black text-foreground tracking-tight leading-tight">طلب مساعدة جديد</h1>
                                            <p className="text-[13px] text-muted-foreground font-medium mt-0.5">أدخل بياناتك بدقة لدراسة حالتك وتحديد نوع الدعم المناسب</p>
                                        </div>
                                    </div>
                                    
                                    <Link href="/dashboard/family/requests" className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                        طلباتي 
                                    </Link>
                                </div>

                                {validationError && (
                                    <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 rounded-2xl">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>خطأ في البيانات المدخلة</AlertTitle>
                                        <AlertDescription className="mt-2 text-right whitespace-pre-wrap font-medium text-destructive">
                                            {validationError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <RequestWizard onSubmit={handleSubmit} />
                            </div>
                        ) : (
                            <Card className="max-w-xl mx-auto p-12 text-center border-border shadow-2xl rounded-[3rem] animate-in zoom-in duration-500 bg-card">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <CheckCircle2 className="w-12 h-12 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold mb-3 text-foreground">تم استلام طلبك بنجاح!</h1>
                                <p className="text-muted-foreground font-medium mb-10 text-base leading-relaxed">
                                    لقد سجلنا طلبك برقم <span className="text-foreground font-bold border-b-2 border-primary/30">#REQ-{requestId || "2024-001"}</span>.
                                    جاري الآن تحويله للفريق المختص للمراجعة.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button asChild className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20">
                                        <Link href="/dashboard/family/requests">
                                            متابعة طلباتي
                                        </Link>
                                    </Button>
                                    <Button asChild variant="ghost" className="h-12 rounded-2xl font-semibold text-muted-foreground hover:text-foreground hover:bg-muted">
                                        <Link href="/dashboard/family" className="flex items-center gap-2">
                                            العودة للرئيسية <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
