import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";
import { AuthProvider } from "@/shared/providers";
import LayoutContent from "./LayoutContent";

const font = Cairo({
    subsets: ["arabic", "latin"],
    display: 'swap',
    variable: '--font-cairo',
    weight: ['400', '500', '600', '700', '800', '900'],
});


export const metadata: Metadata = {
    metadataBase: new URL("https://aounn.runasp.net"),
    title: "عون | مد يد المساعدة للأسر المحتاجة في مصر",
    description: "المنصة الرقمية الأولى في مصر لربط الأسر المحتاجة بالجمعيات الخيرية والمؤسسات المعتمدة بذكاء وأمان وشفافية تامة.",
    keywords: ["عون", "مساعدة", "خير", "جمعيات خيرية", "مصر", "دعم أسر", "تكافل"],
    authors: [{ name: "فريق عون" }],
    openGraph: {
        title: "منصة عون - المساعدة في دقائق",
        description: "نوصل المساعدة إلى كل أسرة بأمان وسرعة. انضم إلينا الآن كمستفيد أو كجمعية شريكة.",
        url: "https://aounn.runasp.net",
        siteName: "عون",
        images: [
            {
                url: "/logo-new.webp",
                width: 800,
                height: 600,
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "منصة عون للعمل الإنساني",
        description: "الرابط الذكي بين المتبرعين والجمعيات والأسر المحتاجة.",
        images: ["/logo-new.webp"],
    },
    icons: {
        icon: "/logo-new.webp",
        apple: "/logo-new.webp",
    },
    manifest: "/manifest.json",
};

import { cookies } from "next/headers";
import { ThemeProvider } from "@/shared/providers";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");
    const isAuthenticated = !!token;

    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <head>
                <link rel="dns-prefetch" href="https://aoun-api.runasp.net" />
                {/* Keep external services as dns-prefetch only to avoid unused preconnect warnings */}
                <link rel="dns-prefetch" href="https://api.dicebear.com" />
                <link rel="dns-prefetch" href="https://muhammadmahmoud-awn-ai-service.hf.space" />
                {/* CSRF Protection Hint - Signals backend to use SameSite=Strict cookies */}
                <meta name="csrf-protection" content="SameSite=Strict; Secure" />
            </head>
            <body className={font.variable}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <AuthProvider initialIsAuthenticated={isAuthenticated}>
                        <LayoutContent>
                            {children}
                        </LayoutContent>
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
