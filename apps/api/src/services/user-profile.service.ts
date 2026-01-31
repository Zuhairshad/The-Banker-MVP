/**
 * User Profile Service
 * Manages user preferences and connected wallets
 */

import { getAdminClient, type Database } from '../lib/supabase.js';
import { validateWalletAddress } from '../lib/coingecko.js';
import { ApiError } from '../middleware/error-handler.js';
import { type PreferencesInput, type ConnectWalletInput } from '../schemas/index.js';
import { logger } from '../utils/logger.js';

type PreferencesRow = Database['public']['Tables']['investment_preferences']['Row'];
type WalletRow = Database['public']['Tables']['connected_wallets']['Row'];

// Convert snake_case DB row to camelCase
const toPreferencesDto = (row: PreferencesRow) => ({
    id: row.id,
    userId: row.user_id,
    riskAversion: row.risk_aversion,
    volatilityTolerance: row.volatility_tolerance,
    growthFocus: row.growth_focus,
    cryptoExperience: row.crypto_experience,
    innovationTrust: row.innovation_trust,
    impactInterest: row.impact_interest,
    diversification: row.diversification,
    holdingPatience: row.holding_patience,
    monitoringFrequency: row.monitoring_frequency,
    adviceOpenness: row.advice_openness,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
});

const toWalletDto = (row: WalletRow) => ({
    id: row.id,
    userId: row.user_id,
    walletAddress: row.wallet_address,
    blockchain: row.blockchain,
    nickname: row.nickname,
    isPrimary: row.is_primary,
    balance: 0,
    balanceUsd: 0,
    createdAt: new Date(row.created_at),
});

/**
 * Get user investment preferences
 */
export const getUserPreferences = async (userId: string) => {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('investment_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned
            return null;
        }
        logger.error({ err: error }, 'Error fetching preferences');
        throw ApiError.internal('Failed to fetch preferences');
    }

    return toPreferencesDto(data);
};

/**
 * Update user preferences (upsert)
 */
export const updateUserPreferences = async (
    userId: string,
    preferences: PreferencesInput
) => {
    const supabase = getAdminClient();

    // Check if preferences exist
    const existing = await getUserPreferences(userId);

    if (existing) {
        // Update existing
        const updateData: Record<string, number> = {};

        if (preferences.riskAversion !== undefined) updateData['risk_aversion'] = preferences.riskAversion;
        if (preferences.volatilityTolerance !== undefined) updateData['volatility_tolerance'] = preferences.volatilityTolerance;
        if (preferences.growthFocus !== undefined) updateData['growth_focus'] = preferences.growthFocus;
        if (preferences.cryptoExperience !== undefined) updateData['crypto_experience'] = preferences.cryptoExperience;
        if (preferences.innovationTrust !== undefined) updateData['innovation_trust'] = preferences.innovationTrust;
        if (preferences.impactInterest !== undefined) updateData['impact_interest'] = preferences.impactInterest;
        if (preferences.diversification !== undefined) updateData['diversification'] = preferences.diversification;
        if (preferences.holdingPatience !== undefined) updateData['holding_patience'] = preferences.holdingPatience;
        if (preferences.monitoringFrequency !== undefined) updateData['monitoring_frequency'] = preferences.monitoringFrequency;
        if (preferences.adviceOpenness !== undefined) updateData['advice_openness'] = preferences.adviceOpenness;

        const { data, error } = await supabase
            .from('investment_preferences')
            // @ts-ignore
            .update(updateData as any)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            logger.error({ err: error }, 'Error updating preferences');
            throw ApiError.internal('Failed to update preferences');
        }

        return toPreferencesDto(data);
    } else {
        // Create new - all fields required
        const requiredFields = [
            'riskAversion',
            'volatilityTolerance',
            'growthFocus',
            'cryptoExperience',
            'innovationTrust',
            'impactInterest',
            'diversification',
            'holdingPatience',
            'monitoringFrequency',
            'adviceOpenness',
        ] as const;

        for (const field of requiredFields) {
            if (preferences[field] === undefined) {
                throw ApiError.badRequest(`Missing required field: ${field}`);
            }
        }

        const { data, error } = await supabase
            .from('investment_preferences')
            // @ts-ignore
            .insert({
                user_id: userId,
                risk_aversion: preferences.riskAversion!,
                volatility_tolerance: preferences.volatilityTolerance!,
                growth_focus: preferences.growthFocus!,
                crypto_experience: preferences.cryptoExperience!,
                innovation_trust: preferences.innovationTrust!,
                impact_interest: preferences.impactInterest!,
                diversification: preferences.diversification!,
                holding_patience: preferences.holdingPatience!,
                monitoring_frequency: preferences.monitoringFrequency!,
                advice_openness: preferences.adviceOpenness!,
            } as any)
            .select()
            .single();

        if (error) {
            logger.error({ err: error }, 'Error creating preferences');
            throw ApiError.internal('Failed to create preferences');
        }

        return toPreferencesDto(data);
    }
};

