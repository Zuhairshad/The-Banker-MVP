/**
 * User Controller
 * Handles user profile HTTP endpoints
 */

import type { Request, Response } from 'express';

import { UserProfileService } from '../services/user-profile.service.js';

/**
 * GET /api/user/preferences
 */
export const getPreferences = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const preferences = await UserProfileService.getUserPreferences(userId);

    res.status(200).json({ preferences });
};

/**
 * PATCH /api/user/preferences
 */
export const updatePreferences = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const updates = req.body;

    const preferences = await UserProfileService.updateUserPreferences(userId, updates);

    res.status(200).json({ preferences });
};

/**
 * GET /api/user/profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    const [preferences, wallets] = await Promise.all([
        UserProfileService.getUserPreferences(userId),
        UserProfileService.getConnectedWallets(userId),
    ]);

    res.status(200).json({
        user: {
            id: userId,
            email: userEmail,
        },
        preferences,
        wallets,
    });
};

export const UserController = {
    getPreferences,
    updatePreferences,
    getProfile,
};
