"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "هل خدمات المنصة مجانية؟",
        answer: "نعم، كافة خدمات منصة عون مجانية تماماً للمستفيدين. نحن هنا لنكون حلقة وصل آمنة بينك وبين الخير دون أي تكاليف.",
    },
    {
        question: "هل بياناتي ومعلوماتي في أمان؟",
        answer: "بكل تأكيد. نحن نولي خصوصيتك أولوية قصوى، وتتم حماية بياناتك بأحدث التقنيات ولا تُشارك إلا مع الجهات المختصة لغرض المساعدة فقط.",
    },
    {
        question: "ما هي المناطق والمحافظات المتاحة؟",
        answer: "نغطي كافة أنحاء الجمهورية. نسعى للوصول إليك أينما كنت، ونربطك بأقرب الجمعيات والمؤسسات الداعمة في منطقتك السكنية.",
    },
    {
        question: "كيف يمكن للجمعيات الخيرية الانضمام؟",
        answer: "نسعد بانضمام شركاء الخير. يمكنكم التسجيل عبر خيار 'الجمعيات' في القائمة، وسيتم التواصل معكم وسرعة مراجعة الأوراق الرسمية للاعتماد.",
    },
    {
        question: "متى يمكنني توقع الرد على طلبي؟",
        answer: "نحرص على سرعة الاستجابة. غالباً ما يتم الرد المبدئي وتوجيه الطلب خلال 24 ساعة، وتعتمد مدة التنفيذ النهائية على إجراءات الجمعية المختصة.",
    },
    {
        question: "ما هي أنواع المساعدات التي تقدمونها؟",
        answer: "تشمل خدماتنا الرعاية الصحية، الدعم التعليمي، المساعدات الغذائية، وتيسير سبل المعيشة وكفالة الأيتام. هدفنا تغطية مختلف جوانب الاحتياج الإنساني.",
    },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 md:py-32 bg-warm-green/5 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-3xl" dir="rtl">
                {/* Header */}
                <div className="!text-center mb-16 animate-fade-in">
                    <div className="section-pill">
                        الأسئلة الشائعة
                    </div>
                    <h2 className="section-title">
                        أسئلة{" "}
                        <span className="title-highlight">متكررة</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        إجابات وافية على الاستفسارات الأكثر شيوعاً
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-2xl border border-border shadow-sm transition-all duration-300 overflow-hidden hover:border-warm-green/30"
                        >
                            <button
                                className="w-full text-right p-6 flex items-center justify-between gap-4 transition-colors duration-300"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-warm-green text-white' : 'bg-muted'}`}>
                                        <HelpCircle className={`w-6 h-6 transition-colors duration-300 ${openIndex === index ? 'text-white' : 'text-warm-green'}`} />
                                    </div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground text-right leading-snug">
                                        {faq.question}
                                    </h3>
                                </div>
                                <ChevronDown
                                    className={`w-6 h-6 text-warm-green transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-4 sm:p-6 pt-0 pr-[72px] sm:pr-[88px] text-muted-foreground leading-relaxed text-[13px] sm:text-base font-medium">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Note */}
                <div className="!text-center mt-12 p-8 bg-white rounded-2xl border border-border shadow-sm">
                    <p className="text-lg text-muted-foreground font-medium">
                        لم تجد إجابة لسؤالك؟{" "}
                        <a href="mailto:info@aoun.org" className="font-bold text-warm-green hover:text-warm-green-dark transition-colors underline">
                            تواصل معنا
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
