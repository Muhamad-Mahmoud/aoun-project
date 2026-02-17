"use client";

import { X, UploadCloud, ImageIcon, FileText } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { AlertCircle } from "lucide-react";

interface Step5AttachmentsProps {
    uploadedFiles: File[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
}

export function Step5Attachments({ uploadedFiles, onFileUpload, onRemoveFile }: Step5AttachmentsProps) {
    return (
        <div className="space-y-6">
            {/* File Upload Area */}
            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-warm-green/50 transition-all">
                <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={onFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-warm-green/10 flex items-center justify-center">
                        <UploadCloud className="w-7 h-7 text-warm-green" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">اضغط أو اسحب الملفات هنا</p>
                        <p className="text-xs text-slate-400 mt-1">صور أو ملفات PDF فقط</p>
                    </div>
                </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">الملفات المرفقة ({uploadedFiles.length})</p>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                            >
                                {file.type.startsWith("image/") ? (
                                    <ImageIcon className="w-4 h-4 text-warm-green shrink-0" />
                                ) : (
                                    <FileText className="w-4 h-4 text-warm-green shrink-0" />
                                )}
                                <span className="text-xs font-medium text-slate-700 flex-1 truncate">
                                    {file.name}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveFile(idx)}
                                    className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Important Warning */}
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                    <p className="font-bold mb-1">تنبيه هام:</p>
                    <p>
                        تأكد من صحة جميع البيانات المدخلة. سيتم مراجعة طلبك من قبل فريقنا وسنتواصل معك في أقرب وقت
                        ممكن.
                    </p>
                </div>
            </div>
        </div>
    );
}
