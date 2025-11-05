import { getEntityIcon, getEntityColor } from './entityUtils';
import { EntityKind } from '@/types';

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
});