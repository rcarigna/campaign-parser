import { AnyEntity, EntityKind, EntityWithId } from '@/types';

/**
 * Gets the appropriate emoji icon for an entity kind
 */
export const getEntityIcon = (kind: EntityKind): string => {
    switch (kind) {
        case EntityKind.SESSION_SUMMARY:
            return '📜';
        case EntityKind.NPC:
            return '👤';
        case EntityKind.LOCATION:
            return '🗺️';
        case EntityKind.ITEM:
            return '⚔️';
        case EntityKind.QUEST:
            return '🎯';
        case EntityKind.PLAYER:
            return '🧙';
        case EntityKind.SESSION_PREP:
            return '📋';
        default:
            return '📄';
    }
};

/**
 * Gets the appropriate color for an entity kind
 */
export const getEntityColor = (kind: EntityKind): string => {
    switch (kind) {
        case EntityKind.SESSION_SUMMARY:
            return '#4f46e5';
        case EntityKind.NPC:
            return '#059669';
        case EntityKind.LOCATION:
            return '#dc2626';
        case EntityKind.ITEM:
            return '#d97706';
        case EntityKind.QUEST:
            return '#7c3aed';
        case EntityKind.PLAYER:
            return '#10b981';
        case EntityKind.SESSION_PREP:
            return '#6366f1';
        default:
            return '#6b7280';
    }
};

/**
 * Gets the display label for an entity kind
 */
export const getEntityLabel = (kind: EntityKind): string => {
    switch (kind) {
        case EntityKind.NPC:
            return 'NPCs';
        case EntityKind.LOCATION:
            return 'Locations';
        case EntityKind.ITEM:
            return 'Items';
        case EntityKind.QUEST:
            return 'Quests';
        case EntityKind.PLAYER:
            return 'Players';
        case EntityKind.SESSION_SUMMARY:
            return 'Sessions';
        case EntityKind.SESSION_PREP:
            return 'Session Prep';
        default:
            return 'Entities';
    }
};

/**
 * Gets the description for an entity kind
 */
export const getEntityDescription = (kind: EntityKind): string => {
    switch (kind) {
        case EntityKind.NPC:
            return 'Non-player characters';
        case EntityKind.LOCATION:
            return 'Places and venues in your world';
        case EntityKind.ITEM:
            return 'Equipment, weapons, and magical items';
        case EntityKind.QUEST:
            return 'Missions and storyline objectives';
        case EntityKind.PLAYER:
            return 'Player characters and their details';
        case EntityKind.SESSION_SUMMARY:
            return 'Session summaries and notes';
        case EntityKind.SESSION_PREP:
            return 'Session preparation and planning';
        default:
            return 'Campaign entities';
    }
};

/**
 * Entity metadata type for UI display
 */
export type EntityMetadata = {
    kind: EntityKind;
    emoji: string;
    label: string;
    description: string;
    color: string;
};

/**
 * Gets complete metadata for an entity kind
 */
export const getEntityMetadata = (kind: EntityKind): EntityMetadata => {
    return {
        kind,
        emoji: getEntityIcon(kind),
        label: getEntityLabel(kind),
        description: getEntityDescription(kind),
        color: getEntityColor(kind),
    };
};

/**
 * Gets metadata for all entity kinds
 */
export const getAllEntityMetadata = (): EntityMetadata[] => {
    return [
        EntityKind.NPC,
        EntityKind.LOCATION,
        EntityKind.ITEM,
        EntityKind.QUEST,
        EntityKind.PLAYER,
        EntityKind.SESSION_SUMMARY,
    ].map(getEntityMetadata);
};


// Outside component for clarity and testability
export const getIsEnumField = (
    entityFields: Array<{ key: string; type: string }>
) => {
    return (fieldName: string): boolean => {
        if (fieldName === 'kind') {
            return true;
        }
        const fieldMeta = entityFields.find((f) => f.key === fieldName);
        return fieldMeta?.type === 'select';
    };
};

export const mergeEntities = (entities: AnyEntity[], fieldsToMerge: string[]): AnyEntity | null => {
    if (entities.length === 0) return null;

    const merged: AnyEntity = { ...entities[0] };

    // const mergedFields: Record<string, unknown> = {};

    // fieldsToMerge.forEach((field) => {
    //     const values = entities.map((e) => (e as Record<string, unknown>)[field]).filter((v) => v !== undefined);
    //     if (values.length > 0) {
    //         mergedFields[field] = Array.from(new Set(values));
    //     }
    // });
    const mergedFields = fieldsToMerge.reduce<Record<string, unknown>>((acc, field) => {
        const values = entities.map((e) => (e as Record<string, unknown>)[field]).filter((v) => v !== undefined);
        if (values.length > 0) {
            if (Array.isArray(values[0])) {
                // If the field is an array, merge and deduplicate
                acc[field] = Array.from(new Set(values.flat()));
            } else {
                acc[field] = Array.from(new Set(values));
            }
        }
        return acc;
    }, {});

    Object.keys(mergedFields).forEach((fieldName) => {
        (merged as Record<string, unknown>)[fieldName] = mergedFields[fieldName];
    });

    return merged;
}