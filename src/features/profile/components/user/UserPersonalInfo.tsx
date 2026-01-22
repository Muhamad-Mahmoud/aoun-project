/**
 * User Personal Info Component
 */

"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { UserProfile } from '../../types';

interface UserPersonalInfoProps {
    profile: UserProfile;
    isEditing: boolean;
}

export function UserPersonalInfo({ profile, isEditing }: UserPersonalInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>الاسم الكامل</Label>
                    <Input value={profile.name} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input value={profile.email} disabled={!isEditing} dir="ltr" />
                </div>
                <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input value={profile.phone} disabled={!isEditing} dir="ltr" />
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
