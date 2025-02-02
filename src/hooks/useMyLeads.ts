import { useState, useEffect } from 'react';
import * as leadsService from '../services/api/leadsService';
import { Lead } from '../types/leads';
import { useAuth } from './useAuth';

export const useMyLeads = () => {
    const { user } = useAuth();
    const [myLeads, setMyLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyLeads = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const data = await leadsService.getMyLeads();
            setMyLeads(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement de vos leads');
            console.error('Erreur lors du chargement de vos leads:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyLeads();
        }
    }, [user]);

    return {
        myLeads,
        loading,
        error,
        refreshMyLeads: fetchMyLeads
    };
};
