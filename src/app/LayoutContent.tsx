"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { useAuthContext } from "@/shared/providers";

// Lazy load ChatWidget — defers ChatWindow, react-markdown, streaming hook to a separate chunk
const ChatWidget = dynamic(
    () => import("@/features/chat/components/ChatWidget").then(m => ({ default: m.ChatWidget })),
    { ssr: false }
);

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthContext();

    const isDashboard = pathname?.startsWith("/dashboard");
    const isAuth = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password" || pathname === "/verify-code";
    const hideLayout = isDashboard || isAuth;

    // Redirect authenticated users away from auth pages
    useEffect(() => {
        if (!isLoading && isAuthenticated && isAuth) {
            router.push("/dashboard");
        }
    }, [isLoading, isAuthenticated, isAuth, router]);

    return (
        <>
            {!hideLayout && <Header />}
            <main className={!hideLayout ? "min-h-screen" : ""}>{children}</main>
            {!hideLayout && <Footer />}
            {/* ChatWidget intentionally not auto-mounted in Phase 1 to reduce initial JS and hydration cost.
                It can be reintroduced later behind an explicit user-triggered button. */}
        </>
    );
}
