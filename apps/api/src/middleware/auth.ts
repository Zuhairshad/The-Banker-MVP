/**
 * Authentication Middleware
 * Validates JWT tokens using Supabase
 */

import type { Request, Response, NextFunction } from 'express';

import { getAdminClient } from '../lib/supabase.js';
import { logger } from '../utils/logger.js';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
            accessToken?: string;
        }
    }
}

/**
 * Extract token from Authorization header
 */
const extractToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
};

/**
 * Auth middleware - validates JWT and attaches user to request
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractToken(req);

        if (!token) {
            res.status(401).json({ error: 'Missing authentication token' });
            return;
        }

        const supabase = getAdminClient();
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            logger.warn({ err: error }, 'Invalid token');
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        // Attach user and token to request
        req.user = {
            id: data.user.id,
            email: data.user.email ?? '',
        };
        req.accessToken = token;

        next();
    } catch (error) {
        logger.error({ err: error }, 'Auth middleware error');
        res.status(500).json({ error: 'Authentication failed' });
    }
};

/**
 * Optional auth middleware - doesn't fail if no token present
 */
export const optionalAuthMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractToken(req);

        if (token) {
            const supabase = getAdminClient();
            const { data } = await supabase.auth.getUser(token);

            if (data.user) {
                req.user = {
                    id: data.user.id,
                    email: data.user.email ?? '',
                };
                req.accessToken = token;
            }
        }

        next();
    } catch {
        // Continue without auth
        next();
    }
};
