/**
 * Wallet Analysis Service
 * Fetches transactions, calculates metrics, generates AI insights
 */

import { getAdminClient, type Database } from '../lib/supabase.js';
import {
    fetchBitcoinTransactions,
    fetchEthereumTransactions,
    getCoinPrice,
    type Transaction,
} from '../lib/coingecko.js';
import { generateInsights, type InvestmentPreferences, type AnalysisData } from '../lib/gemini.js';
import { ApiError } from '../middleware/error-handler.js';
import { logger } from '../utils/logger.js';
import { getUserPreferences } from './user-profile.service.js';

type AnalysisRow = Database['public']['Tables']['wallet_analyses']['Row'];

// Convert snake_case DB row to camelCase
const toAnalysisDto = (row: AnalysisRow) => ({
    id: row.id,
    userId: row.user_id,
    walletAddress: row.wallet_address,
    blockchain: row.blockchain,
    analysisData: row.analysis_data,
    aiInsights: row.ai_insights,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
});

/**
 * Fetch Bitcoin transactions for an address
 */
export const fetchBitcoinTxs = async (address: string): Promise<Transaction[]> => {
    return fetchBitcoinTransactions(address);
};

/**
 * Fetch Ethereum transactions for an address
 */
export const fetchEthereumTxs = async (
    address: string,
    options?: { includeTokenTransfers?: boolean }
): Promise<Transaction[]> => {
    return fetchEthereumTransactions(address, options);
};

export interface ProfitLossResult {
    totalProfitLoss: number;
    realizedGains: number;
    unrealizedGains: number;
    costBasis: number;
    totalVolume: number;
    transactionCount: number;
}

/**
 * Calculate profit/loss metrics from transactions
 */
export const calculateProfitLoss = async (
    walletAddress: string,
    transactions: Transaction[],
    currentPrice: number
): Promise<ProfitLossResult> => {
    if (transactions.length === 0) {
        return {
            totalProfitLoss: 0,
            realizedGains: 0,
            unrealizedGains: 0,
            costBasis: 0,
            totalVolume: 0,
            transactionCount: 0,
        };
    }

    let totalReceived = 0;
    let totalSent = 0;
    let totalVolume = 0;

    for (const tx of transactions) {
        const value = parseFloat(tx.value) || 0;
        totalVolume += value;

        // Compare case-insensitive
        if (tx.from.toLowerCase() === walletAddress.toLowerCase()) {
            totalSent += value;
        } else {
            totalReceived += value;
        }
    }

    const balance = totalReceived - totalSent;
    const currentValue = balance * currentPrice;

    // Estimate cost basis (simplified - in production, use actual historical prices)
    const avgPrice = currentPrice * 0.8; // Assume 20% gain on average
    const costBasis = balance * avgPrice;

    const unrealizedGains = currentValue - costBasis;
    const realizedGains = totalSent * (currentPrice - avgPrice);

    // Ensure we don't return NaN if something is weird
    const safeTotalPL = (unrealizedGains + realizedGains) || 0;

    return {
        totalProfitLoss: safeTotalPL,
        realizedGains: realizedGains || 0,
        unrealizedGains: unrealizedGains || 0,
        costBasis: costBasis || 0,
        totalVolume,
        transactionCount: transactions.length,
    };
};

/**
 * Generate AI-powered insights based on analysis and user preferences
 */
export const generateAIInsights = async (
    analysisData: AnalysisData,
    userPreferences: InvestmentPreferences
): Promise<string> => {
    try {
        const blockchain = (analysisData['blockchain'] as 'bitcoin' | 'ethereum') || 'ethereum';
        return await generateInsights(analysisData, userPreferences, blockchain);
    } catch (error) {
        logger.error({ err: error }, 'Failed to generate AI insights');
        throw ApiError.internal('Failed to generate AI insights');
    }
};

/**
 * Store analysis in database
 */
