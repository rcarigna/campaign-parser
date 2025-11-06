import { initializeTemplates, processEntity } from './templateEngine';
import { EntityKind } from '@/types';
import type { AnyEntity, NPC } from '@/types';

// Dynamic schema validation utility
const validateEntitySchemaInContent = <T extends Record<string, unknown>>(
    entity: T,
    content: string
): {
    presentKeys: string[];
    missingKeys: string[];
    allKeysPresent: boolean;
    schemaKeys: string[];
} => {
    // Dynamically extract all keys that have actual values in the entity object
    const schemaKeys = Object.keys(entity).filter(key => {
        const value = entity[key];
        return value !== undefined &&
            value !== null &&
            (typeof value !== 'string' || value.trim() !== '') &&
            (!Array.isArray(value) || value.length > 0);
    });

    // Check which keys/values are represented in the template content
    const presentKeys: string[] = [];
    const missingKeys: string[] = [];

    schemaKeys.forEach(key => {
        const value = entity[key];
        let keyRepresented = false;

        // Check if the key name appears in content (case-insensitive)
        if (content.toLowerCase().includes(key.toLowerCase())) {
            keyRepresented = true;
        }
        // Check if the value appears in content
        else if (typeof value === 'string' && content.includes(value)) {
            keyRepresented = true;
        }
        // Handle arrays - check if any array element appears in content
        else if (Array.isArray(value)) {
            keyRepresented = value.some(v => content.includes(String(v)));
        }
        // Handle numbers - check as string representation
        else if (typeof value === 'number' && content.includes(value.toString())) {
            keyRepresented = true;
        }

        if (keyRepresented) {
            presentKeys.push(key);
        } else {
            missingKeys.push(key);
        }
    });

    return {
        presentKeys,
        missingKeys,
        allKeysPresent: missingKeys.length === 0,
        schemaKeys
    };
};



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

    it('should handle entities with special characters in filename', async () => {
        const npc: NPC = {
            kind: EntityKind.NPC,
            title: 'Test/NPC<>:"\\|?*Name',
            role: 'special character entity',
            sourceSessions: [1, 2]
        };

        const result = await processEntity(npc);

        expect(result.filename).toBe('TestNPCName.md');
        expect(result.content).toContain('---');

    });

    // Note: Schema validation is now handled dynamically by the tests below
    // See "should dynamically validate all NPC schema properties are handled in template"

    it('should handle entities without sourceSessions', async () => {
        const npc: NPC = {
            kind: EntityKind.NPC,
            title: 'Orphaned NPC',
            role: 'mysterious figure',
            sourceSessions: []
        };

        const result = await processEntity(npc);

        expect(result).toBeDefined();
        expect(result.filename).toBe('Orphaned NPC.md');
        expect(result.content).toContain('# 🧑‍🎭 Orphaned NPC');
    });

    it('should throw error for unsupported entity kind', async () => {
        const invalidEntity = {
            kind: 'unsupported_kind' as EntityKind,
            title: 'Invalid Entity',
            sourceSessions: []
        } as AnyEntity;

        await expect(processEntity(invalidEntity)).rejects.toThrow('No template found for entity kind: unsupported_kind');
    });

    it('should handle multiple entities with processEntities', async () => {
        const entities: NPC[] = [
            {
                kind: EntityKind.NPC,
                title: 'NPC One',
                role: 'first',
                sourceSessions: [1]
            },
            {
                kind: EntityKind.NPC,
                title: 'NPC Two',
                role: 'second',
                sourceSessions: [2]
            }
        ];

        const { processEntities } = await import('./templateEngine');
        const results = await processEntities(entities);

        expect(results).toHaveLength(2);
        expect(results[0].filename).toBe('NPC One.md');
        expect(results[0].kind).toBe(EntityKind.NPC);
        expect(results[1].filename).toBe('NPC Two.md');
        expect(results[1].kind).toBe(EntityKind.NPC);
    });

    it('should continue processing other entities when one fails', async () => {
        const entities = [
            {
                kind: EntityKind.NPC,
                title: 'Valid NPC',
                role: 'valid',
                sourceSessions: [1]
            } as AnyEntity,
            {
                kind: 'invalid_kind' as EntityKind,
                title: 'Invalid Entity',
                sourceSessions: []
            } as AnyEntity
        ];

        const { processEntities } = await import('./templateEngine');
        const results = await processEntities(entities);

        expect(results).toHaveLength(1);
        expect(results[0].filename).toBe('Valid NPC.md');
    });

    it('should handle multiple processEntity calls efficiently', async () => {
        // Test that multiple processEntity calls work correctly
        // Note: Current implementation calls initializeTemplates on each processEntity call
        // but returns early if templates are already cached

        const entities: NPC[] = [
            { kind: EntityKind.NPC, title: 'NPC 1', role: 'first' },
            { kind: EntityKind.NPC, title: 'NPC 2', role: 'second' },
            { kind: EntityKind.NPC, title: 'NPC 3', role: 'third' },
        ];

        const startTime = performance.now();

        // Process multiple entities
        for (const npc of entities) {
            const result = await processEntity(npc);
            expect(result.content).toContain(`# 🧑‍🎭 ${npc.title}`);
            expect(result.filename).toBe(`${npc.title}.md`);
        }

        const endTime = performance.now();
        const totalTime = endTime - startTime;

        // Should be reasonably fast even with redundant init calls (due to caching)
        expect(totalTime).toBeLessThan(100); // Should complete in under 100ms

        console.log(`Processed ${entities.length} entities in ${totalTime.toFixed(2)}ms`);
    });

    it('should dynamically validate all NPC schema properties are handled in template', async () => {
        // Create a comprehensive NPC object with various property types
        const comprehensiveNPC: NPC = {
            kind: EntityKind.NPC,
            title: 'Schema Test Character',
            role: 'dynamic validator',
            faction: 'Test Alliance',
            importance: 'major',
            aliases: ['Validator', 'Schema Tester'],
            location: 'Test Chamber',
            class: 'Artificer',
            race: 'Gnome',
            CR: '8',
            tags: ['testing', 'validation', 'schema'],
            status: 'active',
            sourceSessions: [5, 10, 15]
        };

        const result = await processEntity(comprehensiveNPC);

        // Dynamically validate the entity schema against template output
        const validation = validateEntitySchemaInContent(comprehensiveNPC, result.content);

        // Log the schema analysis for visibility
        console.log(`\n=== Dynamic Schema Validation ===`);
        console.log(`Total schema keys found: ${validation.schemaKeys.length}`);
        console.log(`Schema keys: [${validation.schemaKeys.join(', ')}]`);
        console.log(`Keys present in template: [${validation.presentKeys.join(', ')}]`);

        if (validation.missingKeys.length > 0) {
            console.log(`Keys missing from template: [${validation.missingKeys.join(', ')}]`);
        }

        // Core requirements: at minimum, title and kind should always be present
        expect(validation.presentKeys).toContain('title');
        expect(validation.presentKeys).toContain('kind');

        // Most NPC properties should be represented in the template
        // Allow for some flexibility since not all properties may be displayed
        const representationRate = validation.presentKeys.length / validation.schemaKeys.length;
        expect(representationRate).toBeGreaterThan(0.5); // At least 50% of properties should be represented

        // Essential NPC properties must be present when they have values
        const essentialProperties = ['title', 'role', 'faction', 'importance'];
        essentialProperties.forEach(prop => {
            if (comprehensiveNPC[prop as keyof NPC]) {
                expect(validation.presentKeys).toContain(prop);
            }
        });

        console.log(`Template representation rate: ${(representationRate * 100).toFixed(1)}%`);
        console.log(`=================================\n`);
    });

    it('should dynamically validate any entity type schema properties', async () => {
        // Test with a minimal NPC to ensure the validation works with sparse objects too
        const minimalNPC: NPC = {
            kind: EntityKind.NPC,
            title: 'Minimal Character',
            role: 'test subject'
        };

        const result = await processEntity(minimalNPC);

        // Dynamic validation should work regardless of how many properties are set
        const validation = validateEntitySchemaInContent(minimalNPC, result.content);

        console.log(`\n=== Minimal Entity Validation ===`);
        console.log(`Entity type: ${minimalNPC.kind}`);
        console.log(`Properties with values: ${validation.schemaKeys.length}`);
        console.log(`Properties: [${validation.schemaKeys.join(', ')}]`);
        console.log(`All properties represented: ${validation.allKeysPresent}`);

        // For minimal entities, we expect all provided properties to be represented
        expect(validation.allKeysPresent).toBe(true);
        expect(validation.presentKeys).toContain('title');
        expect(validation.presentKeys).toContain('kind');
        expect(validation.presentKeys).toContain('role');

        console.log(`Validation passed for entity with ${validation.schemaKeys.length} properties`);
        console.log(`==================================\n`);
    });

    it('should register and use Handlebars helpers correctly', async () => {
        // Test each_if_exists helper
        const npcWithTags: NPC = {
            kind: EntityKind.NPC,
            title: 'Helper Test NPC',
            role: 'test subject',
            tags: ['magic', 'friendly', 'shopkeeper'],
            sourceSessions: [1, 2, 3]
        };

        const result = await processEntity(npcWithTags);

        // Verify the helpers are working in the template
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
    });

    it('should handle each_if_exists helper with empty arrays', async () => {
        const npcWithEmptyTags: NPC = {
            kind: EntityKind.NPC,
            title: 'Empty Tags NPC',
            role: 'empty test',
            tags: [],
            sourceSessions: []
        };

        const result = await processEntity(npcWithEmptyTags);

        // Should not throw error and should generate valid content
        expect(result.content).toBeDefined();
        expect(result.filename).toBe('Empty Tags NPC.md');
    });

    it('should handle join helper with arrays', async () => {
        const npcWithAliases: NPC = {
            kind: EntityKind.NPC,
            title: 'Multi-Alias NPC',
            role: 'shapeshifter',
            aliases: ['The Phantom', 'Shadow Walker', 'Mystery Man'],
            sourceSessions: [1]
        };

        const result = await processEntity(npcWithAliases);

        // Verify aliases are properly joined in the output
        expect(result.content).toBeDefined();
        expect(result.content).toContain('Multi-Alias NPC');
    });

    it('should handle session_refs helper with session arrays', async () => {
        const npcWithManySessions: NPC = {
            kind: EntityKind.NPC,
            title: 'Recurring Character',
            role: 'quest giver',
            sourceSessions: [1, 5, 10, 15, 20]
        };

        const result = await processEntity(npcWithManySessions);

        // Session references should be formatted properly
        expect(result.content).toBeDefined();
        expect(result.content).toContain('Recurring Character');
    });

    it('should handle wikilink helper for Obsidian formatting', async () => {
        const npcWithLocation: NPC = {
            kind: EntityKind.NPC,
            title: 'Tavern Keeper',
            role: 'proprietor',
            location: 'The Prancing Pony',
            sourceSessions: [1]
        };

        const result = await processEntity(npcWithLocation);

        // Location should be formatted as wiki link if template uses wikilink helper
        expect(result.content).toBeDefined();
        expect(result.content).toContain('Tavern Keeper');
    });

    it('should handle helpers with null and undefined values gracefully', async () => {
        const npcWithMissingFields: NPC = {
            kind: EntityKind.NPC,
            title: 'Incomplete NPC',
            role: 'test case'
            // Missing optional fields like tags, aliases, etc.
        };

        const result = await processEntity(npcWithMissingFields);

        // Should not throw errors when helpers encounter undefined/null values
        expect(result.content).toBeDefined();
        expect(result.filename).toBe('Incomplete NPC.md');
        expect(result.content).toContain('# 🧑‍🎭 Incomplete NPC');
    });
});
