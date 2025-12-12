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
        answer: "نسعد بانضمام شركاء الخير. يمكنكم التسجيل عبر خيار 'الجمعيات' في القائمة، وسيتم التواصل معكم وسرعة مراجعة الأوراق الرسمية للااعتماد.",
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

        <section className="py-20 md:py-28 bg-card relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 max-w-[1000px]" dir="rtl">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-l from-primary/10 to-secondary/10 text-primary text-sm font-bold mb-5 border border-primary/20">
                        الأسئلة الشائعة
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        أسئلة{" "}
                        <span className="text-primary relative inline-block">
                            متكررة
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-accent opacity-25" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
                            </svg>
                        </span>
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
                            className="bg-card rounded-2xl border-2 border-border shadow-md transition-all duration-300 overflow-hidden"
                        >
                            <button
                                className="w-full text-right p-6 flex items-center justify-between gap-4 transition-colors duration-300"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-gradient-to-br from-primary to-primary-dark text-white' : 'bg-muted'}`}>
                                        <HelpCircle className={`w-6 h-6 transition-colors duration-300 ${openIndex === index ? 'text-white' : 'text-primary'}`} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-foreground">
                                        {faq.question}
                                    </h3>
                                </div>
                                <ChevronDown
                                    className={`w-6 h-6 text-primary transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 pr-[88px] text-muted-foreground leading-relaxed text-base">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Note */}
                <div className="text-center mt-12 p-8 bg-gradient-to-l from-primary/10 to-secondary/10 rounded-2xl border-2 border-border">
                    <p className="text-lg text-muted-foreground">
                        لم تجد إجابة لسؤالك؟{" "}
                        <a href="mailto:info@aoun.org" className="font-bold text-primary transition-colors underline">
                            تواصل معنا
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
