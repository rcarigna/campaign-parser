import { EntityKind, EntityWithId } from "@/types";

export const mockEntity: EntityWithId = {
    id: 'test-id',
    kind: EntityKind.NPC,
    title: 'Test NPC',
    role: 'warrior',
};