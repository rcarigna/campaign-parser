import { EntityKind, EntityWithId } from '@/types';

export const mockPrimaryEntities: EntityWithId[] = [
    {
        id: '1',
        kind: EntityKind.NPC,
        title: 'Alice',
    },
    {
        id: '2',
        kind: EntityKind.LOCATION,
        title: 'Wonderland',
    },
];