// Mock Next.js server imports before importing the route
jest.mock('next/server', () => ({
    NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
            json: () => Promise.resolve(data),
            status: init?.status || 200,
        }),
    },
}));

// Mock the dependencies
jest.mock('@/lib/documentParser');
jest.mock('@/lib/entityExtractor');
jest.mock('fs/promises');

import { GET } from './route';
import { parseDocument } from '@/lib/documentParser';
import { extractEntitiesRegex } from '@/lib/entityExtractor';
import { readFile } from 'fs/promises';

const mockParseDocument = parseDocument as jest.MockedFunction<typeof parseDocument>;
const mockExtractEntitiesRegex = extractEntitiesRegex as jest.MockedFunction<typeof extractEntitiesRegex>;
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

describe('/api/demo GET', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully load demo data', async () => {
        const mockFileContent = '# Test Session\n\nThis is a test.';
        const mockParsedData = {
            type: 'markdown',
            content: {
                raw: mockFileContent,
                metadata: {},
            },
        };

        const mockEntities = [
            {
                kind: 'npc',
                title: 'Test NPC',
                role: 'Warrior',
                importance: 'major',
            },
        ];

        mockReadFile.mockResolvedValue(mockFileContent as never);
        mockParseDocument.mockResolvedValue(mockParsedData as never);
        mockExtractEntitiesRegex.mockReturnValue(mockEntities as never);

        const response = await GET();
        const data = await response.json();
        expect(mockReadFile).toHaveBeenCalled();
        expect(mockParseDocument).toHaveBeenCalled();
        expect(mockExtractEntitiesRegex).toHaveBeenCalled();
        expect(data).toHaveProperty('entities');
        expect(data).toHaveProperty('rawMarkdown');
        expect(data.rawMarkdown).toBe(mockFileContent);
    });

    it('should handle errors gracefully', async () => {
        mockReadFile.mockRejectedValue(new Error('File read failed'));

        const response = await GET();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data).toHaveProperty('error');
        expect(data.error).toBe('File read failed');
    });
});
