/**
 * Jest Configuration
 */

/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    moduleNameMapper: {
        // Handle .js imports by stripping the extension and letting ts-jest resolve the .ts file
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    coverageDirectory: 'coverage',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: false,
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testTimeout: 10000,
    clearMocks: true,
    resetMocks: true,
};
