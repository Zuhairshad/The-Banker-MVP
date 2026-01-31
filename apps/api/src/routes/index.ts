/**
 * API Routes
 * Aggregates all route definitions with rate limiting
 */

import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller.js';
import { UserController } from '../controllers/user.controller.js';
import { WalletsController } from '../controllers/wallets.controller.js';
import { AnalysisController } from '../controllers/analysis.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter, aiAnalysisLimiter } from '../middleware/rate-limiter.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validation.js';
import {
    registerSchema,
    loginSchema,
    updatePasswordSchema,
    preferencesSchema,
    connectWalletSchema,
    walletIdParamSchema,
    generateAnalysisSchema,
    analysisHistoryQuerySchema,
} from '../schemas/index.js';

const router: Router = Router();

// ============================================
// Auth Routes (Public) - with auth rate limiter
// ============================================

router.post(
    '/auth/register',
    authLimiter,
    validateBody(registerSchema),
    AuthController.register
);

router.post(
    '/auth/login',
    authLimiter,
    validateBody(loginSchema),
    AuthController.login
);

router.post('/auth/validate', AuthController.validateToken);

// ============================================
// Auth Routes (Protected)
// ============================================

router.patch(
    '/auth/password',
    authMiddleware,
    validateBody(updatePasswordSchema),
    AuthController.updatePassword
);

router.delete('/auth/account', authMiddleware, AuthController.deleteAccount);

// ============================================
// User Routes (Protected)
// ============================================

router.get('/user/profile', authMiddleware, UserController.getProfile);

router.get('/user/preferences', authMiddleware, UserController.getPreferences);

router.patch(
    '/user/preferences',
    authMiddleware,
    validateBody(preferencesSchema),
    UserController.updatePreferences
);

// ============================================
// Wallet Routes (Protected)
// ============================================

router.get('/wallets', authMiddleware, WalletsController.getWallets);

router.post(
    '/wallets/connect',
    authMiddleware,
    validateBody(connectWalletSchema),
    WalletsController.connectWallet
);

router.delete(
    '/wallets/:id',
    authMiddleware,
    validateParams(walletIdParamSchema),
    WalletsController.disconnectWallet
);

router.patch(
    '/wallets/:id/primary',
    authMiddleware,
    validateParams(walletIdParamSchema),
    WalletsController.setPrimary
);

// ============================================
// Analysis Routes (Protected) - AI endpoint rate limited
// ============================================

router.post(
    '/analysis/generate',
    authMiddleware,
    aiAnalysisLimiter,  // 5 requests per hour
    validateBody(generateAnalysisSchema),
    AnalysisController.generateAnalysis
);

router.get(
    '/analysis/history',
    authMiddleware,
    validateQuery(analysisHistoryQuerySchema),
    AnalysisController.getHistory
);

router.get('/analysis/:id', authMiddleware, AnalysisController.getAnalysis);

export default router;
