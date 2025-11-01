import { parseDocument } from '../services/documentParser';
import { createMockFileFromTestData, getTestDataContent, testDataFiles } from './testUtils';
import { DocumentType } from '@obsidian-parser/shared';

describe('Test Data Integration', () => {
    describe('D&D Session Summary', () => {
        let parsedResult: any;

        beforeAll(async () => {
            const mockFile = createMockFileFromTestData(testDataFiles.SESSION_SUMMARY);
            parsedResult = await parseDocument(mockFile);
        });

        it('should extract all D&D character names', () => {
            expect(parsedResult.type).toBe(DocumentType.MARKDOWN);

            const content = parsedResult.content;
            const text = content.text;

            // Check for character names mentioned in the session
            expect(text).toContain('Cat Amcathra');
            expect(text).toContain('Teddy');
            expect(text).toContain('Hastur');
            expect(text).toContain('Lainadan');
            expect(text).toContain('Era');
        });

        it('should extract location names', () => {
            const content = parsedResult.content;
            const text = content.text;

            expect(text).toContain('Yawning Portal');
            expect(text).toContain('Waterdeep');
            expect(text).toContain('Skewered Dragon');
            expect(text).toContain('Dock Ward');
            expect(text).toContain('Undermountain');
        });

        it('should extract NPC names', () => {
            const content = parsedResult.content;
            const text = content.text;

            expect(text).toContain('Durnan');
            expect(text).toContain('Bonnie');
            expect(text).toContain('Yagra');
            expect(text).toContain('Volothamp Geddarm');
            expect(text).toContain('Floon Blagmaar');
        });

        it('should identify proper heading structure', () => {
            const content = parsedResult.content as any;

            expect(content.headings.length).toBeGreaterThan(0);

            // Check for main headings
            const headingTexts = content.headings.map((h: any) => h.text);
            expect(headingTexts).toContain('1.   A Friend in Need, Part 1:');
            expect(headingTexts).toContain('Synopsis:');
            expect(headingTexts).toContain('Detailed Description:');
        });

        it('should properly structure heading hierarchy', () => {
            const content = parsedResult.content as any;

            // Check for different heading levels
            const level1Headings = content.headings.filter((h: any) => h.level === 1);
            const level2Headings = content.headings.filter((h: any) => h.level === 2);
            const level3Headings = content.headings.filter((h: any) => h.level === 3);

            expect(level1Headings.length).toBe(0); // No # headings in this doc
            expect(level2Headings.length).toBe(1); // One ## heading
            expect(level3Headings.length).toBe(2); // Two ### headings
        });

        it('should preserve markdown structure in raw content', () => {
            const content = parsedResult.content;
            const rawContent = getTestDataContent(testDataFiles.SESSION_SUMMARY);

            expect(content.raw).toBe(rawContent);
            expect(content.raw).toContain('## 1.   A Friend in Need, Part 1:');
            expect(content.raw).toContain('### Synopsis:');
            expect(content.raw).toContain('### Detailed Description:');
        });

        it('should convert markdown to HTML properly', () => {
            const content = parsedResult.content;

            expect(content.html).toContain('<h2>');
            expect(content.html).toContain('<h3>');
            expect(content.html).toContain('<p>');
        });

        it('should extract meaningful metadata', () => {
            const metadata = parsedResult.metadata;

            expect(metadata.size).toBeGreaterThan(5000); // The file is quite long
            expect(metadata.mimeType).toBe('text/markdown');
            expect(metadata.lastModified).toBeInstanceOf(Date);
        });
    });
});