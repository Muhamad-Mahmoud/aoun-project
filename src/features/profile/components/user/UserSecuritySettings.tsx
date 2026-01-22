/**
 * User Security Settings Component
 */

"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Lock } from 'lucide-react';

export function UserSecuritySettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    إعدادات الأمان
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>كلمة المرور الحالية</Label>
                    <Input type="password" placeholder="••••••••" dir="ltr" />
                </div>
                <div className="space-y-2">
                    <Label>كلمة المرور الجديدة</Label>
                    <Input type="password" placeholder="••••••••" dir="ltr" />
                </div>
                <div className="space-y-2">
                    <Label>تأكيد كلمة المرور</Label>
                    <Input type="password" placeholder="••••••••" dir="ltr" />
                </div>
                <Button className="w-full">تغيير كلمة المرور</Button>
            </CardContent>
        </Card>
    );
}
