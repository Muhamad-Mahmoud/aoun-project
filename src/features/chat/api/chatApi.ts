import { apiClient as api } from '@/lib/api';

export interface ChatMessageDto {
    id: number;
    assistanceRequestId: number;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

export interface CreateChatMessageDto {
    assistanceRequestId: number;
    message: string;
}

export interface ChatThreadDto {
    assistanceRequestId: number;
    requestTitle: string;
    otherPartyName: string;
    lastMessage?: string;
    lastMessageDate?: string;
    unreadCount: number;
    hasMessages: boolean;
}

export const chatApi = {
    getMessages: async (requestId: number): Promise<ChatMessageDto[]> => {
        const response = await api.get(`/api/Chat/requests/${requestId}/messages`);
        return response.data;
    },
    getChatThreads: async (requestId?: number): Promise<ChatThreadDto[]> => {
        const url = requestId ? `/api/Chat/threads?requestId=${requestId}` : '/api/Chat/threads';
        const response = await api.get<ChatThreadDto[]>(url);
        return response.data;
    },
    markAsRead: async (requestId: number): Promise<boolean> => {
        const response = await api.put(`/api/Chat/requests/${requestId}/read`);
        return response.data;
    },
    sendMessage: async (dto: CreateChatMessageDto): Promise<ChatMessageDto> => {
        const response = await api.post<ChatMessageDto>(`/api/Chat/requests/${dto.assistanceRequestId}/messages`, dto);
        return response.data;
    }
};
