"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import { useAuthContext } from "@/shared/providers";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("@/features/chat/components/ChatWidget").then(mod => mod.ChatWidget), { ssr: false });
import { APP_EVENTS } from "@/shared/utils/events";
import { ROUTES } from "@/shared/constants/routes";
import { ImpersonationBanner } from "@/shared/components/layout/ImpersonationBanner";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthContext();

    const isDashboard = pathname?.startsWith("/dashboard");
    const isAuth =
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forgot-password" ||
        pathname === "/reset-password" ||
        pathname === "/verify-code";
    const hideLayout = isDashboard || isAuth;

    // Redirect authenticated users away from auth pages
    useEffect(() => {
        if (!isLoading && isAuthenticated && isAuth) {
            router.push("/dashboard");
        }
    }, [isLoading, isAuthenticated, isAuth, router]);

    // Graceful Unauthorized Listener
    useEffect(() => {
        const handleUnauthorized = () => {
            if (!isAuth && pathname !== "/") {
                router.push(`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(pathname || '/')}`);
            }
        };

        window.addEventListener(APP_EVENTS.AUTH_UNAUTHORIZED, handleUnauthorized);
        return () => window.removeEventListener(APP_EVENTS.AUTH_UNAUTHORIZED, handleUnauthorized);
    }, [pathname, isAuth, router]);

    return (
        <>
            <ImpersonationBanner />
            {!hideLayout && <Header />}
            <main className={!hideLayout ? "min-h-screen" : ""}>{children}</main>
            {!hideLayout && <Footer />}
            {/* Show global chat widget on all non-dashboard / non-auth pages */}
            {!hideLayout && <ChatWidget />}
        </>
    );
}
