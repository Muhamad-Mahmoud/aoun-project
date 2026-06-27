const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/dashboard/family/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file is corrupted starting from line 160 (which is the finally block).
// Let's find the `finally {` block to truncate the file safely.
const finallyIndex = content.indexOf('            } finally {');
if (finallyIndex !== -1) {
    // Truncate at `} finally {` and rebuild everything after it.
    const goodPart = content.substring(0, finallyIndex);
    
    const newEnding = `            } finally {
                setLoadingStats(false);
                setLoadingRequests(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout>
            <FamilySidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-slate-50/50" dir="rtl">
                <DashboardTopBar userType="family" />
                <main className="pt-6 pb-20 lg:pt-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full animate-fade-in-up">
                    
                    {/* Welcome Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">نحن هنا لدعمك، {user?.name?.split(' ')[0] || 'عائلتنا'}</h1>
                            <p className="text-slate-500 font-medium mt-2">نتابع طلباتك ونعمل بجد لتوفير الدعم الذي تحتاجه في أسرع وقت.</p>
                        </div>
                        <Button asChild size="lg" className="h-12 px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <Link href="/dashboard/family/requests/new" className="flex items-center gap-2 font-bold text-base">
                                <PlusCircle className="w-5 h-5" /> إنشاء طلب جديد
                            </Link>
                        </Button>
                    </div>

                    {/* Top KPI Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {loadingStats ? (
                            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
                        ) : (
                            <>
                                <StatsCard stat={{
                                    label: "إجمالي المساعدات (ج.م)",
                                    value: stats?.totalAidReceived?.toLocaleString() || "0",
                                    change: "قيمة الدعم",
                                    trend: "neutral",
                                    icon: Coins,
                                    iconBg: "bg-primary/10",
                                    iconColor: "text-primary"
                                }} />
                                <StatsCard stat={{
                                    label: "إجمالي الطلبات",
                                    value: stats?.totalRequests?.toString() || "0",
                                    change: "حجم النشاط",
                                    trend: "neutral",
                                    icon: FileText,
                                    iconBg: "bg-primary/10",
                                    iconColor: "text-primary"
                                }} />
                                <StatsCard stat={{
                                    label: "طلبات قيد المراجعة",
                                    value: stats?.pendingRequests?.toString() || "0",
                                    change: "نعمل عليها",
                                    trend: "neutral",
                                    icon: Clock,
                                    iconBg: "bg-primary/10",
                                    iconColor: "text-primary"
                                }} />
                                <StatsCard stat={{
                                    label: "مساعدات مكتملة",
                                    value: stats?.completedRequests?.toString() || "0",
                                    change: "تم التنفيذ",
                                    trend: "up",
                                    icon: CheckCircle,
                                    iconBg: "bg-primary/10",
                                    iconColor: "text-primary"
                                }} />
                            </>
                        )}
                    </div>

                    {/* Main Workspace Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Primary Column (Active Request & History) */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Active Request Focus */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-6 bg-primary rounded-full" />
                                    <h2 className="text-xl font-bold text-slate-900">حالة طلبك الحالي</h2>
                                </div>
                                
                                {loadingRequests ? (
                                    <Skeleton className="h-48 w-full rounded-2xl" />
                                ) : activeRequest ? (
                                    <ActiveRequestCard
                                        request={activeRequest}
                                        primaryAction={{ label: "التفاصيل", icon: ArrowLeft, href: \`/dashboard/family/requests/\${activeRequest.id.replace('REQ-', '')}\` }}
                                        steps={getStepsForStatus(resolveStatus(activeRequest.status))}
                                    />
                                ) : (
                                    <Card className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 bg-white/50 rounded-2xl shadow-sm">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                            <Shield className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">لا يوجد طلبات قيد التنفيذ حالياً</h3>
                                        <p className="text-slate-500 max-w-sm mb-6">نحن هنا لمساعدتك. إذا كنت بحاجة لدعم، يمكنك تقديم طلب جديد وسيتم مراجعته بسرية تامة.</p>
                                        <Button asChild className="hover:scale-105 transition-transform">
                                            <Link href="/dashboard/family/requests/new">
                                                تقديم طلب جديد
                                            </Link>
                                        </Button>
                                    </Card>
                                )}
                            </section>

                            {/* Request History */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-6 bg-slate-300 rounded-full" />
                                    <h2 className="text-xl font-bold text-slate-900">سجل الطلبات السابقة</h2>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <RequestHistoryTable
                                        requests={recentRequests}
                                        searchTerm=""
                                        onSearchChange={() => { }}
                                        categoryIcons={CATEGORY_ICONS}
                                        statusConfig={STATUS_CONFIG_MAP}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Secondary Column (Widgets) */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Profile Completion Widget */}
                            <Card className="p-6 border-slate-200 shadow-sm rounded-2xl bg-white flex flex-col relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                                <h3 className="text-sm font-bold text-slate-500 mb-4">جودة الملف الشخصي</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            <path className="text-primary" strokeDasharray="75, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        </svg>
                                        <span className="absolute text-sm font-bold text-slate-900">75%</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 leading-tight mb-1">بياناتك شبه مكتملة</p>
                                        <p className="text-xs text-slate-500">إكمال ملفك يساعد الجمعيات على اتخاذ قرار أسرع بنسبة 40%.</p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5 transition-colors">
                                    <Link href="/dashboard/family/profile">إكمال البيانات الآن</Link>
                                </Button>
                            </Card>

                            {/* Need Help Box */}
                            <Card className="p-6 border-slate-200 shadow-sm rounded-2xl bg-slate-50 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                                    <Heart className="w-6 h-6 text-rose-500" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-2">هل تحتاج إلى استشارة؟</h3>
                                <p className="text-sm text-slate-500 mb-4">نحن هنا لدعمك والإجابة على أي استفسارات تتعلق بالتقديم.</p>
                                <Button variant="link" className="text-primary font-bold">تواصل مع الدعم</Button>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
`;
    
    fs.writeFileSync(filePath, goodPart + newEnding, 'utf8');
    console.log("Successfully rebuilt family/page.tsx");
} else {
    console.log("Could not find finally block to replace");
}
