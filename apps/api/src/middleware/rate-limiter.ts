/**
 * Rate Limiter Middleware
 * Prevents API abuse with configurable limits per endpoint type
 */

import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for dev
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    validate: false, // Disable IPv6 validation
    keyGenerator: (req: Request) => {
        // Use user ID if authenticated, otherwise use IP
        return req.user?.id ?? req.ip ?? 'unknown';
    },
});

/**
 * AI Analysis rate limiter
 * 5 requests per hour per user (stricter limit for expensive operations)
 */
export const aiAnalysisLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        error: 'AI analysis rate limit exceeded',
        message: 'You can only generate 5 AI analyses per hour. Please try again later.',
        retryAfter: 60 * 60,
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
    keyGenerator: (req: Request) => {
        // Must use user ID for AI limits (always authenticated)
        return req.user?.id ?? 'unknown';
    },
    skip: (_req: Request) => {
        // Skip rate limiting in test environment
        return process.env['NODE_ENV'] === 'test';
    },
});

/**
 * Auth endpoint rate limiter
 * 10 requests per minute (prevents brute force)
 */
export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: {
        error: 'Too many authentication attempts',
        message: 'Please wait before trying again.',
        retryAfter: 60,
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
    keyGenerator: (req: Request) => {
        return req.ip ?? 'unknown';
    },
    skip: (_req: Request) => {
        return process.env['NODE_ENV'] === 'test';
    },
});

/**
 * Request logging middleware
 * Logs all incoming requests with method, path, and timing
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?.id ?? 'anonymous',
            ip: req.ip,
        };

        if (process.env['NODE_ENV'] === 'test') {
            // Skip logging in tests
        } else if (res.statusCode >= 400) {
            console.error('[REQUEST]', JSON.stringify(log));
        } else {
            console.log('[REQUEST]', JSON.stringify(log));
        }
    });

    next();
};
