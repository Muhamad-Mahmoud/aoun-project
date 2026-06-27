"use client";

import { X, UploadCloud, ImageIcon, FileText, AlertCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";

interface Step5AttachmentsProps {
    uploadedFiles: File[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
    selectedRequestType?: string;
}

export function Step5Attachments({ uploadedFiles, onFileUpload, onRemoveFile, selectedRequestType }: Step5AttachmentsProps) {
    const getHintMessage = () => {
        switch (selectedRequestType) {
            case "Financial": return "يرجى إرفاق: مفردات مرتب، إثبات دخل، أو مستندات الديون المحلولة.";
            case "Medical": return "يرجى إرفاق: روشتة طبية، تقرير طبي معتمد، أو فواتير علاج.";
            case "Food": return "يرجى إرفاق: إثبات الحالة الاجتماعية أو أي وثيقة داعمة للاحتياج.";
            case "Housing": return "يرجى إرفاق: عقد إيجار موثق، أو إيصالات مرافق (كهرباء/مياه) حديثة.";
            case "Education": return "يرجى إرفاق: شهادة قيد من المدرسة/الجامعة وإيصال بمصروفات دراسية متأخرة.";
            case "Utilities": return "يرجى إرفاق: فواتير متأخرة أو إخطارات قطع خدمة.";
            default: return "أرفق صور واضحة للمستندات الداعمة لتسريع عملية دراسة حالتك.";
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h3 className="text-[15px] font-black text-foreground flex items-center gap-2 mb-1">
                    <span className="w-1 h-5 bg-warm-green rounded-full" />
                    المستندات المطلوبة
                </h3>
                <p className="text-muted-foreground text-sm pr-3 font-semibold">
                    {getHintMessage()}
                </p>
            </div>

            {/* Upload Area */}
            <div className="relative border-2 border-dashed border-border bg-muted/50 rounded-2xl p-8 text-center hover:border-warm-green/50 hover:bg-warm-green/5 transition-all duration-300 group overflow-hidden cursor-pointer">
                <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={onFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-3 relative z-0">
                    <div className="w-14 h-14 rounded-2xl bg-card shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <UploadCloud className="w-7 h-7 text-warm-green" />
                    </div>
                    <div>
                        <p className="text-[15px] font-bold text-foreground mb-0.5">اضغط هنا أو اسحب الملفات</p>
                        <p className="text-sm text-muted-foreground">صور وـPDF · حد أقصى 5 MB للملف</p>
                    </div>
                </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                    <p className="text-sm font-bold text-foreground">
                        الملفات المرفقة
                        <span className="mr-2 bg-warm-green/10 text-warm-green px-2 py-0.5 rounded-full text-xs font-bold">{uploadedFiles.length}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {uploadedFiles.map((file, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    {file.type.startsWith("image/") ? (
                                        <ImageIcon className="w-4 h-4 text-warm-green" />
                                    ) : (
                                        <FileText className="w-4 h-4 text-warm-green" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveFile(idx)}
                                    className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-500 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="flex gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-sm text-amber-800">
                    <p className="font-bold mb-0.5">إقرار بصحة البيانات</p>
                    <p className="leading-relaxed text-primary">
                        بإرسالك لهذا الطلب، أنت تقر بصحة جميع البيانات والمستندات. سنتصل بك قريباً.
                    </p>
                </div>
            </div>
        </div>
    );
}
