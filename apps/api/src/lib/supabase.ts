/**
 * Supabase Client
 * Provides admin and user-context Supabase clients
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from '../utils/env.js';

// Types for our database tables
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            investment_preferences: {
                Row: {
                    id: string;
                    user_id: string;
                    risk_aversion: number;
                    volatility_tolerance: number;
                    growth_focus: number;
                    crypto_experience: number;
                    innovation_trust: number;
                    impact_interest: number;
                    diversification: number;
                    holding_patience: number;
                    monitoring_frequency: number;
                    advice_openness: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    risk_aversion: number;
                    volatility_tolerance: number;
                    growth_focus: number;
                    crypto_experience: number;
                    innovation_trust: number;
                    impact_interest: number;
                    diversification: number;
                    holding_patience: number;
                    monitoring_frequency: number;
                    advice_openness: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['investment_preferences']['Insert']>;
            };
            wallet_analyses: {
                Row: {
                    id: string;
                    user_id: string;
                    wallet_address: string;
                    blockchain: 'bitcoin' | 'ethereum';
                    analysis_data: Record<string, unknown>;
                    ai_insights: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    wallet_address: string;
                    blockchain: 'bitcoin' | 'ethereum';
                    analysis_data: Record<string, unknown>;
                    ai_insights?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['wallet_analyses']['Insert']>;
            };
            connected_wallets: {
                Row: {
                    id: string;
                    user_id: string;
                    wallet_address: string;
                    blockchain: 'bitcoin' | 'ethereum';
                    nickname: string | null;
                    is_primary: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    wallet_address: string;
                    blockchain: 'bitcoin' | 'ethereum';
                    nickname?: string | null;
                    is_primary?: boolean;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['connected_wallets']['Insert']>;
            };
        };
    };
}

// Admin client (uses service role key - bypasses RLS)
let adminClient: SupabaseClient<Database> | null = null;

export const getAdminClient = (): SupabaseClient<Database> => {
    if (adminClient) return adminClient;

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase configuration');
    }

    adminClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    return adminClient;
};

// User client factory (uses user's JWT - respects RLS)
export const getUserClient = (accessToken: string): SupabaseClient<Database> => {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        throw new Error('Missing Supabase configuration');
    }

    return createClient<Database>(supabaseUrl, anonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
};

// Anonymous client (for auth operations)
let anonClient: SupabaseClient<Database> | null = null;

export const getAnonClient = (): SupabaseClient<Database> => {
    if (anonClient) return anonClient;

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        throw new Error('Missing Supabase configuration');
    }

    anonClient = createClient<Database>(supabaseUrl, anonKey);

    return anonClient;
};

export type { SupabaseClient };
