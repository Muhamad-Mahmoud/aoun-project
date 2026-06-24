import { apiClient as api } from '@/lib/api';

export interface SearchAssociationDto {
    id: number;
    name: string;
    description: string | null;
    logoUrl: string | null;
    services: string[];
    locations: string[];
    activeCampaignsCount: number;
}

export interface CampaignDto {
    id: number;
    title: string;
    description: string;
    targetAmount: number | null;
    currentAmount: number;
    requiredItems: string | null;
    imageUrl: string | null;
    articleContent: string | null;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    associationId: number;
    associationName: string;
    paymentInstructions?: string;
}

export const searchApi = {
    searchAssociations: async (query?: string, governorate?: string, serviceType?: string): Promise<SearchAssociationDto[]> => {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (governorate) params.append('governorate', governorate);
        if (serviceType) params.append('serviceType', serviceType);
        
        const response = await api.get(`/api/Search/associations?${params.toString()}`);
        return response.data.data;
    },

    searchCampaigns: async (query?: string, associationId?: number): Promise<CampaignDto[]> => {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (associationId) params.append('associationId', associationId.toString());
        
        const response = await api.get(`/api/Search/campaigns?${params.toString()}`);
        return response.data.data;
    }
};
