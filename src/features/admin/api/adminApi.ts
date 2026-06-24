import { apiClient as api } from '@/lib/api';

export interface AdminAnalyticsDto {
    totalUsers: number;
    totalFamilies: number;
    totalAssociations: number;
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    totalAiAnalyses: number;
}

export interface AdminUserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    isActive: boolean;
    createdAt: string;
}

export interface AdminAssociationDto {
    id: number;
    name: string;
    email: string;
    capacity: number | null;
    isActive: boolean;
    createdAt: string;
    handledRequestsCount: number;
    userId?: string;
}

export const adminApi = {
    getAnalytics: async (): Promise<AdminAnalyticsDto> => {
        const response = await api.get('/api/Admin/analytics');
        return response.data.data;
    },
    
    getUsers: async (): Promise<AdminUserDto[]> => {
        const response = await api.get('/api/Admin/users');
        return response.data.data;
    },
    
    toggleUserStatus: async (id: string): Promise<boolean> => {
        const response = await api.put(`/api/Admin/users/${id}/toggle-status`);
        return response.data.data;
    },
    
    getAssociations: async (): Promise<AdminAssociationDto[]> => {
        const response = await api.get('/api/Admin/associations');
        return response.data.data;
    },
    
    toggleAssociationStatus: async (id: number): Promise<boolean> => {
        const response = await api.put(`/api/Admin/associations/${id}/toggle-status`);
        return response.data.data;
    },
    
    getAllRequests: async (): Promise<any[]> => {
        const response = await api.get('/api/Admin/requests');
        return response.data.data;
    },
    
    getRequestById: async (id: string | number): Promise<any> => {
        const response = await api.get(`/api/Admin/requests/${id}`);
        return response.data.data;
    },
    
    impersonateUser: async (userId: string): Promise<any> => {
        const response = await api.post(`/api/Admin/impersonate/${userId}`);
        const payload = response.data.data;
        
        // Map numeric UserType to role string (same as login)
        const userTypeRaw = payload.user.role ?? (payload.user as any).userType ?? 'Family';
        let resolvedRole = userTypeRaw;
        if (userTypeRaw === 0 || userTypeRaw === '0') resolvedRole = 'Admin';
        else if (userTypeRaw === 1 || userTypeRaw === '1') resolvedRole = 'Family';
        else if (userTypeRaw === 2 || userTypeRaw === '2') resolvedRole = 'Association';
        else if (userTypeRaw === 3 || userTypeRaw === '3') resolvedRole = 'Donor';
        
        payload.user.role = resolvedRole.toString();
        
        return payload;
    }
};
