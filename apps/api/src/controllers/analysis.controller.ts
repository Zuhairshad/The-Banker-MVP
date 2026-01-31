/**
 * Analysis Controller
 * Handles wallet analysis HTTP endpoints
 */

import type { Request, Response } from 'express';

import { WalletAnalysisService } from '../services/wallet-analysis.service.js';

/**
 * POST /api/analysis/generate
 */
export const generateAnalysis = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { walletAddress, blockchain } = req.body;

    const analysis = await WalletAnalysisService.generateFullAnalysis(
        userId,
        walletAddress,
        blockchain
    );

    res.status(200).json({ analysis });
};

/**
 * GET /api/analysis/history
 */
export const getHistory = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { page, limit, blockchain } = req.query as {
        page?: number;
        limit?: number;
        blockchain?: 'bitcoin' | 'ethereum';
    };

    const result = await WalletAnalysisService.getAnalysisHistory(userId, {
        page,
        limit,
        blockchain,
    });

    res.status(200).json(result);
};

/**
 * GET /api/analysis/:id
 */
export const getAnalysis = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const analysisId = req.params['id'];

    const history = await WalletAnalysisService.getAnalysisHistory(userId);
    const analysis = history.analyses.find((a) => a.id === analysisId);

    if (!analysis) {
        res.status(404).json({ error: 'Analysis not found' });
        return;
    }

    res.status(200).json({ analysis });
};

export const AnalysisController = {
    generateAnalysis,
    getHistory,
    getAnalysis,
};
