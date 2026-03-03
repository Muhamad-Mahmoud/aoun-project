"use server";

import { cookies } from "next/headers";

/**
 * Server action to securely store the authentication token
 */
export async function storeTokenAction(key: string, token: string) {
    const cookieStore = await cookies();
    cookieStore.set(key, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // e.g. 7 days max age
        maxAge: 7 * 24 * 60 * 60,
    });
}

/**
 * Server action to retrieve the securely stored authentication token
 */
export async function getTokenAction(key: string): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie ? cookie.value : null;
}

/**
 * Server action to remove the securely stored authentication token
 */
export async function removeTokenAction(key: string) {
    const cookieStore = await cookies();
    cookieStore.delete(key);
}
