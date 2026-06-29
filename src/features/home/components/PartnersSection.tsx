import { Heart, Stethoscope, UtensilsCrossed, Users, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/shared/ui/button";

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
    <section id="partners" className="py-24 md:py-32 bg-warm-green/5 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]" dir="rtl">
        {/* Header */}
        <div className="!text-center mb-16 animate-fade-in">
          <div className="section-pill">
            شركاؤنا
          </div>
          <h2 className="section-title">
            شركاؤنا في{" "}
            <span className="title-highlight">خدمة مصر</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold text-warm-green">٨٥+ جهة خيرية وحكومية</span> نفخر بالتعاون معهم لخدمة المجتمع
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-10">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className="card-unified flex flex-col items-center justify-center !text-center group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Fully Saturated Icon */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-warm-green flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md">
                  <Icon className="w-8 h-8 lg:w-9 lg:h-9 text-white" />
                </div>

                {/* Name */}
                <p className="text-sm lg:text-base font-bold text-foreground leading-tight mb-2">
                  {partner.name}
                </p>

                {/* Stats */}
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-semibold">
                  <Heart className="w-3 h-3 text-golden-orange" />
                  <span>{partner.cases}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA for NGOs */}
        <div className="!text-center mt-16 p-10 bg-white rounded-[2rem] border border-border shadow-md max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-black mb-4 text-foreground">
            هل أنت جمعية خيرية مسجلة؟
          </h3>
          <p className="text-muted-foreground mb-8 text-lg font-medium">
            انضم لشبكة عون واستقبل طلبات مساعدة موثقة من محافظتك
          </p>
          <Link href="/register?type=organization">
            <Button className="h-14 px-10 text-lg font-bold bg-warm-green hover:bg-warm-green-dark text-white shadow-lg transition-all duration-300 gap-2 rounded-xl hover:scale-[1.02] hover:-translate-y-1">
              سجل جمعيتك الآن
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
