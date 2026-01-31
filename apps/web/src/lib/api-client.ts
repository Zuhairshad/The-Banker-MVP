import { createClient } from '@/lib/supabase/client';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';

export interface AnalysisResult {
    id: string;
    walletAddress: string;
    blockchain: 'bitcoin' | 'ethereum';
    totalValue: number;
    profitLoss: number;
    profitLossPercent: number;
    aiInsights: string;
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

export interface UserPreferences {
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

/**
 * API client for Banker Expert backend
 */
export class BankerAPI {
    private async getAuthHeaders(): Promise<HeadersInit> {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        return {
            'Content-Type': 'application/json',
            ...(session?.access_token && {
                Authorization: `Bearer ${session.access_token}`,
            }),
        };
    }

    private async fetch<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
                // If JSON parsing fails, stick with the status code message
            }
            throw new Error(errorMessage);
        }

        return response.json();
    }

    // Auth endpoints
    async register(email: string, password: string, name: string, preferences: UserPreferences) {
        return this.fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, preferences }),
        });
    }

    async login(email: string, password: string) {
        return this.fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async validateSession() {
        return this.fetch('/api/auth/validate');
    }

    // User endpoints
    async getProfile() {
        return this.fetch('/api/user/profile');
    }

    async updatePreferences(preferences: Partial<UserPreferences>) {
        return this.fetch('/api/user/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences),
        });
    }

    async deleteAccount() {
        return this.fetch('/api/user/account', {
            method: 'DELETE',
        });
    }

    // Wallet endpoints
    async getWallets(): Promise<Wallet[]> {
        const response = await this.fetch<any>('/api/wallets');
        return response.wallets || [];
    }

    async connectWallet(address: string, blockchain: 'bitcoin' | 'ethereum', nickname: string) {
        return this.fetch('/api/wallets/connect', {
            method: 'POST',
            body: JSON.stringify({ walletAddress: address, blockchain, nickname }),
        });
    }

    async disconnectWallet(walletId: string) {
        return this.fetch(`/api/wallets/${walletId}`, {
            method: 'DELETE',
        });
    }

    // Analysis endpoints
    async generateAnalysis(walletAddress: string, blockchain: 'bitcoin' | 'ethereum'): Promise<AnalysisResult> {
        return this.fetch('/api/analysis/generate', {
            method: 'POST',
            body: JSON.stringify({ walletAddress, blockchain }),
        });
    }

    async getAnalysisHistory(): Promise<AnalysisResult[]> {
        const response = await this.fetch<any>('/api/analysis/history');
        return response.analyses || [];
    }

    async getAnalysis(id: string): Promise<AnalysisResult> {
        return this.fetch(`/api/analysis/${id}`);
    }
}

// Singleton instance
export const api = new BankerAPI();