export const storeAnalysis = async (
    userId: string,
    walletAddress: string,
    blockchain: 'bitcoin' | 'ethereum',
    analysisData: Record<string, unknown>,
    aiInsights?: string
) => {
    const supabase = getAdminClient();

    // Check if analysis exists for this wallet
    const { data: existing } = await supabase
        .from('wallet_analyses')
        .select('id')
        .eq('user_id', userId)
        .eq('wallet_address', walletAddress)
        .single();

    const existingRecord = existing as any;

    if (existingRecord) {
        // Update existing
        const { data, error } = await supabase
            .from('wallet_analyses')
            // @ts-ignore
            .update({
                analysis_data: analysisData,
                ai_insights: aiInsights ?? null,
            } as any)
            .eq('id', existingRecord.id)
            .select()
            .single();

        if (error) {
            logger.error({ err: error }, 'Error updating analysis');
            throw ApiError.internal('Failed to update analysis');
        }

        return toAnalysisDto(data);
    } else {
        // Create new
        const { data, error } = await supabase
            .from('wallet_analyses')
            .insert({
                user_id: userId,
                wallet_address: walletAddress,
                blockchain,
                analysis_data: analysisData,
                ai_insights: aiInsights ?? null,
            } as any)
            .select()
            .single();

        if (error) {
            logger.error({ err: error }, 'Error creating analysis');
            throw ApiError.internal('Failed to create analysis');
        }

        return toAnalysisDto(data);
    }
};

/**
 * Get analysis history for a user
 */
export const getAnalysisHistory = async (
    userId: string,
    options?: { page?: number; limit?: number; blockchain?: 'bitcoin' | 'ethereum' }
) => {
    const supabase = getAdminClient();
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('wallet_analyses')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (options?.blockchain) {
        query = query.eq('blockchain', options.blockchain);
    }

    const { data, error, count } = await query;

    if (error) {
        logger.error({ err: error }, 'Error fetching analysis history');
        throw ApiError.internal('Failed to fetch analysis history');
    }

    return {
        analyses: data.map(toAnalysisDto),
        pagination: {
            currentPage: page,
            totalPages: Math.ceil((count ?? 0) / limit),
            totalItems: count ?? 0,
            itemsPerPage: limit,
        },
    };
};

/**
 * Generate a full wallet analysis
 */
export const generateFullAnalysis = async (
    userId: string,
    walletAddress: string,
    blockchain: 'bitcoin' | 'ethereum'
) => {
    // Fetch transactions
    const transactions =
        blockchain === 'bitcoin'
            ? await fetchBitcoinTxs(walletAddress)
            : await fetchEthereumTxs(walletAddress);

    // Get current price
    const currentPrice = await getCoinPrice(blockchain);

    // Calculate metrics
    // Calculate metrics
    const metrics = await calculateProfitLoss(walletAddress, transactions, currentPrice);

    // Get user preferences for personalized insights
    const preferences = await getUserPreferences(userId);

    let aiInsights: string | undefined;

    if (preferences) {
        // Generate AI insights
        const analysisDataForAI: AnalysisData = {
            ...metrics,
            blockchain,
            balance: metrics.totalVolume - metrics.totalProfitLoss / currentPrice,
            currentPrice,
        };

        const preferencesForAI: InvestmentPreferences = {
            riskAversion: preferences.riskAversion,
            volatilityTolerance: preferences.volatilityTolerance,
            growthFocus: preferences.growthFocus,
            cryptoExperience: preferences.cryptoExperience,
            innovationTrust: preferences.innovationTrust,
            impactInterest: preferences.impactInterest,
            diversification: preferences.diversification,
            holdingPatience: preferences.holdingPatience,
            monitoringFrequency: preferences.monitoringFrequency,
            adviceOpenness: preferences.adviceOpenness,
        };

        try {
            aiInsights = await generateAIInsights(analysisDataForAI, preferencesForAI);
        } catch {
            // Continue without AI insights if generation fails
            logger.warn('AI insights generation failed, continuing without');
        }
    }

    // Store analysis
    const analysis = await storeAnalysis(
        userId,
        walletAddress,
        blockchain,
        {
            ...metrics,
            currentPrice,
            blockchain,
            analyzedAt: new Date().toISOString(),
        },
        aiInsights
    );

    return analysis;
};

export const WalletAnalysisService = {
    fetchBitcoinTransactions: fetchBitcoinTxs,
    fetchEthereumTransactions: fetchEthereumTxs,
    calculateProfitLoss,
    generateAIInsights,
    storeAnalysis,
    getAnalysisHistory,
    generateFullAnalysis,
};
