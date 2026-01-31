'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Seed data types
export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface Wallet {
    id: string;
    address: string;
    blockchain: 'bitcoin' | 'ethereum';
    nickname: string;
    isPrimary: boolean;
    balance: number;
    balanceUsd: number;
    lastSync: string;
}

export interface Report {
    id: string;
    walletAddress: string;
    blockchain: 'bitcoin' | 'ethereum';
    totalValue: number;
    profitLoss: number;
    profitLossPercent: number;
    aiInsights: string;
    createdAt: string;
}

export interface Preferences {
    riskAversion: number;
    volatilityTolerance: number;
    growthFocus: number;
    cryptoExperience: number;
    innovationTrust: number;
    impactInterest: number;
    diversification: number;
    holdingPatience: number;
    monitoringFrequency: number;
    adviceOpenness: number;
}

interface SeedDataContextType {
    user: User | null;
    wallets: Wallet[];
    reports: Report[];
    preferences: Preferences;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<void>;
    updatePreferences: (prefs: Partial<Preferences>) => void;
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    removeWallet: (id: string) => void;
    stats: {
        totalProfitLoss: number;
        activeWallets: number;
        reportsGenerated: number;
    };
}

const defaultPreferences: Preferences = {
    riskAversion: 5,
    volatilityTolerance: 5,
    growthFocus: 7,
    cryptoExperience: 4,
    innovationTrust: 6,
    impactInterest: 5,
    diversification: 7,
    holdingPatience: 6,
    monitoringFrequency: 5,
    adviceOpenness: 8,
};


const SeedDataContext = createContext<SeedDataContextType | null>(null);

export function SeedDataProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [reports] = useState<Report[]>([]);
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

    const login = useCallback(async (email: string, _password: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUser({
            id: '1',
            email,
            name: email.split('@')[0] ?? 'User',
            createdAt: new Date().toISOString(),
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const register = useCallback(async (email: string, _password: string, name: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUser({
            id: '1',
            email,
            name,
            createdAt: new Date().toISOString(),
        });
    }, []);

    const updatePreferences = useCallback((prefs: Partial<Preferences>) => {
        setPreferences((prev) => ({ ...prev, ...prefs }));
    }, []);

    const addWallet = useCallback((wallet: Omit<Wallet, 'id'>) => {
        setWallets((prev) => [
            ...prev,
            { ...wallet, id: Date.now().toString() },
        ]);
    }, []);

    const removeWallet = useCallback((id: string) => {
        setWallets((prev) => prev.filter((w) => w.id !== id));
    }, []);

    const stats = useMemo(() => ({
        totalProfitLoss: reports.reduce((sum, r) => sum + r.profitLoss, 0),
        activeWallets: wallets.length,
        reportsGenerated: reports.length,
    }), [reports, wallets]);

    const value = useMemo(() => ({
        user,
        wallets,
        reports,
        preferences,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updatePreferences,
        addWallet,
        removeWallet,
        stats,
    }), [user, wallets, reports, preferences, login, logout, register, updatePreferences, addWallet, removeWallet, stats]);

    return (
        <SeedDataContext.Provider value={value}>
            {children}
        </SeedDataContext.Provider>
    );
}

export function useSeedData() {
    const context = useContext(SeedDataContext);
    if (!context) {
        throw new Error('useSeedData must be used within a SeedDataProvider');
    }
    return context;
}
