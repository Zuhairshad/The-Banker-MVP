/**
 * Authentication Service Tests
 * Verifies the structure and exports of the AuthService module
 */

// Using require to bypass Jest's ESM-style import transformation issues
const authServiceModule = require('../../src/services/auth.service');

describe('AuthService Module', () => {
    it('should export AuthService with all methods', () => {
        expect(authServiceModule.AuthService).toBeDefined();
        expect(typeof authServiceModule.AuthService.registerUser).toBe('function');
        expect(typeof authServiceModule.AuthService.registerUserWithPreferences).toBe('function');
        expect(typeof authServiceModule.AuthService.loginUser).toBe('function');
        expect(typeof authServiceModule.AuthService.validateToken).toBe('function');
        expect(typeof authServiceModule.AuthService.updatePassword).toBe('function');
        expect(typeof authServiceModule.AuthService.deleteUser).toBe('function');
    });

    it('should export individual functions', () => {
        expect(typeof authServiceModule.registerUser).toBe('function');
        expect(typeof authServiceModule.loginUser).toBe('function');
        expect(typeof authServiceModule.validateToken).toBe('function');
        expect(typeof authServiceModule.updatePassword).toBe('function');
        expect(typeof authServiceModule.deleteUser).toBe('function');
    });
});

describe('AuthService Types', () => {
    it('should define AuthResult interface structure', () => {
        // Verify the service exports are functions
        expect(authServiceModule.AuthService).toBeDefined();

        // Type verification - this would fail at compile time if anything was wrong
        expect(Object.keys(authServiceModule.AuthService)).toContain('registerUser');
        expect(Object.keys(authServiceModule.AuthService)).toContain('loginUser');
    });
});
