/**
 * OpenAPI/Swagger Configuration
 * Provides API documentation at /api/docs
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Banker Expert API',
            version: '0.1.0',
            description: 'AI-powered cryptocurrency wallet analysis platform API',
            contact: {
                name: 'Banker Expert Team',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your Supabase JWT token',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        message: { type: 'string' },
                        details: { type: 'array', items: { type: 'object' } },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                    },
                },
                InvestmentPreferences: {
                    type: 'object',
                    properties: {
                        riskAversion: { type: 'integer', minimum: 1, maximum: 10 },
                        volatilityTolerance: { type: 'integer', minimum: 1, maximum: 10 },
                        growthFocus: { type: 'integer', minimum: 1, maximum: 10 },
                        cryptoExperience: { type: 'integer', minimum: 1, maximum: 10 },
                        innovationTrust: { type: 'integer', minimum: 1, maximum: 10 },
                        impactInterest: { type: 'integer', minimum: 1, maximum: 10 },
                        diversification: { type: 'integer', minimum: 1, maximum: 10 },
                        holdingPatience: { type: 'integer', minimum: 1, maximum: 10 },
                        monitoringFrequency: { type: 'integer', minimum: 1, maximum: 10 },
                        adviceOpenness: { type: 'integer', minimum: 1, maximum: 10 },
                    },
                },
                Wallet: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        walletAddress: { type: 'string' },
                        blockchain: { type: 'string', enum: ['bitcoin', 'ethereum'] },
                        nickname: { type: 'string' },
                        isPrimary: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Analysis: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        walletAddress: { type: 'string' },
                        blockchain: { type: 'string', enum: ['bitcoin', 'ethereum'] },
                        analysisData: { type: 'object' },
                        aiInsights: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'User', description: 'User profile and preferences' },
            { name: 'Wallets', description: 'Wallet management' },
            { name: 'Analysis', description: 'Wallet analysis and AI insights' },
        ],
    },
    apis: ['./src/routes/*.ts', './src/swagger-docs.ts'],
};

const specs = swaggerJsdoc(options);

/**
 * Setup Swagger UI middleware
 * @param app - Express application instance
 */
export const setupSwagger = (app: Express): void => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Banker Expert API Docs',
    }));

    // Expose raw OpenAPI spec as JSON
    app.get('/api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};

export { specs };
