"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { donationsApi } from '@/features/donations/api/donationsApi';
import { CampaignDto } from '@/features/donations/api/searchApi';
import { Building, Target, Wallet, ArrowRight, Share2, Heart, ShieldCheck, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { DonationModal } from '@/features/donations/components/DonationModal';

export default function CampaignDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<CampaignDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                if (params.id) {
                    const data = await donationsApi.getCampaignById(Number(params.id));
                    setCampaign(data);
                }
            } catch (err) {
                console.error("Failed to fetch campaign details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [params.id]);

    const calculateProgress = (current: number, target: number | null) => {
        if (!target) return 0;
        return Math.min(100, Math.round((current / target) * 100));
    };

    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center py-20 text-primary" dir="rtl">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="font-bold text-xl text-slate-600">جاري تحميل تفاصيل الحملة...</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center py-20 text-center" dir="rtl">
                <Heart className="w-24 h-24 text-slate-300 mb-6" />
                <h2 className="text-3xl font-black text-slate-900 mb-4">الحملة غير موجودة</h2>
                <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">عذراً، لم نتمكن من العثور على الحملة التي تبحث عنها. قد تكون انتهت أو تم إزالتها.</p>
                <button onClick={() => router.push('/explore')} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                    العودة لاستكشاف الحملات
                </button>
            </div>
        );
    }

    const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount);

    return (
        <div className="bg-slate-50 min-h-screen pb-24 font-sans" dir="rtl">
            {/* Immersive Premium Hero Banner */}
            <div className="w-full h-[60vh] min-h-[450px] bg-slate-950 relative flex flex-col overflow-hidden">
                {campaign.imageUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`http://aounn.runasp.net/uploads/${campaign.imageUrl.replace(/^\/?(uploads\/)?/, '')}`} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 opacity-50">
                        <Heart className="w-32 h-32 text-slate-700" />
                    </div>
                )}
                
                {/* Advanced Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/30"></div>
                
                {/* Top Navigation inside Hero */}
                <div className="relative z-10 container max-w-7xl mx-auto px-4 pt-8">
                    <button onClick={() => router.push('/explore')} className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all hover:-translate-x-1 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-md w-fit border border-white/10">
                        <ArrowRight className="w-5 h-5" />
                        العودة للحملات
                    </button>
                </div>

                {/* Hero Content - Centered for WOW effect */}
                <div className="relative z-10 mt-auto container max-w-5xl mx-auto px-4 pb-24 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
                        <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-md border ${campaign.isActive ? 'bg-emerald-500/20 text-emerald-50 border-emerald-500/30' : 'bg-rose-500/20 text-rose-50 border-rose-500/30'}`}>
                            {campaign.isActive ? <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> : <Target className="w-4 h-4" />}
                            {campaign.isActive ? 'حملة نشطة' : 'حملة متوقفة'}
                        </span>
                        <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10">
                            <Building className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold">{campaign.associationName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/90 text-sm font-bold bg-blue-500/20 border border-blue-500/30 px-4 py-2 rounded-2xl backdrop-blur-md">
                            <ShieldCheck className="w-4 h-4 text-blue-300" />
                            جمعية موثقة
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8 drop-shadow-2xl max-w-4xl mx-auto">
                        {campaign.title}
                    </h1>
                    {campaign.startDate && (
                        <div className="flex items-center justify-center gap-2 bg-slate-900/50 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/10 text-white/90 font-bold text-sm w-fit">
                            <Calendar className="w-4 h-4 text-primary-300" />
                            تاريخ الإطلاق: {new Date(campaign.startDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    
                    {/* Right Column: Article & Story (8 cols) */}
                    <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/40 border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Heart className="w-6 h-6" />
                                </span>
                                القصة والاحتياج
                            </h2>
                            
                            <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-loose font-medium whitespace-pre-wrap">
                                {campaign.articleContent || campaign.description}
                            </div>
                        </div>

                        {/* Extra Context Box */}
                        <div className="bg-emerald-50/50 rounded-3xl p-6 md:p-8 border border-emerald-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-start">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-emerald-100">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-slate-900 mb-2">تبرعك بأمان تام</h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                    يتم الإشراف المباشر على هذه الحملة بواسطة جمعية <span className="font-bold text-slate-800">{campaign.associationName}</span> المعتمدة من وزارة التضامن. منصة عون تضمن وصول المساعدات لمستحقيها بكل شفافية وموثوقية.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Donation Sticky Widget (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 sticky top-32">
                            <h3 className="font-black text-slate-900 text-xl mb-8 flex items-center gap-3">
                                موقف الحملة
                            </h3>
                            
                            {campaign.targetAmount ? (
                                <div className="space-y-6 mb-8">
                                    <div>
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-sm text-slate-500 font-bold mb-1">المبلغ المجمع</p>
                                                <p className="text-4xl font-black text-primary tracking-tight flex items-baseline gap-1">
                                                    {campaign.currentAmount.toLocaleString()} <span className="text-lg text-primary/70 font-bold">ج.م</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-3 text-sm font-bold">
                                            <span className="text-primary">{progress}% مكتمل</span>
                                            <span className="text-slate-400">الهدف: {campaign.targetAmount.toLocaleString()} ج.م</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3 text-amber-800 bg-amber-50 p-5 rounded-2xl border border-amber-100 mb-8">
                                    <Target className="w-6 h-6 shrink-0 text-amber-500 mt-1" />
                                    <div>
                                        <p className="font-black mb-1">الاحتياجات العينية:</p>
                                        <p className="font-bold text-sm leading-relaxed text-amber-700">{campaign.requiredItems}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {campaign.isActive ? (
                                    <DonationModal campaign={campaign}>
                                        <button className="w-full h-14 bg-slate-900 hover:bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-0.5">
                                            <Wallet className="w-5 h-5" />
                                            شارك وتبرع الآن
                                        </button>
                                    </DonationModal>
                                ) : (
                                    <div className="w-full h-14 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 border-slate-200 border-dashed">
                                        عذراً، الحملة غير نشطة حالياً
                                    </div>
                                )}

                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }} 
                                    className={`w-full h-12 border-2 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        copied 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                            : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Share2 className="w-4 h-4 text-slate-400" />}
                                    {copied ? 'تم نسخ الرابط بنجاح!' : 'مشاركة رابط الحملة'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
