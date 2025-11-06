import { extractEntitiesRegex, EntityExtractor } from './entityExtractor';
import { MarkdownContent, EntityKind, LocationType, ItemType, NPC, Location, Item } from '@/types';
import { readFileSync } from 'fs';
import { join } from 'path';

// Helper to create a complete MarkdownContent object and avoid issues mocking marked
const createMarkdownContent = (raw: string, overrides: Partial<MarkdownContent> = {}): MarkdownContent => {
    // Parse headings from the content
    const headings = [];
    const lines = raw.split('\n');
    for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            headings.push({ level, text, id });
        }
    }

    // Create text version (simplified - removing markdown)
    const textContent = raw
        .replace(/^#{1,6}\s+/gm, '') // Remove heading markers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\n\n+/g, ' ') // Collapse multiple newlines
        .replace(/\n/g, ' ') // Replace single newlines with spaces
        .trim();

    return {
        raw,
        html: `<div>${textContent}</div>`, // Simple HTML conversion
        text: textContent,
        frontmatter: {},
        headings,
        links: [],
        images: [],
        ...overrides
    };
};


describe('EntityExtractor', () => {
    let realSessionData: MarkdownContent;

    beforeAll(() => {
        // Load real session data for testing
        const sessionPath = join(__dirname, '../../../__mocks__/session_summary_1/session_summary_1.md');
        const rawContent = readFileSync(sessionPath, 'utf-8');
        realSessionData = createMarkdownContent(rawContent);
    });

    describe('Real Session Data Tests', () => {
        it('should extract session summary from real data', () => {
            const entities = extractEntitiesRegex(realSessionData, 'session_summary_1.md');
            const sessionSummary = entities.find(e => e.kind === EntityKind.SESSION_SUMMARY);

            expect(sessionSummary).toBeDefined();
            expect(sessionSummary?.title).toBe('A Friend in Need, Part 1:'); // Number prefix is stripped
            expect(sessionSummary?.session_number).toBe(1);
            expect(sessionSummary?.status).toBe('complete');
            expect(sessionSummary?.brief_synopsis).toContain('Our adventurers gathered in the Yawning Portal');
        });

        it('should extract major NPCs from real session data', () => {
            const entities = extractEntitiesRegex(realSessionData, 'session_summary_1.md');
            const npcs = entities.filter(e => e.kind === EntityKind.NPC);
            const npcNames = npcs.map(npc => npc.title);

            // Check for key NPCs mentioned in the session
            expect(npcNames).toContain('Durnan');
            expect(npcNames).toContain('Bonnie');
            expect(npcNames).toContain('Yagra');
            expect(npcNames).toContain('Volothamp Geddarm');
            expect(npcNames).toContain('Cat Amcathra');
            expect(npcNames).toContain('Teddy');
            expect(npcNames).toContain('Hastur');

            // Verify some NPC details
            const durnan = npcs.find(npc => npc.title === 'Durnan') as NPC;
            expect(durnan?.role).toBe('barkeep');

            const bonnie = npcs.find(npc => npc.title === 'Bonnie') as NPC;
            expect(bonnie?.role).toBe('barmaid');
        });

        it('should extract key locations from real session data', () => {
            const entities = extractEntitiesRegex(realSessionData, 'session_summary_1.md');
            const locations = entities.filter(e => e.kind === EntityKind.LOCATION);
            const locationNames = locations.map(loc => loc.title);

            // Check for key locations mentioned in the session
            expect(locationNames).toContain('Yawning Portal');
            expect(locationNames).toContain('Waterdeep');
            expect(locationNames).toContain('Undermountain');
            expect(locationNames).toContain('Skewered Dragon');
            expect(locationNames).toContain('Dock Ward');
            expect(locationNames).toContain('Temple of Gond');

            // Verify location types
            const yawningPortal = locations.find(l => l.title === 'Yawning Portal') as Location;
            expect(yawningPortal?.type).toBe(LocationType.TAVERN);

            const waterdeep = locations.find(l => l.title === 'Waterdeep') as Location;
            expect(waterdeep?.type).toBe(LocationType.CITY);

            const templeOfGond = locations.find(l => l.title === 'Temple of Gond') as Location;
            expect(templeOfGond?.type).toBe(LocationType.TEMPLE);
        });

        it('should extract items from real session data', () => {
            const entities = extractEntitiesRegex(realSessionData, 'session_summary_1.md');
            const items = entities.filter(e => e.kind === EntityKind.ITEM);
            const itemNames = items.map(item => item.title);

            // Check for items mentioned in the session
            expect(itemNames).toContain('ancestral blade');

            // Verify item types
            const ancestralBlade = items.find(i => i.title === 'ancestral blade') as Item;
            expect(ancestralBlade?.type).toBe(ItemType.WEAPON);
        });

        it('should extract quests from real session data', () => {
            const entities = extractEntitiesRegex(realSessionData, 'session_summary_1.md');
            const quests = entities.filter(e => e.kind === EntityKind.QUEST);

            // The main quest should be finding Floon
            const findFloonQuest = quests.find(q => q.title.includes('Floon'));
            expect(findFloonQuest).toBeDefined();
            expect(findFloonQuest?.status).toBe('active');
        });

        it('should assign correct session numbers to entities', () => {
            const entities = extractEntitiesRegex(realSessionData, 'session_summary_1.md');

            entities.forEach(entity => {
                if (entity.kind !== EntityKind.SESSION_SUMMARY) {
                    expect(entity.sourceSessions).toEqual([1]);
                }
            });
        });

        it('should handle the detailed session synopsis correctly', () => {
            const entities = extractEntitiesRegex(realSessionData, 'session_summary_1.md');
            const sessionSummary = entities.find(e => e.kind === EntityKind.SESSION_SUMMARY);

            expect(sessionSummary?.brief_synopsis).toBeDefined();
            expect(sessionSummary?.brief_synopsis?.length).toBeGreaterThan(100);
            expect(sessionSummary?.brief_synopsis?.length).toBeLessThanOrEqual(500);
            expect(sessionSummary?.full_summary).toContain('Yawning Portal');
        });
    });

    describe('Edge Cases and Basic Functionality', () => {
        it('should handle empty content gracefully', () => {
            const emptyContent = createMarkdownContent('');
            const entities = extractEntitiesRegex(emptyContent, 'empty.md');
            expect(entities).toEqual([]);
        });

        it('should not extract common words as NPCs', () => {
            const contentWithCommonWords = createMarkdownContent('The party went with They to find The.');
            const entities = extractEntitiesRegex(contentWithCommonWords, 'test.md');
            const npcs = entities.filter(e => e.kind === EntityKind.NPC);

            expect(npcs).toHaveLength(0);
        });

        it('should handle content without session number in filename', () => {
            const simpleContent = createMarkdownContent('# Some Random Document\nJust some content here.');
            const entities = extractEntitiesRegex(simpleContent, 'random_file.md');
            const sessionSummary = entities.find(e => e.kind === EntityKind.SESSION_SUMMARY);

            expect(sessionSummary).toBeUndefined();
        });

        it('should avoid duplicate entity extraction', () => {
            const contentWithDuplicates = createMarkdownContent('Durnan the barkeep served drinks. Later, Durnan helped the party.');
            const entities = extractEntitiesRegex(contentWithDuplicates, 'test.md');
            const durnanEntities = entities.filter(e => e.title === 'Durnan');

            expect(durnanEntities).toHaveLength(1);
        });

        it('should extract session number from different filename formats', () => {
            const testCases = [
                { filename: 'session_summary_5.md', expectedNumber: 5 },
                { filename: 'session_10.md', expectedNumber: 10 }
            ];

            testCases.forEach(({ filename, expectedNumber }) => {
                const content = createMarkdownContent(`# Session ${expectedNumber}`);
                const entities = extractEntitiesRegex(content, filename);
                const sessionSummary = entities.find(e => e.kind === EntityKind.SESSION_SUMMARY);

                expect(sessionSummary?.session_number).toBe(expectedNumber);
            });
        });
    });

    describe('EntityExtractor class (legacy)', () => {
        it('should work as a backward compatible wrapper', () => {
            const extractor = new EntityExtractor();
            const simpleContent = createMarkdownContent(`# Session 1
            ## Synopsis
            Test content with Durnan, Yagra, and the Yawning Portal.`);

            const entities = extractor.extractEntities(simpleContent, 'session_1.md');

            expect(entities.length).toBeGreaterThan(0);

            // Should have at least a session summary
            const sessionSummary = entities.find(e => e.kind === EntityKind.SESSION_SUMMARY);
            expect(sessionSummary).toBeDefined();
        });
    });
});