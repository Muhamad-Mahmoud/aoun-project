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
                <div className="bg-primary/5 border-b border-primary/10 py-16">
                    <div className="container max-w-5xl mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                اكتشف <span className="text-primary">الجمعيات</span> وادعم <span className="text-primary">حملات الخير</span>
                            </h1>
                            <p className="text-lg text-slate-600">
                                محرك بحث منصة عون يساعدك في الوصول للجمعيات الموثوقة أو المشاركة في حملات التبرع العاجلة لدعم الأسر المتعففة.
                            </p>
                        </div>

                        <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
                            <div className="flex-1 relative">
                                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input 
                                    placeholder={activeTab === 'campaigns' ? "ابحث عن حملة تبرع، بطانيات، علاج..." : "ابحث عن جمعية بالاسم..."}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="ps-12 h-14 bg-transparent border-none text-lg focus-visible:ring-0"
                                />
                            </div>
                            <div className="flex gap-2 p-2 bg-slate-50 rounded-xl">
                                <button 
                                    onClick={() => setActiveTab('campaigns')}
                                    className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'campaigns' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    حملات التبرع
                                </button>
                                <button 
                                    onClick={() => setActiveTab('associations')}
                                    className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'associations' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
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
                                                    <img src={`http://aounn.runasp.net/uploads/${campaign.imageUrl.replace(/^\/?(uploads\/)?/, '')}`} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                                                    <Heart className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                                                </>
                                            )}
                                            <div className="absolute bottom-4 start-4 z-20">
                                                <span className="bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    حملة نشطة
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-bold">
                                                <Building className="w-4 h-4 text-primary" />
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
                                                            <span className="text-primary">{campaign.currentAmount.toLocaleString()} ج.م</span>
                                                            <span className="text-slate-500">الهدف: {campaign.targetAmount.toLocaleString()} ج.م</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
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
                                                        <button className="w-full h-12 bg-slate-900 hover:bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
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
                                                <img src={assoc.logoUrl} alt={assoc.name} className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                <Building className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-slate-900 mb-1">{assoc.name}</h3>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                                <MapPin className="w-4 h-4 text-primary/70" />
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
                                            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
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
