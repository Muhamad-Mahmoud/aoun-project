/**
 * Token Storage Security
 * Utilizes Next.js Server Actions to safely store tokens inside HttpOnly Cookies.
 */

import { storeTokenAction, getTokenAction, removeTokenAction } from "@/app/actions/authActions";

const ENCRYPTION_KEY_NAME = 'aoun_token_key';
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Generate or retrieve encryption key
 * Key is generated once per session and stored in memory
 */
let cachedKey: CryptoKey | null = null;

// Simplified storage for now to fix reload issue
// TODO: Implement proper key exchange or persistent key derivation if encryption is strictly required

export async function setSecureToken(key: string, token: string): Promise<void> {
    await storeTokenAction(key, token);
}

export async function getSecureToken(key: string): Promise<string | null> {
    return await getTokenAction(key);
}

export async function removeSecureToken(key: string): Promise<void> {
    await removeTokenAction(key);
}
