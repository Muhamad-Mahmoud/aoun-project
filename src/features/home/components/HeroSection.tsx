"use client";

import { Button } from "@/shared/ui/button";
import { ArrowLeft, Users, Building2, MapPin, ShieldCheck, Award, Clock, CheckCircle, BrainCircuit, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { colors } from "@/shared/constants";
import { useCountUp } from "@/shared/hooks/useCountUp";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-[calc(100dvh-72px)] flex flex-col items-center justify-center py-20 lg:py-24"
      dir="rtl"
      style={{
        background: "linear-gradient(to bottom, hsl(var(--warm-green-pale)) 0%, hsl(var(--warm-white)) 100%)",
      }}
    >
      {/* Background Decorative Elements - Soft & Minimal */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] max-w-[100vw] bg-warm-green/3 rounded-full blur-[100px] overflow-hidden"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] max-w-[100vw] bg-golden-orange/5 rounded-full blur-[80px] overflow-hidden"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-center">
          {/* Content Column - 60% */}
          <div className="text-right space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-blue/10 border border-sky-blue/20 text-sky-blue-dark text-sm font-bold transition-all duration-700 hover:scale-105 cursor-default opacity-0 animate-fade-in-up">
              <BrainCircuit className="w-4 h-4 text-sky-blue" />
              <span className="bg-gradient-to-r from-sky-blue-dark to-sky-blue bg-clip-text text-transparent">مدعومة بالذكاء الاصطناعي</span>
            </div>

            {/* Main Headline - Enhanced Size & Typography */}
            <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-bold leading-[1.3] lg:leading-[1.2] text-foreground">
              نُوصّل <span className="text-warm-green">المساعدة</span>
              <br className="hidden sm:block" />
              إلى كل أسرة بأمان وسرعة
            </h1>

            {/* Subheadline - Concise & Direct */}
            <p className="text-base sm:text-lg lg:text-[20px] text-muted-foreground leading-relaxed max-w-2xl">
              منصة رقمية تربط الأسر المحتاجة بالجمعيات الموثوقة في دقائق، لتجربة إنسانية كريمة
            </p>

            {/* CTA Buttons - Enhanced Size & Design */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start opacity-0 animate-fade-in-up delay-300 relative z-[100]">
              
              {/* Primary CTA - Donate */}
              <Link href="/explore" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 lg:h-16 text-base lg:text-[17px] font-semibold px-8 rounded-xl gap-3 text-white bg-gradient-to-l from-warm-green via-warm-green/90 to-sky-blue hover:from-warm-green-dark hover:via-warm-green hover:to-sky-blue-dark shadow-[0_8px_20px_hsla(var(--warm-green)/0.3)] hover:shadow-[0_8px_30px_hsla(var(--warm-green)/0.5)] transition-[background,box-shadow,transform] duration-300 hover:scale-[1.02] hover:-translate-y-1">
                  تبرع وادعم الآن
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>

              {/* Secondary CTA - Request Help */}
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-14 lg:h-16 text-base lg:text-[17px] font-semibold px-7 rounded-xl border-2 border-warm-green/40 hover:border-warm-green hover:bg-warm-green hover:text-white text-warm-green transition-[background-color,border-color,color,transform] duration-300 hover:scale-[1.02] gap-2.5"
                >
                  اطلب مساعدة
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Enhanced Design */}
            <div className="flex flex-wrap gap-2 sm:gap-3 opacity-0 animate-fade-in delay-500">
              {/* Government Badge - Enhanced */}
              <div className={`group flex items-center gap-2 bg-white/80 backdrop-blur-sm border ${colors.warmGreen.borderLight} px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-[13px] lg:text-[14px] font-medium ${colors.warmGreen.textDark} shadow-sm hover:-translate-y-0.5 transition-transform duration-250`}>
                <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>معتمد من وزارة التضامن</span>
              </div>

              {/* Rating - Enhanced */}
              <div className={`group flex items-center gap-2 bg-white/80 backdrop-blur-sm border ${colors.goldenOrange.borderLight} px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-[13px] lg:text-[14px] font-medium ${colors.goldenOrange.textDark} shadow-sm hover:-translate-y-0.5 transition-transform duration-250`}>
                <Award className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>تقييم 4.9/5</span>
              </div>

              {/* Response Time - Enhanced */}
              <div className={`group flex items-center gap-2 bg-white/80 backdrop-blur-sm border ${colors.skyBlue.borderLight} px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl text-[13px] lg:text-[14px] font-medium ${colors.skyBlue.textDark} shadow-sm hover:-translate-y-0.5 transition-transform duration-250`}>
                <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>استجابة خلال 24 ساعة</span>
              </div>
            </div>
          </div>

          {/* Visual Column - 40% - Enhanced Illustration */}
          <div className="relative order-1 lg:order-2 opacity-0 animate-fade-in delay-500">
            <div className="relative aspect-square max-w-[320px] sm:max-w-lg mx-auto lg:mx-0">
              {/* Decorative Circles */}
              <div className="absolute top-1/4 right-0 w-48 lg:w-64 h-48 lg:h-64 bg-warm-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 left-0 w-32 lg:w-48 h-32 lg:h-48 bg-golden-orange/10 rounded-full blur-2xl animate-pulse-slow delay-700"></div>

              {/* Professional Illustration */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Main Illustration Image */}
                  <div className="relative w-full aspect-square rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-[0_10px_30px_hsla(var(--text-primary)/0.05)] lg:shadow-[0_20px_60px_hsla(var(--text-primary)/0.1)] bg-gradient-to-br from-warm-green/5 to-golden-orange/5">
                    <Image
                      src="/hero-illustration.png"
                      alt="عون - منصة تربط الأسر المحتاجة بالجمعيات الخيرية"
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
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
      <div className="mt-20 lg:mt-24 px-6 py-10 lg:px-12 lg:py-14 rounded-[2rem] bg-white border border-border/50 shadow-[0_10px_40px_hsla(var(--text-primary)/0.03)] opacity-0 animate-fade-in-up delay-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <AnimatedStatCard
            icon={Users}
            number="١,٢٠٠+"
            label="أسرة مستفيدة"
            colorClass="text-warm-green"
            bgClass="bg-warm-green/10"
          />
          <AnimatedStatCard
            icon={Building2}
            number="٨٥+"
            label="جهة شريكة"
            colorClass="text-sky-blue"
            bgClass="bg-sky-blue/10"
          />
          <AnimatedStatCard
            icon={MapPin}
            number="٢٧"
            label="محافظة مصرية"
            colorClass="text-sky-blue"
            bgClass="bg-sky-blue/10"
          />
          <AnimatedStatCard
            icon={CheckCircle}
            number="٩٨٪"
            label="نسبة نجاح"
            colorClass="text-warm-green"
            bgClass="bg-warm-green/10"
          />
        </div>
      </div>
    </section>
  );
}

interface AnimatedStatCardProps {
  icon: React.ElementType;
  number: string;
  label: string;
  colorClass: string;
  bgClass: string;
}

function AnimatedStatCard({ icon: Icon, number, label, colorClass, bgClass }: AnimatedStatCardProps) {
  const animatedValue = useCountUp(number);
  
  return (
    <div className="!text-center transition-all duration-500 opacity-100 translate-y-0">
      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${bgClass} flex items-center justify-center transition-transform hover:scale-110 duration-300`}>
        <Icon className={`w-7 h-7 ${colorClass}`} />
      </div>

      <div className={`text-3xl lg:text-4xl font-black mb-1 ${colorClass}`}>
        {animatedValue}
      </div>

      <div className="text-[15px] text-muted-foreground font-bold">{label}</div>
    </div>
  );
}