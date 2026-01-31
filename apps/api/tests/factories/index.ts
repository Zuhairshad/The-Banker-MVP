/**
 * Mock Data Factories
 * Generate test data for unit and integration tests
 */

import { type Blockchain } from './types';

// ============================================
// Types for factories
// ============================================

export interface MockUser {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MockInvestmentPreferences {
    id: string;
    userId: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface MockConnectedWallet {
    id: string;
    userId: string;
    walletAddress: string;
    blockchain: Blockchain;
    nickname: string | null;
    isPrimary: boolean;
    createdAt: Date;
}

export interface MockWalletAnalysis {
    id: string;
    userId: string;
    walletAddress: string;
    blockchain: Blockchain;
    analysisData: Record<string, unknown>;
    aiInsights: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Factory Functions
// ============================================

let userCounter = 0;
let preferencesCounter = 0;
let walletCounter = 0;
let analysisCounter = 0;

/**
 * Create a mock user
 */
export const createMockUser = (overrides?: Partial<MockUser>): MockUser => {
    userCounter += 1;
    const now = new Date();

    return {
        id: `user-${userCounter.toString().padStart(4, '0')}-0000-0000-000000000000`,
        email: `testuser${userCounter}@example.com`,
        createdAt: now,
        updatedAt: now,
        ...overrides,
    };
};

/**
 * Create mock investment preferences
 */
export const createMockPreferences = (
    userId: string,
    profile: 'conservative' | 'balanced' | 'aggressive' = 'balanced',
    overrides?: Partial<MockInvestmentPreferences>
): MockInvestmentPreferences => {
    preferencesCounter += 1;
    const now = new Date();

    const profiles = {
        conservative: {
            riskAversion: 9,
            volatilityTolerance: 2,
            growthFocus: 4,
            cryptoExperience: 3,
            innovationTrust: 3,
            impactInterest: 5,
            diversification: 8,
            holdingPatience: 7,
            monitoringFrequency: 4,
            adviceOpenness: 8,
        },
        balanced: {
            riskAversion: 5,
            volatilityTolerance: 5,
            growthFocus: 6,
            cryptoExperience: 5,
            innovationTrust: 6,
            impactInterest: 6,
            diversification: 6,
            holdingPatience: 5,
            monitoringFrequency: 6,
            adviceOpenness: 5,
        },
        aggressive: {
            riskAversion: 2,
            volatilityTolerance: 9,
            growthFocus: 9,
            cryptoExperience: 8,
            innovationTrust: 8,
            impactInterest: 4,
            diversification: 3,
            holdingPatience: 3,
            monitoringFrequency: 9,
            adviceOpenness: 3,
        },
    };

    return {
        id: `pref-${preferencesCounter.toString().padStart(4, '0')}-0000-0000-000000000000`,
        userId,
        ...profiles[profile],
        createdAt: now,
        updatedAt: now,
        ...overrides,
    };
};

/**
 * Create a mock connected wallet
 */
export const createMockWallet = (
    userId: string,
    blockchain: Blockchain = 'ethereum',
    overrides?: Partial<MockConnectedWallet>
): MockConnectedWallet => {
    walletCounter += 1;

    const addresses = {
        bitcoin: `bc1q${walletCounter.toString().padStart(38, 'a')}`,
        ethereum: `0x${walletCounter.toString(16).padStart(40, 'a')}`,
    };

    return {
        id: `wallet-${walletCounter.toString().padStart(4, '0')}-0000-0000-000000000000`,
        userId,
        walletAddress: addresses[blockchain],
        blockchain,
        nickname: `Test Wallet ${walletCounter}`,
        isPrimary: walletCounter === 1,
        createdAt: new Date(),
        ...overrides,
    };
};

/**
 * Create a mock wallet analysis
 */
export const createMockAnalysis = (
    userId: string,
    walletAddress: string,
    blockchain: Blockchain = 'ethereum',
    overrides?: Partial<MockWalletAnalysis>
): MockWalletAnalysis => {
    analysisCounter += 1;
    const now = new Date();

    const sampleData = {
        bitcoin: {
            totalTransactions: 45,
            totalReceivedBtc: 2.5,
            totalSentBtc: 0.8,
            balanceBtc: 1.7,
            profitLossEstimateUsd: 12500,
        },
        ethereum: {
            totalTransactions: 120,
            totalReceivedEth: 15.5,
            totalSentEth: 8.2,
            balanceEth: 7.3,
            profitLossEstimateUsd: 8750,
        },
    };

    return {
        id: `analysis-${analysisCounter.toString().padStart(4, '0')}-0000-0000-000000000000`,
        userId,
        walletAddress,
        blockchain,
        analysisData: sampleData[blockchain],
        aiInsights: `AI-generated insights for ${blockchain} wallet analysis.`,
        createdAt: now,
        updatedAt: now,
        ...overrides,
    };
};

/**
 * Create a mock auth token
 */
export const createMockAuthToken = (userId: string): string => {
    return `mock-jwt-token-for-${userId}`;
};

/**
 * Create mock transaction data
 */
export const createMockTransactionData = (
    blockchain: Blockchain,
    count: number = 10
): Record<string, unknown>[] => {
    const transactions: Record<string, unknown>[] = [];

    for (let i = 0; i < count; i += 1) {
        transactions.push({
            hash: `0x${(i + 1).toString(16).padStart(64, 'a')}`,
            blockNumber: 1000000 + i,
            timestamp: new Date(Date.now() - i * 86400000).toISOString(),
            from: `0x${'1'.padStart(40, '0')}`,
            to: `0x${'2'.padStart(40, '0')}`,
            value: blockchain === 'ethereum' ? `${0.1 * (i + 1)}` : `${0.01 * (i + 1)}`,
            gasUsed: blockchain === 'ethereum' ? '21000' : undefined,
            fee: blockchain === 'bitcoin' ? '0.0001' : undefined,
        });
    }

    return transactions;
};

/**
 * Reset all counters (useful for test isolation)
 */
export const resetFactories = (): void => {
    userCounter = 0;
    preferencesCounter = 0;
    walletCounter = 0;
    analysisCounter = 0;
};
