import { useState, useEffect } from 'react';
import * as leadsService from '../services/api/leadsService';
import { Lead } from '../types/leads';

export const useLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await leadsService.getAvailableLeads();
            setLeads(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des leads');
            console.error('Erreur lors du chargement des leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const purchaseLead = async (leadId: string) => {
        try {
            const result = await leadsService.purchaseLead(leadId);
            // Mettre à jour la liste des leads après l'achat
            await fetchLeads();
            return result;
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return {
        leads,
        loading,
        error,
        refreshLeads: fetchLeads,
        purchaseLead
    };
};
