/**
 * Authentication Service
 * Handles user registration, login, and account management
 */

import { getAnonClient, getAdminClient, type Database } from '../lib/supabase.js';
import { ApiError } from '../middleware/error-handler.js';
import { type FullPreferencesInput } from '../schemas/index.js';
import { logger } from '../utils/logger.js';

export interface AuthResult {
    user: {
        id: string;
        email: string;
    };
    session?: {
        access_token: string;
        refresh_token: string;
    };
}

export interface RegisterResult extends AuthResult {
    preferences?: Database['public']['Tables']['investment_preferences']['Row'];
}

/**
 * Register a new user with email and password
 */
export const registerUser = async (
    email: string,
    password: string
): Promise<AuthResult> => {
    // MVP: Use Admin Client to create user with auto-confirmed email
    const supabase = getAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error) {
        logger.error(error, 'Registration error:');

        if (error.message.includes('already registered') || error.message.includes('already created')) {
            throw ApiError.conflict('User already exists');
        }

        throw ApiError.badRequest(error.message);
    }

    if (!data.user) {
        throw ApiError.internal('Failed to create user');
    }

    // Auto-login to get session
    const loginResult = await loginUser(email, password);

    return {
        user: {
            id: data.user.id,
            email: data.user.email ?? email,
        },
        session: loginResult.session,
    };
};

/**
 * Register a new user with investment preferences
 */
export const registerUserWithPreferences = async (
    email: string,
    password: string,
    preferences: FullPreferencesInput
): Promise<RegisterResult> => {
    // First, register the user
    const authResult = await registerUser(email, password);

    // Then, create their preferences
    const supabase = getAdminClient();

    const { data: prefsData, error: prefsError } = await supabase
        .from('investment_preferences')
        .insert({
            user_id: authResult.user.id,
            risk_aversion: preferences.riskAversion,
            volatility_tolerance: preferences.volatilityTolerance,
            growth_focus: preferences.growthFocus,
            crypto_experience: preferences.cryptoExperience,
            innovation_trust: preferences.innovationTrust,
            impact_interest: preferences.impactInterest,
            diversification: preferences.diversification,
            holding_patience: preferences.holdingPatience,
            monitoring_frequency: preferences.monitoringFrequency,
            advice_openness: preferences.adviceOpenness,
        } as any)
        .select()
        .single();

    if (prefsError) {
        logger.error(prefsError, 'Failed to create preferences:');
        // User is created but preferences failed - log but don't fail registration
    }

    return {
        ...authResult,
        preferences: prefsData ?? undefined,
    };
};

/**
 * Login user with email and password
 */
export const loginUser = async (
    email: string,
    password: string
): Promise<AuthResult> => {
    const supabase = getAnonClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        logger.error(error, 'Login error:');

        if (error.message.includes('Invalid login credentials')) {
            throw ApiError.unauthorized('Invalid credentials');
        }

        throw ApiError.unauthorized(error.message);
    }

    if (!data.user || !data.session) {
        throw ApiError.internal('Login failed');
    }

    return {
        user: {
            id: data.user.id,
            email: data.user.email ?? email,
        },
        session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        },
    };
};

/**
 * Validate a JWT token
 */
export const validateToken = async (
    token: string
): Promise<{ valid: boolean; user?: { id: string; email: string }; error?: string }> => {
    const supabase = getAdminClient();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return {
            valid: false,
            error: error?.message ?? 'Invalid token',
        };
    }

    // Check if token is expired
    const payload = JSON.parse(atob(token.split('.')[1] ?? '{}'));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
        return {
            valid: false,
            error: 'Token expired',
        };
    }

    return {
        valid: true,
        user: {
            id: data.user.id,
            email: data.user.email ?? '',
        },
    };
};

/**
 * Update user password
 */
export const updatePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<{ success: boolean }> => {
    const supabase = getAdminClient();

    // First, get the user's email
    const { data: userData } = await supabase.auth.admin.getUserById(userId);

    if (!userData.user?.email) {
        throw ApiError.notFound('User not found');
    }

    // Verify current password by attempting login
    const anonClient = getAnonClient();
    const { error: loginError } = await anonClient.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword,
    });

    if (loginError) {
        throw ApiError.badRequest('Current password is incorrect');
    }

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
    });

    if (updateError) {
        logger.error(updateError, 'Password update error:');
        throw ApiError.internal('Failed to update password');
    }

    return { success: true };
};

/**
 * Delete user and all associated data
 */
export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
    const supabase = getAdminClient();

    // Check if user exists
    const { data: userData, error: getUserError } = await supabase.auth.admin.getUserById(userId);

    if (getUserError || !userData.user) {
        throw ApiError.notFound('User not found');
    }

    // Delete user (cascade will handle related data)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
        logger.error(deleteError, 'User deletion error:');
        throw ApiError.internal('Failed to delete user');
    }

    return { success: true };
};

export const AuthService = {
    registerUser,
    registerUserWithPreferences,
    loginUser,
    validateToken,
    updatePassword,
    deleteUser,
};
