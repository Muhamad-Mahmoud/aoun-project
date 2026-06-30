"use client";

import { Button } from "@/shared/ui/button";
import {
  Award,
  Building2,
  Clock,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
    number: "98",
    label: "نسبة نجاح وتوصيل الدعم",
    icon: Sparkles,
    colorClass: "text-warm-green",
    bgClass: "bg-warm-green/15",
    suffix: "%"
  },
  {
    number: "5000",
    label: "أسرة مستفيدة",
    icon: Users,
    colorClass: "text-brand-dark",
    bgClass: "bg-brand-dark/15",
    suffix: "+"
  },
  {
    number: "200",
    label: "جهة شريكة",
    icon: Building2,
    colorClass: "text-golden-orange",
    bgClass: "bg-golden-orange/15",
    suffix: "+"
  },
];

function CountUpNumber({ target, suffix = "" }: { target: number, suffix?: string }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = target;
      const duration = 2000;
      const incrementTime = (duration / end) * 5;
      
      const timer = setInterval(() => {
        start += Math.ceil(end / 40);
        if (start >= end) {
          setValue(end);
          clearInterval(timer);
        } else {
          setValue(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [inView, target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      dir="rtl"
      className="relative z-10 flex flex-col justify-center min-h-[100dvh] -mt-[76px] pt-20 lg:pt-24 pb-10 lg:pb-12 overflow-hidden bg-brand-dark"
    >
      {/* 1. Background Image with Premium Image Adjustments & Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 bg-brand-dark overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ scale: [1.05, 1.1] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <Image
            src="/herobg.webp"
            alt="عون - منصة تربط الأسر المحتاجة بالجمعيات الخيرية"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={85}
            className="object-cover object-[15%_20%] lg:object-[15%_center] brightness-[1.15] contrast-[1.05] saturate-[1.10]"
          />
        </motion.div>
        
        {/* Lighter Gradient (Better visibility of the photo) */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/70 via-brand-dark/20 to-transparent mix-blend-multiply pointer-events-none" />
        
        {/* Radial Glow behind text */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(15,93,70,0.45)_0%,_transparent_65%)] mix-blend-screen pointer-events-none" />
        
        {/* Cinematic Sunlight Rays (Top Left) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,_rgba(255,255,255,0.3)_0%,_rgba(255,255,255,0.05)_30%,_transparent_60%)] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent mix-blend-overlay opacity-50 pointer-events-none" />
        
        {/* Atmospheric Particles Overlay (Subtle noise/texture) */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      </motion.div>

      {/* 2. Content Container (Tightened Spacing for 100vh fit) */}
      <div className="container relative z-10 mx-auto px-6 lg:px-12 flex justify-start">
        <div className="max-w-[640px] lg:max-w-[720px] text-right flex flex-col gap-4 lg:gap-5">
            
            {/* Tag / Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-md self-start"
            >
              <Sparkles className="h-4 w-4 text-golden-orange" />
              منصة موثوقة تربط المحتاجين بالجمعيات
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[2.5rem] sm:text-5xl lg:text-[56px] font-black leading-[1.3] tracking-normal text-white drop-shadow-lg mt-1"
            >
              كل طلب مساعدة
              <br className="hidden sm:block" />
              يجد طريقه إلى{" "}
              <span className="text-golden-orange font-bold">
                الجهة المناسبة
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="max-w-[550px] text-[17px] lg:text-[19px] leading-[1.7] text-white/90 font-medium drop-shadow-md"
            >
              منصة ذكية تربط الأسر المحتاجة بالجمعيات المعتمدة، لضمان وصول الدعم بشفافية وأمان.
            </motion.p>

            {/* CTAs (Equal Widths) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[540px] mt-2"
            >
              <Link href="/explore" className="w-full">
                <Button className="w-full h-14 lg:h-14 rounded-xl text-[16px] lg:text-[17px] font-bold gap-3 bg-warm-green text-white hover:bg-warm-green-dark shadow-[0_8px_24px_rgba(15,93,70,0.4)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgba(15,93,70,0.5)] border-none">
                  تبرع وادعم الآن
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-14 lg:h-14 rounded-xl text-[16px] lg:text-[17px] font-bold border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[3px] hover:shadow-lg backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
                >
                  اطلب مساعدة
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators (Sleek Horizontal Row) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-4 pt-5 border-t border-white/15"
            >
              <div className="grid grid-cols-3 gap-6 lg:gap-8 max-w-[600px]">
                {stats.slice(0, 3).map((stat) => {
                  return (
                    <div key={stat.label} className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl lg:text-4xl font-medium text-white tracking-tighter drop-shadow-sm">
                          <CountUpNumber target={parseInt(stat.number)} suffix={stat.suffix} />
                        </span>
                      </div>
                      <span className="text-[11px] lg:text-sm text-white/70 font-normal leading-tight">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            
        </div>
      </div>
    </section>
  );
}
