import { z } from 'zod';

// Base entity schema with common fields
const baseEntitySchema = z.object({
    id: z.string(),
    kind: z.enum(['item', 'location', 'npc', 'player', 'quest', 'session_prep', 'session_summary']),
    title: z.string().min(1, 'Title is required'),
    tags: z.array(z.string()).optional(),
});

// Entity-specific schemas with proper validation rules
const npcSchema = baseEntitySchema.extend({
    kind: z.literal('npc'),
    character_name: z.string().min(1, 'Character name is required'),
    role: z.string().min(1, 'Role is required'),
    faction: z.string().min(1, 'Faction is required'),
    importance: z.enum(['minor', 'supporting', 'major'], {
        message: 'Importance must be minor, supporting, or major'
    }),
    status: z.string().optional(),
    CR: z.string().optional(),
});

const locationSchema = baseEntitySchema.extend({
    kind: z.literal('location'),
    name: z.string().min(1, 'Location name is required'),
    type: z.string().min(1, 'Location type is required'),
    region: z.string().min(1, 'Region is required'),
    faction_presence: z.array(z.string()).optional(),
    status: z.string().optional(),
});

const itemSchema = baseEntitySchema.extend({
    kind: z.literal('item'),
    name: z.string().min(1, 'Item name is required'),
    type: z.string().min(1, 'Item type is required'),
    rarity: z.string().min(1, 'Rarity is required'),
    attunement: z.boolean().optional(),
    owner: z.string().optional(),
    status: z.string().optional(),
});

const questSchema = baseEntitySchema.extend({
    kind: z.literal('quest'),
    name: z.string().min(1, 'Quest name is required'),
    status: z.string().min(1, 'Quest status is required'),
    type: z.string().min(1, 'Quest type is required'),
    owner: z.string().optional(),
    faction: z.string().optional(),
    arc: z.string().optional(),
});

const playerSchema = baseEntitySchema.extend({
    kind: z.literal('player'),
    character_name: z.string().min(1, 'Character name is required'),
    player_name: z.string().optional(),
    race: z.string().optional(),
    class: z.string().optional(),
    level: z.number().optional(),
    status: z.string().optional(),
});

const sessionSummarySchema = baseEntitySchema.extend({
    kind: z.literal('session_summary'),
    session_number: z.number(),
    session_date: z.string().optional(),
    arc: z.string().optional(),
    synopsis: z.string().optional(),
    summary: z.string().optional(),
});

const sessionPrepSchema = baseEntitySchema.extend({
    kind: z.literal('session_prep'),
    session_number: z.number().optional(),
    planned_date: z.string().optional(),
    arc: z.string().optional(),
    notes: z.string().min(1, 'Notes are required'),
});

// Union schema for all entity types
const entitySchema = z.discriminatedUnion('kind', [
    npcSchema,
    locationSchema,
    itemSchema,
    questSchema,
    playerSchema,
    sessionSummarySchema,
    sessionPrepSchema,
]);

// Export the schemas for reuse
export {
    entitySchema,
    npcSchema,
    locationSchema,
    itemSchema,
    questSchema,
    playerSchema,
    sessionSummarySchema,
    sessionPrepSchema,
};

// Validation utilities
export const validateEntity = (entity: unknown) => {
    return entitySchema.safeParse(entity);
};

export const getMissingFields = (entity: unknown): string[] => {
    const result = entitySchema.safeParse(entity);

    if (result.success) {
        return [];
    }

    // Extract field names from Zod error paths
    return result.error.issues
        .filter(issue => issue.code === 'invalid_type' || issue.code === 'too_small')
        .map(issue => issue.path[issue.path.length - 1] as string)
        .filter((field, index, arr) => arr.indexOf(field) === index); // Remove duplicates
};

export const getValidationErrors = (entity: unknown): Record<string, string> => {
    const result = entitySchema.safeParse(entity);

    if (result.success) {
        return {};
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
    });

    return errors;
};

export const isEntityComplete = (entity: unknown): boolean => {
    return entitySchema.safeParse(entity).success;
};

// Type helpers
export type ValidatedNPC = z.infer<typeof npcSchema>;
export type ValidatedLocation = z.infer<typeof locationSchema>;
export type ValidatedItem = z.infer<typeof itemSchema>;
export type ValidatedQuest = z.infer<typeof questSchema>;
export type ValidatedPlayer = z.infer<typeof playerSchema>;
export type ValidatedEntity = z.infer<typeof entitySchema>;