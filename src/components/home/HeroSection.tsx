"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Building2, MapPin, ShieldCheck, Award, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [counts, setCounts] = useState({ families: 0, partners: 0, governorates: 0 });

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setCounts({ families: 1200, partners: 85, governorates: 27 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // h-[calc(100vh-80px)] ensures the hero + header (80px) fits exactly in 100vh.
    <section className="relative overflow-hidden h-[calc(100dvh-80px)] flex items-center justify-center bg-background" dir="rtl">

      {/* Background Decorative Elements - Subtle & Premium */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>
      </div>

      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center z-10">

        {/* Badge - Compact */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border shadow-sm mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
          <span className="text-xs font-bold text-primary">منصة مصرية ذكية 🇪🇬</span>
        </div>

        {/* Headline - Scaled Down */}
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground mb-5 max-w-4xl mx-auto transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          منصة ذكية تربط
          <span className="block text-primary mt-2 relative">
            المحتاجين بالجهات الخيرية
            <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-2.5 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
            </svg>
          </span>
        </h1>

        {/* Subheadline - More Compact */}
        <p className={`text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          أول منصة ذكية تربط الأسر المستحقة بأكثر من ٨٥ جهة خيرية في ٢٧ محافظة لضمان وصول الدعم لمستحقيه بسرعة وشفافية.
        </p>

        {/* Buttons - Standard Size */}
        <div className={`flex flex-wrap justify-center gap-4 mb-10 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/register">
            <Button className="h-12 text-lg font-bold px-8 rounded-xl gap-2 text-white bg-[#EC4F10] hover:bg-[#C93D0A] shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300">
              سجل احتياجك
              <ArrowLeft className="w-5 h-5 animate-pulse" />
            </Button>
          </Link>
          <Link href="/register?type=organization">
            <Button
              variant="outline"
              size="lg"
              className="h-12 text-lg font-bold px-8 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all duration-300"
            >
              انضم كجمعية
            </Button>
          </Link>
        </div>

        {/* Stats Grid - Compact */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 pt-6 border-t border-border/50 max-w-2xl mx-auto transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center group">
            <span className="text-3xl font-black text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
              <Counter value={counts.families} suffix="+" />
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-sm">
              <Users className="w-4 h-4" />
              <span>أسرة مستفيدة</span>
            </div>
          </div>
          <div className="flex flex-col items-center group">
            <span className="text-3xl font-black text-secondary mb-1 group-hover:scale-110 transition-transform duration-300">
              <Counter value={counts.partners} suffix="+" />
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-sm">
              <Building2 className="w-4 h-4" />
              <span>جهة شريكة</span>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col items-center group">
            <span className="text-3xl font-black text-cta mb-1 group-hover:scale-110 transition-transform duration-300">
              <Counter value={counts.governorates} suffix="" />
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-sm">
              <MapPin className="w-4 h-4" />
              <span>محافظة</span>
            </div>
          </div>
        </div>

        <div className={`flex flex-wrap justify-center gap-4 mt-8 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>إشراف وزارة التضامن</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>مرخص حكومياً 100%</span>
          </div>
        </div>

      </div>
    </section>
  );

}

// Counter Component - Smooth Animation
function Counter({ value, suffix }: { value: number, suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2500; // Increased duration for smoother effect
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString('ar-EG')}{suffix}</span>;
}
