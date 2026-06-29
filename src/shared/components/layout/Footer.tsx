import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ChevronLeft } from "lucide-react";


export function Footer() {
    return (
        <footer className="bg-footer text-footer-foreground py-16 md:py-24 border-t border-footer-border overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10" dir="rtl">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-12">
                    {/* Brand - Egyptian Identity */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-1">
                        <Link href="/" aria-label="العودة للصفحة الرئيسية" className="inline-block mb-6 group">
                            <Image
                                src="/logo.png"
                                alt="عون"
                                width={128}
                                height={64}
                                className="h-16 w-auto object-contain opacity-90 group-hover:opacity-100 transition-all duration-300"
                            />
                        </Link>
                        <p className="text-footer-muted leading-relaxed text-base mb-8 max-w-sm">
                            منصة مصرية ١٠٠٪ لخدمة المصريين. نجمع بين التكنولوجيا والعمل الإنساني لضمان وصول الدعم لمستحقيه.
                        </p>

                        {/* Social Links - Egyptian Colors */}
                        <div className="flex items-center gap-3">
                            {[
                                { Icon: Facebook, href: "#", color: "hover:bg-social-facebook", label: "فيسبوك" },
                                { Icon: Twitter, href: "#", color: "hover:bg-social-twitter", label: "تويتر" },
                                { Icon: Instagram, href: "#", color: "hover:bg-social-instagram", label: "انستجرام" },
                                { Icon: Linkedin, href: "#", color: "hover:bg-social-linkedin", label: "لينكد إن" }
                            ].map(({ Icon, href, color, label }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    aria-label={label}
                                    className={`w-10 h-10 rounded-full bg-footer/50 border border-footer-border ${color} hover:text-white text-footer-muted flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:pr-8">
                        <h3 className="text-lg font-bold mb-6 text-footer-foreground relative inline-block">
                            روابط سريعة
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "الرئيسية", href: "/" },
                                { name: "من نحن", href: "#about" },
                                { name: "الحالات", href: "/cases" },
                                { name: "الجهات", href: "#partners" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center text-footer-muted hover:text-footer-foreground transition-all duration-300 font-medium text-[15px]">
                                        <ChevronLeft className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute" />
                                        <span className="group-hover:pr-6 transition-all duration-300">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Users */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-footer-foreground relative inline-block">
                            للمستخدمين
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: "تسجيل الدخول", href: "/login" },
                                { name: "إنشاء حساب جديد", href: "/register" },
                                { name: "الأسئلة الشائعة", href: "#faq" },
                                { name: "سياسة الخصوصية", href: "#privacy" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center text-footer-muted hover:text-footer-foreground transition-all duration-300 font-medium text-[15px]">
                                        <ChevronLeft className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 absolute" />
                                        <span className="group-hover:pr-6 transition-all duration-300">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact - Egyptian Info */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-lg font-bold mb-6 text-footer-foreground relative inline-block">
                            تواصل معنا
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-accent rounded-full"></span>
                        </h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-footer-muted group">
                                <div className="w-10 h-10 rounded-lg bg-footer/50 border border-footer-border group-hover:bg-primary group-hover:border-primary group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 shadow-sm group-hover:shadow-primary/25">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-footer-muted mb-1 font-medium group-hover:text-primary transition-colors">البريد الإلكتروني</span>
                                    <a href="mailto:info@aoun.org" className="text-footer-foreground/90 group-hover:text-footer-foreground transition-colors text-[15px] dir-ltr font-sans hover:underline decoration-primary/50 underline-offset-4">
                                        info@aoun.org
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-footer-muted group">
                                <div className="w-10 h-10 rounded-lg bg-footer/50 border border-footer-border group-hover:bg-primary group-hover:border-primary group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 shadow-sm group-hover:shadow-primary/25">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-footer-muted mb-1 font-medium group-hover:text-primary transition-colors">رقم الهاتف</span>
                                    <a href="tel:+201234567890" className="text-footer-foreground/90 group-hover:text-footer-foreground transition-colors text-[15px] dir-ltr font-sans hover:underline decoration-primary/50 underline-offset-4">
                                        +20 12 345 6789
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-footer-muted group">
                                <div className="w-10 h-10 rounded-lg bg-footer/50 border border-footer-border group-hover:bg-primary group-hover:border-primary group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 shadow-sm group-hover:shadow-primary/25">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-footer-muted mb-1 font-medium group-hover:text-primary transition-colors">العنوان</span>
                                    <span className="text-footer-foreground/90 text-[15px] group-hover:text-footer-foreground transition-colors">القاهرة – جمهورية مصر العربية</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - Egyptian Pride */}
                <div className="pt-8 border-t border-footer-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-footer-muted text-sm">
                        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> منصة عون – مصرية ١٠٠٪ لخدمة المصريين 🇪🇬
                    </p>
                    <p className="text-footer-muted text-sm flex items-center gap-1.5" dir="ltr">
                        Made with <Heart className="w-4 h-4 fill-secondary text-primary animate-pulse" /> by Aoun Team
                    </p>
                </div>

            </div>
        </footer>
    );
}
