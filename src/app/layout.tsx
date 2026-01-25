import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/ui/sonner";
import { AuthProvider } from "@/shared/providers";
import LayoutContent from "./LayoutContent";

const font = Cairo({ subsets: ["arabic", "latin"] });



export const metadata: Metadata = {
    title: "عون - منصة العون للأسر المحتاجة",
    description: "منصة رقمية لربط الأسر المحتاجة بالجمعيات الموثوقة",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <body className={font.className}>
                <AuthProvider>

                    <LayoutContent>
                        {children}
                    </LayoutContent>
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
}
