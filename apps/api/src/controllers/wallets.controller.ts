/**
 * Wallets Controller
 * Handles connected wallets HTTP endpoints
 */

import type { Request, Response } from 'express';

import { UserProfileService } from '../services/user-profile.service.js';

/**
 * GET /api/wallets
 */
import { WalletAnalysisService } from '../services/wallet-analysis.service.js';

export const getWallets = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    console.log('[API] getWallets for user:', userId);

    const [wallets, analysisHistory] = await Promise.all([
        UserProfileService.getConnectedWallets(userId),
        WalletAnalysisService.getAnalysisHistory(userId, { limit: 100 })
    ]);

    // Merge analysis data into wallets
    const walletsWithBalance = wallets.map(wallet => {
        const latestAnalysis = analysisHistory.analyses.find(a =>
            a.walletAddress.toLowerCase() === wallet.walletAddress.toLowerCase() &&
            a.blockchain === wallet.blockchain
        );

        if (latestAnalysis) {
            const data = latestAnalysis.analysisData as any;
            return {
                ...wallet,
                balance: data.balance || 0,
                balanceUsd: (data.balance || 0) * (data.currentPrice || 0),
                lastSync: latestAnalysis.createdAt,
            };
        }
        return wallet;
    });

    console.log('[API] Found wallets with balance:', walletsWithBalance);

    res.status(200).json({ wallets: walletsWithBalance });
};

/**
 * POST /api/wallets/connect
 */
export const connectWallet = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const walletData = req.body;
    console.log('[API] connectWallet for user:', userId, 'data:', walletData);

    const wallet = await UserProfileService.addConnectedWallet(userId, walletData);
    console.log('[API] Connected wallet result:', wallet);

    res.status(201).json({ wallet });
};

/**
 * DELETE /api/wallets/:id
 */
export const disconnectWallet = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const walletId = req.params['id']!;

    const result = await UserProfileService.removeConnectedWallet(userId as string, walletId as string);

    res.status(200).json(result);
};

/**
 * PATCH /api/wallets/:id/primary
 */
export const setPrimary = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const walletId = req.params['id']!;

    const wallet = await UserProfileService.setPrimaryWallet(userId as string, walletId as string);

    res.status(200).json({ wallet });
};

export const WalletsController = {
    getWallets,
    connectWallet,
    disconnectWallet,
    setPrimary,
};
