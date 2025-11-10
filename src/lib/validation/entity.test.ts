import {
    validateEntity,
    getMissingFields,
    getValidationErrors,
    isEntityComplete,
    npcSchema,
    locationSchema,
    itemSchema,
    questSchema,
    playerSchema,
    type ValidatedNPC,
    type ValidatedLocation,
} from './entity';
import { EntityKind, Item, ItemRarity, ItemType } from '@/types';

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
            expect(missing).toContain('importance');
            expect(missing.length).toBe(2);
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

        it('should validate quest entities correctly', () => {
            const validQuest = {
                id: 'quest-1',
                kind: EntityKind.QUEST,
                title: 'The Missing Artifact',
                name: 'Find the Lost Crown',
                status: 'active',
                type: 'main',
            };

            expect(isEntityComplete(validQuest)).toBe(true);

            const incompleteQuest = {
                id: 'quest-2',
                kind: EntityKind.QUEST,
                title: 'Incomplete Quest',
                name: '', // Empty required field
                status: 'active',
                // Missing type
            };

            const missing = getMissingFields(incompleteQuest);
            expect(missing).toContain('name');
            expect(missing).toContain('type');
        });

        it('should handle array fields validation', () => {
            const locationWithTags = {
                id: 'loc-1',
                kind: EntityKind.LOCATION,
                title: 'Tagged Location',
                name: 'City Hall',
                type: 'Building',
                region: 'Downtown',
                tags: ['government', 'important'],
                faction_presence: ['City Guard', 'Merchants'],
            };

            expect(isEntityComplete(locationWithTags)).toBe(true);
        });

        it('should validate item entities correctly', () => {
            const validItem: Item = {
                id: 'item-1',
                kind: EntityKind.ITEM,
                title: 'Excalibur',
                type: ItemType.WEAPON,
                rarity: ItemRarity.LEGENDARY,
            };

            expect(isEntityComplete(validItem)).toBe(true);

        });

        it('should validate invalid item entities correctly', () => {

            const incompleteItem = {
                id: 'item-2',
                kind: EntityKind.ITEM,
                title: 'Incomplete Item',
                name: '', // Empty required field
                type: 'Weapon',
                // Missing rarity
            };

            const missing = getMissingFields(incompleteItem);
            expect(missing).toContain('name');
            expect(missing).toContain('rarity');
        });

        it('should validate player entities correctly', () => {
            const validPlayer = {
                id: 'player-1',
                kind: EntityKind.PLAYER,
                title: 'Test Player',
                character_name: 'Hero',
                // All other fields are optional for players
            };

            expect(isEntityComplete(validPlayer)).toBe(true);

            const incompletePlayer = {
                id: 'player-2',
                kind: EntityKind.PLAYER,
                title: 'Incomplete Player',
                character_name: '', // Empty required field
            };

            const missing = getMissingFields(incompletePlayer);
            expect(missing).toContain('character_name');
        });

        it('should validate session summary entities correctly', () => {
            const validSessionSummary = {
                id: 'session-1',
                kind: EntityKind.SESSION_SUMMARY,
                title: 'Session 1 Summary',
                session_number: 1,
                summary: 'The party explored the ancient ruins and found a mysterious artifact.',
                date: '2024-04-27',
            };

            expect(isEntityComplete(validSessionSummary)).toBe(true);

            const incompleteSessionSummary = {
                id: 'session-2',
                kind: EntityKind.SESSION_SUMMARY,
                title: 'Incomplete Session Summary',
                summary: '', // Empty required field
                // Missing date
            };

            const missing = getMissingFields(incompleteSessionSummary);
            expect(missing).toContain('session_number');
        });

        it('should validate session prep entities correctly', () => {
            const validSessionPrep = {
                id: 'prep-1',
                kind: EntityKind.SESSION_PREP,
                title: 'Session 1 Prep',
                notes: 'Prepare maps and NPCs for the upcoming session.',
                date: '2024-04-26',
            };

            expect(isEntityComplete(validSessionPrep)).toBe(true);

            const incompleteSessionPrep = {
                id: 'prep-2',
                kind: EntityKind.SESSION_PREP,
                title: 'Incomplete Session Prep',
                notes: '', // Empty required field
            };

            const missing = getMissingFields(incompleteSessionPrep);
            expect(missing).toContain('notes');
        });

        it('should export all schema types for external use', () => {
            // Test that all schemas are properly exported and functional
            const testData = {
                npc: {
                    id: 'npc-1',
                    kind: EntityKind.NPC,
                    title: 'Test NPC',
                    character_name: 'Bob',
                    role: 'Merchant',
                    faction: 'Guild',
                    importance: 'major' as const,
                },
                location: {
                    id: 'loc-1',
                    kind: EntityKind.LOCATION,
                    title: 'Test Location',
                    name: 'Tavern',
                    type: 'Building',
                    region: 'City',
                },
                item: {
                    id: 'item-1',
                    kind: EntityKind.ITEM,
                    title: 'Test Item',
                    name: 'Sword',
                    type: ItemType.WEAPON,
                    rarity: ItemRarity.RARE,
                },
                quest: {
                    id: 'quest-1',
                    kind: EntityKind.QUEST,
                    title: 'Test Quest',
                    name: 'Find Artifact',
                    status: 'active',
                    type: 'main',
                },
                player: {
                    id: 'player-1',
                    kind: EntityKind.PLAYER,
                    title: 'Test Player',
                    character_name: 'Hero',
                },
                sessionSummary: {
                    id: 'session-1',
                    kind: EntityKind.SESSION_SUMMARY,
                    title: 'Session 1',
                    session_number: 1,
                },
                sessionPrep: {
                    id: 'prep-1',
                    kind: EntityKind.SESSION_PREP,
                    title: 'Prep 1',
                    notes: 'Test notes',
                },
            };

            // Verify each schema can validate its corresponding test data
            expect(npcSchema.safeParse(testData.npc).success).toBe(true);
            expect(locationSchema.safeParse(testData.location).success).toBe(true);
            expect(itemSchema.safeParse(testData.item).success).toBe(true);
            expect(questSchema.safeParse(testData.quest).success).toBe(true);
            expect(playerSchema.safeParse(testData.player).success).toBe(true);
        });

        it('should validate discriminated union correctly', () => {
            const entities = [
                {
                    id: 'npc-1',
                    kind: EntityKind.NPC,
                    title: 'Test NPC',
                    character_name: 'Bob',
                    role: 'Merchant',
                    faction: 'Guild',
                    importance: 'major' as const,
                },
                {
                    id: 'loc-1',
                    kind: EntityKind.LOCATION,
                    title: 'Test Location',
                    name: 'Tavern',
                    type: 'Building',
                    region: 'City',
                },
            ];

            entities.forEach(entity => {
                const result = validateEntity(entity);
                expect(result.success).toBe(true);
            });
        });

        it('should reject entities with wrong kind for specific schemas', () => {
            const npcData = {
                id: 'npc-1',
                kind: EntityKind.LOCATION, // Wrong kind
                title: 'Test',
                character_name: 'Bob',
                role: 'Merchant',
                faction: 'Guild',
                importance: 'major' as const,
            };

            expect(npcSchema.safeParse(npcData).success).toBe(false);
        });
    });
});
