import { initializeTemplates, processEntity } from './templateEngine';
import { EntityKind } from '@/types';
import type { NPC } from '@/types';

describe('Template Engine', () => {
    beforeAll(async () => {
        await initializeTemplates();
    });

    it('should process an NPC entity into markdown', async () => {
        const npc: NPC = {
            kind: EntityKind.NPC,
            title: 'Durnan',
            role: 'barkeep',
            sourceSessions: [1]
        };

        const result = await processEntity(npc);

        expect(result).toBeDefined();
        expect(result.filename).toBe('Durnan.md');
        expect(result.content).toContain('# 🧑‍🎭 Durnan');
        expect(result.content).toContain('barkeep');
    });
});
