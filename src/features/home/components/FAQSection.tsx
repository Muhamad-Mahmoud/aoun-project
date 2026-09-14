"use client";

import { useState } from "react";
import { ChevronDown, Headset } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";

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
    // Set initially open to null to match the screenshot where everything looks closed, 
    // or keep first one open. Let's start with all closed for cleaner look like mockup.
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-20 md:py-28 bg-white relative overflow-hidden" dir="rtl">
            <div className="container mx-auto max-w-[1100px] px-4">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                    
                    {/* Right Column: Titles & CTA Box (First in RTL) */}
                    <div className="w-full lg:w-[40%] flex flex-col pt-2 text-center lg:text-right">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#Eef4f3] text-[#157A75] text-sm font-bold tracking-wider mb-4">
                                الأسئلة الشائعة
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-[#0F4C4A] mb-4 leading-tight tracking-tight">
                                أسئلة متكررة
                            </h2>
                            <p className="text-[#64748b] text-[1.125rem] font-medium leading-[1.8] max-w-sm mx-auto lg:mx-0">
                                إجابات وافية على الاستفسارات الأكثر شيوعاً
                            </p>
                        </div>

                        {/* Contact CTA Box */}
                        <div className="bg-[#f4f7f5] rounded-2xl p-6 md:p-8 mt-4 flex flex-col">
                            <h4 className="text-[#113f3b] font-extrabold text-[17.5px] mb-5 text-right sm:pr-4">
                                لم تجد إجابة لسؤالك؟
                            </h4>
                            <div className="flex justify-end sm:pl-4">
                                <Button 
                                    asChild 
                                    variant="outline" 
                                    className="h-[3.15rem] px-8 border-[#1a7a75] border-[1.5px] text-[#1a7a75] hover:bg-[#1a7a75] hover:text-white rounded-xl text-[16px] font-extrabold transition-all bg-transparent shadow-sm"
                                >
                                    <Link href="/contact">
                                        تواصل معنا
                                        <Headset className="w-[1.25rem] h-[1.25rem] mr-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Accordion (Second in RTL) */}
                    <div className="w-full lg:w-[60%]">
                        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
                            {faqs.map((faq, index) => {
                                const isOpen = openIndex === index;
                                const isLast = index === faqs.length - 1;
                                
                                return (
                                    <div key={index} className={`border-slate-100 ${!isLast ? 'border-b' : ''}`}>
                                        <button
                                            className="w-full text-right py-[1.15rem] px-6 flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus-visible:bg-slate-50"
                                            onClick={() => setOpenIndex(isOpen ? null : index)}
                                        >
                                            <h3 className={`text-[15.5px] font-bold leading-snug transition-colors duration-300 ${isOpen ? 'text-[#1a7a75]' : 'text-[#113f3b]'}`}>
                                                {faq.question}
                                            </h3>
                                            <ChevronDown
                                                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1a7a75]' : 'text-slate-400'}`}
                                            />
                                        </button>
                                        
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                        >
                                            <div className="px-6 pb-6 pt-1 text-[#64748b] leading-[1.8] text-[14.5px] font-medium">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
