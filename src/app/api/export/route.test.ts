// Mock Next.js server imports before importing the route
jest.mock('next/server', () => ({
    NextRequest: class MockNextRequest {
        constructor(public url: string, public init?: { body?: string }) { }
        async json() {
            return JSON.parse(this.init?.body || '{}');
        }
    },
    NextResponse: class MockNextResponse {
        constructor(public body: unknown, public init?: { status?: number; headers?: Record<string, string> }) { }
        get status() {
            return this.init?.status || 200;
        }
        get headers() {
            return this.init?.headers || {};
        }
        static json(data: unknown, init?: { status?: number }) {
            return new MockNextResponse(data, init);
        }
        async json() {
            return this.body;
        }
    },
}));

// Mock the template engine
jest.mock('@/lib/templateEngine', () => ({
    initializeTemplates: jest.fn(),
    processEntities: jest.fn(),
}));

// Mock JSZip
jest.mock('jszip', () => {
    return jest.fn().mockImplementation(() => ({
        file: jest.fn(),
        generateAsync: jest.fn().mockResolvedValue({
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(100))
        })
    }));
});

import { POST } from './route';
import { initializeTemplates, processEntities } from '@/lib/templateEngine';
import { EntityWithId, EntityKind } from '@/types';
import type { NextRequest } from 'next/server';

const mockInitializeTemplates = initializeTemplates as jest.MockedFunction<typeof initializeTemplates>;
const mockProcessEntities = processEntities as jest.MockedFunction<typeof processEntities>;

describe('/api/export', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const mockEntity: EntityWithId = {
        id: 'npc-1',
        kind: EntityKind.NPC,
        title: 'Test NPC',
        role: 'Guard',
        faction: 'City Watch',
        importance: 'minor'
    };

    const mockProcessedFiles = [
        {
            filename: 'Test NPC.md',
            content: '# Test NPC\n\nA guard in the city watch.',
            kind: 'npc'
        }
    ];

    it('should export entities successfully', async () => {
        mockInitializeTemplates.mockResolvedValue(undefined);
        mockProcessEntities.mockResolvedValue(mockProcessedFiles);

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ entities: [mockEntity] })
        };

        const response = await POST(mockRequest as unknown as NextRequest);

        expect(response.status).toBe(200);
        expect(response.headers).toMatchObject({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="obsidian-vault.zip"'
        });
        expect(response.body).toBeInstanceOf(Buffer);
        expect(mockInitializeTemplates).toHaveBeenCalled();
        expect(mockProcessEntities).toHaveBeenCalledWith([mockEntity]);
    });

    it('should handle invalid request body', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ entities: 'not-an-array' })
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.error).toBe('Invalid request: entities must be an array');
        expect(mockProcessEntities).not.toHaveBeenCalled();
    });

    it('should handle missing entities field', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({})
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.error).toBe('Invalid request: entities must be an array');
    });

    it('should handle invalid entity structure', async () => {
        const invalidEntity = { id: 'test', kind: 'npc' }; // missing title

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ entities: [invalidEntity] })
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toContain('Invalid entity at index 0');
    });

    it('should handle template processing errors', async () => {
        const errorMessage = 'Template processing failed';
        mockInitializeTemplates.mockResolvedValue(undefined);
        mockProcessEntities.mockRejectedValue(new Error(errorMessage));

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ entities: [mockEntity] })
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toBe(errorMessage);
        expect(console.error).toHaveBeenCalledWith('Export error:', expect.any(Error));
    });

    it('should handle unknown errors', async () => {
        mockInitializeTemplates.mockResolvedValue(undefined);
        mockProcessEntities.mockRejectedValue('String error');

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ entities: [mockEntity] })
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toBe('Failed to export entities');
    });

    it('should handle malformed JSON', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toBe('Invalid JSON');
    });


});