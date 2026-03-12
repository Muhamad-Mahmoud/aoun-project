/**
 * Token Storage Security
 * Utilizes Next.js Server Actions to safely store tokens inside HttpOnly Cookies.
 */

import { storeTokenAction, removeTokenAction } from "@/app/actions/authActions";

export async function setSecureToken(key: string, token: string): Promise<void> {
    await storeTokenAction(key, token);
}

export async function removeSecureToken(key: string): Promise<void> {
    await removeTokenAction(key);
}
