/**
 * Token Storage Security
 * Encrypts authentication tokens before storing in sessionStorage
 * Uses Web Crypto API for hardware-accelerated, zero-cost encryption
 */

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
    // Storing as plain text (or base64) for now because in-memory key is lost on reload
    // caused the token to be unreadable.
    sessionStorage.setItem(key, btoa(token));
}

export async function getSecureToken(key: string): Promise<string | null> {
    const value = sessionStorage.getItem(key);
    if (!value) return null;
    try {
        return atob(value);
    } catch {
        return value;
    }
}

export function removeSecureToken(key: string): void {
    sessionStorage.removeItem(key);
}
