/**
 * Wallet Connection E2E Tests
 * Tests wallet connection, management, and primary wallet features
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

test.describe('Wallet Connection Flow', () => {
    test.describe('Connect New Wallet', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page);
        });

        test('should display connect wallet button on dashboard', async ({ page }) => {
            await expect(page.getByRole('button', { name: /connect wallet/i })).toBeVisible();
        });

        test('should open wallet connection modal', async ({ page }) => {
            await page.getByRole('button', { name: /connect wallet/i }).click();

            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByRole('heading', { name: /connect wallet/i })).toBeVisible();
        });

        test('should show blockchain selection options', async ({ page }) => {
            await page.getByRole('button', { name: /connect wallet/i }).click();

            await expect(page.getByRole('button', { name: /bitcoin/i })).toBeVisible();
            await expect(page.getByRole('button', { name: /ethereum/i })).toBeVisible();
        });

        test('should validate wallet address format for Bitcoin', async ({ page }) => {
            await page.getByRole('button', { name: /connect wallet/i }).click();
            await page.getByRole('button', { name: /bitcoin/i }).click();
            await page.getByLabel('Wallet Address').fill('invalid-address');
            await page.getByRole('button', { name: /connect$/i }).click();

            await expect(page.getByText(/invalid bitcoin address/i)).toBeVisible();
        });

        test('should validate wallet address format for Ethereum', async ({ page }) => {
            await page.getByRole('button', { name: /connect wallet/i }).click();
            await page.getByRole('button', { name: /ethereum/i }).click();
            await page.getByLabel('Wallet Address').fill('not-an-eth-address');
            await page.getByRole('button', { name: /connect$/i }).click();

            await expect(page.getByText(/invalid ethereum address/i)).toBeVisible();
        });

        test('should successfully connect a valid Ethereum wallet', async ({ page }) => {
            await page.getByRole('button', { name: /connect wallet/i }).click();
            await page.getByRole('button', { name: /ethereum/i }).click();
            await page.getByLabel('Wallet Address').fill('0x1234567890123456789012345678901234567890');
            await page.getByLabel('Nickname').fill('My Test Wallet');
            await page.getByRole('button', { name: /connect$/i }).click();

            // Modal should close
            await expect(page.getByRole('dialog')).not.toBeVisible();
            // Wallet should appear in list
            await expect(page.getByText('My Test Wallet')).toBeVisible();
        });

        test('should successfully connect a valid Bitcoin wallet', async ({ page }) => {
            await page.getByRole('button', { name: /connect wallet/i }).click();
            await page.getByRole('button', { name: /bitcoin/i }).click();
            await page.getByLabel('Wallet Address').fill('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
            await page.getByLabel('Nickname').fill('BTC Savings');
            await page.getByRole('button', { name: /connect$/i }).click();

            await expect(page.getByRole('dialog')).not.toBeVisible();
            await expect(page.getByText('BTC Savings')).toBeVisible();
        });

        test('should show error for duplicate wallet address', async ({ page }) => {
            // First, connect a wallet
            await page.getByRole('button', { name: /connect wallet/i }).click();
            await page.getByRole('button', { name: /ethereum/i }).click();
            const address = '0x9999777788886666555544443333222211110000';
            await page.getByLabel('Wallet Address').fill(address);
            await page.getByRole('button', { name: /connect$/i }).click();
            await expect(page.getByRole('dialog')).not.toBeVisible();

            // Try to connect same wallet again
            await page.getByRole('button', { name: /connect wallet/i }).click();
            await page.getByRole('button', { name: /ethereum/i }).click();
            await page.getByLabel('Wallet Address').fill(address);
            await page.getByRole('button', { name: /connect$/i }).click();

            await expect(page.getByText(/already connected/i)).toBeVisible();
        });
    });

    test.describe('Manage Connected Wallets', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page, 'balanced@test.com');
        });

        test('should display list of connected wallets', async ({ page }) => {
            await page.goto('/dashboard/wallets');

            // User from seed data has connected wallets
            await expect(page.getByTestId('wallet-list')).toBeVisible();
            await expect(page.getByText('Primary ETH')).toBeVisible();
        });

        test('should show wallet details when clicked', async ({ page }) => {
            await page.goto('/dashboard/wallets');
            await page.getByText('Primary ETH').click();

            await expect(page.getByText(/wallet address/i)).toBeVisible();
            await expect(page.getByText(/blockchain/i)).toBeVisible();
            await expect(page.getByText(/connected on/i)).toBeVisible();
        });

        test('should delete a connected wallet', async ({ page }) => {
            await page.goto('/dashboard/wallets');

            // Find non-primary wallet to delete
            const walletCard = page.getByText('BTC Reserve').locator('..');
            await walletCard.getByRole('button', { name: /delete/i }).click();

            // Confirm deletion
            await page.getByRole('button', { name: /confirm/i }).click();

            await expect(page.getByText('BTC Reserve')).not.toBeVisible();
        });

        test('should edit wallet nickname', async ({ page }) => {
            await page.goto('/dashboard/wallets');

            const walletCard = page.getByText('Primary ETH').locator('..');
            await walletCard.getByRole('button', { name: /edit/i }).click();

            await page.getByLabel('Nickname').clear();
            await page.getByLabel('Nickname').fill('Updated Wallet Name');
            await page.getByRole('button', { name: /save/i }).click();

            await expect(page.getByText('Updated Wallet Name')).toBeVisible();
        });
    });

    test.describe('Primary Wallet', () => {
        test.beforeEach(async ({ page }) => {
            await loginAsTestUser(page, 'aggressive@test.com');
        });

        test('should display primary wallet badge', async ({ page }) => {
            await page.goto('/dashboard/wallets');

            const primaryWallet = page.getByText('DeFi Trading').locator('..');
            await expect(primaryWallet.getByText(/primary/i)).toBeVisible();
        });

        test('should change primary wallet', async ({ page }) => {
            await page.goto('/dashboard/wallets');

            // Find non-primary wallet
            const wallet = page.getByText('NFT Wallet').locator('..');
            await wallet.getByRole('button', { name: /set as primary/i }).click();

            // Confirm
            await page.getByRole('button', { name: /confirm/i }).click();

            // New wallet should be primary
            await expect(wallet.getByText(/primary/i)).toBeVisible();

            // Old primary should not have badge
            const oldPrimary = page.getByText('DeFi Trading').locator('..');
            await expect(oldPrimary.getByText(/primary/i)).not.toBeVisible();
        });

        test('should use primary wallet for default analysis', async ({ page }) => {
            await page.goto('/dashboard');

            // Quick analysis should use primary wallet
            await page.getByRole('button', { name: /quick analysis/i }).click();

            // Should show primary wallet address pre-filled or selected
            await expect(page.getByText(/DeFi Trading/i)).toBeVisible();
        });
    });
});
