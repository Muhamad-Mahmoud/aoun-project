import { useState, useCallback } from 'react';
import { searchApi, SearchAssociationDto, CampaignDto } from '../api/searchApi';

export function useSearch() {
    const [loading, setLoading] = useState(false);
    const [associations, setAssociations] = useState<SearchAssociationDto[]>([]);
    const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);

    const searchAssociations = useCallback(async (query?: string, governorate?: string, serviceType?: string) => {
        try {
            setLoading(true);
            const data = await searchApi.searchAssociations(query, governorate, serviceType);
            setAssociations(data);
            return data;
        } catch (err) {
            console.error("Failed to search associations", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCampaigns = useCallback(async (query?: string, associationId?: number) => {
        try {
            setLoading(true);
            const data = await searchApi.searchCampaigns(query, associationId);
            setCampaigns(data);
            return data;
        } catch (err) {
            console.error("Failed to search campaigns", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        associations,
        campaigns,
        searchAssociations,
        searchCampaigns
    };
}
