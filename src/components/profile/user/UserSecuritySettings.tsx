"use client";

import React, { useState } from 'react';
import { Lock, Shield } from 'lucide-react';
import { ProfileCard } from '../shared/ProfileCard';
import { ProfileSection } from '../shared/ProfileSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const UserSecuritySettings: React.FC = () => {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordChange = () => {
        // TODO: Implement password change logic
        console.log('Changing password...', passwords);
        setIsChangingPassword(false);
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <ProfileCard>
            <ProfileSection
                title="الأمان وكلمة المرور"
                icon={<Lock className="w-3.5 h-3.5" />}
            >
                {!isChangingPassword ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div>
                                <p className="font-semibold text-foreground">كلمة المرور</p>
                                <p className="text-sm text-muted-foreground">آخر تغيير منذ 3 أشهر</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setIsChangingPassword(true)}
                            >
                                تغيير كلمة المرور
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-secondary" />
                                <div>
                                    <p className="font-semibold text-foreground">المصادقة الثنائية</p>
                                    <p className="text-sm text-muted-foreground">غير مفعلة</p>
                                </div>
                            </div>
                            <Button variant="outline">
                                تفعيل
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password" className="text-base font-bold">
                                كلمة المرور الحالية
                            </Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                placeholder="أدخل كلمة المرور الحالية"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-base font-bold">
                                كلمة المرور الجديدة
                            </Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                placeholder="أدخل كلمة المرور الجديدة"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-base font-bold">
                                تأكيد كلمة المرور
                            </Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                placeholder="أعد إدخال كلمة المرور الجديدة"
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswords({ current: '', new: '', confirm: '' });
                                }}
                            >
                                إلغاء
                            </Button>
                            <Button onClick={handlePasswordChange}>
                                حفظ كلمة المرور
                            </Button>
                        </div>
                    </div>
                )}
            </ProfileSection>
        </ProfileCard>
    );
};
