/**
 * Organization Representative Component
 */

"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { User } from 'lucide-react';

interface Representative {
    name: string;
    phone: string;
    email: string;
    position: string;
}

interface OrganizationRepresentativeProps {
    representative: Representative;
    isEditing: boolean;
}

export function OrganizationRepresentative({ representative, isEditing }: OrganizationRepresentativeProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المسؤول / الممثل القانوني
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>الاسم</Label>
                    <Input value={representative.name} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label>المنصب</Label>
                    <Input value={representative.position} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input value={representative.email} disabled={!isEditing} dir="ltr" />
                </div>
                <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input value={representative.phone} disabled={!isEditing} dir="ltr" />
                </div>
            </CardContent>
        </Card>
    );
}
