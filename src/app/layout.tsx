import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";
import { AuthProvider } from "@/shared/providers";
import LayoutContent from "./LayoutContent";

/**
 * Production-grade self-hosted Cairo font — zero external dependencies at build/runtime.
 * Variable font (400-900) covers arabic + latin via 3 woff2 subsets (~81KB total).
 * Build will NEVER fail due to Google Fonts network issues (offline-safe).
 */
const font = localFont({
    src: [
        {
            path: "./fonts/Cairo-Arabic.woff2",
            weight: "200 900",
            style: "normal",
        },
        {
            path: "./fonts/Cairo-Latin.woff2",
            weight: "200 900",
            style: "normal",
        },
        {
            path: "./fonts/Cairo-LatinExt.woff2",
            weight: "200 900",
            style: "normal",
        },
    ],
    display: "swap",
    variable: "--font-cairo",
    fallback: ["system-ui", "Segoe UI", "Tahoma", "Arial", "sans-serif"],
    preload: true,
});


import { cookies } from "next/headers";
import { ThemeProvider } from "@/shared/providers";

// Site URL — server-only, never exposed to client bundle.
// Fallback to legacy NEXT_PUBLIC_SITE_URL for backwards compat, then hardcoded production domain.
const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    process.env.SITE_URL ||
    "https://aounn.runasp.net";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "عون | مد يد المساعدة للأسر المحتاجة في مصر",
    description: "المنصة الرقمية الأولى في مصر لربط الأسر المحتاجة بالجمعيات الخيرية والمؤسسات المعتمدة بذكاء وأمان وشفافية تامة.",
    keywords: ["عون", "مساعدة", "خير", "جمعيات خيرية", "مصر", "دعم أسر", "تكافل"],
    authors: [{ name: "فريق عون" }],
    openGraph: {
        title: "منصة عون - المساعدة في دقائق",
        description: "نوصل المساعدة إلى كل أسرة بأمان وسرعة. انضم إلينا الآن كمستفيد أو كجمعية شريكة.",
        url: SITE_URL,
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");
    const isAuthenticated = !!token;

    // Derive API hosts for dns-prefetch (server-only env, never bundle full URL to client except host)
    const apiHost = (() => {
        try {
            return new URL(process.env.API_URL || "https://aounn.runasp.net").origin;
        } catch {
            return "https://aounn.runasp.net";
        }
    })();
    const aiHost = (() => {
        try {
            return new URL(process.env.AI_API_URL || "https://muhammadmahmoud-awn-ai-service.hf.space").origin;
        } catch {
            return "https://muhammadmahmoud-awn-ai-service.hf.space";
        }
    })();

    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <head>
                <link rel="dns-prefetch" href={apiHost} />
                {/* Keep external services as dns-prefetch only to avoid unused preconnect warnings */}
                <link rel="dns-prefetch" href="https://api.dicebear.com" />
                <link rel="dns-prefetch" href={aiHost} />
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
