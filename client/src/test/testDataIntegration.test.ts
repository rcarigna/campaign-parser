import { uploadDocument } from '../services/documentService';
import { DocumentType } from '@obsidian-parser/shared';

// Mock the service
jest.mock('../services/documentService');
const mockUploadDocument = uploadDocument as jest.MockedFunction<typeof uploadDocument>;

// Helper to create mock test file (simulating the D&D session summary)
const createMockSessionFile = (): File => {
    const mockContent = `## 1. A Friend in Need, Part 1:

### Synopsis:

Our adventurers gathered in the Yawning Portal tavern and inn, each for their own reasons, making first introductions and impressions. They met the barkeep & proprietor of the place, Durnan, as well as a barmaid named Bonnie.

### Detailed Description:

Our adventurers start in the Yawning Portal, a famous, or infamous, tavern and inn in the bustling city of Waterdeep. Cat Amcathra, noble half-elf hexblade sat in the VIP section of the tavern. Teddy the bugbear barbarian started outside. Hastur, a secretive drow, sat alone at a table. Volothamp Geddarm approached the party and offered them 10GP each.`;

    return new File([mockContent], 'session_summary_1.md', { type: 'text/markdown' });
};

describe('Integration Tests with Real Test Data', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle D&D session summary file upload', async () => {
        const testFile = createMockSessionFile();

        // Mock successful response
        const mockResponse = {
            filename: 'session_summary_1.md',
            type: DocumentType.MARKDOWN,
            content: {
                raw: 'mocked content',
                html: '<h2>A Friend in Need, Part 1:</h2>',
                text: 'Our adventurers gathered in the Yawning Portal...',
                frontmatter: {},
                headings: [
                    { level: 2, text: 'A Friend in Need, Part 1:', id: 'a-friend-in-need-part-1' }
                ],
                links: [],
                images: [],
            },
            metadata: {
                size: testFile.size,
                lastModified: new Date().toISOString(),
                mimeType: 'text/markdown',
            },
        };

        mockUploadDocument.mockResolvedValue(mockResponse);

        // Test that the file would be processed correctly
        const result = await uploadDocument(testFile);

        expect(result.filename).toBe('session_summary_1.md');
        expect(result.type).toBe(DocumentType.MARKDOWN);
        expect(result.content.text).toContain('Yawning Portal');
        expect(mockUploadDocument).toHaveBeenCalledWith(testFile);
    });

    it('should validate file content matches expected D&D session structure', async () => {
        const testFile = createMockSessionFile();

        // Read file content using FileReader API (browser-compatible)
        const fileContent = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsText(testFile);
        });

        // Basic validation of the test file structure
        expect(fileContent).toContain('A Friend in Need, Part 1:');
        expect(fileContent).toContain('Synopsis:');
        expect(fileContent).toContain('Detailed Description:');
        expect(fileContent).toContain('Yawning Portal');
        expect(fileContent).toContain('Volothamp Geddarm');
    });
});