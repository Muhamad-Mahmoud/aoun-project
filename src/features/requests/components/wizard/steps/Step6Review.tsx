"use client";

import { RequestFormData } from "../schemas/requestSchema";
import { RequestCategory } from "../types";
import { housingLabels } from "../../../config/requestConfig";
import { SectionCard } from "../ui/SectionCard";
import {
    CheckCircle2,
    Briefcase,
    Heart,
    Home,
    Coins,
    MapPin,
    Info,
    Paperclip,
} from "lucide-react";
import { motion } from "framer-motion";

interface Step6ReviewProps {
    formData: RequestFormData;
    categories: RequestCategory[];
    uploadedFiles: File[];
}

export function Step6Review({ formData, categories, uploadedFiles }: Step6ReviewProps) {
    const selectedCategory = categories.find(c => c.value === formData.requestType);

    const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="text-[13px] font-semibold text-foreground bg-card rounded-lg px-3 py-2 min-h-[36px] flex items-center border border-border">
                {value || <span className="text-muted-foreground italic font-normal text-xs">غير محدد</span>}
            </span>
        </div>
    );

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === undefined || amount === null) return "غير محدد";
        return `${amount.toLocaleString()} جنيه`;
    };

    return (
        <div className="space-y-4">
            {/* Ready banner */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border border-emerald-100"
            >
                <div className="w-8 h-8 bg-card rounded-full shadow-sm flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="font-bold text-foreground text-[15px]">جاهز للإرسال!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">تحقق من البيانات أدناه قبل الإرسال النهائي.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <SectionCard title="البيانات الأساسية" icon={Info}>
                    <div className="space-y-3">
                        <Field
                            label="تصنيف المساعدة"
                            value={
                                <span className={`flex items-center gap-2 ${selectedCategory?.color}`}>
                                    {selectedCategory && <selectedCategory.icon className="w-4 h-4" />}
                                    {formData.requestType === "Other" ? formData.otherRequestType : selectedCategory?.label}
                                </span>
                            }
                        />
                        <Field
                            label="المدينة / المنطقة"
                            value={
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                    {formData.location}
                                </span>
                            }
                        />
                        <Field label="وصف الحالة" value={<p className="whitespace-pre-wrap text-[13px] leading-relaxed">{formData.description}</p>} />
                    </div>
                </SectionCard>

                {/* Employment */}
                <SectionCard title="الحالة المهنية والسكن" icon={Briefcase}>
                    <div className="space-y-3">
                        <Field
                            label="حالة التوظيف"
                            value={
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${formData.isWorking ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                    {formData.isWorking ? "يعمل" : "لا يعمل"}
                                </span>
                            }
                        />
                        {formData.isWorking ? (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="المسمى الوظيفي" value={formData.jobTitle} />
                                    <Field label="الدخل الشهري" value={formatCurrency(formData.salaryMonthly)} />
                                </div>
                                <Field label="جهة العمل" value={formData.company} />
                            </>
                        ) : (
                            <Field label="سبب عدم العمل" value={formData.unEmploymentReason} />
                        )}
                        <Field label="نوع السكن" value={(housingLabels as Record<string, string>)[formData.housingType as string] ?? "غير محدد"} />
                    </div>
                </SectionCard>

                {/* Health */}
                <SectionCard title="الحالة الصحية" icon={Heart} iconColor="text-rose-500" iconBg="bg-rose-50">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="تأمين طبي" value={formData.hasInsurance ? <span className="text-primary">نعم ({formData.insuranceType})</span> : "لا يوجد"} />
                        <Field label="أمراض مزمنة" value={formData.hasChronicDisease ? <span className="text-rose-600">نعم ({formData.chronicDiseaseType})</span> : "لا يوجد"} />
                        <Field label="إعاقة" value={formData.hasDisability ? <span className="text-amber-600">نعم ({formData.disabilityType})</span> : "لا يوجد"} />
                        {formData.hasChronicDisease && (
                            <Field label="التكلفة الطبية الشهرية" value={formatCurrency(formData.medicalCostMonthly)} />
                        )}
                    </div>
                </SectionCard>

                {/* Financial */}
                <SectionCard title="الوضع المالي" icon={Coins} iconColor="text-primary" iconBg="bg-primary/10">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="إجمالي المصاريف" value={formatCurrency(formData.monthlyExpenses)} />
                        {formData.housingType === "Rented" && (
                            <Field label="الإيجار الشهري" value={formatCurrency(formData.rentMonthly)} />
                        )}
                        <Field label="فواتير الخدمات" value={formatCurrency(formData.utilitiesMonthly)} />
                        {formData.registeredSocialSupport && (
                            <Field label="الدعم الاجتماعي" value={formatCurrency(formData.socialSupportAmount)} />
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Attachments */}
            {uploadedFiles.length > 0 && (
                <SectionCard title={`المرفقات (${uploadedFiles.length})`} icon={Paperclip}>
                    <ul className="flex flex-wrap gap-2">
                        {uploadedFiles.map((f, i) => (
                            <li key={i} className="text-xs font-medium text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-lg">
                                {f.name}
                            </li>
                        ))}
                    </ul>
                </SectionCard>
            )}
        </div>
    );
}
