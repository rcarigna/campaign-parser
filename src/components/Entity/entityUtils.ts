import { EntityKind } from '@/types';

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