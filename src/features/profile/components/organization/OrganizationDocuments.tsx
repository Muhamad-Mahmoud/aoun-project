/**
 * Organization Documents Component
 */

"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { FileText, Upload } from 'lucide-react';

interface Documents {
    registrationCertificate?: string;
    taxCard?: string;
}

interface OrganizationDocumentsProps {
    documents: Documents;
}

export function OrganizationDocuments({ documents }: OrganizationDocumentsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    المستندات
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">شهادة التسجيل</h4>
                        <p className="text-sm text-muted-foreground">
                            {documents.registrationCertificate ? 'تم الرفع' : 'لم يتم الرفع بعد'}
                        </p>
                    </div>
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 ml-2" />
                        رفع
                    </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">البطاقة الضريبية</h4>
                        <p className="text-sm text-muted-foreground">
                            {documents.taxCard ? 'تم الرفع' : 'لم يتم الرفع بعد'}
                        </p>
                    </div>
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 ml-2" />
                        رفع
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
