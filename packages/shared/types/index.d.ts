/**
 * Shared types between frontend and backend
 * Add your shared type definitions here
 */
export interface User {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Wallet {
    id: string;
    userId: string;
    address: string;
    chain: Chain;
    label?: string;
    createdAt: Date;
    updatedAt: Date;
}
export type Chain = 'ethereum' | 'bitcoin' | 'solana' | 'polygon';
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
export interface CryptoAsset {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    marketCap: number;
    volume24h: number;
    image?: string;
}
export interface WalletBalance {
    asset: CryptoAsset;
    balance: number;
    value: number;
}
export interface WalletAnalysis {
    walletId: string;
    totalValue: number;
    balances: WalletBalance[];
    riskScore: number;
    aiInsights: string[];
    analyzedAt: Date;
}
//# sourceMappingURL=index.d.ts.map