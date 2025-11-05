import {
    getMissingFields,
    isEntityComplete,
    getRequiredFields,
    ENTITY_FIELD_REQUIREMENTS
} from './entityFieldValidation';
import { EntityKind } from '@/types';

describe('entityFieldValidation', () => {
    describe('ENTITY_FIELD_REQUIREMENTS', () => {
        it('should define required fields for all entity kinds', () => {
            // Ensure all EntityKind values are covered
            Object.values(EntityKind).forEach(kind => {
                expect(ENTITY_FIELD_REQUIREMENTS).toHaveProperty(kind);
                expect(Array.isArray(ENTITY_FIELD_REQUIREMENTS[kind])).toBe(true);
            });
        });

        it('should have correct required fields for each entity type', () => {
            expect(ENTITY_FIELD_REQUIREMENTS[EntityKind.NPC]).toEqual(['role', 'faction', 'importance']);
            expect(ENTITY_FIELD_REQUIREMENTS[EntityKind.LOCATION]).toEqual(['type', 'region']);
            expect(ENTITY_FIELD_REQUIREMENTS[EntityKind.ITEM]).toEqual(['type', 'rarity']);
            expect(ENTITY_FIELD_REQUIREMENTS[EntityKind.QUEST]).toEqual(['status', 'type']);
            expect(ENTITY_FIELD_REQUIREMENTS[EntityKind.PLAYER]).toEqual([]);
            expect(ENTITY_FIELD_REQUIREMENTS[EntityKind.SESSION_SUMMARY]).toEqual([]);
            expect(ENTITY_FIELD_REQUIREMENTS[EntityKind.SESSION_PREP]).toEqual([]);
        });
    });

    describe('getMissingFields', () => {
        it('should return empty array for complete NPC', () => {
            const completeNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                role: 'Merchant',
                faction: 'Guild',
                importance: 'major',
                character_name: 'Test NPC'
            };

            expect(getMissingFields(completeNPC as any)).toEqual([]);
        });

        it('should return missing fields for incomplete NPC', () => {
            const incompleteNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Test NPC',
                role: 'Merchant'
                // Missing: faction, importance
            };

            const missing = getMissingFields(incompleteNPC as any);
            expect(missing).toContain('faction');
            expect(missing).toContain('importance');
            expect(missing).toHaveLength(2);
        });

        it('should handle empty string values as missing', () => {
            const npcWithEmptyFields = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Test NPC',
                role: '',
                faction: '   ', // Whitespace only
                importance: 'major'
            };

            const missing = getMissingFields(npcWithEmptyFields as any);
            expect(missing).toContain('role');
            expect(missing).toContain('faction');
            expect(missing).toHaveLength(2);
        });

        it('should return empty array for entities with no required fields', () => {
            const player = {
                id: 'player-1',
                kind: EntityKind.PLAYER,
                title: 'Test Player',
                character_name: 'Test Player'
            };

            expect(getMissingFields(player as any)).toEqual([]);
        });
    });

    describe('isEntityComplete', () => {
        it('should return true for complete entities', () => {
            const completeNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                role: 'Merchant',
                faction: 'Guild',
                importance: 'major',
                character_name: 'Test NPC'
            };

            expect(isEntityComplete(completeNPC as any)).toBe(true);
        });

        it('should return false for incomplete entities', () => {
            const incompleteNPC = {
                id: 'npc-1',
                kind: EntityKind.NPC,
                title: 'Test NPC',
                character_name: 'Test NPC',
                role: 'Merchant'
                // Missing: faction, importance
            };

            expect(isEntityComplete(incompleteNPC as any)).toBe(false);
        });

        it('should return true for entities with no required fields', () => {
            const player = {
                id: 'player-1',
                kind: EntityKind.PLAYER,
                title: 'Test Player',
                character_name: 'Test Player'
            };

            expect(isEntityComplete(player as any)).toBe(true);
        });
    });

    describe('getRequiredFields', () => {
        it('should return correct required fields for each entity kind', () => {
            expect(getRequiredFields(EntityKind.NPC)).toEqual(['role', 'faction', 'importance']);
            expect(getRequiredFields(EntityKind.LOCATION)).toEqual(['type', 'region']);
            expect(getRequiredFields(EntityKind.ITEM)).toEqual(['type', 'rarity']);
            expect(getRequiredFields(EntityKind.QUEST)).toEqual(['status', 'type']);
            expect(getRequiredFields(EntityKind.PLAYER)).toEqual([]);
        });

        it('should return empty array for unknown entity kinds', () => {
            expect(getRequiredFields('unknown' as EntityKind)).toEqual([]);
        });
    });
});