jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
}));

import {
    normalizeRole,
    extractRawRole,
    getRoleHome,
    isRoleAllowed,
    isSameOriginRequest,
    decodePayloadUnsafe,
} from './edgeAuth';

describe('normalizeRole', () => {
    it.each([
        ['Admin', 'admin'],
        ['admin', 'admin'],
        [0, 'admin'],
        ['0', 'admin'],
        ['Family', 'family'],
        [1, 'family'],
        ['Association', 'association'],
        ['organization', 'association'],
        ['Org', 'association'],
        [2, 'association'],
        ['Donor', 'donor'],
        [3, 'donor'],
        ['WEIRD', 'unknown'],
        ['', 'unknown'],
        [undefined, 'unknown'],
    ])('normalizes %p → %p', (raw, expected) => {
        expect(normalizeRole(raw)).toBe(expected);
    });
});

describe('extractRawRole', () => {
    it('reads standard + .NET namespaced claims', () => {
        expect(extractRawRole({ role: 'Donor' })).toBe('Donor');
        expect(extractRawRole({ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin' })).toBe('Admin');
        expect(extractRawRole({ userType: 2 })).toBe('2');
    });

    it('takes the first entry of array claims', () => {
        expect(extractRawRole({ roles: ['Family', 'Donor'] })).toBe('Family');
    });

    it('returns empty string when no claim exists', () => {
        expect(extractRawRole({})).toBe('');
    });
});

describe('getRoleHome / isRoleAllowed', () => {
    it('maps roles to canonical homes', () => {
        expect(getRoleHome('admin')).toBe('/dashboard/admin');
        expect(getRoleHome('donor')).toBe('/dashboard/donor');
        expect(getRoleHome('association')).toBe('/dashboard/organization');
        expect(getRoleHome('family')).toBe('/dashboard/family');
    });

    it('admin may access everything; roles are confined to their prefix', () => {
        expect(isRoleAllowed('/dashboard/family', 'admin')).toBe(true);
        expect(isRoleAllowed('/dashboard/donor', 'admin')).toBe(true);
        expect(isRoleAllowed('/dashboard/family', 'family')).toBe(true);
        expect(isRoleAllowed('/dashboard/family/settings', 'family')).toBe(true);
        expect(isRoleAllowed('/dashboard/donor', 'family')).toBe(false);
        expect(isRoleAllowed('/dashboard/admin', 'donor')).toBe(false);
        expect(isRoleAllowed('/dashboard/organization/requests', 'association')).toBe(true);
        expect(isRoleAllowed('/dashboard', 'unknown')).toBe(false);
        // Non-dashboard paths are unaffected by the role gate
        expect(isRoleAllowed('/explore', 'unknown')).toBe(true);
    });
});

describe('isSameOriginRequest (strict CSRF check)', () => {
    it('accepts exact origin match', () => {
        expect(isSameOriginRequest('https://aounn.runasp.net', null, 'aounn.runasp.net')).toBe(true);
    });

    it('rejects subdomain-suffix bypass (victim.com.evil.com)', () => {
        expect(isSameOriginRequest('https://aounn.runasp.net.evil.com', null, 'aounn.runasp.net')).toBe(false);
    });

    it('falls back to referer when origin is absent', () => {
        expect(isSameOriginRequest(null, 'https://aounn.runasp.net/dashboard', 'aounn.runasp.net')).toBe(true);
        expect(isSameOriginRequest(null, 'https://evil.com/x', 'aounn.runasp.net')).toBe(false);
    });

    it('fails closed when both are missing', () => {
        expect(isSameOriginRequest(null, null, 'aounn.runasp.net')).toBe(false);
    });
});

describe('decodePayloadUnsafe', () => {
    it('decodes base64url payloads and rejects malformed tokens', () => {
        const payload = { role: 'Donor' };
        const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
        expect(decodePayloadUnsafe(`h.${b64}.s`)).toEqual(payload);
        expect(decodePayloadUnsafe('not-a-jwt')).toBeNull();
    });
});
