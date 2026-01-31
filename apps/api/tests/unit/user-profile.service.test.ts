/**
 * User Profile Service Tests
 * Verifies the structure and exports of the UserProfileService module
 */

const userProfileModule = require('../../src/services/user-profile.service');

describe('UserProfileService Module', () => {
    it('should export UserProfileService with all methods', () => {
        expect(userProfileModule.UserProfileService).toBeDefined();
        expect(typeof userProfileModule.UserProfileService.getUserPreferences).toBe('function');
        expect(typeof userProfileModule.UserProfileService.updateUserPreferences).toBe('function');
        expect(typeof userProfileModule.UserProfileService.addConnectedWallet).toBe('function');
        expect(typeof userProfileModule.UserProfileService.removeConnectedWallet).toBe('function');
        expect(typeof userProfileModule.UserProfileService.getConnectedWallets).toBe('function');
        expect(typeof userProfileModule.UserProfileService.setPrimaryWallet).toBe('function');
    });
});

describe('UserProfileService Types', () => {
    it('should define preference methods correctly', () => {
        expect(userProfileModule.UserProfileService).toBeDefined();
        expect(Object.keys(userProfileModule.UserProfileService)).toContain('getUserPreferences');
    });

    it('should define wallet methods correctly', () => {
        expect(userProfileModule.UserProfileService.addConnectedWallet).toBeDefined();
        expect(userProfileModule.UserProfileService.getConnectedWallets).toBeDefined();
    });
});
