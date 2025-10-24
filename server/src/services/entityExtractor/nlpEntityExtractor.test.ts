import { extractEntities } from './nlpEntityExtractor';
import { EntityExtractor, extractEntitiesRegex } from './entityExtractor';
import { parseDocument } from '../documentParser';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { AnyEntity } from '@obsidian-parser/shared';

describe('NLP Entity Extractor vs Regex Extractor', () => {
    const regexExtractor = new EntityExtractor();

    let parsedContent: any;
    let filename: string;

    beforeAll(async () => {
        // Read and parse the test file once for both extractors
        const testFilePath = resolve(__dirname, '../../../../test_data/session_summary_1.md');
        const fileContent = readFileSync(testFilePath);
        filename = 'session_summary_1.md';

        const mockFile = {
            originalname: filename,
            buffer: fileContent,
            mimetype: 'text/markdown',
            size: fileContent.length
        } as Express.Multer.File;

        const parsedDocument = await parseDocument(mockFile);
        parsedContent = parsedDocument.content;
    });

    it('should compare NLP vs Regex extraction quality', () => {
        if (!('raw' in parsedContent)) {
            throw new Error('Expected markdown content');
        }

        // Extract with both methods
        const nlpEntities = extractEntities(parsedContent);
        const regexEntities = regexExtractor.extractEntities(parsedContent, filename);

        console.log('\\n=== NLP EXTRACTOR RESULTS ===');
        console.log(`Total entities: ${nlpEntities.length}`);

        const nlpNPCs = nlpEntities.filter((e: AnyEntity) => e.kind === 'npc');
        const nlpLocations = nlpEntities.filter((e: AnyEntity) => e.kind === 'location');
        const nlpItems = nlpEntities.filter((e: AnyEntity) => e.kind === 'item');
        const nlpQuests = nlpEntities.filter((e: AnyEntity) => e.kind === 'quest');

        console.log(`NPCs (${nlpNPCs.length}):`, nlpNPCs.map((e: AnyEntity) => e.title));
        console.log(`Locations (${nlpLocations.length}):`, nlpLocations.map((e: AnyEntity) => e.title));
        console.log(`Items (${nlpItems.length}):`, nlpItems.map((e: AnyEntity) => e.title));
        console.log(`Quests (${nlpQuests.length}):`, nlpQuests.map((e: AnyEntity) => e.title));

        console.log('\\n=== REGEX EXTRACTOR RESULTS ===');
        console.log(`Total entities: ${regexEntities.length}`);

        const regexNPCs = regexEntities.filter(e => e.kind === 'npc');
        const regexLocations = regexEntities.filter(e => e.kind === 'location');
        const regexItems = regexEntities.filter(e => e.kind === 'item');
        const regexQuests = regexEntities.filter(e => e.kind === 'quest');

        console.log(`NPCs (${regexNPCs.length}):`, regexNPCs.map(e => e.title));
        console.log(`Locations (${regexLocations.length}):`, regexLocations.map(e => e.title));
        console.log(`Items (${regexItems.length}):`, regexItems.map(e => e.title));
        console.log(`Quests (${regexQuests.length}):`, regexQuests.map(e => e.title));

        // Quality assertions
        expect(nlpEntities.length).toBeGreaterThan(0);
        expect(regexEntities.length).toBeGreaterThan(0);

        // Both should extract core NPCs
        const nlpNPCNames = nlpNPCs.map((npc: AnyEntity) => npc.title);
        const regexNPCNames = regexNPCs.map(npc => npc.title);

        expect(nlpNPCNames).toContain('Durnan');
        expect(nlpNPCNames).toContain('Bonnie');
        expect(regexNPCNames).toContain('Durnan');
        expect(regexNPCNames).toContain('Bonnie');

        // Both should extract core locations
        const nlpLocationNames = nlpLocations.map((loc: AnyEntity) => loc.title);
        const regexLocationNames = regexLocations.map(loc => loc.title);

        expect(nlpLocationNames).toContain('Yawning Portal');
        expect(nlpLocationNames).toContain('Waterdeep');
        expect(regexLocationNames).toContain('Yawning Portal');
        expect(regexLocationNames).toContain('Waterdeep');

        // Check for session summary
        const nlpSession = nlpEntities.find((e: AnyEntity) => e.kind === 'session_summary');
        const regexSession = regexEntities.find(e => e.kind === 'session_summary');

        expect(nlpSession).toBeDefined();
        expect(regexSession).toBeDefined();
        expect(nlpSession?.title).toContain('A Friend in Need');
        expect(regexSession?.title).toContain('A Friend in Need');
    });

    it('should have better NPC extraction quality with NLP', () => {
        if (!('raw' in parsedContent)) return;

        const nlpEntities = extractEntities(parsedContent);
        const regexEntities = regexExtractor.extractEntities(parsedContent, filename);

        const nlpNPCs = nlpEntities.filter((e: AnyEntity) => e.kind === 'npc');
        const regexNPCs = regexEntities.filter(e => e.kind === 'npc');

        // NLP should have fewer false positives (partial sentences as NPCs)
        const nlpFalsePositives = nlpNPCs.filter((npc: AnyEntity) =>
            npc.title.includes(' the ') ||
            npc.title.includes(' and ') ||
            npc.title.length > 30
        );

        const regexFalsePositives = regexNPCs.filter(npc =>
            npc.title.includes(' the ') ||
            npc.title.includes(' and ') ||
            npc.title.length > 30
        );

        console.log('\\nFalse positives comparison:');
        console.log('NLP false positives:', nlpFalsePositives.length);
        console.log('Regex false positives:', regexFalsePositives.length);

        // NLP should have significantly fewer false positives
        expect(nlpFalsePositives.length).toBeLessThan(regexFalsePositives.length);
    });
});