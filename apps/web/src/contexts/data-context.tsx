'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api, Wallet, AnalysisResult } from '@/lib/api-client';
import { useAuth } from './auth-context';

interface DataContextType {
    wallets: Wallet[];
    reports: AnalysisResult[];
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
    addWallet: (address: string, blockchain: 'bitcoin' | 'ethereum', nickname: string) => Promise<void>;
    removeWallet: (walletId: string) => Promise<void>;
    generateAnalysis: (walletAddress: string, blockchain: 'bitcoin' | 'ethereum') => Promise<AnalysisResult>;
    stats: {
        totalProfitLoss: number;
        activeWallets: number;
        reportsGenerated: number;
    };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { user, session } = useAuth();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [reports, setReports] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!user || !session) return;

        setIsLoading(true);
        setError(null);
        try {
            const [walletsData, reportsData] = await Promise.all([
                api.getWallets(),
                api.getAnalysisHistory()
            ]);
            console.log('[DataContext] Fetched wallets:', walletsData);
            console.log('[DataContext] Fetched reports:', reportsData);
            setWallets(walletsData);
            setReports(reportsData);
        } catch (err: any) {
            console.error('[DataContext] Error fetching data:', err);
            setError(err.message || 'Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    }, [user, session]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addWallet = async (address: string, blockchain: 'bitcoin' | 'ethereum', nickname: string) => {
        try {
            await api.connectWallet(address, blockchain, nickname);
            await fetchData();
        } catch (err: any) {
            throw new Error(err.message || 'Failed to connect wallet');
        }
    };

    const removeWallet = async (walletId: string) => {
        try {
            await api.disconnectWallet(walletId);
            await fetchData();
        } catch (err: any) {
            throw new Error(err.message || 'Failed to disconnect wallet');
        }
    };

    const generateAnalysis = async (walletAddress: string, blockchain: 'bitcoin' | 'ethereum') => {
        try {
            const result = await api.generateAnalysis(walletAddress, blockchain);
            await fetchData();
            return result;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to generate analysis');
        }
    };

    const stats = useMemo(() => ({
        totalProfitLoss: reports.reduce((sum, r) => sum + r.profitLoss, 0),
        activeWallets: wallets.length,
        reportsGenerated: reports.length,
    }), [reports, wallets]);

    const value = {
        wallets,
        reports,
        isLoading,
        error,
        refreshData: fetchData,
        addWallet,
        removeWallet,
        generateAnalysis,
        stats
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
