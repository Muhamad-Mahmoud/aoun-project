import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#0a4740] text-white pt-16 pb-6 relative overflow-hidden" dir="rtl">
            <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1280px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    
                    {/* Column 1: Brand & Contact */}
                    <div className="flex flex-col items-start lg:pr-4">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/logo-new.png"
                                alt="عون"
                                width={120}
                                height={60}
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-white/80 text-[14.5px] leading-[1.8] mb-6 font-medium">
                            منصة مصرية ١٠٠٪ لخدمة المصريين. نجمع بين التكنولوجيا والعمل الإنساني لضمان وصول الدعم لمستحقيه.
                        </p>
                        <div className="space-y-4 w-full">
                            <a href="mailto:info@aoun.org" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors text-[14.5px]">
                                <Mail className="w-5 h-5 shrink-0" />
                                <span className="font-sans dir-ltr tracking-wide">info@aoun.org</span>
                            </a>
                            <a href="tel:+201234567890" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors text-[14.5px]">
                                <Phone className="w-5 h-5 shrink-0" />
                                <span className="font-sans dir-ltr tracking-wider">+20 12 345 6789</span>
                            </a>
                            <div className="flex items-center gap-3 text-white/90 text-[14.5px]">
                                <MapPin className="w-5 h-5 shrink-0" />
                                <span>القاهرة – جمهورية مصر العربية</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Users */}
                    <div className="flex flex-col lg:items-center">
                        <div className="w-full lg:w-max">
                            <h3 className="text-lg font-bold mb-6 text-white">
                                للمستخدمين
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { name: "تسجيل الدخول", href: "/login" },
                                    { name: "إنشاء حساب جديد", href: "/register" },
                                    { name: "الأسئلة الشائعة", href: "#faq" },
                                    { name: "سياسة الخصوصية", href: "#privacy" },
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-white/75 hover:text-white transition-colors font-medium text-[15px]">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div className="flex flex-col lg:items-center">
                        <div className="w-full lg:w-max">
                            <h3 className="text-lg font-bold mb-6 text-white">
                                روابط سريعة
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { name: "الرئيسية", href: "/" },
                                    { name: "من نحن", href: "#about" },
                                    { name: "الحالات", href: "/cases" },
                                    { name: "الجهات", href: "#partners" },
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-white/75 hover:text-white transition-colors font-medium text-[15px]">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Column 4: Newsletter & Social */}
                    <div className="flex flex-col items-start lg:pl-4">
                        <h3 className="text-lg font-bold mb-4 text-white">
                            ابق على اطلاع بأحدث الحملات
                        </h3>
                        <p className="text-white/80 text-[14px] leading-[1.8] mb-6 font-medium">
                            اشترك في نشرتنا البريدية لتصلك أحدث قصص النجاح والمبادرات الإنسانية التي تحدث فرقاً في مجتمعنا.
                        </p>
                        
                        <form className="flex w-full mb-8 relative">
                            <input 
                                type="email" 
                                placeholder="البريد الإلكتروني..." 
                                className="w-full h-[3.25rem] pl-[100px] pr-4 rounded-[0.8rem] bg-white text-[#0a4740] placeholder:text-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-white/20 shadow-sm"
                                required
                            />
                            <button 
                                type="submit"
                                className="absolute left-1 top-1 bottom-1 px-6 rounded-lg bg-[#F18825] hover:bg-[#d9771e] text-white font-bold transition-colors text-[14.5px]"
                            >
                                اشترك الآن
                            </button>
                        </form>

                        <div className="flex items-center gap-3 w-full justify-start">
                            {[
                                { Icon: Facebook, href: "#", label: "فيسبوك" },
                                { Icon: Twitter, href: "#", label: "تويتر" },
                                { Icon: Instagram, href: "#", label: "انستجرام" },
                                { Icon: Linkedin, href: "#", label: "لينكد إن" }
                            ].map(({ Icon, href, label }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    aria-label={label}
                                    className="w-[2.35rem] h-[2.35rem] rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-[#0a4740] transition-all"
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-center">
                    <p className="text-white/70 text-[13.5px] font-medium">
                        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> عون. جميع الحقوق محفوظة.
                    </p>
                </div>
            </div>
        </footer>
    );
}
