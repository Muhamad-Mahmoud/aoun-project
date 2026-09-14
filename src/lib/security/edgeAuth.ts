import { jwtVerify } from 'jose';

export type UserRole = 'admin' | 'family' | 'association' | 'donor' | 'unknown';

const ROLE_CLAIM_KEYS = [
    'role',
    'roles',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role',
    'userType',
    'usertype',
] as const;

/** Extract the raw role claim from a decoded JWT payload (handles string, array, numeric .NET enum). */
export function extractRawRole(payload: Record<string, unknown>): string {
    for (const key of ROLE_CLAIM_KEYS) {
        const v = payload[key];
        if (v === undefined || v === null) continue;
        if (Array.isArray(v)) {
            const first = v.map(String).find((s) => s.length > 0);
            if (first) return first;
        } else if (String(v).length > 0) {
            return String(v);
        }
    }
    return '';
}

/**
 * Normalize backend role values to the canonical union.
 * Handles: "Admin"/"Family"/"Association"/"Donor" (any case),
 * .NET numeric enum (0=Admin,1=Family,2=Association,3=Donor),
 * and legacy aliases (organization/org/charity → association).
 */
export function normalizeRole(raw: unknown): UserRole {
    const s = String(raw ?? '').trim().toLowerCase();
    if (s === '0' || s === 'admin' || s.includes('admin') || s.includes('أدمن')) return 'admin';
    if (s === '3' || s === 'donor' || s.includes('donor') || s.includes('متبرع') || s.includes('فاعل خير')) return 'donor';
    if (
        s === '2' ||
        s.includes('assoc') ||
        s.includes('organiz') ||
        s === 'org' ||
        s.includes('charity') ||
        s.includes('جمعية') ||
        s.includes('مؤسسة')
    )
        return 'association';
    if (s === '1' || s === 'family' || s.includes('family') || s.includes('أسرة') || s.includes('مستفيد')) return 'family';
    return 'unknown';
}

/** Canonical dashboard home per role. */
export function getRoleHome(role: UserRole): string {
    switch (role) {
        case 'admin':
            return '/dashboard/admin';
        case 'donor':
            return '/dashboard/donor';
        case 'association':
            return '/dashboard/organization';
        case 'family':
            return '/dashboard/family';
        default:
            return '/dashboard';
    }
}

/** URL prefix owned by each role. Admin may access everything. */
const ROLE_PREFIXES: Record<Exclude<UserRole, 'unknown'>, string[]> = {
    admin: ['/dashboard'],
    family: ['/dashboard/family'],
    association: ['/dashboard/organization'],
    donor: ['/dashboard/donor'],
};

export function isRoleAllowed(pathname: string, role: UserRole): boolean {
    if (!pathname.startsWith('/dashboard')) return true;
    if (role === 'admin') return true;
    if (role === 'unknown') return false;
    return ROLE_PREFIXES[role].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Decode payload WITHOUT verifying (routing hint only — never trust for auth). */
export function decodePayloadUnsafe(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const json = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
}

export interface VerifiedSession {
    valid: boolean;
    role: UserRole;
    payload: Record<string, unknown> | null;
}

/**
 * Edge-safe JWT verification (jose works in edge + node runtimes).
 * Returns invalid when secret is missing so proxy fails CLOSED, never open.
 */
export async function verifySessionEdge(token: string | undefined, jwtSecret: string | undefined): Promise<VerifiedSession> {
    if (!token || !jwtSecret) return { valid: false, role: 'unknown', payload: null };
    try {
        const secret = new TextEncoder().encode(jwtSecret);
        const { payload } = await jwtVerify(token, secret);
        const role = normalizeRole(extractRawRole(payload as unknown as Record<string, unknown>));
        return { valid: true, role, payload: payload as unknown as Record<string, unknown> };
    } catch {
        return { valid: false, role: 'unknown', payload: null };
    }
}

// ---------------------------------------------------------------------------
// Strict same-origin check (CSRF). Substring matching is bypassable
// (e.g. victim.com.evil.com includes victim.com) — compare hosts exactly.
// ---------------------------------------------------------------------------

function hostOf(value: string | null): string | null {
    if (!value) return null;
    try {
        return new URL(value).host.toLowerCase();
    } catch {
        return null;
    }
}

/** True when Origin/Referer exactly matches the request Host. Missing both → false (fail closed in prod). */
export function isSameOriginRequest(origin: string | null, referer: string | null, host: string | null): boolean {
    const expected = (host ?? '').toLowerCase();
    if (!expected) return false;
    const o = hostOf(origin);
    if (o) return o === expected;
    const r = hostOf(referer);
    if (r) return r === expected;
    return false;
}
