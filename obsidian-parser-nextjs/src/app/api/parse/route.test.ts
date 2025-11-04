/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock the marked library to avoid ESM issues
jest.mock('marked', () => ({
    marked: {
        parse: jest.fn((content) => `<p>${content}</p>`),
        setOptions: jest.fn(),
    },
    Renderer: jest.fn(),
}));

// Mock Next.js server imports before importing the route
jest.mock('next/server', () => ({
    NextRequest: class MockNextRequest {
        constructor(input: unknown) {
            Object.assign(this, input);
        }
    },
    NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
            json: () => Promise.resolve(data),
            status: init?.status || 200,
        }),
    },
}));

import { parseDocument } from '@/lib/services/documentParser';
import { extractEntitiesRegex } from '@/lib/services/entityExtractor';
import { DocumentType, type EntityKind, type NPC } from '@/types';
import { POST } from './route';

// Import NextRequest type from the mock
type MockNextRequest = {
    formData: () => Promise<{ get: (key: string) => File | null }>;
};

jest.mock('@/lib/services/documentParser');
jest.mock('@/lib/services/entityExtractor');

const mockParseDocument = parseDocument as jest.MockedFunction<typeof parseDocument>;
const mockExtractEntitiesRegex = extractEntitiesRegex as jest.MockedFunction<typeof extractEntitiesRegex>;

describe('/api/parse POST', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 when no file is uploaded', async () => {
        const mockRequest = {
            formData: jest.fn().mockResolvedValue({
                get: jest.fn().mockReturnValue(null)
            })
        } as unknown as MockNextRequest;

        const response = await POST(mockRequest as any);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json).toEqual({ error: 'No file uploaded' });
    });

    it('should parse non-markdown document successfully', async () => {
        const mockFile = {
            name: 'test.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 1024,
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1024))
        };

        const mockRequest = {
            formData: jest.fn().mockResolvedValue({
                get: jest.fn().mockReturnValue(mockFile)
            })
        } as unknown as MockNextRequest;

        const mockResult = {
            filename: 'test.docx',
            type: DocumentType.WORD_DOCUMENT,
            content: { html: '<p>parsed content</p>', text: 'parsed content', messages: [], warnings: [], errors: [] },
            metadata: { size: 1024, lastModified: new Date(), mimeType: mockFile.type }
        };

        mockParseDocument.mockResolvedValue(mockResult);

        const response = await POST(mockRequest as any);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual(mockResult);
        expect(mockParseDocument).toHaveBeenCalledWith({
            originalname: 'test.docx',
            mimetype: mockFile.type,
            size: mockFile.size,
            buffer: expect.any(Buffer)
        });
    });

    it('should parse markdown document with entity extraction', async () => {
        const mockFile = {
            name: 'test.md',
            type: 'text/markdown',
            size: 1024,
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1024))
        };

        const mockRequest = {
            formData: jest.fn().mockResolvedValue({
                get: jest.fn().mockReturnValue(mockFile)
            })
        } as unknown as MockNextRequest;

        const mockResult = {
            filename: 'test.md',
            type: DocumentType.MARKDOWN,
            content: {
                raw: '# Header\nContent',
                html: '<h1>Header</h1>\n<p>Content</p>',
                text: 'Header\nContent',
                frontmatter: {},
                headings: [],
                links: [],
                images: []
            },
            metadata: { size: 1024, lastModified: new Date(), mimeType: 'text/markdown' }
        };

        const mockEntities: NPC[] = [{
            kind: 'npc' as EntityKind.NPC,
            title: 'Test NPC',
            role: 'Guard'
        }];

        mockParseDocument.mockResolvedValue(mockResult);
        mockExtractEntitiesRegex.mockReturnValue(mockEntities);

        const response = await POST(mockRequest as any);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual({
            ...mockResult,
            entities: mockEntities
        });
        expect(mockExtractEntitiesRegex).toHaveBeenCalledWith(mockResult.content, 'test.md');
    });

    it('should handle parseDocument errors', async () => {
        const mockFile = {
            name: 'test.txt',
            type: 'text/plain',
            size: 1024,
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1024))
        };

        const mockRequest = {
            formData: jest.fn().mockResolvedValue({
                get: jest.fn().mockReturnValue(mockFile)
            })
        } as unknown as MockNextRequest;

        const errorMessage = 'Parse failed';
        mockParseDocument.mockRejectedValue(new Error(errorMessage));

        const response = await POST(mockRequest as any);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json).toEqual({ error: errorMessage });
    });

    it('should handle unknown errors', async () => {
        const mockFile = {
            name: 'test.txt',
            type: 'text/plain',
            size: 1024,
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(1024))
        };

        const mockRequest = {
            formData: jest.fn().mockResolvedValue({
                get: jest.fn().mockReturnValue(mockFile)
            })
        } as unknown as MockNextRequest;

        mockParseDocument.mockRejectedValue('Unknown error');

        const response = await POST(mockRequest as any);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json).toEqual({ error: 'Failed to parse document' });
    });

    // Tests for health endpoint
    describe('/api/health GET', () => {
        it('should return health status successfully', async () => {
            const { GET } = await import('../health/route');

            const response = await GET();
            const json = await response.json();

            expect(response.status).toBe(200);
            expect(json).toEqual({
                status: 'OK',
                message: 'Document Parser API is running'
            });
        });
    });
});