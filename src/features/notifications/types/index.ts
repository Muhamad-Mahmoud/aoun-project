export interface NotificationDto {
    id: number;
    title: string;
    body: string;
    type: string;
    relatedRequestId?: number | null;
    isRead: boolean;
    createdAt: string;
}
