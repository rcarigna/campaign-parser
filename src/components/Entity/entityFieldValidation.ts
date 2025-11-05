import { EntityKind, type EntityWithId } from '@/types';

/**
 * Configuration for required fields per entity kind
 */
export const ENTITY_FIELD_REQUIREMENTS: Record<EntityKind, string[]> = {
    [EntityKind.NPC]: ['role', 'faction', 'importance'],
    [EntityKind.LOCATION]: ['type', 'region'],
    [EntityKind.ITEM]: ['type', 'rarity'],
    [EntityKind.QUEST]: ['status', 'type'],
    [EntityKind.PLAYER]: [], // Players typically don't have missing field validation
    [EntityKind.SESSION_SUMMARY]: [], // Session summaries are complete by default
    [EntityKind.SESSION_PREP]: [], // Session prep is complete by default
};

/**
 * Gets the list of missing required fields for an entity
 */
export const getMissingFields = (entity: EntityWithId): string[] => {
    const requiredFields = ENTITY_FIELD_REQUIREMENTS[entity.kind as EntityKind] || [];

    return requiredFields.filter((field: string) => {
        const value = (entity as any)[field];
        return !value || (typeof value === 'string' && value.trim() === '');
    });
};

/**
 * Checks if an entity has all required fields
 */
export const isEntityComplete = (entity: EntityWithId): boolean => {
    return getMissingFields(entity).length === 0;
};

/**
 * Gets the required fields for a specific entity kind
 */
export const getRequiredFields = (kind: EntityKind): string[] => {
    return ENTITY_FIELD_REQUIREMENTS[kind] || [];
};