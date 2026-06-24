import { useState, useCallback } from 'react';
import { donationsApi, DonationDto, CreateCampaignDto, CreateDonationDto } from '../api/donationsApi';
import { CampaignDto } from '../api/searchApi';

export function useDonations() {
    const [loading, setLoading] = useState(false);
    const [myCampaigns, setMyCampaigns] = useState<CampaignDto[]>([]);
    const [myDonations, setMyDonations] = useState<DonationDto[]>([]);
    const [campaignDonations, setCampaignDonations] = useState<DonationDto[]>([]);

    const fetchMyCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const data = await donationsApi.getMyCampaigns();
            setMyCampaigns(data);
        } catch (err) {
            console.error("Failed to fetch campaigns", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyDonations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await donationsApi.getMyDonations();
            setMyDonations(data);
        } catch (err) {
            console.error("Failed to fetch donations", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCampaignDonations = useCallback(async (campaignId: number) => {
        try {
            setLoading(true);
            const data = await donationsApi.getCampaignDonations(campaignId);
            setCampaignDonations(data);
            return data;
        } catch (err) {
            console.error("Failed to fetch campaign donations", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createCampaign = async (data: CreateCampaignDto) => {
        try {
            const result = await donationsApi.createCampaign(data);
            setMyCampaigns(prev => [result, ...prev]);
            return result;
        } catch (err) {
            console.error("Failed to create campaign", err);
            throw err;
        }
    };

    const toggleCampaignStatus = async (id: number) => {
        try {
            const newState = await donationsApi.toggleCampaignStatus(id);
            setMyCampaigns(prev => prev.map(c => c.id === id ? { ...c, isActive: newState } : c));
            return true;
        } catch (err) {
            console.error("Failed to toggle campaign", err);
            return false;
        }
    };

    const deleteCampaign = async (id: number) => {
        try {
            const success = await donationsApi.deleteCampaign(id);
            if (success) {
                setMyCampaigns(prev => prev.filter(c => c.id !== id));
            }
            return success;
        } catch (err) {
            console.error("Failed to delete campaign", err);
            return false;
        }
    };

    const confirmDonation = async (id: number) => {
        try {
            const success = await donationsApi.confirmDonation(id);
            if (success) {
                setCampaignDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'Confirmed' } : d));
            }
            return success;
        } catch (err) {
            console.error("Failed to confirm donation", err);
            return false;
        }
    };

    const pledgeDonation = async (data: CreateDonationDto) => {
        try {
            const result = await donationsApi.pledgeDonation(data);
            setMyDonations(prev => [result, ...prev]);
            return result;
        } catch (err) {
            console.error("Failed to pledge donation", err);
            throw err;
        }
    };

    return {
        loading,
        myCampaigns,
        myDonations,
        campaignDonations,
        fetchMyCampaigns,
        fetchMyDonations,
        fetchCampaignDonations,
        createCampaign,
        toggleCampaignStatus,
        deleteCampaign,
        confirmDonation,
        pledgeDonation
    };
}
