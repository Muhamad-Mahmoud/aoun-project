"use client";

import { Button } from "@/shared/ui/button";
import {
  Award,
  Building2,
  CheckCircle,
  Clock,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCountUp } from "@/shared/hooks/useCountUp";

const trustBadges = [
  {
    icon: ShieldCheck,
    label: "معتمد من وزارة التضامن",
    className: "text-warm-green border-warm-green/20 bg-warm-green/5",
  },
  {
    icon: Award,
    label: "تقييم 4.9/5",
    className: "text-gold-text border-golden-orange/25 bg-golden-orange/10",
  },
  {
    icon: Clock,
    label: "استجابة خلال 24 ساعة",
    className: "text-warm-green border-warm-green/20 bg-white",
  },
];

const stats = [
  {
    icon: Users,
    number: "١,٢٠٠+",
    label: "أسرة مستفيدة",
    colorClass: "text-golden-orange",
    bgClass: "bg-golden-orange/15",
  },
  {
    icon: Building2,
    number: "٨٥+",
    label: "جهة شريكة",
    colorClass: "text-warm-green",
    bgClass: "bg-warm-green/10",
  },
  {
    icon: MapPin,
    number: "٢٧",
    label: "محافظة مصرية",
    colorClass: "text-warm-green",
    bgClass: "bg-warm-green/10",
  },
  {
    icon: CheckCircle,
    number: "٩٨٪",
    label: "نسبة نجاح",
    colorClass: "text-golden-orange",
    bgClass: "bg-golden-orange/15",
  },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      dir="rtl"
      className="relative overflow-hidden bg-warm-white pt-16 pb-20 lg:pt-24 lg:pb-28"
    >
      {/* Subtle identity pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, hsl(var(--warm-green)) 1px, transparent 1px), linear-gradient(-45deg, hsl(var(--warm-green)) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Cream-to-white depth */}
      <div className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-warm-beige/70 via-warm-white to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[56%_44%] gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-warm-green/20 bg-white/75 px-4 py-2 text-sm font-bold text-warm-green shadow-sm backdrop-blur-sm opacity-0 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-golden-orange" />
              منصة ذكية لخدمة الأسر في مصر
            </div>

            <h1 className="mt-6 max-w-3xl text-[2.55rem] sm:text-5xl lg:text-[64px] font-black leading-[1.28] lg:leading-[1.2] tracking-normal text-foreground">
              نُوصّل{" "}
              <span className="title-highlight">
                المساعدة
                <span className="title-highlight-underline" />
              </span>
              <br className="hidden sm:block" />
              إلى كل أسرة بأمان وسرعة
            </h1>

            <p className="mt-5 max-w-2xl text-base sm:text-lg lg:text-[20px] leading-[1.9] text-muted-foreground">
              منصة رقمية تربط الأسر المحتاجة بالجمعيات الموثوقة في دقائق، لتجربة إنسانية كريمة ووصول أسرع للدعم.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start opacity-0 animate-fade-in-up delay-300">
              <Link href="/explore" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 lg:h-16 rounded-xl px-8 text-base lg:text-[17px] font-bold gap-3 bg-warm-green text-white hover:bg-warm-green-dark shadow-[0_12px_26px_hsl(var(--warm-green)/0.24)] hover:shadow-[0_16px_34px_hsl(var(--warm-green)/0.34)] transition-[background,box-shadow,transform] duration-300 hover:-translate-y-1">
                  تبرع وادعم الآن
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-14 lg:h-16 rounded-xl px-7 text-base lg:text-[17px] font-bold border-2 border-warm-green/35 bg-white/70 text-warm-green hover:bg-warm-green hover:text-white hover:border-warm-green transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-1"
                >
                  اطلب مساعدة
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3 opacity-0 animate-fade-in delay-500">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;

                return (
                  <div
                    key={badge.label}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] lg:text-sm font-bold shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 ${badge.className}`}
                  >
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 relative opacity-0 animate-fade-in delay-500">
            <div className="relative mx-auto lg:mx-0 max-w-[360px] sm:max-w-[460px]">
              {/* Brand backing block */}
              <div className="absolute inset-5 rounded-[2rem] bg-warm-green/5 rotate-3 border border-warm-green/10" />

              {/* Image frame */}
              <div className="relative rounded-[2rem] bg-white p-3 shadow-[0_18px_50px_hsl(var(--text-primary)/0.12)] border border-border">
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-warm-green/10 to-golden-orange/10">
                  <Image
                    src="/hero-illustration.png"
                    alt="عون - منصة تربط الأسر المحتاجة بالجمعيات الخيرية"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 90vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-3 lg:-right-6 rounded-2xl bg-white px-4 py-3 shadow-xl border border-border">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-warm-green" />
                  <div>
                    <div className="text-sm font-black text-foreground">٢٧ محافظة</div>
                    <div className="text-xs font-semibold text-muted-foreground">تغطية أوسع</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-3 lg:-left-6 rounded-2xl bg-white px-4 py-3 shadow-xl border border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-golden-orange" />
                  <div>
                    <div className="text-sm font-black text-foreground">+١٢٠٠ أسرة</div>
                    <div className="text-xs font-semibold text-muted-foreground">وصلها الدعم</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-5 hidden sm:block rounded-2xl bg-white px-4 py-3 shadow-xl border border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold-text" />
                  <div>
                    <div className="text-sm font-black text-foreground">٢٤ ساعة</div>
                    <div className="text-xs font-semibold text-muted-foreground">استجابة سريعة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics anchor */}
        <div className="mt-16 lg:mt-20 mx-auto max-w-5xl rounded-[2rem] bg-white border border-border px-5 py-7 lg:px-10 lg:py-9 shadow-xl opacity-0 animate-fade-in-up delay-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <AnimatedStatCard
                key={stat.label}
                icon={stat.icon}
                number={stat.number}
                label={stat.label}
                colorClass={stat.colorClass}
                bgClass={stat.bgClass}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface AnimatedStatCardProps {
  icon: LucideIcon;
  number: string;
  label: string;
  colorClass: string;
  bgClass: string;
}

function AnimatedStatCard({
  icon: Icon,
  number,
  label,
  colorClass,
  bgClass,
}: AnimatedStatCardProps) {
  const animatedValue = useCountUp(number);

  return (
    <div className="text-center">
      <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${bgClass}`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>

      <div className={`mb-1 text-3xl lg:text-4xl font-black ${colorClass}`}>
        {animatedValue}
      </div>

      <div className="text-sm lg:text-[15px] font-bold text-muted-foreground">
        {label}
      </div>
    </div>
  );
}