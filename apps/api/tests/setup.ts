/**
 * Jest Test Setup
 * Configures test environment
 */

// Global test timeout
jest.setTimeout(10000);

// Mock environment variables for tests
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '3001';
process.env['LOG_LEVEL'] = 'error';
process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://test.supabase.co';
process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = 'test-anon-key';
process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-service-role-key';
process.env['GEMINI_API_KEY'] = 'test-gemini-key';
process.env['COINGECKO_API_KEY'] = 'test-coingecko-key';

// Reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
});

// Export test utilities
export const TEST_USER_IDS = {
    conservative: '11111111-1111-1111-1111-111111111111',
    balanced: '22222222-2222-2222-2222-222222222222',
    aggressive: '33333333-3333-3333-3333-333333333333',
} as const;

export const TEST_WALLET_ADDRESSES = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x742d35Cc6634C0532925a3b844Bc9e7595f3E6aB',
} as const;
