import type { ChatMessageDto } from '../api/chatApi';

export type ChatMessage = ChatMessageDto & {
    /** Local id for optimistic messages not yet echoed by the server. */
    clientId?: string;
    pending?: boolean;
    failed?: boolean;
};

/** Merge incoming server messages with local state: dedupe by id, reconcile optimistic temps. */
export function mergeMessages(prev: ChatMessage[], incoming: ChatMessageDto[]): ChatMessage[] {
    const byId = new Map<number, ChatMessageDto>();
    for (const m of incoming) byId.set(m.id, m);

    const next: ChatMessage[] = [];
    const matched = new Set<number>();

    for (const local of prev) {
        if (local.pending && local.clientId) {
            const echo = incoming.find(
                (s) => s.senderId === local.senderId && s.message === local.message && !matched.has(s.id),
            );
            if (echo) {
                matched.add(echo.id);
                next.push({ ...echo });
                continue;
            }
            const ageMs = Date.now() - new Date(local.createdAt).getTime();
            if (Number.isFinite(ageMs) && ageMs < 60_000) next.push(local);
            continue;
        }
        const server = byId.get(local.id);
        if (server) {
            matched.add(server.id);
            next.push({ ...server });
        }
    }

    for (const m of incoming) {
        if (!matched.has(m.id)) next.push({ ...m });
    }

    return next.sort((a, b) => {
        if (a.id < 0 || b.id < 0) return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return a.id - b.id;
    });
}
