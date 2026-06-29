"use client";

import React, { useEffect, useState } from 'react';
import { useDonations } from '@/features/donations';
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { OrganizationSidebar } from "@/shared/components/layout/OrganizationSidebar";
import { DashboardTopBar } from "@/shared/components/layout/DashboardLayout";
import { Plus, Target, CheckCircle2, Heart, X, PackageOpen, Building2, Trash2 } from 'lucide-react';
import { Input } from '@/shared/ui/input';

export default function AssociationCampaignsPage() {
    const { myCampaigns, loading, fetchMyCampaigns, toggleCampaignStatus, createCampaign, deleteCampaign, fetchCampaignDonations } = useDonations();
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [requiredItems, setRequiredItems] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Active campaign donations modal
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
    const [donations, setDonations] = useState<any[]>([]);
    const { confirmDonation } = useDonations();

    useEffect(() => {
        fetchMyCampaigns();
    }, [fetchMyCampaigns]);

    useEffect(() => {
        if (selectedCampaignId) {
            fetchCampaignDonations(selectedCampaignId).then(setDonations);
        }
    }, [selectedCampaignId, fetchCampaignDonations]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await createCampaign({
                title,
                description,
                articleContent: articleContent || undefined,
                imageFile: imageFile || undefined,
                targetAmount: targetAmount ? Number(targetAmount) : undefined,
                requiredItems: requiredItems || undefined
            });
            setIsCreating(false);
            setTitle('');
            setDescription('');
            setArticleContent('');
            setImageFile(null);
            setTargetAmount('');
            setRequiredItems('');
        } catch (err) {
            alert('حدث خطأ أثناء إنشاء الحملة');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (window.confirm(`هل أنت متأكد من حذف حملة "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
            await deleteCampaign(id);
        }
    };

    return (
        <DashboardLayout>
            <OrganizationSidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50/50">
                <DashboardTopBar userType="organization" />
                <main className="py-8 lg:pb-8">
                    <div className="space-y-6 px-4 md:px-6 lg:px-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Target className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-2xl font-black text-slate-900">إدارة حملات التبرع</h1>
                        <p className="text-[11px] md:text-sm text-slate-500 mt-0.5">نشر حملات جديدة واستقبال تبرعات المجتمع.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="w-full sm:w-auto h-12 px-6 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                >
                    {isCreating ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isCreating ? 'إلغاء' : 'إنشاء حملة جديدة'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">تفاصيل الحملة الجديدة</h2>
                    <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">عنوان الحملة *</label>
                            <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: حملة كسوة الشتاء لعام 2026" className="bg-slate-50 border-transparent h-12" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">وصف الحملة المختصر *</label>
                            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="وصف قصير يظهر في بطاقة الحملة..." className="w-full rounded-xl bg-slate-50 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 p-3 text-sm font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">مقال تفصيلي عن الحملة (اختياري)</label>
                            <textarea value={articleContent} onChange={e => setArticleContent(e.target.value)} rows={6} placeholder="اكتب تفاصيل القصة والاحتياجات لزيادة تفاعل المتبرعين..." className="w-full rounded-xl bg-slate-50 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 p-3 text-sm font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">صورة غلاف الحملة (اختياري)</label>
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full rounded-xl bg-slate-50 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 p-2 text-sm font-medium" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">الهدف المالي (اختياري)</label>
                                <Input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="المبلغ بالجنية" className="bg-slate-50 border-transparent h-12" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">الأشياء العينية المطلوبة (اختياري)</label>
                                <Input value={requiredItems} onChange={e => setRequiredItems(e.target.value)} placeholder="مثال: 50 بطانية، 100 جاكيت" className="bg-slate-50 border-transparent h-12" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-bold">يمكنك تحديد هدف مالي، أو متطلبات عينية، أو كلاهما معاً.</p>
                        <button type="submit" disabled={isSubmitting} className="h-12 w-full bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors mt-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    جاري إنشاء الحملة...
                                </>
                            ) : (
                                'نشر الحملة'
                            )}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && myCampaigns.length === 0 ? (
                    <div className="col-span-full py-10 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                ) : myCampaigns.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-100 border-dashed">
                        <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">لا توجد حملات مسجلة</h3>
                        <p className="text-slate-500">قم بإنشاء أول حملة لجمع التبرعات من المجتمع.</p>
                    </div>
                ) : (
                    myCampaigns.map(campaign => {
                        const progress = campaign.targetAmount ? Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100)) : 0;
                        return (
                            <div key={campaign.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 text-xs font-bold rounded-full ${campaign.isActive ? 'bg-primary/10 text-primary border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                        {campaign.isActive ? 'نشطة' : 'متوقفة'}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => toggleCampaignStatus(campaign.id)}
                                            className="text-sm font-bold text-slate-400 hover:text-slate-900 underline"
                                        >
                                            {campaign.isActive ? 'إيقاف' : 'تفعيل'}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(campaign.id, campaign.title)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="حذف الحملة"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {campaign.startDate && (
                                    <p className="text-xs text-primary font-bold mb-1">{new Date(campaign.startDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                )}
                                <h3 className="text-xl font-black text-slate-900 mb-3">{campaign.title}</h3>
                                
                                {campaign.imageUrl && (
                                    <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={campaign.imageUrl.startsWith('http') ? campaign.imageUrl.replace(/^http:/i, 'https:') : `https://aounn.runasp.net/uploads/${campaign.imageUrl.replace(/^\/?(uploads\/)?/, '')}`} alt={campaign.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex-1">
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{campaign.description}</p>
                                </div>
                                
                                <div className="mt-auto space-y-4">
                                    {campaign.targetAmount ? (
                                        <div>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-primary">{campaign.currentAmount.toLocaleString()} ج.م تم جمعها</span>
                                                <span className="text-slate-500">{campaign.targetAmount.toLocaleString()} ج.م هدف</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-2 rounded-xl">
                                            مطلوب: {campaign.requiredItems}
                                        </div>
                                    )}
                                    
                                    <button 
                                        onClick={() => setSelectedCampaignId(campaign.id)}
                                        className="w-full h-10 border-2 border-slate-100 hover:border-slate-200 rounded-xl font-bold text-sm text-slate-700 transition-colors"
                                    >
                                        استعراض التبرعات
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Donations Modal */}
            {selectedCampaignId && (
                <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-900">تبرعات الحملة</h2>
                            <button onClick={() => setSelectedCampaignId(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {donations.length === 0 ? (
                                <p className="text-center text-slate-500 font-bold py-10">لم يتم استلام أي تبرعات لهذه الحملة بعد.</p>
                            ) : (
                                donations.map(d => (
                                    <div key={d.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                {d.amount ? <Heart className="w-4 h-4 text-primary" /> : <PackageOpen className="w-4 h-4 text-primary" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{d.donorName}</p>
                                                <p className="text-sm text-slate-500">
                                                    {d.amount ? `${d.amount.toLocaleString()} ج.م` : d.inKindItems}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            {d.status === 'Confirmed' ? (
                                                <span className="text-primary text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> تم التأكيد</span>
                                            ) : (
                                                <button 
                                                    onClick={async () => {
                                                        const ok = await confirmDonation(d.id);
                                                        if (ok) setDonations(prev => prev.map(old => old.id === d.id ? {...old, status: 'Confirmed'} : old));
                                                    }}
                                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                                                >
                                                    تأكيد الاستلام
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

