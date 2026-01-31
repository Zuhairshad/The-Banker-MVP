/**
 * Authentication E2E Tests
 * Tests user registration, login, and authentication flows
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.describe('User Registration', () => {
        test('should display registration form', async ({ page }) => {
            await page.goto('/register');

            // Check form elements exist
            await expect(page.getByLabel('Email')).toBeVisible();
            await expect(page.getByLabel('Password')).toBeVisible();
            await expect(page.getByLabel('Confirm Password')).toBeVisible();
            await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
        });

        test('should show validation errors for empty fields', async ({ page }) => {
            await page.goto('/register');
            await page.getByRole('button', { name: /register/i }).click();

            await expect(page.getByText(/email is required/i)).toBeVisible();
            await expect(page.getByText(/password is required/i)).toBeVisible();
        });

        test('should show error for invalid email format', async ({ page }) => {
            await page.goto('/register');
            await page.getByLabel('Email').fill('invalid-email');
            await page.getByLabel('Password').fill('SecurePassword123!');
            await page.getByLabel('Confirm Password').fill('SecurePassword123!');
            await page.getByRole('button', { name: /register/i }).click();

            await expect(page.getByText(/invalid email/i)).toBeVisible();
        });

        test('should show error when passwords do not match', async ({ page }) => {
            await page.goto('/register');
            await page.getByLabel('Email').fill('test@example.com');
            await page.getByLabel('Password').fill('Password123!');
            await page.getByLabel('Confirm Password').fill('DifferentPassword!');
            await page.getByRole('button', { name: /register/i }).click();

            await expect(page.getByText(/passwords do not match/i)).toBeVisible();
        });

        test('should redirect to investment preferences after successful registration', async ({ page }) => {
            await page.goto('/register');
            await page.getByLabel('Email').fill(`test+${Date.now()}@example.com`);
            await page.getByLabel('Password').fill('SecurePassword123!');
            await page.getByLabel('Confirm Password').fill('SecurePassword123!');
            await page.getByRole('button', { name: /register/i }).click();

            // Should navigate to preferences setup
            await expect(page).toHaveURL(/\/onboarding\/preferences/);
        });
    });

    test.describe('User Login', () => {
        test('should display login form', async ({ page }) => {
            await page.goto('/login');

            await expect(page.getByLabel('Email')).toBeVisible();
            await expect(page.getByLabel('Password')).toBeVisible();
            await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
        });

        test('should show error for invalid credentials', async ({ page }) => {
            await page.goto('/login');
            await page.getByLabel('Email').fill('nonexistent@example.com');
            await page.getByLabel('Password').fill('wrongpassword');
            await page.getByRole('button', { name: /sign in/i }).click();

            await expect(page.getByText(/invalid credentials/i)).toBeVisible();
        });

        test('should redirect to dashboard after successful login', async ({ page }) => {
            // Using test account from seed data
            await page.goto('/login');
            await page.getByLabel('Email').fill('conservative@test.com');
            await page.getByLabel('Password').fill('password123');
            await page.getByRole('button', { name: /sign in/i }).click();

            await expect(page).toHaveURL(/\/dashboard/);
            await expect(page.getByText(/welcome/i)).toBeVisible();
        });

        test('should have forgot password link', async ({ page }) => {
            await page.goto('/login');

            const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
            await expect(forgotPasswordLink).toBeVisible();
            await forgotPasswordLink.click();

            await expect(page).toHaveURL(/\/forgot-password/);
        });
    });

    test.describe('Authentication State', () => {
        test('should redirect unauthenticated users from protected routes', async ({ page }) => {
            await page.goto('/dashboard');

            await expect(page).toHaveURL(/\/login/);
        });

        test('should persist authentication after page refresh', async ({ page }) => {
            // Login first
            await page.goto('/login');
            await page.getByLabel('Email').fill('balanced@test.com');
            await page.getByLabel('Password').fill('password123');
            await page.getByRole('button', { name: /sign in/i }).click();
            await expect(page).toHaveURL(/\/dashboard/);

            // Refresh page
            await page.reload();

            // Should still be on dashboard
            await expect(page).toHaveURL(/\/dashboard/);
        });

        test('should log out user successfully', async ({ page }) => {
            // Login first
            await page.goto('/login');
            await page.getByLabel('Email').fill('aggressive@test.com');
            await page.getByLabel('Password').fill('password123');
            await page.getByRole('button', { name: /sign in/i }).click();
            await expect(page).toHaveURL(/\/dashboard/);

            // Click logout
            await page.getByRole('button', { name: /logout/i }).click();

            // Should redirect to home/login
            await expect(page).toHaveURL(/\/(login)?$/);
        });
    });

    test.describe('Investment Preferences Onboarding', () => {
        test('should display all 10 preference questions', async ({ page }) => {
            // Register new user first (or use authenticated context)
            await page.goto('/register');
            await page.getByLabel('Email').fill(`newuser+${Date.now()}@example.com`);
            await page.getByLabel('Password').fill('SecurePassword123!');
            await page.getByLabel('Confirm Password').fill('SecurePassword123!');
            await page.getByRole('button', { name: /register/i }).click();

            await expect(page).toHaveURL(/\/onboarding\/preferences/);

            // Check all preference sliders/inputs exist
            const preferenceLabels = [
                'Risk Aversion',
                'Volatility Tolerance',
                'Growth Focus',
                'Crypto Experience',
                'Innovation Trust',
                'Impact Interest',
                'Diversification',
                'Holding Patience',
                'Monitoring Frequency',
                'Advice Openness',
            ];

            for (const label of preferenceLabels) {
                await expect(page.getByText(label)).toBeVisible();
            }
        });

        test('should save preferences and navigate to dashboard', async ({ page }) => {
            await page.goto('/onboarding/preferences');

            // Fill out preferences (assuming slider inputs)
            // This is a placeholder - actual implementation will depend on UI
            await page.getByRole('button', { name: /continue/i }).click();

            await expect(page).toHaveURL(/\/dashboard/);
        });
    });
});
