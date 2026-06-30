"use client";

import React, { useState, useEffect } from 'react';
import { useSearch } from '@/features/donations';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { Search, MapPin, Activity, Building, Heart, ArrowLeft, Target, Wallet, FileText } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { DonationModal } from '@/features/donations/components/DonationModal';
import Link from 'next/link';

export default function ExplorePage() {
    const { loading, associations, campaigns, searchAssociations, searchCampaigns } = useSearch();
    const [activeTab, setActiveTab] = useState<'associations' | 'campaigns'>('campaigns');
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (activeTab === 'associations') {
            searchAssociations(query);
        } else {
            searchCampaigns(query);
        }
    }, [activeTab, query, searchAssociations, searchCampaigns]);

    const calculateProgress = (current: number, target: number | null) => {
        if (!target) return 0;
        return Math.min(100, Math.round((current / target) * 100));
    };

    return (
        <div className="bg-slate-50 flex flex-col" dir="rtl">
            
            <div className="flex-1">
                {/* Hero Search Section */}
                <div className="relative pt-32 pb-20 overflow-hidden bg-[#0F4C4A] -mt-[76px]">
                    {/* Background like landing page */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C4A] via-[#0F4C4A] to-[#0a3829] z-10 opacity-90" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(18,161,123,0.3)_0%,_transparent_50%)] z-20 pointer-events-none" />
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
                    </div>

                    <div className="container max-w-5xl mx-auto px-4 relative z-30 mt-8">
                        {/* Heading */}
                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                                اكتشف <span className="text-[#f58a1f]">الجمعيات</span> وادعم <span className="text-[#f58a1f]">حملات الخير</span>
                            </h1>
                        </div>
                       
                        {/* Search Box - Premium Glassmorphism */}
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-[2rem] shadow-2xl border border-white/20 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
                            <div className="flex-1 relative">
                                <Search className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                                <Input 
                                    placeholder={activeTab === 'campaigns' ? "ابحث عن حملة تبرع، بطانيات، علاج..." : "ابحث عن جمعية بالاسم..."}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="ps-14 h-14 bg-white/5 border-transparent text-lg focus-visible:ring-2 focus-visible:ring-[#12a17b] text-white placeholder:text-white/50 rounded-2xl transition-all"
                                />
                            </div>
                            <div className="flex gap-2 p-1.5 bg-black/20 rounded-2xl">
                                <button 
                                    onClick={() => setActiveTab('campaigns')}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'campaigns' ? 'bg-[#12a17b] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    حملات التبرع
                                </button>
                                <button 
                                    onClick={() => setActiveTab('associations')}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'associations' ? 'bg-[#12a17b] text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    دليل الجمعيات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container max-w-7xl mx-auto px-4 py-16">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-primary">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-bold">جاري البحث...</p>
                        </div>
                    ) : activeTab === 'campaigns' ? (
                        // Campaigns Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.length > 0 ? campaigns.map(campaign => {
                                const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount);
                                return (
                                    <div key={campaign.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                            {campaign.imageUrl ? (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={campaign.imageUrl.startsWith('http') ? campaign.imageUrl : `http://aounn.runasp.net/uploads/${campaign.imageUrl.replace(/^\/?(uploads\/)?/, '')}`} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                                                    <Heart className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                                                </>
                                            )}
                                            <div className="absolute bottom-4 start-4 z-20">
                                                <span className="bg-[#12a17b] text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    حملة نشطة
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-bold">
                                                <Building className="w-4 h-4 text-[#12a17b]" />
                                                {campaign.associationName}
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2">{campaign.title}</h3>
                                            <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                                                {campaign.description}
                                            </p>
                                            
                                            <div className="mt-auto space-y-4">
                                                {campaign.targetAmount ? (
                                                    <div>
                                                        <div className="flex justify-between text-sm font-bold mb-2">
                                                            <span className="text-[#12a17b]">{campaign.currentAmount.toLocaleString()} ج.م</span>
                                                            <span className="text-slate-500">الهدف: {campaign.targetAmount.toLocaleString()} ج.م</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-[#12a17b] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-2xl border border-amber-100">
                                                        <Target className="w-5 h-5" />
                                                        <span className="text-sm font-bold">تبرع عيني: {campaign.requiredItems}</span>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                    <Link href={`/explore/${campaign.id}`} className="w-full h-12 border-2 border-slate-100 hover:border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                                        <FileText className="w-5 h-5" />
                                                        التفاصيل
                                                    </Link>
                                                    <DonationModal campaign={campaign}>
                                                        <button className="w-full h-12 bg-[#0F4C4A] hover:bg-[#12a17b] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                                                            <Wallet className="w-5 h-5" />
                                                            تبرع الآن
                                                        </button>
                                                    </DonationModal>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد حملات</h3>
                                    <p className="text-slate-500">جرب البحث بكلمات مختلفة أو عد لاحقاً.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Associations Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {associations.length > 0 ? associations.map(assoc => (
                                <div key={assoc.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-50 group-hover:border-primary/20 transition-colors">
                                            {assoc.logoUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={assoc.logoUrl.startsWith('http') ? assoc.logoUrl : `http://aounn.runasp.net/uploads/${assoc.logoUrl.replace(/^\/?(uploads\/)?/, '')}`} alt={assoc.name} className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                <Building className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-slate-900 mb-1">{assoc.name}</h3>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                <MapPin className="w-4 h-4 text-[#12a17b]/80" />
                                                {assoc.locations.join('، ') || 'المكان غير محدد'}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                                        {assoc.description || 'لا يوجد وصف متاح لهذه الجمعية في الوقت الحالي.'}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {assoc.services.map((service, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                                                    {service}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                <Activity className="w-4 h-4 text-emerald-500" />
                                                <span className="text-slate-700">{assoc.activeCampaignsCount} حملات نشطة</span>
                                            </div>
                                            <button className="text-[#0F4C4A] hover:text-[#12a17b] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                                عرض التفاصيل
                                                <ArrowLeft className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Building className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">لا توجد جمعيات</h3>
                                    <p className="text-slate-500">لم نتمكن من العثور على جمعيات مطابقة لبحثك.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
}
