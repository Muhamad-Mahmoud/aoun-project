"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { ArrowLeft, Users, Building2, MapPin, ShieldCheck, Award, Clock, Heart, CheckCircle } from "lucide-react";
import Link from "next/link";
import { colors } from "@/lib/colors";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-[calc(100dvh-72px)] flex flex-col items-center justify-center py-20 lg:py-24"
      dir="rtl"
      style={{
        background: 'linear-gradient(to bottom, hsl(var(--warm-green-pale)) 0%, hsl(var(--warm-white)) 100%)'
      }}
    >

      {/* Background Decorative Elements - Soft & Minimal */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-warm-green/3 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-golden-orange/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl z-10">

        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-center flex-col-reverse">

          {/* Content Column - 60% */}
          <div className="text-right space-y-6 lg:space-y-8 order-2 lg:order-1">

            {/* Main Headline - Enhanced Size & Typography */}
            <h1 className={`text-3xl sm:text-4px lg:text-[56px] font-bold leading-[1.3] lg:leading-[1.2] text-foreground transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              نُوصّل <span className="text-warm-green">المساعدة</span>
              <br className="hidden sm:block" />
              إلى كل أسرة بأمان وسرعة
            </h1>

            {/* Subheadline - Concise & Direct */}
            <p className={`text-base sm:text-lg lg:text-[20px] text-muted-foreground leading-relaxed max-w-2xl transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              منصة رقمية تربط الأسر المحتاجة بالجمعيات الموثوقة في دقائق، لتجربة إنسانية كريمة
            </p>

            {/* CTA Buttons - Enhanced Size & Design */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Primary CTA - Larger & More Prominent */}
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 lg:h-16 text-base lg:text-[17px] font-semibold px-8 rounded-xl gap-3 text-white bg-gradient-to-l from-warm-green via-teal-500 to-sky-blue hover:from-warm-green-dark hover:via-teal-600 hover:to-sky-blue-dark shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_30px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-pulse-subtle">
                  اطلب مساعدة الآن
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              {/* Secondary CTA - Enhanced Design */}
              <Link href="/register?type=organization" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-14 text-base lg:text-[17px] font-semibold px-7 rounded-xl border-2 border-warm-green/40 hover:border-warm-green hover:bg-warm-green hover:text-white text-warm-green transition-all duration-300 hover:scale-[1.02] gap-2.5"
                >
                  <Building2 className="w-5 h-5" />
                  انضم كجمعية
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Enhanced Design */}
            <div className={`flex flex-wrap gap-2 sm:gap-3 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

              {/* Government Badge - Enhanced */}
              <div className={`group flex items-center gap-2 bg-white/80 backdrop-blur-sm border ${colors.emerald.borderLight} px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-[13px] lg:text-[14px] font-medium ${colors.emerald.textDark} shadow-sm hover:-translate-y-0.5 transition-all duration-250`}>
                <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>معتمد من وزارة التضامن</span>
              </div>

              {/* Rating - Enhanced */}
              <div className={`group flex items-center gap-2 bg-white/80 backdrop-blur-sm border ${colors.orange.borderLight} px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-[13px] lg:text-[14px] font-medium ${colors.orange.textDark} shadow-sm hover:-translate-y-0.5 transition-all duration-250`}>
                <Award className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>تقييم 4.9/5</span>
              </div>

              {/* Response Time - Enhanced */}
              <div className={`group flex items-center gap-2 bg-white/80 backdrop-blur-sm border ${colors.cyan.borderLight} px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-[13px] lg:text-[14px] font-medium ${colors.cyan.textDark} shadow-sm hover:-translate-y-0.5 transition-all duration-250`}>
                <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>استجابة خلال 24 ساعة</span>
              </div>
            </div>
          </div>

          {/* Visual Column - 40% - Enhanced Illustration */}
          <div className={`relative transition-all duration-700 delay-400 order-1 lg:order-2 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative aspect-square max-w-[320px] sm:max-w-lg mx-auto lg:mx-0">
              {/* Decorative Circles */}
              <div className="absolute top-1/4 right-0 w-48 lg:w-64 h-48 lg:h-64 bg-warm-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 left-0 w-32 lg:w-48 h-32 lg:h-48 bg-golden-orange/10 rounded-full blur-2xl animate-pulse-slow delay-700"></div>

              {/* Professional Illustration */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Main Illustration Image */}
                  <div className="relative w-full aspect-square rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] lg:shadow-[0_20px_60px_rgba(0,0,0,0.1)] bg-gradient-to-br from-warm-green/5 to-golden-orange/5">
                    <img
                      src="/hero-illustration.png"
                      alt="عون - منصة تربط الأسر المحتاجة بالجمعيات الخيرية"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Floating Stats - Enhanced */}
                  <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-white border-2 border-sky-blue/20 rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 shadow-lg scale-90 lg:scale-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-sky-blue" />
                      <span className="text-xs lg:text-sm font-semibold text-foreground">27 محافظة</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 bg-white border-2 border-golden-orange/20 rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 shadow-lg scale-90 lg:scale-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 lg:w-5 lg:h-5 text-golden-orange" />
                      <span className="text-xs lg:text-sm font-semibold text-foreground">1200+ أسرة</span>
                    </div>
                  </div>

                  <div className="absolute top-1/2 -left-6 lg:-left-8 bg-white border-2 border-warm-green/20 rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 shadow-lg scale-90 lg:scale-100 hidden sm:block">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-warm-green" />
                      <span className="text-xs lg:text-sm font-semibold text-foreground">24 ساعة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section - Trust Signals */}
      <div className={`mt-20 lg:mt-24 pt-12 border-t border-border/50 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            icon={Users}
            number={1200}
            suffix="+"
            label="أسرة مستفيدة"
            gradient={colors.emerald.gradient}
            delay={600}
          />
          <StatCard
            icon={Building2}
            number={85}
            suffix="+"
            label="جهة شريكة"
            gradient={colors.cyan.gradient}
            delay={700}
          />
          <StatCard
            icon={MapPin}
            number={27}
            suffix=""
            label="محافظة مصرية"
            gradient={colors.orange.gradient}
            delay={800}
          />
          <StatCard
            icon={CheckCircle}
            number={98}
            suffix="%"
            label="نسبة نجاح"
            gradient={colors.emerald.gradient}
            delay={900}
          />
        </div>
      </div>

    </section>
  );
}

// StatCard Component - Refined & Minimal
interface StatCardProps {
  icon: React.ElementType;
  number: number;
  suffix: string;
  label: string;
  gradient: string;
  delay: number;
}

function StatCard({ icon: Icon, number, suffix, label, gradient, delay }: StatCardProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      let start = 0;
      const duration = 2000;
      const increment = number / (duration / 16);

      const counter = setInterval(() => {
        start += increment;
        if (start >= number) {
          setCount(number);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [number, delay]);

  return (
    <div
      className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Number */}
      <div className={`text-3xl lg:text-4xl  font-black mb-1 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
        {count.toLocaleString('ar-EG')}{suffix}
      </div>

      {/* Label */}
      <div className="text-sm text-muted-foreground font-medium">
        {label}
      </div>
    </div>
  );
}
