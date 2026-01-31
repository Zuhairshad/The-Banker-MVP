/**
 * Error Handler Middleware
 * Centralized error handling with proper status codes
 */

import type { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger.js';

/**
 * Custom API Error class with status code
 */
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly code: string;

    constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, code: string = 'BAD_REQUEST'): ApiError {
        return new ApiError(message, 400, code);
    }

    static unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED'): ApiError {
        return new ApiError(message, 401, code);
    }

    static forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN'): ApiError {
        return new ApiError(message, 403, code);
    }

    static notFound(message: string = 'Not found', code: string = 'NOT_FOUND'): ApiError {
        return new ApiError(message, 404, code);
    }

    static conflict(message: string, code: string = 'CONFLICT'): ApiError {
        return new ApiError(message, 409, code);
    }

    static internal(message: string = 'Internal server error', code: string = 'INTERNAL_ERROR'): ApiError {
        return new ApiError(message, 500, code);
    }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log the error
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle ApiError
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
        });
        return;
    }

    // Handle Zod validation errors (in case they slip through)
    if (err.name === 'ZodError') {
        res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
        });
        return;
    }

    // Handle Supabase errors
    if ('code' in err && typeof (err as any).code === 'string') {
        const supabaseError = err as { code: string; message: string };

        if (supabaseError.code === 'PGRST301') {
            res.status(404).json({
                error: 'Resource not found',
                code: 'NOT_FOUND',
            });
            return;
        }

        if (supabaseError.code === '23505') {
            res.status(409).json({
                error: 'Resource already exists',
                code: 'DUPLICATE',
            });
            return;
        }
    }

    // Default to 500 Internal Server Error
    res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        error: `Route ${req.method} ${req.path} not found`,
        code: 'ROUTE_NOT_FOUND',
    });
};
