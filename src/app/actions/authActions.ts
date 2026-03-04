"use server";

import { cookies } from "next/headers";

/**
 * Allowed cookie keys — prevents arbitrary cookie injection
 */
const ALLOWED_KEYS = ['auth_token', 'refresh_token'] as const;
type AllowedKey = typeof ALLOWED_KEYS[number];

function validateKey(key: string): asserts key is AllowedKey {
    if (!ALLOWED_KEYS.includes(key as AllowedKey)) {
        throw new Error(`Invalid token key: "${key}". Allowed keys: ${ALLOWED_KEYS.join(', ')}`);
    }
}

/**
 * Server action to securely store the authentication token
 */
export async function storeTokenAction(key: string, token: string) {
    validateKey(key);
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
    validateKey(key);
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie ? cookie.value : null;
}

/**
 * Server action to remove the securely stored authentication token
 */
export async function removeTokenAction(key: string) {
    validateKey(key);
    const cookieStore = await cookies();
    cookieStore.delete(key);
}
