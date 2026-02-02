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

async function getEncryptionKey(): Promise<CryptoKey> {
    if (cachedKey) return cachedKey;

    const keyMaterial = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    cachedKey = keyMaterial;
    return keyMaterial;
}

/**
 * Encrypt a token before storing
 */
export async function encryptToken(token: string): Promise<string> {
    try {
        const key = await getEncryptionKey();
        const encoder = new TextEncoder();
        const data = encoder.encode(token);

        // Generate random IV
        const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

        // Encrypt
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        // Combine IV + encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encrypted), iv.length);

        // Convert to base64 for storage
        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('Token encryption failed, storing plain text', error);
        return token; // Fallback to plain storage if encryption fails
    }
}

/**
 * Decrypt a token after retrieving
 */
export async function decryptToken(encryptedToken: string): Promise<string> {
    try {
        const key = await getEncryptionKey();

        // Decode from base64
        const combined = Uint8Array.from(atob(encryptedToken), c => c.charCodeAt(0));

        // Extract IV and encrypted data
        const iv = combined.slice(0, IV_LENGTH);
        const encrypted = combined.slice(IV_LENGTH);

        // Decrypt
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encrypted
        );

        // Convert back to string
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error('Token decryption failed, returning as-is', error);
        return encryptedToken; // Return as-is if decryption fails (might be plain text)
    }
}

/**
 * Store encrypted token in sessionStorage
 */
export async function setSecureToken(key: string, token: string): Promise<void> {
    const encrypted = await encryptToken(token);
    sessionStorage.setItem(key, encrypted);
}

/**
 * Retrieve and decrypt token from sessionStorage
 */
export async function getSecureToken(key: string): Promise<string | null> {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;

    return await decryptToken(encrypted);
}

/**
 * Remove token from sessionStorage
 */
export function removeSecureToken(key: string): void {
    sessionStorage.removeItem(key);
}
