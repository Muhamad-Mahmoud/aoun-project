"use client";

import React from 'react';
import { FileText, Download, Upload, Eye } from 'lucide-react';
import { ProfileCard } from '../shared/ProfileCard';
import { ProfileSection } from '../shared/ProfileSection';
import { Button } from '@/components/ui/button';
import { OrganizationProfile } from '@/types/profile';

interface OrganizationDocumentsProps {
    documents?: OrganizationProfile['documents'];
    onUpload?: (type: string, file: File) => Promise<void>;
}

const DocumentItem: React.FC<{
    title: string;
    url?: string;
    onUpload?: (file: File) => Promise<void>;
}> = ({ title, url, onUpload }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">
                        {url ? 'تم الرفع' : 'لم يتم الرفع'}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                {url ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                        >
                            <Eye className="w-4 h-4 ml-1" />
                            عرض
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = title;
                                link.click();
                            }}
                        >
                            <Download className="w-4 h-4 ml-1" />
                            تحميل
                        </Button>
                    </>
                ) : (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && onUpload) onUpload(file);
                            }}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4 ml-1" />
                            رفع
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export const OrganizationDocuments: React.FC<OrganizationDocumentsProps> = ({
    documents,
    onUpload
}) => {
    return (
        <ProfileCard>
            <ProfileSection
                title="المستندات الرسمية"
                icon={<FileText className="w-3.5 h-3.5" />}
            >
                <div className="space-y-3">
                    <DocumentItem
                        title="شهادة التسجيل"
                        url={documents?.registrationCertificate}
                        onUpload={onUpload ? (file) => onUpload('registrationCertificate', file) : undefined}
                    />
                    <DocumentItem
                        title="البطاقة الضريبية"
                        url={documents?.taxCard}
                        onUpload={onUpload ? (file) => onUpload('taxCard', file) : undefined}
                    />
                </div>
            </ProfileSection>
        </ProfileCard>
    );
};
