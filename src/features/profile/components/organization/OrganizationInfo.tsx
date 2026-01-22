/**
 * Organization Info Component
 */

"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Badge } from '@/shared/ui/badge';
import type { OrganizationProfile } from '../../types';

interface OrganizationInfoProps {
    profile: OrganizationProfile;
    isEditing: boolean;
}

export function OrganizationInfo({ profile, isEditing }: OrganizationInfoProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>معلومات المنظمة</CardTitle>
                    <Badge variant={profile.registrationStatus === 'registered' ? 'default' : 'secondary'}>
                        {profile.registrationStatus === 'registered' ? 'مسجلة' : 'قيد التسجيل'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>اسم المنظمة</Label>
                    <Input value={profile.name} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label>الاسم القانوني</Label>
                    <Input value={profile.legalName} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label>رقم التسجيل</Label>
                    <Input value={profile.registrationNumber} disabled dir="ltr" />
                </div>
                <div className="space-y-2">
                    <Label>المحافظة</Label>
                    <Input value={profile.governorate} disabled={!isEditing} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>العنوان</Label>
                    <Input value={profile.address} disabled={!isEditing} />
                </div>
            </CardContent>
        </Card>
    );
}
