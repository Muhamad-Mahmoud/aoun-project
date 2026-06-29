"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { donationsApi } from '../api/donationsApi';
import { useAuthContext } from '@/shared/providers';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { CampaignDto } from '../api/searchApi';

interface DonationModalProps {
    campaign: CampaignDto;
    children: React.ReactNode;
}

export function DonationModal({ campaign, children }: DonationModalProps) {
    const { isAuthenticated, user } = useAuthContext();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<string>('');
    const [inKindItems, setInKindItems] = useState('');
    const [notes, setNotes] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount && !inKindItems) {
            toast.error('الرجاء إدخال تفاصيل التبرع');
            return;
        }

        if (!isAuthenticated && !guestName.trim()) {
            toast.error('الرجاء إدخال اسمك كمتبرع');
            return;
        }

        setLoading(true);
        try {
            await donationsApi.pledgeDonation({
                campaignId: campaign.id,
                amount: amount ? Number(amount) : undefined,
                inKindItems: inKindItems || undefined,
                notes: notes || undefined,
                guestName: !isAuthenticated ? guestName : undefined,
                guestPhone: !isAuthenticated ? guestPhone : undefined
            });
            toast.success('تم إرسال تبرعك بنجاح! شكراً لعطائك.');
            setOpen(false);
            setAmount('');
            setInKindItems('');
            setNotes('');
            setGuestName('');
            setGuestPhone('');
        } catch (error) {
            toast.error('حدث خطأ أثناء إرسال التبرع');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl overflow-y-auto max-h-[90vh]" dir="rtl">
                <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
                    <DialogTitle className="text-xl font-black text-slate-900 text-start">
                        {campaign.title}
                    </DialogTitle>
                </DialogHeader>

                {campaign.imageUrl && (
                    <div className="w-full h-40 bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={campaign.imageUrl.startsWith('http') ? campaign.imageUrl.replace(/^http:/i, 'https:') : `https://aounn.runasp.net/uploads/${campaign.imageUrl.replace(/^\/?(uploads\/)?/, '')}`} alt={campaign.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="bg-primary/10 border border-emerald-200 p-4 rounded-xl mb-6">
                    <h4 className="text-sm font-bold text-emerald-800 mb-2">وسائل وطرق الدفع للجمعية</h4>
                    <p className="text-sm font-medium text-amber-900 whitespace-pre-wrap leading-relaxed">
                        {campaign.paymentInstructions || "لم تقم الجمعية بتحديد وسائل دفع إلكترونية حتى الآن. سيتم التواصل معك لتنسيق عملية التبرع واستلام المبلغ."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isAuthenticated && (
                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800">بيانات المتبرع (للتواصل)</h4>
                            <div className="space-y-3">
                                <Input 
                                    required 
                                    value={guestName} 
                                    onChange={e => setGuestName(e.target.value)}
                                    placeholder="الاسم الكريم *"
                                    className="h-12 bg-white border-slate-200 focus:border-primary/50 text-sm"
                                />
                                <Input 
                                    value={guestPhone} 
                                    onChange={e => setGuestPhone(e.target.value)}
                                    placeholder="رقم الهاتف (اختياري)"
                                    className="h-12 bg-white border-slate-200 focus:border-primary/50 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {campaign.targetAmount ? (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700">مبلغ التبرع (ج.م)</label>
                            <Input 
                                type="number" 
                                min="1" 
                                required 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)}
                                placeholder="أدخل المبلغ الذي تود التبرع به..."
                                className="h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 text-lg font-bold"
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700">الأشياء العينية المتبرع بها</label>
                            <Input 
                                required 
                                value={inKindItems} 
                                onChange={e => setInKindItems(e.target.value)}
                                placeholder="مثال: 5 بطانيات، ملابس شتوية..."
                                className="h-12 bg-slate-50 border-slate-200 focus:border-primary/50 focus:ring-primary/20 text-lg font-bold"
                            />
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">ملاحظات أو تفاصيل التحويل (اختياري)</label>
                        <Input 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)}
                            placeholder="مثال: تم التحويل من فودافون كاش، رقم العملية..."
                            className="h-12 bg-white border-slate-200 focus:border-primary/50 text-sm"
                        />
                    </div>

                    <div className="bg-primary/5 p-4 rounded-xl text-sm font-bold text-primary flex items-center gap-2">
                        <span>💡</span>
                        <span>سيتم إرسال تعهد التبرع للجمعية للتواصل معك وتأكيد الاستلام.</span>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" disabled={loading}>
                        {loading ? 'جاري الإرسال...' : 'تأكيد التبرع'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
