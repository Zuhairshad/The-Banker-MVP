/**
 * Auth Controller
 * Handles authentication HTTP endpoints
 */

import type { Request, Response } from 'express';

import { AuthService } from '../services/auth.service.js';

/**
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, preferences } = req.body;

    let result;
    if (preferences) {
        result = await AuthService.registerUserWithPreferences(email, password, preferences);
    } else {
        result = await AuthService.registerUser(email, password);
    }

    res.status(201).json({
        user: result.user,
        token: result.session?.access_token,
        refreshToken: result.session?.refresh_token,
    });
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const result = await AuthService.loginUser(email, password);

    res.status(200).json({
        user: result.user,
        token: result.session?.access_token,
        refreshToken: result.session?.refresh_token,
    });
};

/**
 * POST /api/auth/validate
 */
export const validateToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    const result = await AuthService.validateToken(token);

    res.status(200).json(result);
};

/**
 * PATCH /api/auth/password
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    const result = await AuthService.updatePassword(userId, currentPassword, newPassword);

    res.status(200).json(result);
};

/**
 * DELETE /api/auth/account
 */
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const result = await AuthService.deleteUser(userId);

    res.status(200).json(result);
};

export const AuthController = {
    register,
    login,
    validateToken,
    updatePassword,
    deleteAccount,
};
