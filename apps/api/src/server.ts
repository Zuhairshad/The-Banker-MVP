/**
 * Banker Expert API Server
 * Express application with rate limiting, Swagger docs, and security middleware
 */

import 'express-async-errors';

import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';

import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { generalLimiter, requestLogger } from './middleware/rate-limiter.js';
import routes from './routes/index.js';
import { setupSwagger } from './swagger.js';
import { env } from './utils/env.js';
import { logger } from './utils/logger.js';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: env.NODE_ENV === 'production' ? 'https://banker-expert.com' : '*',
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// General rate limiting (skip in test)
if (env.NODE_ENV !== 'test') {
    app.use(generalLimiter as any);
}

// Setup Swagger documentation
setupSwagger(app);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API info endpoint
app.get('/api', (_req: Request, res: Response) => {
    res.json({
        message: 'Banker Expert API',
        version: '0.1.0',
        documentation: '/api/docs',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                validate: 'POST /api/auth/validate',
                updatePassword: 'PATCH /api/auth/password',
                deleteAccount: 'DELETE /api/auth/account',
            },
            user: {
                profile: 'GET /api/user/profile',
                preferences: 'GET /api/user/preferences',
                updatePreferences: 'PATCH /api/user/preferences',
            },
            wallets: {
                list: 'GET /api/wallets',
                connect: 'POST /api/wallets/connect',
                disconnect: 'DELETE /api/wallets/:id',
                setPrimary: 'PATCH /api/wallets/:id/primary',
            },
            analysis: {
                generate: 'POST /api/analysis/generate',
                history: 'GET /api/analysis/history',
                get: 'GET /api/analysis/:id',
            },
        },
    });
});

// Mount API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

const PORT = env.PORT;

// Only start server if not in test mode and not on Vercel
if (env.NODE_ENV !== 'test' && !(process.env as any).VERCEL) {
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info(`Environment: ${env.NODE_ENV}`);
        logger.info(`API documentation: http://localhost:${PORT}/api/docs`);
    });
}

export default app;
