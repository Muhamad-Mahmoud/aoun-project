"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <>
            {!isDashboard && <Header />}
            <main className={!isDashboard ? "min-h-screen" : ""}>
                {children}
            </main>
            {!isDashboard && <Footer />}
        </>
    );
}
