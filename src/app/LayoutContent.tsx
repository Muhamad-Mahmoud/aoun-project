"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
    const hideLayout = isDashboard || isAuth;

    return (
        <>
            {!hideLayout && <Header />}
            <main className={!hideLayout ? "min-h-screen" : ""}>
                {children}
            </main>
            {!hideLayout && <Footer />}
        </>
    );
}
