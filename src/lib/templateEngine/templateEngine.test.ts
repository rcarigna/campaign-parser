import { initializeTemplates, processEntity } from './templateEngine';
import { exportEntities, type OrganizedFile } from '../services/exportService';
import { EntityKind, LocationType } from '@/types';
import type { NPC, AnyEntity } from '@/types';

describe('Template Engine', () => {
    beforeAll(async () => {
        await initializeTemplates();
    });

    describe('processEntity', () => {
        it('should process an NPC entity into markdown', async () => {
            const npc: NPC = {
                kind: EntityKind.NPC,
                title: 'Durnan',
                role: 'barkeep',
                sourceSessions: [1]
            };

            const result = await processEntity(npc);

            expect(result.filename).toBe('Durnan.md');
            expect(result.content).toContain('# 🧑‍🎭 Durnan');
            expect(result.content).toContain('**Role:** barkeep');
            expect(result.content).toContain('*Referenced in Sessions: 1*');
            expect(result.content).toContain('tags: [character, npc]');
        });

        it('should handle entities with missing optional fields', async () => {
            const npc: NPC = {
                kind: EntityKind.NPC,
                title: 'Mystery NPC'
            };

            const result = await processEntity(npc);

            expect(result.filename).toBe('Mystery NPC.md');
            expect(result.content).toContain('# 🧑‍🎭 Mystery NPC');
            // Should handle missing fields gracefully
            expect(result.content).not.toContain('undefined');
        });
    });

    describe('filename sanitization', () => {
        it('should sanitize problematic characters in filenames', async () => {
            const npc: NPC = {
                kind: EntityKind.NPC,
                title: 'Bad/Name:With|Chars?'
            };

            const result = await processEntity(npc);

            expect(result.filename).toBe('BadNameWithChars.md');
            expect(result.filename).not.toMatch(/[<>:"/\\|?*]/);
        });
    });
});

describe('Export Service', () => {
    it('should export entities with proper vault organization', async () => {
        const entities: AnyEntity[] = [
            { kind: EntityKind.NPC, title: 'Test NPC' },
            { kind: EntityKind.LOCATION, title: 'Test Location', type: LocationType.TAVERN },
            { kind: EntityKind.ITEM, title: 'Test Item' }
        ];

        const result = await exportEntities(entities);

        expect(result.files).toHaveLength(3);
        expect(result.metadata.totalEntities).toBe(3);
        expect(result.metadata.entityCounts.npc).toBe(1);
        expect(result.metadata.entityCounts.location).toBe(1);
        expect(result.metadata.entityCounts.item).toBe(1);

        // Check vault organization
        const npcFile = result.files.find((f: OrganizedFile) => f.kind === 'npc');
        expect(npcFile?.vaultPath).toBe('02_World/NPCs');
        expect(npcFile?.fullPath).toBe('02_World/NPCs/Test NPC.md');
    });
});

// Integration test with real session data
describe('Integration with Session Data', () => {
    it('should process session summary entities correctly', async () => {
        // Use a subset of the real session data
        const sessionEntities: AnyEntity[] = [
            {
                kind: EntityKind.NPC,
                title: 'Durnan',
                role: 'barkeep',
                sourceSessions: [1]
            },
            {
                kind: EntityKind.LOCATION,
                title: 'Yawning Portal',
                type: LocationType.TAVERN,
                sourceSessions: [1]
            }
        ];

        const result = await exportEntities(sessionEntities);

        expect(result.files).toHaveLength(2);

        const durnanFile = result.files.find((f) => f.filename === 'Durnan.md');
        expect(durnanFile?.content).toContain('barkeep');
        expect(durnanFile?.vaultPath).toBe('02_World/NPCs');

        const tavernFile = result.files.find((f) => f.filename === 'Yawning Portal.md');
        expect(tavernFile?.content).toContain('tavern');
        expect(tavernFile?.vaultPath).toBe('02_World/Locations');
    });
});