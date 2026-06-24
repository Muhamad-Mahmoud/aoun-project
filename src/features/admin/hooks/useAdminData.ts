import { useState, useCallback } from 'react';
import { adminApi, AdminAnalyticsDto, AdminUserDto, AdminAssociationDto } from '../api/adminApi';

export function useAdminData() {
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState<AdminAnalyticsDto | null>(null);
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [associations, setAssociations] = useState<AdminAssociationDto[]>([]);
    const [requests, setRequests] = useState<any[]>([]);

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAnalytics();
            setAnalytics(data);
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAssociations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAssociations();
            setAssociations(data);
        } catch (err) {
            console.error("Failed to fetch associations", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAllRequests();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleUserStatus = async (id: string) => {
        try {
            const newState = await adminApi.toggleUserStatus(id);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: newState } : u));
            return true;
        } catch (err) {
            console.error("Failed to toggle user status", err);
            return false;
        }
    };

    const toggleAssociationStatus = async (id: number) => {
        try {
            const newState = await adminApi.toggleAssociationStatus(id);
            setAssociations(prev => prev.map(a => a.id === id ? { ...a, isActive: newState } : a));
            return true;
        } catch (err) {
            console.error("Failed to toggle association status", err);
            return false;
        }
    };

    return {
        loading,
        analytics,
        users,
        associations,
        requests,
        fetchAnalytics,
        fetchUsers,
        fetchAssociations,
        fetchRequests,
        toggleUserStatus,
        toggleAssociationStatus
    };
}
