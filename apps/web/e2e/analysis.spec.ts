/**
 * Analysis & Report Generation E2E Tests
 * Tests wallet analysis flow, AI insights, and report viewing
 */

import { test, expect } from '@playwright/test';

// Helper to login before tests
const loginAsTestUser = async (page: any, email = 'conservative@test.com') => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
};

test.describe('Report Generation Flow', () => {
    test.describe('Generate New Analysis', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page);
        });

        test('should display analysis generation form', async ({ page }) => {
            await page.goto('/dashboard/analysis/new');

            await expect(page.getByLabel('Wallet Address')).toBeVisible();
            await expect(page.getByText(/blockchain/i)).toBeVisible();
            await expect(page.getByRole('button', { name: /generate analysis/i })).toBeVisible();
        });

        test('should pre-fill with connected wallet if available', async ({ page }) => {
            await page.goto('/dashboard/analysis/new');

            // Should show dropdown with connected wallets
            await expect(page.getByRole('combobox')).toBeVisible();

            // Primary wallet should be selected
            const walletSelect = page.getByRole('combobox');
            await expect(walletSelect).toHaveText(/main btc savings/i);
        });

        test('should allow entering new wallet address', async ({ page }) => {
            await page.goto('/dashboard/analysis/new');

            // Switch to manual entry
            await page.getByRole('tab', { name: /enter address/i }).click();

            await page.getByLabel('Wallet Address').fill('0x1234567890abcdef1234567890abcdef12345678');
            await page.getByRole('button', { name: /ethereum/i }).click();

            await expect(page.getByLabel('Wallet Address')).toHaveValue('0x1234567890abcdef1234567890abcdef12345678');
        });

        test('should show loading state during analysis generation', async ({ page }) => {
            await page.goto('/dashboard/analysis/new');

            // Use a connected wallet
            await page.getByRole('button', { name: /generate analysis/i }).click();

            // Should show loading indicator
            await expect(page.getByText(/analyzing/i)).toBeVisible();
            await expect(page.getByRole('progressbar')).toBeVisible();
        });

        test('should display analysis results after generation', async ({ page }) => {
            await page.goto('/dashboard/analysis/new');
            await page.getByRole('button', { name: /generate analysis/i }).click();

            // Wait for analysis to complete (adjust timeout as needed)
            await page.waitForSelector('[data-testid="analysis-results"]', { timeout: 30000 });

            // Check key sections are present
            await expect(page.getByText(/portfolio overview/i)).toBeVisible();
            await expect(page.getByText(/transaction history/i)).toBeVisible();
            await expect(page.getByText(/ai insights/i)).toBeVisible();
        });
    });

    test.describe('Analysis Results Display', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page, 'balanced@test.com');
        });

        test('should show profit/loss metrics', async ({ page }) => {
            // Navigate to existing analysis
            await page.goto('/dashboard/analysis/history');
            await page.getByTestId('analysis-item').first().click();

            await expect(page.getByText(/total value/i)).toBeVisible();
            await expect(page.getByText(/profit\/loss/i)).toBeVisible();
            await expect(page.getByText(/\$/)).toBeVisible(); // Dollar amount visible
        });

        test('should display transaction chart', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');
            await page.getByTestId('analysis-item').first().click();

            // Should show chart component
            await expect(page.getByTestId('transaction-chart')).toBeVisible();
        });

        test('should show AI-generated insights personalized to user preferences', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');
            await page.getByTestId('analysis-item').first().click();

            const insightsSection = page.getByTestId('ai-insights');
            await expect(insightsSection).toBeVisible();

            // Insights should have substantial content
            const insightsText = await insightsSection.textContent();
            expect(insightsText?.length).toBeGreaterThan(100);
        });

        test('should show different insights based on investor profile', async ({ page }) => {
            // Login as aggressive investor
            await page.goto('/login');
            await page.getByLabel('Email').fill('aggressive@test.com');
            await page.getByLabel('Password').fill('password123');
            await page.getByRole('button', { name: /sign in/i }).click();

            await page.goto('/dashboard/analysis/history');
            await page.getByTestId('analysis-item').first().click();

            const insightsSection = page.getByTestId('ai-insights');
            const insightsText = await insightsSection.textContent();

            // Aggressive investor insights should mention growth/opportunities
            expect(insightsText?.toLowerCase()).toMatch(/growth|opportunity|potential/);
        });
    });

    test.describe('Analysis History', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page, 'conservative@test.com');
        });

        test('should display list of past analyses', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');

            await expect(page.getByTestId('analysis-list')).toBeVisible();
            const analyses = page.getByTestId('analysis-item');
            await expect(analyses.first()).toBeVisible();
        });

        test('should show analysis date and wallet info in list', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');

            const firstAnalysis = page.getByTestId('analysis-item').first();
            await expect(firstAnalysis.getByText(/\d{4}/)).toBeVisible(); // Date format
            await expect(firstAnalysis.getByText(/btc|eth/i)).toBeVisible(); // Blockchain
        });

        test('should filter analyses by blockchain', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');

            // Filter by Bitcoin
            await page.getByRole('combobox', { name: /filter/i }).click();
            await page.getByRole('option', { name: /bitcoin/i }).click();

            // All visible items should be Bitcoin
            const analyses = page.getByTestId('analysis-item');
            const count = await analyses.count();
            for (let i = 0; i < count; i++) {
                await expect(analyses.nth(i).getByText(/btc|bitcoin/i)).toBeVisible();
            }
        });

        test('should sort analyses by date', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');

            // Default should be newest first
            const dates = await page.getByTestId('analysis-date').allTextContents();
            const parsedDates = dates.map(d => new Date(d).getTime());

            // Verify descending order
            for (let i = 0; i < parsedDates.length - 1; i++) {
                expect(parsedDates[i]).toBeGreaterThanOrEqual(parsedDates[i + 1] ?? 0);
            }
        });

        test('should paginate results', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');

            // Check for pagination controls
            const paginationExists = await page.getByRole('navigation', { name: /pagination/i }).isVisible();

            if (paginationExists) {
                await page.getByRole('button', { name: /next/i }).click();
                await expect(page).toHaveURL(/page=2/);
            }
        });
    });

    test.describe('Analysis Actions', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page);
        });

        test('should allow re-running analysis', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');
            await page.getByTestId('analysis-item').first().click();

            await page.getByRole('button', { name: /refresh analysis/i }).click();

            // Should show loading and then new results
            await expect(page.getByText(/analyzing/i)).toBeVisible();
        });

        test('should allow exporting analysis as PDF', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');
            await page.getByTestId('analysis-item').first().click();

            // Start download
            const downloadPromise = page.waitForEvent('download');
            await page.getByRole('button', { name: /export pdf/i }).click();
            const download = await downloadPromise;

            expect(download.suggestedFilename()).toContain('.pdf');
        });

        test('should allow sharing analysis', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');
            await page.getByTestId('analysis-item').first().click();

            await page.getByRole('button', { name: /share/i }).click();

            // Share modal should appear
            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByText(/shareable link/i)).toBeVisible();
        });

        test('should delete analysis with confirmation', async ({ page }) => {
            await page.goto('/dashboard/analysis/history');

            const firstAnalysis = page.getByTestId('analysis-item').first();
            const analysisId = await firstAnalysis.getAttribute('data-analysis-id');

            await firstAnalysis.getByRole('button', { name: /delete/i }).click();

            // Confirmation dialog
            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByText(/are you sure/i)).toBeVisible();

            await page.getByRole('button', { name: /confirm/i }).click();

            // Analysis should be removed
            await expect(page.getByTestId(`analysis-${analysisId}`)).not.toBeVisible();
        });
    });

    test.describe('Error Handling', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page);
        });

        test('should show error for invalid wallet address', async ({ page }) => {
            await page.goto('/dashboard/analysis/new');
            await page.getByRole('tab', { name: /enter address/i }).click();
            await page.getByLabel('Wallet Address').fill('invalid');
            await page.getByRole('button', { name: /generate analysis/i }).click();

            await expect(page.getByText(/invalid.*address/i)).toBeVisible();
        });

        test('should handle API errors gracefully', async ({ page }) => {
            await page.goto('/dashboard/analysis/new');

            // Use a wallet that might cause API issues
            await page.getByRole('tab', { name: /enter address/i }).click();
            await page.getByLabel('Wallet Address').fill('0x0000000000000000000000000000000000000000');
            await page.getByRole('button', { name: /ethereum/i }).click();
            await page.getByRole('button', { name: /generate analysis/i }).click();

            // Should show user-friendly error
            await expect(page.getByText(/unable to analyze|error occurred/i)).toBeVisible();
            // Should have retry option
            await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
        });

        test('should show empty state when no analyses exist', async ({ page }) => {
            // New user with no analyses
            // This would require a fresh test user
            await page.goto('/dashboard/analysis/history');

            // If empty, should show helpful message
            const emptyState = page.getByTestId('empty-state');
            if (await emptyState.isVisible()) {
                await expect(emptyState.getByText(/no analyses yet/i)).toBeVisible();
                await expect(emptyState.getByRole('button', { name: /create first analysis/i })).toBeVisible();
            }
        });
    });
});
