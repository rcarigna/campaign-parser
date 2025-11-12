import { EntityKind, EntityWithId, LocationType } from "@/types";

export const mockEntity: EntityWithId = {
    id: 'test-id',
    kind: EntityKind.NPC,
    title: 'Test NPC',
    role: 'warrior',
};

export const mockPlayerEntity: EntityWithId = {
    id: 'test-id',
    kind: EntityKind.PLAYER,
    title: 'Test Player Title',
    character_name: 'Test Character',
    tags: ['hero'],
};

// Realistic NPC entity based on actual schema
export const mockNPCEntity: EntityWithId = {
    id: 'npc-1',
    kind: EntityKind.NPC,
    title: 'Davil Starsong',
    role: 'Information Broker',
    faction: 'Zhentarim',
    importance: 'supporting' as const,
    status: 'active',
    CR: '2',
    race: 'Half-Elf',
    class: 'Rogue',
    tags: ['zhentarim', 'tavern-keeper', 'information'],
    sourceSessions: [1, 3, 7],
};

// Realistic Location entity based on actual schema
export const mockLocationEntity: EntityWithId = {
    id: 'location-1',
    kind: EntityKind.LOCATION,
    title: 'Yawning Portal',
    type: LocationType.TAVERN,
    region: 'Castle Ward',
    faction_presence: ['Harpers', 'Lords Alliance'],
    status: 'active',
    tags: ['tavern', 'famous', 'undermountain-entrance'],
    sourceSessions: [1, 2, 5],
};