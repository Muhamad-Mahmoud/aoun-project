"use client";

import { RequestFormData } from "../schemas/requestSchema";
import { RequestCategory } from "../types";
import { Card } from "@/shared/ui/card";
import { 
    CheckCircle2, 
    Briefcase, 
    Heart, 
    Home, 
    Coins, 
    MapPin, 
    Info 
} from "lucide-react";
import { motion } from "framer-motion";

interface Step6ReviewProps {
    formData: RequestFormData;
    categories: RequestCategory[];
    uploadedFiles: File[];
}

export function Step6Review({ formData, categories, uploadedFiles }: Step6ReviewProps) {
    const selectedCategory = categories.find(c => c.value === formData.requestType);

    const DefinitionItem = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: any }) => (
        <div className="flex flex-col space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </span>
            <span className="text-sm font-bold text-slate-800 bg-slate-50 rounded-lg p-2.5 min-h-[40px] flex items-center">
                {value || <span className="text-slate-400 font-medium italic">غير محدد</span>}
            </span>
        </div>
    );

    const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <h4 className="flex items-center gap-2 text-base font-black text-slate-900 border-b border-slate-100 pb-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-warm-green/10 flex items-center justify-center text-warm-green">
                <Icon className="w-4 h-4" />
            </div>
            {title}
        </h4>
    );

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === undefined || amount === null) return "غير محدد";
        return `${amount.toLocaleString()} ريال`;
    };

    const getHousingTypeLabel = (type: number) => {
        return ["ملك", "إيجار", "استضافة", "سكن طوارئ", "أخرى"][type] || "غير محدد";
    };

    return (
        <div className="space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-gradient-to-br from-warm-green/10 to-transparent p-5 rounded-2xl border border-warm-green/20 mb-8 flex items-start gap-4"
            >
                <div className="bg-white p-2 rounded-full shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-warm-green" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">جاهز للإرسال!</h3>
                    <p className="text-sm text-slate-600 font-medium mt-1">
                        يرجى مراجعة بياناتك بدقة قبل الإرسال النهائي للتأكد من صحتها وسرعة معالجة الطلب.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card className="p-6 border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-slate-100 rounded-2xl bg-white/50 backdrop-blur-sm">
                    <SectionHeader title="البيانات الأساسية" icon={Info} />
                    <div className="space-y-4">
                        <DefinitionItem 
                            label="تصنيف المساعدة" 
                            value={
                                <div className={`flex items-center gap-2 ${selectedCategory?.color}`}>
                                    {selectedCategory && <selectedCategory.icon className="w-4 h-4" />}
                                    {formData.requestType === 6 ? formData.otherRequestType : selectedCategory?.label}
                                </div>
                            } 
                        />
                        <DefinitionItem 
                            label="المدينة / المنطقة" 
                            value={formData.location} 
                            icon={MapPin} 
                        />
                        <DefinitionItem label="وصف الحالة" value={<p className="whitespace-pre-wrap text-sm leading-relaxed">{formData.description}</p>} />
                    </div>
                </Card>

                {/* Employment */}
                <Card className="p-6 border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-slate-100 rounded-2xl bg-white/50 backdrop-blur-sm">
                    <SectionHeader title="الحالة المهنية والسكن" icon={Briefcase} />
                    <div className="space-y-4">
                        <DefinitionItem 
                            label="حالة التوظيف" 
                            value={
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${formData.isWorking ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {formData.isWorking ? "يعمل" : "لا يعمل"}
                                </span>
                            } 
                        />
                        {formData.isWorking ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <DefinitionItem label="المسمى الوظيفي" value={formData.jobTitle} />
                                    <DefinitionItem label="الدخل الشهري" value={formatCurrency(formData.salaryMonthly)} />
                                </div>
                                <DefinitionItem label="جهة العمل" value={formData.company} />
                            </>
                        ) : (
                            <DefinitionItem label="سبب عدم العمل" value={formData.unEmploymentReason} />
                        )}
                        <DefinitionItem label="نوع السكن" value={getHousingTypeLabel(formData.housingType)} icon={Home} />
                    </div>
                </Card>

                {/* Health */}
                <Card className="p-6 border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-slate-100 rounded-2xl bg-white/50 backdrop-blur-sm">
                    <SectionHeader title="الحالة الصحية" icon={Heart} />
                    <div className="grid grid-cols-2 gap-4">
                        <DefinitionItem 
                            label="تأمين طبي" 
                            value={formData.hasInsurance ? <span className="text-emerald-600">نعم ({formData.insuranceType})</span> : "لا يوجد"} 
                        />
                        <DefinitionItem 
                            label="أمراض مزمنة" 
                            value={formData.hasChronicDisease ? <span className="text-rose-600">نعم ({formData.chronicDiseaseType})</span> : "لا يوجد"} 
                        />
                        <DefinitionItem 
                            label="إعاقة" 
                            value={formData.hasDisability ? <span className="text-purple-600">نعم ({formData.disabilityType})</span> : "لا يوجد"} 
                        />
                        {formData.hasChronicDisease && (
                            <DefinitionItem label="التكلفة الطبية الشهرية" value={formatCurrency(formData.medicalCostMonthly)} />
                        )}
                    </div>
                </Card>

                {/* Financial */}
                <Card className="p-6 border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-slate-100 rounded-2xl bg-white/50 backdrop-blur-sm">
                    <SectionHeader title="الوضع المالي" icon={Coins} />
                    <div className="grid grid-cols-2 gap-4">
                        <DefinitionItem label="إجمالي المصاريف الشهرية" value={formatCurrency(formData.monthlyExpenses)} />
                        {formData.housingType === 1 && (
                            <DefinitionItem label="الإيجار الشهري" value={formatCurrency(formData.rentMonthly)} />
                        )}
                        <DefinitionItem label="فواتير الخدمات" value={formatCurrency(formData.utilitiesMonthly)} />
                        {formData.registeredSocialSupport && (
                            <DefinitionItem label="قيمة الدعم الاجتماعي" value={formatCurrency(formData.socialSupportAmount)} />
                        )}
                    </div>
                </Card>
            </div>

            {/* Attachments Summary */}
            {uploadedFiles.length > 0 && (
                <Card className="p-6 border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-slate-100 rounded-2xl bg-white/50 backdrop-blur-sm mt-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base font-black text-slate-900">المرفقات</h4>
                        <span className="bg-warm-green/10 text-warm-green text-xs font-bold px-2 py-0.5 rounded-full">
                            {uploadedFiles.length} ملفات
                        </span>
                    </div>
                    <ul className="text-sm font-medium text-slate-600 list-disc list-inside space-y-1">
                        {uploadedFiles.map((f, i) => (
                            <li key={i}>{f.name}</li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
}