/**
 * Get user's connected wallets
 */
export const getConnectedWallets = async (userId: string) => {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('connected_wallets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        logger.error({ err: error }, 'Error fetching wallets');
        throw ApiError.internal('Failed to fetch wallets');
    }

    return data.map(toWalletDto);
};

/**
 * Add a connected wallet
 */
export const addConnectedWallet = async (
    userId: string,
    walletData: ConnectWalletInput
) => {
    // Validate address format
    if (!validateWalletAddress(walletData.walletAddress, walletData.blockchain)) {
        throw ApiError.badRequest('Invalid wallet address');
    }

    const supabase = getAdminClient();

    // Check if first wallet (will be primary)
    const existingWallets = await getConnectedWallets(userId);
    const isPrimary = existingWallets.length === 0;

    const { data, error } = await supabase
        .from('connected_wallets')
        // @ts-ignore
        .insert({
            user_id: userId,
            wallet_address: walletData.walletAddress,
            blockchain: walletData.blockchain,
            nickname: walletData.nickname ?? null,
            is_primary: isPrimary,
        } as any)
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            throw ApiError.conflict('Wallet already connected');
        }
        logger.error({ err: error }, 'Error adding wallet');
        throw ApiError.internal('Failed to add wallet');
    }

    return toWalletDto(data);
};

/**
 * Remove a connected wallet
 */
export const removeConnectedWallet = async (
    userId: string,
    walletId: string
) => {
    const supabase = getAdminClient();

    // Check wallet exists and belongs to user
    const { data: existing, error: fetchError } = await supabase
        .from('connected_wallets')
        .select('*')
        .eq('id', walletId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !existing) {
        throw ApiError.notFound('Wallet not found');
    }

    const wasPrimary = (existing as any).is_primary;

    // Delete the wallet
    const { error: deleteError } = await supabase
        .from('connected_wallets')
        .delete()
        .eq('id', walletId)
        .eq('user_id', userId);

    if (deleteError) {
        logger.error({ err: deleteError }, 'Error deleting wallet');
        throw ApiError.internal('Failed to delete wallet');
    }

    // If deleted wallet was primary, set another as primary
    if (wasPrimary) {
        const remainingWallets = await getConnectedWallets(userId);
        if (remainingWallets.length > 0) {
            await setPrimaryWallet(userId, remainingWallets[0]!.id);
        }
    }

    return { success: true };
};

/**
 * Set a wallet as primary
 */
export const setPrimaryWallet = async (userId: string, walletId: string) => {
    const supabase = getAdminClient();

    // Check wallet exists and belongs to user
    const { data: wallet, error: fetchError } = await supabase
        .from('connected_wallets')
        .select('*')
        .eq('id', walletId)
        .eq('user_id', userId)
        .single();

    if (fetchError || !wallet) {
        throw ApiError.notFound('Wallet not found');
    }

    // Update to primary (trigger will unset others)
    const { data, error } = await supabase
        .from('connected_wallets')
        // @ts-ignore
        .update({ is_primary: true } as any)
        .eq('id', walletId)
        .select()
        .single();

    if (error) {
        logger.error({ err: error }, 'Error setting primary wallet');
        throw ApiError.internal('Failed to set primary wallet');
    }

    return toWalletDto(data);
};

export const UserProfileService = {
    getUserPreferences,
    updateUserPreferences,
    getConnectedWallets,
    addConnectedWallet,
    removeConnectedWallet,
    setPrimaryWallet,
};
