import * as utils from './index';

describe('utils/index exports', () => {
    it('should export all members from entity and form modules', () => {
        // Check that exports exist (smoke test)
        expect(typeof utils).toBe('object');
        // Optionally, check for known exports if you know their names
        // Example:
        expect(utils.getEntityIcon).toBeDefined();
        expect(utils.generateFieldsFromSchema).toBeDefined();
    });

});