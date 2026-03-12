"use client";

import { X, UploadCloud, ImageIcon, FileText } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step5AttachmentsProps {
    uploadedFiles: File[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
}

export function Step5Attachments({ uploadedFiles, onFileUpload, onRemoveFile }: Step5AttachmentsProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-6 bg-warm-green rounded-full" />
                    المستندات المطلوبة
                </h3>
                <p className="text-slate-500 text-sm">
                    يرجى إرفاق صور واضحة للمستندات الداعمة لطلبك لتسريع عملية المراجعة.
                </p>
            </div>

            {/* File Upload Area */}
            <div className="relative border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-10 text-center hover:border-warm-green/50 hover:bg-warm-green/5 transition-all duration-300 group overflow-hidden">
                <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={onFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-4 relative z-0">
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <UploadCloud className="w-10 h-10 text-warm-green" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-slate-800 mb-1">اضغط هنا أو اسحب الملفات للإرفاق</p>
                        <p className="text-sm text-slate-500">يدعم الصور وملفات PDF بحد أقصى 5 ميجابايت للملف</p>
                    </div>
                </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-800">
                            الملفات المرفقة <span className="bg-warm-green/10 text-warm-green px-2 py-0.5 rounded-full text-xs ml-2">{uploadedFiles.length}</span>
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {uploadedFiles.map((file, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    {file.type.startsWith("image/") ? (
                                        <ImageIcon className="w-5 h-5 text-warm-green" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-warm-green" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveFile(idx)}
                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 rounded-full shrink-0 opacity-50 group-hover:opacity-100 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Important Warning */}
            <div className="flex gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1 text-base">إقرار بصحة البيانات</p>
                    <p className="leading-relaxed">
                        بإرسالك لهذا الطلب، أنت تقر بصحة جميع البيانات والمستندات المرفقة. سيتم مراجعة طلبك بعناية من قبل فريق الإدارة، وسنتصل بك في أقرب وقت.
                    </p>
                </div>
            </div>
        </div>
    );
}
