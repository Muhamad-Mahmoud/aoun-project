import { Users, BrainCircuit, BarChart, HandHeart, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Users,
    title: "الأسرة",
    description: "تقوم الأسرة بإدخال بياناتها ورفع المستندات الرسمية",
  },
  {
    icon: BrainCircuit,
    title: "الذكاء الاصطناعي",
    description: "يقوم النظام باستخراج وتحليل البيانات تلقائياً",
  },
  {
    icon: BarChart,
    title: "تحليل البيانات",
    description: "تقييم الحاجة وتصنيف نوع المساعدة المطلوبة",
  },
  {
    icon: HandHeart,
    title: "اختيار المساعدة",
    description: "تحديد نوع الدعم الأنسب للحالة",
  },
  {
    icon: CheckCircle,
    title: "ربط الجمعية",
    description: "توصيل الأسرة بالجمعية الخيرية الأنسب",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 border border-primary/20">
            الخطوات
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-foreground">
            كيف تعمل{" "}
            <span className="text-primary relative inline-block">
              المنصة
              <svg className="absolute w-full h-2 -bottom-2 left-0 text-primary opacity-20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            خمس خطوات بسيطة لربط الأسر المحتاجة بالجمعيات الخيرية
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Line - Gradient Blue to Green */}
          <div className="hidden lg:block absolute top-[4.5rem] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10 opacity-50"></div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group animate-fade-in relative z-10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon Circle with Step Badge */}
                  <div className="relative mb-6">
                    <div className="relative z-10 w-24 h-24 lg:w-28 lg:h-28 rounded-[2rem] bg-card border-4 border-card shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-primary/20">
                      {/* Gradient Bg - Blue to Green */}
                      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"></div>

                      <div className="text-primary transition-all duration-500 group-hover:scale-110 relative z-10">
                        <Icon className="w-10 h-10 lg:w-12 lg:h-12" />
                      </div>
                    </div>

                    {/* Step Number Badge - Gradient */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg border-4 border-card shadow-lg group-hover:scale-110 transition-transform duration-300 z-20">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 font-display text-foreground group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base px-2">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="inline-block rounded-3xl border border-border bg-gradient-to-br from-accent/10 via-card to-accent/5 p-10 shadow-xl max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground font-display">
              جاهز للبدء؟
            </h3>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              انضم إلى آلاف الأسر المستفيدة من منصة عون
            </p>
            <Link href="/register">
              <Button className="h-12 px-8 text-base font-bold bg-[#EC4F10] hover:bg-[#C93D0A] text-white shadow-md hover:shadow-lg transition-all duration-300 gap-2 rounded-xl">
                سجل الآن
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
