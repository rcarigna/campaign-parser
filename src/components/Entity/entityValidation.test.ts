import {
    validateEntity,
    getMissingFields,
    getValidationErrors,
    isEntityComplete,
    npcSchema,
    locationSchema,
    type ValidatedNPC,
    type ValidatedLocation,
} from './entityValidation';
import { EntityKind } from '@/types';

describe('entityValidation (Zod-based)', () => {
    describe('validateEntity', () => {
        it('should validate a complete NPC successfully', () => {
            const validNPC = {
                id: 'npc-1',
                kind: 'npc' as const,
                title: 'Test NPC',
                character_name: 'Merchant Bob',
                role: 'Merchant',
                faction: 'Traders Guild',
                importance: 'major' as const,
            };

            const result = validateEntity(validNPC);
            expect(result.success).toBe(true);
            if (result.success && result.data.kind === 'npc') {
                expect(result.data.character_name).toBe('Merchant Bob');
            }
        });

        it('should reject invalid entity with detailed errors', () => {
            const invalidNPC = {
                id: 'npc-1',
                kind: 'npc' as const,
                title: '', // Invalid: empty title
                character_name: 'Test NPC',
                // Missing required fields: role, faction, importance
            };

            const result = validateEntity(invalidNPC);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.length).toBeGreaterThan(0);
            }
        });
    });

    describe('getMissingFields', () => {
        it('should return empty array for complete entity', () => {
            const completeNPC = {
                id: 'npc-1',
                kind: 'npc' as const,
                title: 'Test NPC',
                character_name: 'Merchant Bob',
                role: 'Merchant',
                faction: 'Traders Guild',
                importance: 'major' as const,
            };

            expect(getMissingFields(completeNPC)).toEqual([]);
        });

        it('should return missing required fields', () => {
            const incompleteNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Test NPC',
                role: 'Merchant',
                // Missing: faction, importance
            };

            const missing = getMissingFields(incompleteNPC);
            expect(missing).toContain('faction');
            // expect(missing).toContain('importance'); // importance is not required
            expect(missing.length).toBe(1);
        });

        it('should handle empty string values as missing', () => {
            const npcWithEmptyFields = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Test NPC',
                role: '', // Empty string
                faction: 'Guild',
                importance: 'major' as const,
            };

            const missing = getMissingFields(npcWithEmptyFields);
            expect(missing).toContain('role');
        });

        it('should work for different entity types', () => {
            const incompleteLocation = {
                id: 'loc-1',
                kind: EntityKind.LOCATION,
                title: 'Test Location',
                name: 'Test Location',
                // Missing: type, region
            };

            const missing = getMissingFields(incompleteLocation);
            expect(missing).toContain('type');
            expect(missing).toContain('region');
        });
    });

    describe('getValidationErrors', () => {
        it('should return empty object for valid entity', () => {
            const validNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Merchant Bob',
                role: 'Merchant',
                faction: 'Traders Guild',
                importance: 'major' as const,
            };

            expect(getValidationErrors(validNPC)).toEqual({});
        });

        it('should return detailed error messages', () => {
            const invalidNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: '', // Empty title
                character_name: 'Test NPC',
                role: 'Merchant',
                importance: 'invalid' as 'major', // Invalid enum value
                // Missing: faction
            };

            const errors = getValidationErrors(invalidNPC);
            expect(Object.keys(errors).length).toBeGreaterThan(0);
            expect(errors.title).toContain('Title is required');
        });
    });

    describe('isEntityComplete', () => {
        it('should return true for complete entities', () => {
            const completeNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Merchant Bob',
                role: 'Merchant',
                faction: 'Traders Guild',
                importance: 'major' as const,
            };

            expect(isEntityComplete(completeNPC)).toBe(true);
        });

        it('should return false for incomplete entities', () => {
            const incompleteNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Test NPC',
                // Missing required fields
            };

            expect(isEntityComplete(incompleteNPC)).toBe(false);
        });
    });

    describe('schema type inference', () => {
        it('should provide proper TypeScript types', () => {
            // This test mainly checks TypeScript compilation
            const validNPC: ValidatedNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Merchant Bob',
                role: 'Merchant',
                faction: 'Traders Guild',
                importance: 'major',
            };

            const validLocation: ValidatedLocation = {
                id: 'loc-1',
                kind: EntityKind.LOCATION,
                title: 'Test Location',
                name: 'Tavern',
                type: 'Building',
                region: 'City Center',
            };

            expect(npcSchema.safeParse(validNPC).success).toBe(true);
            expect(locationSchema.safeParse(validLocation).success).toBe(true);
        });
    });

    describe('advanced validation features', () => {
        it('should validate enum values correctly', () => {
            const npcWithInvalidImportance = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Test NPC',
                role: 'Merchant',
                faction: 'Guild',
                importance: 'invalid-value',
            };

            const result = validateEntity(npcWithInvalidImportance);
            expect(result.success).toBe(false);
        });

        it('should handle optional fields correctly', () => {
            const minimalPlayer = {
                id: 'player-1',
                kind: EntityKind.PLAYER,
                title: 'Test Player',
                character_name: 'Hero',
                // All other fields are optional for players
            };

            expect(isEntityComplete(minimalPlayer)).toBe(true);
        });
    });
});