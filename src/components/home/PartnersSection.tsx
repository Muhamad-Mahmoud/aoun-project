"use client";

import { Heart, Stethoscope, UtensilsCrossed, Users, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";

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
    <section id="partners" className="py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-5 py-2 rounded-full bg-background text-primary text-sm font-bold mb-5 border-2 border-primary/10 shadow-sm">
            شركاؤنا
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            شركاؤنا في{" "}
            <span className="text-secondary relative inline-block">
              خدمة مصر
              <svg className="absolute w-full h-3 -bottom-2 left-0 text-accent opacity-25" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-primary">٨٥+ جهة خيرية وحكومية</span> نفخر بالتعاون معهم لخدمة المجتمع
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl border-2 border-border p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                </div>

                {/* Name */}
                <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight mb-2">
                  {partner.name}
                </p>

                {/* Cases */}
                <p className="text-sm font-semibold text-secondary mb-2">
                  {partner.cases}
                </p>

                {/* Type Badge */}
                <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {partner.type}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-primary mb-2">٨٥+</div>
            <div className="text-sm text-muted-foreground">جهة شريكة</div>
          </div>
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-secondary mb-2">٢٧</div>
            <div className="text-sm text-muted-foreground">محافظة</div>
          </div>
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-accent mb-2">١,٢٠٠+</div>
            <div className="text-sm text-muted-foreground">أسرة مستفيدة</div>
          </div>
          <div className="text-center p-6 bg-card rounded-2xl border-2 border-border shadow-md">
            <div className="text-4xl font-bold text-primary mb-2">٩٨٪</div>
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
          <Link href="/contact">
            <Button className="h-14 px-10 text-lg font-bold bg-gradient-to-l from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-xl hover:shadow-2xl transition-all duration-300 gap-2 rounded-2xl hover:-translate-y-1">
              سجل جمعيتك الآن
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
