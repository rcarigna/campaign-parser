import { itemSchema, locationSchema, npcSchema, playerSchema, questSchema, sessionPrepSchema, sessionSummarySchema } from "@/components/Entity/entityValidation";
import { generateFieldsFromSchema } from "@/lib/formGenerator";

// Campaign Entity Types
export enum EntityKind {
    ITEM = "item",
    LOCATION = "location",
    NPC = "npc",
    PLAYER = "player",
    QUEST = "quest",
    SESSION_PREP = "session_prep",
    SESSION_SUMMARY = "session_summary"
}

export enum ItemRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    VERY_RARE = "very_rare",
    LEGENDARY = "legendary",
    ARTIFACT = "artifact"
}

export enum ItemType {
    WEAPON = "weapon",
    ARMOR = "armor",
    SHIELD = "shield",
    CONSUMABLE = "consumable",
    TOOL = "tool",
    ADVENTURING_GEAR = "adventuring_gear",
    TREASURE = "treasure",
    MAGIC_ITEM = "magic_item"
}

export enum LocationType {
    CITY = "city",
    TOWN = "town",
    VILLAGE = "village",
    DUNGEON = "dungeon",
    TAVERN = "tavern",
    SHOP = "shop",
    TEMPLE = "temple",
    LANDMARK = "landmark",
    WILDERNESS = "wilderness"
}

export enum QuestType {
    MAIN = "main",
    SIDE = "side",
    PERSONAL = "personal"
}

export type BaseEntity = {
    kind: EntityKind;
    title: string;              // or character_name for players
    sourceSessions?: number[];  // which session numbers referenced this
};

export type Item = BaseEntity & {
    kind: EntityKind.ITEM;
    tags?: string[];
    rarity?: ItemRarity;
    type?: ItemType;
    attunement?: boolean;
    owner?: string;
    status?: string;
};

export type Location = BaseEntity & {
    kind: EntityKind.LOCATION;
    tags?: string[];
    region?: string;
    type?: LocationType;
    faction_presence?: string[];
    status?: string;
};

export type NPC = BaseEntity & {
    kind: EntityKind.NPC;
    tags?: string[];
    faction?: string;
    role?: string;
    status?: string;
    importance?: "minor" | "supporting" | "major";
    aliases?: string[];
    location?: string;
    class?: string;
    race?: string;
    CR?: string;
};

export type Player = BaseEntity & {
    kind: EntityKind.PLAYER;
    tags?: string[];
    status?: string;
    player_name?: string;
    character_name: string;
    race?: string;
    class?: string;
    level?: number | string;
    background?: string;
    affiliations?: string[];
    aliases?: string[];
};

export type Quest = BaseEntity & {
    kind: EntityKind.QUEST;
    tags?: string[];
    status?: string;
    owner?: string;
    faction?: string;
    arc?: string;
    type?: QuestType;
};

export type SessionPrep = BaseEntity & {
    kind: EntityKind.SESSION_PREP;
    tags?: string[];
    session_date?: string;
    status?: string;
    arc?: string;
    objectives?: string[]; // optional UI-only helpers
};

export type SessionSummary = BaseEntity & {
    kind: EntityKind.SESSION_SUMMARY;
    tags?: string[];
    session_date?: string;
    session_number?: number;
    arc?: string;
    status?: "complete" | "draft" | string;
    brief_synopsis?: string;
    full_summary?: string;
    consequences?: string[];
    foreshadowing?: string[];
    threads_updated?: string[];
};

export type AnyEntity =
    | Item
    | Location
    | NPC
    | Player
    | Quest
    | SessionPrep
    | SessionSummary;

// Client-specific type extensions
export type EntityWithId = AnyEntity & {
    id: string;
};

// Dynamic form field mapping - generates form fields from schemas automatically, with lazy memoization
const fieldCache: Partial<Record<EntityKind, any[]>> = {};
export const EntityFieldMap: Record<EntityKind, () => any[]> = {
    [EntityKind.ITEM]: () => {
        if (!fieldCache[EntityKind.ITEM]) {
            fieldCache[EntityKind.ITEM] = generateFieldsFromSchema(itemSchema);
        }
        return fieldCache[EntityKind.ITEM]!;
    },
    [EntityKind.LOCATION]: () => {
        if (!fieldCache[EntityKind.LOCATION]) {
            fieldCache[EntityKind.LOCATION] = generateFieldsFromSchema(locationSchema);
        }
        return fieldCache[EntityKind.LOCATION]!;
    },
    [EntityKind.QUEST]: () => {
        if (!fieldCache[EntityKind.QUEST]) {
            fieldCache[EntityKind.QUEST] = generateFieldsFromSchema(questSchema);
        }
        return fieldCache[EntityKind.QUEST]!;
    },
    [EntityKind.NPC]: () => {
        if (!fieldCache[EntityKind.NPC]) {
            fieldCache[EntityKind.NPC] = generateFieldsFromSchema(npcSchema);
        }
        return fieldCache[EntityKind.NPC]!;
    },
    [EntityKind.PLAYER]: () => {
        if (!fieldCache[EntityKind.PLAYER]) {
            fieldCache[EntityKind.PLAYER] = generateFieldsFromSchema(playerSchema);
        }
        return fieldCache[EntityKind.PLAYER]!;
    },
    [EntityKind.SESSION_PREP]: () => {
        if (!fieldCache[EntityKind.SESSION_PREP]) {
            fieldCache[EntityKind.SESSION_PREP] = generateFieldsFromSchema(sessionPrepSchema);
        }
        return fieldCache[EntityKind.SESSION_PREP]!;
    },
    [EntityKind.SESSION_SUMMARY]: () => {
        if (!fieldCache[EntityKind.SESSION_SUMMARY]) {
            fieldCache[EntityKind.SESSION_SUMMARY] = generateFieldsFromSchema(sessionSummarySchema);
        }
        return fieldCache[EntityKind.SESSION_SUMMARY]!;
    }
};

// Helper to get form fields for any entity type
export const getEntityFields = (entityKind: EntityKind) => {
    const getter = EntityFieldMap[entityKind];
    return getter ? getter() : [];
};