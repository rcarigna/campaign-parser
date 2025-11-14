import {
    getEntityIcon,
    getEntityColor,
    getEntityLabel,
    getEntityDescription,
    getEntityMetadata,
    getAllEntityMetadata,
    mergeEntities
} from './entity';
import { AnyEntity, EntityKind, EntityWithId } from '@/types';

describe('entityUtils', () => {
    describe('getEntityIcon', () => {
        it('should return correct icons for all entity kinds', () => {
            expect(getEntityIcon(EntityKind.SESSION_SUMMARY)).toBe('📜');
            expect(getEntityIcon(EntityKind.NPC)).toBe('👤');
            expect(getEntityIcon(EntityKind.LOCATION)).toBe('🗺️');
            expect(getEntityIcon(EntityKind.ITEM)).toBe('⚔️');
            expect(getEntityIcon(EntityKind.QUEST)).toBe('🎯');
            expect(getEntityIcon(EntityKind.PLAYER)).toBe('🧙');
            expect(getEntityIcon(EntityKind.SESSION_PREP)).toBe('📋');
        });

        it('should return default icon for unknown entity kind', () => {
            // Type assertion to test fallback case
            expect(getEntityIcon('unknown' as EntityKind)).toBe('📄');
        });
    });

    describe('getEntityColor', () => {
        it('should return correct colors for all entity kinds', () => {
            expect(getEntityColor(EntityKind.SESSION_SUMMARY)).toBe('#4f46e5');
            expect(getEntityColor(EntityKind.NPC)).toBe('#059669');
            expect(getEntityColor(EntityKind.LOCATION)).toBe('#dc2626');
            expect(getEntityColor(EntityKind.ITEM)).toBe('#d97706');
            expect(getEntityColor(EntityKind.QUEST)).toBe('#7c3aed');
            expect(getEntityColor(EntityKind.PLAYER)).toBe('#10b981');
            expect(getEntityColor(EntityKind.SESSION_PREP)).toBe('#6366f1');
        });

        it('should return default color for unknown entity kind', () => {
            // Type assertion to test fallback case
            expect(getEntityColor('unknown' as EntityKind)).toBe('#6b7280');
        });

        it('should return valid hex color codes', () => {
            const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

            // Test all entity kinds return valid hex colors
            Object.values(EntityKind).forEach(kind => {
                const color = getEntityColor(kind);
                expect(color).toMatch(hexColorRegex);
            });
        });
    });

    describe('getEntityLabel', () => {
        it('should return correct labels for all entity kinds', () => {
            expect(getEntityLabel(EntityKind.NPC)).toBe('NPCs');
            expect(getEntityLabel(EntityKind.LOCATION)).toBe('Locations');
            expect(getEntityLabel(EntityKind.ITEM)).toBe('Items');
            expect(getEntityLabel(EntityKind.QUEST)).toBe('Quests');
            expect(getEntityLabel(EntityKind.PLAYER)).toBe('Players');
            expect(getEntityLabel(EntityKind.SESSION_SUMMARY)).toBe('Sessions');
            expect(getEntityLabel(EntityKind.SESSION_PREP)).toBe('Session Prep');
        });

        it('should return default label for unknown entity kind', () => {
            expect(getEntityLabel('unknown' as EntityKind)).toBe('Entities');
        });
    });

    describe('getEntityDescription', () => {
        it('should return correct descriptions for all entity kinds', () => {
            expect(getEntityDescription(EntityKind.NPC)).toBe('Non-player characters');
            expect(getEntityDescription(EntityKind.LOCATION)).toBe('Places and venues in your world');
            expect(getEntityDescription(EntityKind.ITEM)).toBe('Equipment, weapons, and magical items');
            expect(getEntityDescription(EntityKind.QUEST)).toBe('Missions and storyline objectives');
            expect(getEntityDescription(EntityKind.PLAYER)).toBe('Player characters and their details');
            expect(getEntityDescription(EntityKind.SESSION_SUMMARY)).toBe('Session summaries and notes');
            expect(getEntityDescription(EntityKind.SESSION_PREP)).toBe('Session preparation and planning');
        });

        it('should return default description for unknown entity kind', () => {
            expect(getEntityDescription('unknown' as EntityKind)).toBe('Campaign entities');
        });
    });

    describe('getEntityMetadata', () => {
        it('should return complete metadata for an entity kind', () => {
            const metadata = getEntityMetadata(EntityKind.NPC);

            expect(metadata).toEqual({
                kind: EntityKind.NPC,
                emoji: '👤',
                label: 'NPCs',
                description: 'Non-player characters',
                color: '#059669',
            });
        });

        it('should include all metadata fields', () => {
            const metadata = getEntityMetadata(EntityKind.QUEST);

            expect(metadata).toHaveProperty('kind');
            expect(metadata).toHaveProperty('emoji');
            expect(metadata).toHaveProperty('label');
            expect(metadata).toHaveProperty('description');
            expect(metadata).toHaveProperty('color');
        });
    });

    describe('getAllEntityMetadata', () => {
        it('should return metadata for all main entity kinds', () => {
            const allMetadata = getAllEntityMetadata();

            expect(allMetadata).toHaveLength(6);

            const kinds = allMetadata.map(m => m.kind);
            expect(kinds).toContain(EntityKind.NPC);
            expect(kinds).toContain(EntityKind.LOCATION);
            expect(kinds).toContain(EntityKind.ITEM);
            expect(kinds).toContain(EntityKind.QUEST);
            expect(kinds).toContain(EntityKind.PLAYER);
            expect(kinds).toContain(EntityKind.SESSION_SUMMARY);
        });

        it('should not include SESSION_PREP in main entity list', () => {
            const allMetadata = getAllEntityMetadata();
            const kinds = allMetadata.map(m => m.kind);

            expect(kinds).not.toContain(EntityKind.SESSION_PREP);
        });

        it('should return complete metadata objects', () => {
            const allMetadata = getAllEntityMetadata();

            allMetadata.forEach(metadata => {
                expect(metadata).toHaveProperty('kind');
                expect(metadata).toHaveProperty('emoji');
                expect(metadata).toHaveProperty('label');
                expect(metadata).toHaveProperty('description');
                expect(metadata).toHaveProperty('color');
                expect(typeof metadata.emoji).toBe('string');
                expect(typeof metadata.label).toBe('string');
                expect(typeof metadata.description).toBe('string');
                expect(metadata.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
            });
        });
    });

    describe('mergeEntities', () => {
        it('should merge specified fields from multiple entities', () => {
            const entities: Array<AnyEntity & EntityWithId> = [
                { id: '1', title: 'Entity One', kind: EntityKind.NPC, tags: ['tag1', 'tag2'] },
                { id: '2', title: 'Entity Two', kind: EntityKind.NPC, tags: ['tag2', 'tag3'] },
            ];
            const merged = mergeEntities(entities, ['tags']);

            expect(merged).toEqual({
                id: '1',
                title: 'Entity One',
                kind: EntityKind.NPC,
                tags: ['tag1', 'tag2', 'tag3'],
            });
        });

        it('should return null if no entities are provided', () => {
            const merged = mergeEntities([], ['tags']);
            expect(merged).toBeNull();
        });

        it('should handle cases where some entities do not have the field to merge', () => {
            const entities: Array<AnyEntity & EntityWithId> = [
                { id: '1', title: 'Entity One', kind: EntityKind.ITEM },
                { id: '2', title: 'Entity Two', tags: ['tag2', 'tag3'], kind: EntityKind.ITEM },
            ];
            const merged = mergeEntities(entities, ['tags']);

            expect(merged).toEqual({
                id: '1',
                title: 'Entity One',
                tags: ['tag2', 'tag3'],
                kind: EntityKind.ITEM,
            });
        });
    });
});