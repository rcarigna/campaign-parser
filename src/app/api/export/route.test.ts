// Mock Next.js server imports before importing the route
jest.mock('next/server', () => ({
    NextRequest: class MockNextRequest {
        constructor(public url: string, public init?: { body?: string }) { }
        async json() {
            return JSON.parse(this.init?.body || '{}');
        }
    },
    NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
            json: () => Promise.resolve(data),
            status: init?.status || 200,
        }),
    },
}));

import { POST } from './route';
import { exportEntities } from '@/lib/services/exportService';
import { EntityWithId, EntityKind } from '@/types';
import type { NextRequest } from 'next/server';

// Mock the exportService
jest.mock('@/lib/services/exportService', () => ({
    exportEntities: jest.fn(),
}));

const mockExportEntities = exportEntities as jest.MockedFunction<typeof exportEntities>;

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

    const mockExportResult = {
        files: [
            {
                filename: 'Test NPC.md',
                content: '# Test NPC\n\nA guard in the city watch.',
                vaultPath: '02_World/NPCs',
                fullPath: '02_World/NPCs/Test NPC.md',
                kind: 'npc'
            }
        ],
        metadata: {
            exportDate: '2024-01-01T00:00:00.000Z',
            totalEntities: 1,
            entityCounts: { npc: 1 },
            vaultStructure: {
                'Campaign Vault': {
                    '02_World': {
                        'NPCs': 'Character files with relationships and stats'
                    }
                }
            }
        }
    };

    it('should export entities successfully', async () => {
        mockExportEntities.mockResolvedValue(mockExportResult);

        const mockRequest = {
            json: jest.fn().mockResolvedValue({ entities: [mockEntity] })
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.files).toEqual(mockExportResult.files);
        expect(result.metadata).toEqual(mockExportResult.metadata);
        expect(mockExportEntities).toHaveBeenCalledWith([mockEntity]);
    });

    it('should handle invalid request body', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({ entities: 'not-an-array' })
        };

        const response = await POST(mockRequest as unknown as NextRequest);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.error).toBe('Invalid request: entities must be an array');
        expect(mockExportEntities).not.toHaveBeenCalled();
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

    it('should handle export service errors', async () => {
        const errorMessage = 'Template processing failed';
        mockExportEntities.mockRejectedValue(new Error(errorMessage));

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
        mockExportEntities.mockRejectedValue('String error');

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