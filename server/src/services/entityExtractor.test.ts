import { EntityExtractor } from './entityExtractor';
import { parseDocument } from './documentParser';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('EntityExtractor', () => {
    const extractor = new EntityExtractor();

    it('should extract entities from session summary', async () => {
        // Read the test file
        const testFilePath = resolve(__dirname, '../../../test_data/session_summary_1.md');
        const fileContent = readFileSync(testFilePath);

        // Create a mock file object
        const mockFile = {
            originalname: 'session_summary_1.md',
            buffer: fileContent,
            mimetype: 'text/markdown',
            size: fileContent.length
        } as Express.Multer.File;

        // Parse the document first
        const parsedDocument = await parseDocument(mockFile);

        expect(parsedDocument).toBeDefined();
        expect(parsedDocument.content).toBeDefined();

        if ('raw' in parsedDocument.content) {
            // Extract entities
            const entities = extractor.extractEntities(parsedDocument.content, mockFile.originalname);

            console.log('Extracted entities:', JSON.stringify(entities, null, 2));

            // Basic assertions
            expect(entities.length).toBeGreaterThan(0);

            // Should have a session summary
            const sessionSummary = entities.find(e => e.kind === 'session_summary');
            expect(sessionSummary).toBeDefined();
            expect(sessionSummary?.title).toContain('A Friend in Need');

            // Should extract some NPCs
            const npcs = entities.filter(e => e.kind === 'npc');
            expect(npcs.length).toBeGreaterThan(0);

            // Should have some known NPCs
            const npcNames = npcs.map(npc => npc.title);
            expect(npcNames).toContain('Durnan');
            expect(npcNames).toContain('Bonnie');

            // Should extract some locations
            const locations = entities.filter(e => e.kind === 'location');
            expect(locations.length).toBeGreaterThan(0);

            const locationNames = locations.map(loc => loc.title);
            expect(locationNames).toContain('Yawning Portal');
            expect(locationNames).toContain('Waterdeep');
        }
    });
});