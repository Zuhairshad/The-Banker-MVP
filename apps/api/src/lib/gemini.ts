/**
 * Google Gemini AI Client
 * Generates personalized investment insights with retry logic
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

import { env } from '../utils/env.js';
import { logger } from '../utils/logger.js';

/** Maximum number of retry attempts for API calls */
const MAX_RETRIES = 3;
/** Initial delay between retries in milliseconds */
const INITIAL_RETRY_DELAY_MS = 1000;

let genAI: GoogleGenerativeAI | null = null;

/**
 * Get or create the Gemini client singleton
 * @returns GoogleGenerativeAI client instance
 * @throws Error if GEMINI_API_KEY is not configured
 */
const getClient = (): GoogleGenerativeAI => {
    if (genAI) return genAI;

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Missing GEMINI_API_KEY');
    }

    genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
};

/**
 * Execute a function with retry logic and exponential backoff
 * @param fn - Async function to execute
 * @param retries - Number of retries remaining
 * @param delay - Current delay in ms
 * @returns Result of the function
 * @throws Error if all retries are exhausted
 */
async function withRetry<T>(
    fn: () => Promise<T>,
    retries: number = MAX_RETRIES,
    delay: number = INITIAL_RETRY_DELAY_MS
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) {
            throw error;
        }

        logger.warn(`Gemini API retry, ${retries} attempts remaining. Waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));

        return withRetry(fn, retries - 1, delay * 2);
    }
}

/**
 * User investment preferences for personalized insights
 */
export interface InvestmentPreferences {
    /** Risk aversion level (1-10, higher = more risk averse) */
    riskAversion: number;
    /** Tolerance for price volatility (1-10) */
    volatilityTolerance: number;
    /** Focus on growth vs stability (1-10) */
    growthFocus: number;
    /** Prior cryptocurrency experience (1-10) */
    cryptoExperience: number;
    /** Trust in innovative/new projects (1-10) */
    innovationTrust: number;
    /** Interest in impact investing (1-10) */
    impactInterest: number;
    /** Preference for diversification (1-10) */
    diversification: number;
    /** Patience for long-term holding (1-10) */
    holdingPatience: number;
    /** Frequency of portfolio monitoring (1-10) */
    monitoringFrequency: number;
    /** Openness to advisory suggestions (1-10) */
    adviceOpenness: number;
}

/**
 * Wallet analysis data for AI insights generation
 */
export interface AnalysisData {
    /** Total number of transactions */
    totalTransactions?: number;
    /** Total trading volume */
    totalVolume?: number;
    /** Net profit or loss */
    profitLoss?: number;
    /** Current wallet balance */
    balance?: number;
    /** Risk metrics */
    riskMetrics?: {
        /** Price volatility measure */
        volatility?: number;
        /** Sharpe ratio for risk-adjusted returns */
        sharpeRatio?: number;
    };
    /** Additional custom properties */
    [key: string]: unknown;
}

/**
 * Generate personalized AI insights based on wallet analysis and user preferences
 * Uses retry logic with exponential backoff for reliability
 * 
 * @param analysisData - Wallet analysis metrics
 * @param preferences - User's investment preferences
 * @param blockchain - Type of blockchain ('bitcoin' or 'ethereum')
 * @returns Promise resolving to AI-generated insights text
 * @throws Error if AI generation fails after retries
 * 
 * @example
 * const insights = await generateInsights(
 *   { totalVolume: 5.5, profitLoss: 0.3 },
 *   { riskAversion: 7, ... },
 *   'bitcoin'
 * );
 */
export const generateInsights = async (
    analysisData: AnalysisData,
    preferences: InvestmentPreferences,
    blockchain: 'bitcoin' | 'ethereum'
): Promise<string> => {
    return withRetry(async () => {
        const client = getClient();
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Determine investor profile based on preferences
        const avgRiskScore =
            (preferences.riskAversion +
                (10 - preferences.volatilityTolerance) +
                (10 - preferences.growthFocus)) /
            3;

        let investorProfile: string;
        if (avgRiskScore >= 7) {
            investorProfile = 'conservative';
        } else if (avgRiskScore >= 4) {
            investorProfile = 'balanced';
        } else {
            investorProfile = 'aggressive';
        }

        const prompt = `You are an expert cryptocurrency investment advisor. Analyze the following ${blockchain} wallet data and provide personalized investment insights.

USER PROFILE:
- Investor Type: ${investorProfile}
- Risk Aversion: ${preferences.riskAversion}/10
- Volatility Tolerance: ${preferences.volatilityTolerance}/10
- Growth Focus: ${preferences.growthFocus}/10
- Crypto Experience: ${preferences.cryptoExperience}/10
- Diversification Preference: ${preferences.diversification}/10
- Holding Patience: ${preferences.holdingPatience}/10

WALLET ANALYSIS DATA:
${JSON.stringify(analysisData, null, 2)}

Please provide:
1. A brief assessment of the wallet's investment performance
2. Risk analysis tailored to the user's profile
3. 2-3 specific, actionable recommendations based on their preferences
4. A risk score (1-10) for this portfolio given the user's profile

Format your response in a clear, professional manner. Keep it concise (max 300 words).`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error('Empty response from Gemini');
        }

        return text;
    });
};

/**
 * Generate a simple summary for quick display
 * 
 * @param profitLoss - Net profit/loss value
 * @param blockchain - Blockchain type
 * @returns Promise resolving to short summary text
 * 
 * @example
 * const summary = await generateQuickSummary(0.5, 'bitcoin');
 */
export const generateQuickSummary = async (
    profitLoss: number,
    blockchain: 'bitcoin' | 'ethereum'
): Promise<string> => {
    return withRetry(async () => {
        const client = getClient();
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const performance = profitLoss >= 0 ? 'profit' : 'loss';
        const prompt = `In one sentence (under 50 words), summarize a ${blockchain} wallet with a ${Math.abs(profitLoss)} ${blockchain.toUpperCase().slice(0, 3)} net ${performance}. Be neutral and professional.`;

        const result = await model.generateContent(prompt);
        return result.response.text() ?? 'Analysis complete.';
    });
};
