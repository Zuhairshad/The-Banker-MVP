/**
 * API Health and Structure Tests
 * Integration tests that verify API routes are correctly mounted
 */

import request from 'supertest';

// Mock the Supabase module before importing app
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: {
            signUp: jest.fn(),
            signInWithPassword: jest.fn(),
            signOut: jest.fn(),
            getUser: jest.fn(),
            updateUser: jest.fn(),
            admin: {
                getUserById: jest.fn(),
                updateUserById: jest.fn(),
                deleteUser: jest.fn(),
            },
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            range: jest.fn().mockReturnThis(),
        })),
    })),
}));

// Mock Gemini
jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: jest.fn().mockResolvedValue({
                response: { text: () => 'AI insights' },
            }),
        }),
    })),
}));

// Now import app after mocks
import app from '../../src/server';

describe('Banker Expert API - Health', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('ok');
            expect(response.body.timestamp).toBeDefined();
        });
    });

    describe('GET /api', () => {
        it('should return API info', async () => {
            const response = await request(app).get('/api');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Banker Expert API');
            expect(response.body.version).toBe('0.1.0');
            expect(response.body.endpoints).toBeDefined();
        });

        it('should list all available endpoints', async () => {
            const response = await request(app).get('/api');

            expect(response.body.endpoints.auth).toBeDefined();
            expect(response.body.endpoints.user).toBeDefined();
            expect(response.body.endpoints.wallets).toBeDefined();
            expect(response.body.endpoints.analysis).toBeDefined();
        });
    });
});

describe('Banker Expert API - Route Registration', () => {
    describe('Auth Routes', () => {
        it('POST /api/auth/register should exist', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({});

            // 400 means route exists but validation failed
            // 404 would mean route doesn't exist
            expect(response.status).not.toBe(404);
        });

        it('POST /api/auth/login should exist', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.status).not.toBe(404);
        });

        it('POST /api/auth/validate should exist', async () => {
            const response = await request(app)
                .post('/api/auth/validate')
                .send({});

            expect(response.status).not.toBe(404);
        });
    });

    describe('User Routes', () => {
        it('GET /api/user/profile should require auth', async () => {
            const response = await request(app).get('/api/user/profile');

            // 401 means route exists but auth is required
            expect(response.status).toBe(401);
        });

        it('GET /api/user/preferences should require auth', async () => {
            const response = await request(app).get('/api/user/preferences');

            expect(response.status).toBe(401);
        });

        it('PATCH /api/user/preferences should require auth', async () => {
            const response = await request(app)
                .patch('/api/user/preferences')
                .send({});

            expect(response.status).toBe(401);
        });
    });

    describe('Wallet Routes', () => {
        it('GET /api/wallets should require auth', async () => {
            const response = await request(app).get('/api/wallets');

            expect(response.status).toBe(401);
        });

        it('POST /api/wallets/connect should require auth', async () => {
            const response = await request(app)
                .post('/api/wallets/connect')
                .send({});

            expect(response.status).toBe(401);
        });

        it('DELETE /api/wallets/:id should require auth', async () => {
            const response = await request(app)
                .delete('/api/wallets/test-id');

            expect(response.status).toBe(401);
        });
    });

    describe('Analysis Routes', () => {
        it('POST /api/analysis/generate should require auth', async () => {
            const response = await request(app)
                .post('/api/analysis/generate')
                .send({});

            expect(response.status).toBe(401);
        });

        it('GET /api/analysis/history should require auth', async () => {
            const response = await request(app).get('/api/analysis/history');

            expect(response.status).toBe(401);
        });

        it('GET /api/analysis/:id should require auth', async () => {
            const response = await request(app).get('/api/analysis/test-id');

            expect(response.status).toBe(401);
        });
    });
});

describe('Banker Expert API - Validation', () => {
    describe('POST /api/auth/register', () => {
        it('should reject empty body', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation failed');
        });

        it('should reject invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ email: 'not-an-email', password: 'Password123!' });

            expect(response.status).toBe(400);
        });

        it('should reject short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com', password: '123' });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should reject empty body', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation failed');
        });
    });
});

describe('Banker Expert API - 404', () => {
    it('should return 404 for unknown routes', async () => {
        const response = await request(app).get('/api/unknown/route');

        expect(response.status).toBe(404);
    });
});
