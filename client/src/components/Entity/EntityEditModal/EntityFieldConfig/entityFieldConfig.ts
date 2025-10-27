import {
    EntityKind,
    ItemRarity,
    LocationType,
    QuestType,
    ItemType,
} from '../../../../types/constants';

export type FieldConfig = {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox';
    options?: string[];
};

const baseFields: FieldConfig[] = [
    { key: 'title', label: 'Title', type: 'text' }
];

const npcFields: FieldConfig[] = [
    ...baseFields,
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'faction', label: 'Faction', type: 'text' },
    {
        key: 'importance',
        label: 'Importance',
        type: 'select',
        options: ['minor', 'supporting', 'major'],
    },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'class', label: 'Class', type: 'text' },
    { key: 'race', label: 'Race', type: 'text' },
];

const locationFields: FieldConfig[] = [
    ...baseFields,
    {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: Object.values(LocationType),
    },
    { key: 'region', label: 'Region', type: 'text' },
];

const itemFields: FieldConfig[] = [
    ...baseFields,
    {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: Object.values(ItemType),
    },
    {
        key: 'rarity',
        label: 'Rarity',
        type: 'select',
        options: Object.values(ItemRarity),
    },
    { key: 'attunement', label: 'Requires Attunement', type: 'checkbox' },
    { key: 'owner', label: 'Owner', type: 'text' },
];

const questFields: FieldConfig[] = [
    ...baseFields,
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['active', 'completed', 'failed', 'available'],
    },
    {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: Object.values(QuestType),
    },
    { key: 'owner', label: 'Quest Giver', type: 'text' },
    { key: 'faction', label: 'Faction', type: 'text' },
];

const sessionSummaryFields: FieldConfig[] = [
    ...baseFields,
    { key: 'session_date', label: 'Session Date', type: 'text' },
    { key: 'session_number', label: 'Session Number', type: 'text' },
    { key: 'arc', label: 'Arc', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
];

const sessionPrepFields: FieldConfig[] = [
    ...baseFields,
    { key: 'session_date', label: 'Session Date', type: 'text' },
    { key: 'prep_notes', label: 'Prep Notes', type: 'textarea' },
];

const playerFields: FieldConfig[] = [
    ...baseFields,
    { key: 'class', label: 'Class', type: 'text' },
    { key: 'race', label: 'Race', type: 'text' },
    { key: 'level', label: 'Level', type: 'text' },
    { key: 'player_name', label: 'Player Name', type: 'text' },
];

/**
 * Get field configuration for a specific entity kind
 */
export const getFieldsForEntityKind = (kind: EntityKind): FieldConfig[] => {
    switch (kind) {
        case EntityKind.NPC:
            return npcFields;
        case EntityKind.LOCATION:
            return locationFields;
        case EntityKind.ITEM:
            return itemFields;
        case EntityKind.QUEST:
            return questFields;
        case EntityKind.SESSION_SUMMARY:
            return sessionSummaryFields;
        case EntityKind.SESSION_PREP:
            return sessionPrepFields;
        case EntityKind.PLAYER:
            return playerFields;
        default:
            return baseFields;
    }
};

/**
 * Get all available entity kinds that have field configurations
 */
export const getAvailableEntityKinds = (): EntityKind[] => {
    return Object.values(EntityKind);
};

/**
 * Check if a field is required for a specific entity kind
 */
export const isFieldRequired = (kind: EntityKind, fieldKey: string): boolean => {
    // Title is always required
    if (fieldKey === 'title') return true;

    // Add entity-specific required fields
    switch (kind) {
        case EntityKind.NPC:
            return ['role'].includes(fieldKey);
        case EntityKind.LOCATION:
            return ['type'].includes(fieldKey);
        case EntityKind.ITEM:
            return ['type'].includes(fieldKey);
        case EntityKind.QUEST:
            return ['status'].includes(fieldKey);
        default:
            return false;
    }
};