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
  styleClass: string;
  iconClass: string;
  badgeClass: string;
  lineClass: string;
};

const features: Feature[] = [
  {
    icon: MapPinned,
    badge: "٠١",
    title: "بحث ذكي حسب النطاق الجغرافي",
    description: "نربطك بأقرب الجمعيات الخيرية في منطقتك ومحافظتك بدقة عالية لضمان سهولة الوصول.",
    styleClass: "bg-white border-border shadow-sm hover:shadow-md hover:border-warm-green/30",
    iconClass: "bg-warm-green text-white",
    badgeClass: "text-warm-green",
    lineClass: "bg-warm-green/30",
  },
  {
    icon: Target,
    badge: "٠٢",
    title: "توجيه دقيق حسب نوع الدعم",
    description: "سواء كان احتياجك طبيًا، تعليميًا، أو ماديًا، نقوم بتوصيلك بالجهة المتخصصة لتلبية طلبك بكفاءة.",
    styleClass: "bg-warm-green/5 border-warm-green/20 shadow-sm hover:shadow-lg hover:border-warm-green/40",
    iconClass: "bg-warm-green text-white shadow-sm",
    badgeClass: "text-warm-green",
    lineClass: "bg-warm-green",
  },
  {
    icon: Zap,
    badge: "٠٣",
    title: "استجابة خلال 24 ساعة",
    description: "لا داعي للانتظار الطويل؛ نحرص على الرد وتوجيهك لأفضل الخيارات المناسبة خلال يوم واحد.",
    styleClass: "bg-gradient-to-br from-white to-golden-orange/10 border-golden-orange/20 shadow-[0_10px_30px_hsl(var(--golden-orange)/0.1)] hover:shadow-[0_20px_40px_hsl(var(--golden-orange)/0.15)]",
    iconClass: "bg-golden-orange/20 text-golden-orange border border-golden-orange/30",
    badgeClass: "text-golden-orange",
    lineClass: "bg-golden-orange",
  },
  {
    icon: ShieldCheck,
    badge: "٠٤",
    title: "جهات ومؤسسات معتمدة",
    description: "نتعاون حصريًا مع جمعيات ومؤسسات مرخصة رسميًا من وزارة التضامن الاجتماعي لضمان الأمان والمصداقية.",
    styleClass: "bg-brand-dark border-brand-dark shadow-[0_20px_40px_rgba(15,93,70,0.2)] hover:-translate-y-2 text-white",
    iconClass: "bg-white/10 text-golden-orange border border-white/20",
    badgeClass: "text-white",
    lineClass: "bg-golden-orange",
  },
];

export function WhyAounSection() {
  return (
    <section
      id="why-aoun"
      dir="rtl"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, hsl(var(--warm-green)) 1px, transparent 1px), linear-gradient(-45deg, hsl(var(--golden-orange)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isDark = index === 3;

            return (
              <article
                key={feature.title}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-8 text-right transition-all duration-500 hover:-translate-y-1 ${feature.styleClass}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Number Badge */}
                <div
                  className={`absolute left-5 top-5 text-6xl font-black leading-none opacity-[0.06] ${feature.badgeClass}`}
                >
                  {feature.badge}
                </div>

                {/* Icon */}
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${feature.iconClass}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3
                  className={`mb-3 text-[19px] font-black leading-[1.4] ${isDark ? "text-white" : "text-brand-dark"}`}
                >
                  {feature.title}
                </h3>

                <p
                  className={`text-[15px] leading-[1.9] font-medium ${isDark ? "text-white/80" : "text-brand-dark/70"}`}
                >
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div
                  className={`mt-8 h-1 w-12 rounded-full transition-all duration-500 group-hover:w-20 ${feature.lineClass}`}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}