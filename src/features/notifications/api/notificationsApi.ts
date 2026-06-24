import { apiClient as api } from '@/lib/api';
import { NotificationDto } from '../types';

export const getMyNotifications = async (pageNumber = 1, pageSize = 20): Promise<NotificationDto[]> => {
    const response = await api.get('/api/Notifications', {
        params: { pageNumber, pageSize }
    });
    return response.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
    const response = await api.get('/api/Notifications/unread-count');
    return response.data.count;
};

export const markAsRead = async (id: number): Promise<void> => {
    await api.put(`/api/Notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
    await api.put('/api/Notifications/read-all');
};
