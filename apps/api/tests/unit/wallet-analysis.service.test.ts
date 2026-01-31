/**
 * Wallet Analysis Service Tests
 * Verifies the structure and exports of the WalletAnalysisService module
 */

const walletAnalysisModule = require('../../src/services/wallet-analysis.service');

describe('WalletAnalysisService Module', () => {
    it('should export WalletAnalysisService with all methods', () => {
        expect(walletAnalysisModule.WalletAnalysisService).toBeDefined();
        expect(typeof walletAnalysisModule.WalletAnalysisService.fetchBitcoinTransactions).toBe('function');
        expect(typeof walletAnalysisModule.WalletAnalysisService.fetchEthereumTransactions).toBe('function');
        expect(typeof walletAnalysisModule.WalletAnalysisService.calculateProfitLoss).toBe('function');
        expect(typeof walletAnalysisModule.WalletAnalysisService.generateAIInsights).toBe('function');
        expect(typeof walletAnalysisModule.WalletAnalysisService.storeAnalysis).toBe('function');
        expect(typeof walletAnalysisModule.WalletAnalysisService.getAnalysisHistory).toBe('function');
    });
});

describe('WalletAnalysisService Types', () => {
    it('should define service methods correctly', () => {
        expect(walletAnalysisModule.WalletAnalysisService).toBeDefined();
        expect(Object.keys(walletAnalysisModule.WalletAnalysisService)).toContain('calculateProfitLoss');
    });
});
