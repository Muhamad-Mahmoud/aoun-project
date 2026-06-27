"use client";

import React, { useEffect } from 'react';
import { useDonations } from '@/features/donations';
import { Heart, Clock, CheckCircle2, PackageOpen, Trophy, Sparkles, TrendingUp, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export default function DonorDashboardPage() {
    const { loading, myDonations, fetchMyDonations } = useDonations();

    useEffect(() => {
        fetchMyDonations();
    }, [fetchMyDonations]);

    const totalMoney = myDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const inKindCount = myDonations.filter(d => d.inKindItems).length;
    const completedDonations = myDonations.filter(d => d.status === 'Confirmed').length;

    // Derived Impact Mock (Since backend doesn't provide direct family impact yet)
    const familiesHelped = Math.floor((totalMoney / 500) + inKindCount);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pt-6 lg:pt-8 px-4 sm:px-6 lg:px-10 pb-20 animate-fade-in-up" dir="rtl">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        مرحباً بعطائك 
                        <Sparkles className="w-8 h-8 text-primary" />
                    </h1>
                    <p className="text-muted-foreground font-medium mt-2 max-w-2xl">هنا يمكنك متابعة أثر تبرعاتك وحملات الخير التي شاركت في نجاحها.</p>
                </div>
                <Button asChild size="lg" className="h-12 px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform bg-primary">
                    <Link href="/explore" className="flex items-center gap-2 font-bold text-base">
                        تصفح فرص التبرع <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
            </div>

            {/* Impact Tracking Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Impact Card */}
                <div className="md:col-span-1 bg-gradient-to-br from-emerald-600 to-emerald-900 text-white p-8 rounded-3xl shadow-sm border border-emerald-500 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-card/10 rounded-full blur-3xl group-hover:bg-card/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-card/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                            <Heart className="w-7 h-7 text-rose-300" fill="currentColor" />
                        </div>
                        <p className="text-emerald-200 text-sm font-bold mb-2">أثرك المجتمعي المتوقع</p>
                        <h3 className="text-5xl font-black mb-2">{familiesHelped} <span className="text-xl font-bold text-emerald-200">أسرة</span></h3>
                        <p className="text-sm font-medium text-emerald-100">تمت مساعدتها بفضل مساهماتك النقدية والعينية.</p>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center bg-card hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary\/20">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">إجمالي التبرعات</span>
                        </div>
                        <h3 className="text-4xl font-black text-foreground">{totalMoney.toLocaleString()} <span className="text-lg font-bold text-muted-foreground">ج.م</span></h3>
                    </Card>

                    <Card className="p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center bg-card hover:border-amber-200 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-amber-600 flex items-center justify-center border border-primary/20">
                                <PackageOpen className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-amber-600 bg-primary/10 px-3 py-1 rounded-full">المساهمات العينية</span>
                        </div>
                        <h3 className="text-4xl font-black text-foreground">{inKindCount} <span className="text-lg font-bold text-muted-foreground">مرة</span></h3>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Donation History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-6 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-bold text-foreground">سجل التبرعات</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20 bg-card rounded-3xl border border-border">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-muted-foreground font-medium">جاري تحميل سجل العطاء...</span>
                            </div>
                        </div>
                    ) : myDonations.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">سجلك ينتظر أول بصمة خير</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8">ابدأ الآن بدعم الأسر المتعففة وشارك في صنع التغيير الإيجابي في مجتمعك.</p>
                            <Button asChild size="lg" className="shadow-sm">
                                <Link href="/explore">تصفح الحملات الحالية</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myDonations.map(donation => (
                                <div key={donation.id} className="group bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${donation.amount ? 'bg-primary/10 border-primary\/20 text-primary' : 'bg-primary/10 border-primary/20 text-amber-600'}`}>
                                            {donation.amount ? <span className="font-black text-xl">ج.م</span> : <PackageOpen className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-lg mb-1">{donation.campaignTitle}</h4>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {donation.amount ? `مساهمة نقدية: ${donation.amount.toLocaleString()} ج.م` : `مساهمة عينية: ${donation.inKindItems}`}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                                        {donation.status === 'Confirmed' ? (
                                            <span className="flex items-center gap-1.5 text-primary bg-primary/10 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" /> تبرع مكتمل
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-muted-foreground bg-slate-100 border border-border px-3 py-1.5 rounded-lg text-xs font-bold">
                                                <Clock className="w-4 h-4" /> قيد المراجعة والتأكيد
                                            </span>
                                        )}
                                        <p className="text-xs text-muted-foreground font-bold">
                                            {new Date(donation.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Gamification & Badges */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                        <h2 className="text-xl font-bold text-foreground">أوسمة العطاء</h2>
                    </div>
                    
                    <Card className="p-6 rounded-3xl border border-border shadow-sm bg-card overflow-hidden relative">
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amber-100/50 to-transparent pointer-events-none"></div>
                        
                        <div className="relative z-10 text-center mb-6">
                            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-3">
                                <Trophy className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">المستوى الحالي: مبادر</h3>
                            <p className="text-sm text-muted-foreground mt-1">أكملت {completedDonations} تبرعات ناجحة</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-2xl border border-border flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${completedDonations >= 1 ? 'bg-amber-100 text-primary' : 'bg-slate-200 text-muted-foreground'}`}>
                                    <Star className="w-6 h-6" fill={completedDonations >= 1 ? "currentColor" : "none"} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${completedDonations >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>بذرة الخير</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">أول تبرع لك على المنصة</p>
                                </div>
                            </div>
                            
                            <div className="bg-muted p-4 rounded-2xl border border-border flex items-center gap-4 opacity-70">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${completedDonations >= 5 ? 'bg-amber-100 text-primary' : 'bg-slate-200 text-muted-foreground'}`}>
                                    <Heart className="w-6 h-6" fill={completedDonations >= 5 ? "currentColor" : "none"} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${completedDonations >= 5 ? 'text-foreground' : 'text-muted-foreground'}`}>القلب السخي</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">إتمام 5 مساهمات ناجحة</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 rounded-3xl border border-primary/20 bg-primary/5 shadow-sm text-center">
                        <h3 className="text-base font-bold text-foreground mb-2">استكشف الاحتياجات العاجلة</h3>
                        <p className="text-sm text-muted-foreground mb-4">هناك أسر بانتظار دعمك اليوم. اكتشف أحدث الحملات المضافة.</p>
                        <Button asChild variant="outline" className="w-full bg-card border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors">
                            <Link href="/explore">تصفح الحملات العاجلة</Link>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
