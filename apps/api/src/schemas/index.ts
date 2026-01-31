/**
 * Validation Schemas
 * Zod schemas for API request validation
 */

import { z } from 'zod';

// ============================================
// Auth Schemas
// ============================================

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    preferences: z
        .object({
            riskAversion: z.number().min(1).max(10),
            volatilityTolerance: z.number().min(1).max(10),
            growthFocus: z.number().min(1).max(10),
            cryptoExperience: z.number().min(1).max(10),
            innovationTrust: z.number().min(1).max(10),
            impactInterest: z.number().min(1).max(10),
            diversification: z.number().min(1).max(10),
            holdingPatience: z.number().min(1).max(10),
            monitoringFrequency: z.number().min(1).max(10),
            adviceOpenness: z.number().min(1).max(10),
        })
        .optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// ============================================
// User Preferences Schemas
// ============================================

export const preferencesSchema = z.object({
    riskAversion: z.number().min(1).max(10).optional(),
    volatilityTolerance: z.number().min(1).max(10).optional(),
    growthFocus: z.number().min(1).max(10).optional(),
    cryptoExperience: z.number().min(1).max(10).optional(),
    innovationTrust: z.number().min(1).max(10).optional(),
    impactInterest: z.number().min(1).max(10).optional(),
    diversification: z.number().min(1).max(10).optional(),
    holdingPatience: z.number().min(1).max(10).optional(),
    monitoringFrequency: z.number().min(1).max(10).optional(),
    adviceOpenness: z.number().min(1).max(10).optional(),
});

export const fullPreferencesSchema = z.object({
    riskAversion: z.number().min(1, 'Value must be between 1 and 10').max(10, 'Value must be between 1 and 10'),
    volatilityTolerance: z.number().min(1).max(10),
    growthFocus: z.number().min(1).max(10),
    cryptoExperience: z.number().min(1).max(10),
    innovationTrust: z.number().min(1).max(10),
    impactInterest: z.number().min(1).max(10),
    diversification: z.number().min(1).max(10),
    holdingPatience: z.number().min(1).max(10),
    monitoringFrequency: z.number().min(1).max(10),
    adviceOpenness: z.number().min(1).max(10),
});

// ============================================
// Wallet Schemas
// ============================================

export const blockchainSchema = z.enum(['bitcoin', 'ethereum']);

export const walletAddressSchema = z.string().refine(
    (val) => {
        // Bitcoin address patterns
        const btcPattern = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
        // Ethereum address pattern
        const ethPattern = /^0x[a-fA-F0-9]{40}$/;
        return btcPattern.test(val) || ethPattern.test(val);
    },
    { message: 'Invalid wallet address' }
);

export const connectWalletSchema = z.object({
    walletAddress: z.string().min(1, 'Wallet address is required'),
    blockchain: blockchainSchema,
    nickname: z.string().max(50).optional(),
});

export const walletIdParamSchema = z.object({
    id: z.string().uuid('Invalid wallet ID'),
});

// ============================================
// Analysis Schemas
// ============================================

export const generateAnalysisSchema = z.object({
    walletAddress: z.string().min(1, 'Wallet address is required'),
    blockchain: blockchainSchema,
});

export const analysisHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    blockchain: blockchainSchema.optional(),
});

// ============================================
// Type exports
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type FullPreferencesInput = z.infer<typeof fullPreferencesSchema>;
export type ConnectWalletInput = z.infer<typeof connectWalletSchema>;
export type GenerateAnalysisInput = z.infer<typeof generateAnalysisSchema>;
export type AnalysisHistoryQuery = z.infer<typeof analysisHistoryQuerySchema>;
