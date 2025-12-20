"use client";

import { Heart, Stethoscope, UtensilsCrossed, Users, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/shadcn/button";
import { partnerTypeColors } from "@/lib/colors";

const partners = [
  { name: "جمعية رسالة", icon: Heart, cases: "٣٥٠ حالة", type: "عامة" },
  { name: "مستشفى ٥٧٣٥٧", icon: Stethoscope, cases: "١٢٠ عملية", type: "صحية" },
  { name: "بنك الطعام المصري", icon: UtensilsCrossed, cases: "٤٥٠ أسرة", type: "غذائية" },
  { name: "مؤسسة مصر الخير", icon: Heart, cases: "٢٨٠ حالة", type: "عامة" },
  { name: "جمعية الأورمان", icon: Users, cases: "٢١٠ أسرة", type: "اجتماعية" },
  { name: "مؤسسة صناع الحياة", icon: Heart, cases: "١٩٥ حالة", type: "تنموية" },
];

export function PartnersSection() {
  return (
    <section id="partners" className="py-20 md:py-28 bg-gradient-to-b from-emerald-500/5 to-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-5 py-2 rounded-full bg-background text-emerald-600 text-sm font-bold mb-5 border-2 border-emerald-500/20 shadow-sm">
            شركاؤنا
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            شركاؤنا في{" "}
            <span className="text-emerald-600 relative inline-block">
              خدمة مصر
              <svg className="absolute w-full h-3 -bottom-2 left-0 text-cyan-500 opacity-25" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-emerald-600">٨٥+ جهة خيرية وحكومية</span> نفخر بالتعاون معهم لخدمة المجتمع
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            const colorScheme = partnerTypeColors[partner.type];
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl border-2 border-border p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorScheme.lightGradient} ${colorScheme.hoverLightGradient} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 ${colorScheme.text} group-hover:${colorScheme.textDark} transition-colors duration-300`} />
                </div>

                {/* Name */}
                <p className={`text-base font-bold text-foreground group-hover:${colorScheme.textDark} transition-colors duration-300 leading-tight mb-2`}>
                  {partner.name}
                </p>

                {/* Stats */}
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>{partner.cases}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-emerald-600 mb-2">٨٥+</div>
            <div className="text-sm text-muted-foreground">جهة شريكة</div>
          </div>
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-cyan-600 mb-2">٢٧</div>
            <div className="text-sm text-muted-foreground">محافظة</div>
          </div>
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-orange-500 mb-2">١,٢٠٠+</div>
            <div className="text-sm text-muted-foreground">أسرة مستفيدة</div>
          </div>
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-emerald-600 mb-2">٩٨٪</div>
            <div className="text-sm text-muted-foreground">نسبة نجاح</div>
          </div>
        </div>

        {/* CTA for NGOs */}
        <div className="text-center mt-16 p-10 bg-card rounded-3xl border-2 border-border shadow-xl max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            هل أنت جمعية خيرية مسجلة؟
          </h3>
          <p className="text-muted-foreground mb-6 text-lg">
            انضم لشبكة عون واستقبل طلبات مساعدة موثقة من محافظتك
          </p>
          <Link href="/register?type=organization">
            <Button className="h-14 px-10 text-lg font-bold bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 gap-2 rounded-2xl hover:-translate-y-1">
              سجل جمعيتك الآن
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section >
  );
}
