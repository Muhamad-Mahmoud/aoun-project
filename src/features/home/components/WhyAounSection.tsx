import {
  MapPinned,
  Target,
  Zap,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  featured?: boolean;
};

const features: Feature[] = [
  {
    icon: MapPinned,
    badge: "٠١",
    title: "بحث ذكي حسب النطاق الجغرافي",
    description:
      "نربطك بأقرب الجمعيات الخيرية في منطقتك ومحافظتك بدقة عالية لضمان سهولة الوصول.",
  },
  {
    icon: Target,
    badge: "٠٢",
    title: "توجيه دقيق حسب نوع الدعم",
    description:
      "سواء كان احتياجك طبيًا، تعليميًا، أو ماديًا، نقوم بتوصيلك بالجهة المتخصصة لتلبية طلبك بكفاءة.",
    featured: true,
  },
  {
    icon: Zap,
    badge: "٠٣",
    title: "استجابة خلال 24 ساعة",
    description:
      "لا داعي للانتظار الطويل؛ نحرص على الرد وتوجيهك لأفضل الخيارات المناسبة خلال يوم واحد.",
  },
  {
    icon: ShieldCheck,
    badge: "٠٤",
    title: "جهات ومؤسسات معتمدة",
    description:
      "نتعاون حصريًا مع جمعيات ومؤسسات مرخصة رسميًا من وزارة التضامن الاجتماعي لضمان الأمان والمصداقية.",
  },
];

export function WhyAounSection() {
  return (
    <section
      id="why-aoun"
      dir="rtl"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Pattern خفيف جداً يربط السكشن بالهوية بدون blobs */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, hsl(var(--warm-green)) 1px, transparent 1px), linear-gradient(-45deg, hsl(var(--golden-orange)) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center animate-fade-in">
          <div className="section-pill">لماذا عون؟</div>

          <h2 className="section-title">
            مميزات{" "}
            <span className="title-highlight">المنصة الذكية</span>
          </h2>

          <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-xl leading-[1.9] text-muted-foreground">
            نظام متكامل يجمع بين الذكاء الاصطناعي والشفافية لضمان وصول الدعم لمستحقيه بسرعة وأمان.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className={[
                  "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-7 text-right transition-all duration-300 hover:-translate-y-1",
                  feature.featured
                    ? "bg-white border-warm-green/40 shadow-[0_20px_50px_hsl(var(--warm-green)/0.12)]"
                    : "bg-white border-border shadow-sm hover:shadow-[0_18px_40px_hsl(var(--warm-green)/0.10)] hover:border-warm-green/25",
                ].join(" ")}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* رقم الميزة */}
                <div
                  className={[
                    "absolute left-5 top-5 text-5xl font-black leading-none opacity-[0.07]",
                    feature.featured ? "text-golden-orange" : "text-warm-green",
                  ].join(" ")}
                >
                  {feature.badge}
                </div>

                {/* Icon */}
                <div
                  className={[
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110",
                    feature.featured
                      ? "bg-golden-orange/15 text-golden-orange border border-golden-orange/20"
                      : "bg-warm-green text-white",
                  ].join(" ")}
                >
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3
                  className={[
                    "mb-3 text-lg lg:text-xl font-black leading-[1.45]",
                    "text-foreground",
                  ].join(" ")}
                >
                  {feature.title}
                </h3>

                <p
                  className={[
                    "text-sm leading-[1.9]",
                    "text-muted-foreground",
                  ].join(" ")}
                >
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div
                  className={[
                    "mt-7 h-1 w-14 rounded-full transition-all duration-300 group-hover:w-24",
                    feature.featured ? "bg-golden-orange" : "bg-warm-green/35",
                  ].join(" ")}
                />

                {/* Decorative corner للـ featured بس */}
                {feature.featured && (
                  <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-warm-green/10 blur-2xl" />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}