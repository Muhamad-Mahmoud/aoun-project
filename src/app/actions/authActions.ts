"use server";

import { cookies } from "next/headers";
import { assertAuthCookieKey, getAuthCookieOptions } from "@/lib/security/authCookies";

/**
 * Server action to securely store the authentication token
 */
export async function storeTokenAction(key: string, token: string) {
    assertAuthCookieKey(key);
    const cookieStore = await cookies();

    cookieStore.set(key, token, getAuthCookieOptions());
}

/**
 * Server action to remove the securely stored authentication token
 */
export async function removeTokenAction(key: string) {
    assertAuthCookieKey(key);
    const cookieStore = await cookies();
    cookieStore.delete(key);
}
