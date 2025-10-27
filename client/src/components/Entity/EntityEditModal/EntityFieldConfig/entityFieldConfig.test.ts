import { getFieldsForEntityKind, isFieldRequired, getAvailableEntityKinds } from './entityFieldConfig';
import { EntityKind } from '../../../../types/constants';

describe('entityFieldConfig', () => {
    describe('getFieldsForEntityKind', () => {
        it('returns NPC fields for NPC entity kind', () => {
            const fields = getFieldsForEntityKind(EntityKind.NPC);

            expect(fields).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ key: 'title', label: 'Title', type: 'text' }),
                    expect.objectContaining({ key: 'role', label: 'Role', type: 'text' }),
                    expect.objectContaining({ key: 'faction', label: 'Faction', type: 'text' }),
                    expect.objectContaining({ key: 'importance', label: 'Importance', type: 'select' }),
                ])
            );
        });

        it('returns LOCATION fields for LOCATION entity kind', () => {
            const fields = getFieldsForEntityKind(EntityKind.LOCATION);

            expect(fields).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ key: 'title', label: 'Title', type: 'text' }),
                    expect.objectContaining({ key: 'type', label: 'Type', type: 'select' }),
                    expect.objectContaining({ key: 'region', label: 'Region', type: 'text' }),
                ])
            );
        });

        it('returns ITEM fields for ITEM entity kind', () => {
            const fields = getFieldsForEntityKind(EntityKind.ITEM);

            expect(fields).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ key: 'title', label: 'Title', type: 'text' }),
                    expect.objectContaining({ key: 'type', label: 'Type', type: 'select' }),
                    expect.objectContaining({ key: 'rarity', label: 'Rarity', type: 'select' }),
                    expect.objectContaining({ key: 'attunement', label: 'Requires Attunement', type: 'checkbox' }),
                ])
            );
        });

        it('returns base fields for unknown entity kind', () => {
            const fields = getFieldsForEntityKind('unknown' as EntityKind);

            expect(fields).toEqual([
                expect.objectContaining({ key: 'title', label: 'Title', type: 'text' })
            ]);
        });
    });

    describe('isFieldRequired', () => {
        it('returns true for title field (always required)', () => {
            expect(isFieldRequired(EntityKind.NPC, 'title')).toBe(true);
            expect(isFieldRequired(EntityKind.LOCATION, 'title')).toBe(true);
        });

        it('returns true for required NPC fields', () => {
            expect(isFieldRequired(EntityKind.NPC, 'role')).toBe(true);
            expect(isFieldRequired(EntityKind.NPC, 'faction')).toBe(false);
        });

        it('returns true for required LOCATION fields', () => {
            expect(isFieldRequired(EntityKind.LOCATION, 'type')).toBe(true);
            expect(isFieldRequired(EntityKind.LOCATION, 'region')).toBe(false);
        });

        it('returns false for non-required fields', () => {
            expect(isFieldRequired(EntityKind.NPC, 'importance')).toBe(false);
            expect(isFieldRequired(EntityKind.ITEM, 'owner')).toBe(false);
        });
    });

    describe('getAvailableEntityKinds', () => {
        it('returns all entity kinds', () => {
            const kinds = getAvailableEntityKinds();

            expect(kinds).toContain(EntityKind.NPC);
            expect(kinds).toContain(EntityKind.LOCATION);
            expect(kinds).toContain(EntityKind.ITEM);
            expect(kinds).toContain(EntityKind.QUEST);
        });
    });
});