import { apiClient as api } from '@/lib/api';
import { CampaignDto } from './searchApi';

export interface DonationDto {
    id: number;
    amount: number | null;
    inKindItems: string | null;
    notes: string | null;
    status: string;
    createdAt: string;
    campaignId: number;
    campaignTitle: string;
    donorId: string | null;
    donorName: string | null;
}

export interface CreateCampaignDto {
    title: string;
    description: string;
    targetAmount?: number;
    requiredItems?: string;
    endDate?: string;
    imageFile?: File;
    articleContent?: string;
}

export interface CreateDonationDto {
    campaignId: number;
    amount?: number;
    inKindItems?: string;
    notes?: string;
    guestName?: string;
    guestPhone?: string;
}

export const donationsApi = {
    // Association Actions
    createCampaign: async (data: CreateCampaignDto): Promise<CampaignDto> => {
        const formData = new FormData();
        formData.append('Title', data.title);
        formData.append('Description', data.description);
        if (data.targetAmount) formData.append('TargetAmount', data.targetAmount.toString());
        if (data.requiredItems) formData.append('RequiredItems', data.requiredItems);
        if (data.endDate) formData.append('EndDate', data.endDate);
        if (data.articleContent) formData.append('ArticleContent', data.articleContent);
        if (data.imageFile) formData.append('ImageFile', data.imageFile);

        const response = await api.post('/api/Donations/campaigns', formData);
        return response.data.data;
    },
    getMyCampaigns: async (): Promise<CampaignDto[]> => {
        const response = await api.get('/api/Donations/campaigns/my');
        return response.data.data;
    },
    getMyAssociationDonations: async (): Promise<DonationDto[]> => {
        const response = await api.get('/api/Donations/donations/my');
        return response.data.data;
    },
    toggleCampaignStatus: async (id: number): Promise<boolean> => {
        const response = await api.put(`/api/Donations/campaigns/${id}/toggle`);
        return response.data.data;
    },
    deleteCampaign: async (id: number): Promise<boolean> => {
        const response = await api.delete(`/api/Donations/campaigns/${id}`);
        return response.data.data;
    },
    confirmDonation: async (id: number): Promise<boolean> => {
        const response = await api.put(`/api/Donations/donations/${id}/confirm`);
        return response.data.data;
    },
    getCampaignDonations: async (campaignId: number): Promise<DonationDto[]> => {
        const response = await api.get(`/api/Donations/campaigns/${campaignId}/donations`);
        return response.data.data;
    },

    // Donor Actions
    pledgeDonation: async (data: CreateDonationDto): Promise<DonationDto> => {
        const response = await api.post('/api/Donations/pledge', data);
        return response.data.data;
    },
    getMyDonations: async (): Promise<DonationDto[]> => {
        const response = await api.get('/api/Donations/my-donations');
        return response.data.data;
    },

    // Public
    getCampaignById: async (id: number): Promise<CampaignDto> => {
        const response = await api.get(`/api/Donations/campaigns/${id}`);
        return response.data.data;
    }
};
