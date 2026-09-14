import { mergeMessages } from './chatMerge';
import type { ChatMessageDto } from '../api/chatApi';

const base: ChatMessageDto = {
    id: 1,
    assistanceRequestId: 7,
    senderId: 'u1',
    senderName: 'A',
    message: 'hello',
    createdAt: new Date().toISOString(),
    isRead: true,
};

describe('mergeMessages', () => {
    it('dedupes server echoes of optimistic messages', () => {
        const prev = [{ ...base, id: -5, pending: true, clientId: 'c1' }];
        const next = mergeMessages(prev, [{ ...base, id: 99 }]);
        expect(next).toHaveLength(1);
        expect(next[0].id).toBe(99);
        expect(next[0].pending).toBeUndefined();
    });

    it('drops exact duplicate server ids', () => {
        const next = mergeMessages([{ ...base }], [{ ...base }]);
        expect(next).toHaveLength(1);
    });

    it('keeps young pending messages and drops stale ones', () => {
        const fresh = { ...base, id: -1, pending: true, clientId: 'c-fresh', createdAt: new Date().toISOString() };
        const stale = {
            ...base,
            id: -2,
            pending: true,
            clientId: 'c-stale',
            message: 'different-text-never-echoed',
            createdAt: new Date(Date.now() - 120_000).toISOString(),
        };
        const next = mergeMessages([fresh, stale], []);
        expect(next.some((m) => m.clientId === 'c-fresh')).toBe(true);
        expect(next.some((m) => m.clientId === 'c-stale')).toBe(false);
    });
});
