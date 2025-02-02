import { useState, useEffect } from 'react';
import * as creditsService from '../services/api/creditsService';

interface CreditBalance {
    amount: number;
    currency: string;
}

interface Transaction {
    id: string;
    amount: number;
    type: 'purchase' | 'usage';
    description: string;
    created_at: string;
}

export const useCredits = () => {
    const [balance, setBalance] = useState<CreditBalance | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = async () => {
        try {
            setLoading(true);
            const data = await creditsService.getUserCredits();
            setBalance(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement du solde');
            console.error('Erreur lors du chargement du solde:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await creditsService.getTransactionHistory();
            setTransactions(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des transactions');
            console.error('Erreur lors du chargement des transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const purchaseCredits = async (amount: number) => {
        try {
            const result = await creditsService.purchaseCredits(amount);
            await fetchBalance(); // Rafraîchir le solde après l'achat
            return result;
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchBalance();
        fetchTransactions();
    }, []);

    return {
        balance,
        transactions,
        loading,
        error,
        purchaseCredits,
        refreshBalance: fetchBalance,
        refreshTransactions: fetchTransactions
    };
};
