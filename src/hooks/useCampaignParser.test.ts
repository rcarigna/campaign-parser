import { renderHook, act } from '@testing-library/react';
import { useCampaignParser } from './useCampaignParser';
import { uploadDocument } from '@/client/api';
import { SerializedParsedDocument, DocumentType, Player, Location, EntityKind, EntityWithId } from '@/types';

// Mock the client API
jest.mock('@/client/api', () => ({
    uploadDocument: jest.fn(),
}));

const mockUploadDocument = uploadDocument as jest.MockedFunction<typeof uploadDocument>;

describe('useCampaignParser', () => {
    const mockParsedData: SerializedParsedDocument = {
        filename: 'test.md',
        content: {
            raw: '# Test',
            html: '<h1>Test</h1>',
            text: 'Test',
            frontmatter: {},
            headings: [{ level: 1, text: 'Test', id: 'test' }],
            links: [],
            images: [],
        },
        type: DocumentType.MARKDOWN,
        metadata: {
            mimeType: 'text/markdown',
            size: 1024,
            lastModified: '2024-01-01T00:00:00.000Z',
        },
    };
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useCampaignParser());

        expect(result.current.parsedData).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(typeof result.current.processDocument).toBe('function');
        expect(typeof result.current.clearResults).toBe('function');
        expect(typeof result.current.clearError).toBe('function');
    });

    it('should handle successful document processing', async () => {
        mockUploadDocument.mockResolvedValue(mockParsedData);
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.parsedData).toEqual(mockParsedData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(mockUploadDocument).toHaveBeenCalledWith(mockFile);
    });

    it('should handle document processing error', async () => {
        const errorMessage = 'Upload failed';
        mockUploadDocument.mockRejectedValue(new Error(errorMessage));
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.parsedData).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(console.error).toHaveBeenCalledWith('Document processing error:', expect.any(Error));
    });

    it('should handle unknown error type', async () => {
        mockUploadDocument.mockRejectedValue('String error');
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.error).toBe('An unexpected error occurred');
    });

    it('should set loading state during processing', async () => {
        mockUploadDocument.mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve(mockParsedData), 100))
        );
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        let processPromise: Promise<void>;

        act(() => {
            processPromise = result.current.processDocument(mockFile);
        });

        // Check loading state is true during processing
        expect(result.current.loading).toBe(true);
        expect(result.current.parsedData).toBeNull();
        expect(result.current.error).toBeNull();

        // Wait for processing to complete
        await act(async () => {
            await processPromise;
        });

        expect(result.current.loading).toBe(false);
    });

    it('should clear results', async () => {
        mockUploadDocument.mockResolvedValue(mockParsedData);
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        // Set some initial state by processing a document
        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.parsedData).toEqual(mockParsedData);

        act(() => {
            result.current.clearResults();
        });

        expect(result.current.parsedData).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should clear error only', async () => {
        mockUploadDocument.mockRejectedValue(new Error('Test error'));
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.error).toBe('Test error');

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
        expect(result.current.parsedData).toBeNull();
    });

    it('should create entities with IDs when parsedData has entities', async () => {
        const mockParsedDataWithEntities = {
            ...mockParsedData,
            entities: [
                { kind: EntityKind.PLAYER, title: 'pc', character_name: 'Test Character' } as Player,
                { kind: EntityKind.LOCATION, title: 'location', name: 'Test Location' } as Location
            ]
        };

        mockUploadDocument.mockResolvedValue(mockParsedDataWithEntities);
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.entities).toHaveLength(2);
        expect(result.current.entities[0]).toEqual({
            kind: EntityKind.PLAYER,
            title: 'pc',
            character_name: 'Test Character',
            id: 'player-0'
        });
        expect(result.current.entities[1]).toEqual({
            kind: EntityKind.LOCATION,
            title: 'location',
            name: 'Test Location',
            id: 'location-1'
        });
    });

    it('should discard entity by ID', async () => {
        const mockParsedDataWithEntities = {
            ...mockParsedData,
            entities: [
                { kind: EntityKind.PLAYER, title: 'pc', character_name: 'Character 1' } as Player,
                { kind: EntityKind.PLAYER, title: 'pc', character_name: 'Character 2' } as Player,
                { kind: EntityKind.LOCATION, title: 'location', name: 'Location 1' } as Location
            ]
        };

        mockUploadDocument.mockResolvedValue(mockParsedDataWithEntities);
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        // Process document to set initial entities
        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.entities).toHaveLength(3);

        act(() => {
            result.current.discardEntity('player-1');
        });

        expect(result.current.entities).toHaveLength(2);
        expect(result.current.entities.find(e => e.id === 'player-1')).toBeUndefined();
        expect(result.current.entities.find(e => e.id === 'player-0')).toBeDefined();
        expect(result.current.entities.find(e => e.id === 'location-2')).toBeDefined();
    });

    it('should merge entities correctly', async () => {
        const mockParsedDataWithEntities = {
            ...mockParsedData,
            entities: [
                { kind: EntityKind.PLAYER, title: 'Primary Character', character_name: 'Primary Character' } as Player,
                { kind: EntityKind.PLAYER, title: 'Duplicate 1', character_name: 'Duplicate 1' } as Player,
                { kind: EntityKind.PLAYER, title: 'Duplicate 2', character_name: 'Duplicate 2' } as Player,
                { kind: EntityKind.LOCATION, title: 'Location 1' } as Location
            ]
        };

        mockUploadDocument.mockResolvedValue(mockParsedDataWithEntities);
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        // Process document to set initial entities
        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.entities).toHaveLength(4);

        const mergedPrimaryEntity = {
            kind: EntityKind.PLAYER,
            title: 'Primary Character',
            character_name: 'Primary Character',
            id: 'player-0',

        };

        act(() => {
            result.current.mergeEntities(result.current.entities[0], ['player-1', 'player-2']);
        });

        expect(result.current.entities).toHaveLength(2);
        expect(result.current.entities.find(e => e.id === 'player-0')).toEqual(mergedPrimaryEntity);
        expect(result.current.entities.find(e => e.id === 'player-1')).toBeUndefined();
        expect(result.current.entities.find(e => e.id === 'player-2')).toBeUndefined();
        expect(result.current.entities.find(e => e.id === 'location-3')).toBeDefined();
    });

    it('should handle merging when primary entity is not in current entities', async () => {
        const mockParsedDataWithEntities = {
            ...mockParsedData,
            entities: [
                { kind: EntityKind.PLAYER, title: 'Duplicate 1', character_name: 'Duplicate 1' } as Player,
                { kind: EntityKind.PLAYER, title: 'Duplicate 2', character_name: 'Duplicate 2' } as Player
            ]
        };

        mockUploadDocument.mockResolvedValue(mockParsedDataWithEntities);
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        // Process document to set initial entities
        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        expect(result.current.entities).toHaveLength(2);

        const newPrimaryEntity: Player & EntityWithId = {
            kind: EntityKind.PLAYER,
            title: 'New Primary',
            character_name: 'New Primary',
            id: 'character-0',
            player_name: 'New Player',
            tags: [],
            status: '',
            race: '',
            class: '',
            level: '',
            background: '',
            affiliations: [],
            aliases: [],
        };

        act(() => {
            result.current.mergeEntities(newPrimaryEntity, ['player-0', 'player-1']);
        });

        expect(result.current.entities).toHaveLength(1);
        expect(result.current.entities[0]).toEqual(newPrimaryEntity);
    });

    it('should restore entities from parsed data', async () => {
        const mockParsedDataWithEntities = {
            ...mockParsedData,
            entities: [
                { kind: EntityKind.PLAYER, title: 'Character 1', character_name: 'Character 1' } as Player,
                { kind: EntityKind.LOCATION, title: 'Location 0', name: 'Location 0' } as Location
            ]
        };

        mockUploadDocument.mockResolvedValue(mockParsedDataWithEntities);
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        // Process document to set initial entities
        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        // Wait for entities to be set via useEffect
        expect(result.current.entities).toHaveLength(2);
        expect(result.current.entities[0].id).toBe('player-0');
        expect(result.current.entities[1].id).toBe('location-1');

        // Modify entities
        act(() => {
            result.current.discardEntity('player-0');
        });

        expect(result.current.entities).toHaveLength(1);
        expect(result.current.entities[0].id).toBe('location-1');

        // Restore entities
        act(() => {
            result.current.restoreEntities();
        });

        expect(result.current.entities).toHaveLength(2);
        expect(result.current.entities[0]).toEqual({
            kind: EntityKind.PLAYER,
            title: 'Character 1',
            character_name: 'Character 1',
            id: 'player-0'
        });
        expect(result.current.entities[1]).toEqual({
            kind: EntityKind.LOCATION,
            title: 'Location 0',
            name: 'Location 0',
            id: 'location-1'
        });
    });

    it('should handle restore entities when no parsed data exists', () => {
        const { result } = renderHook(() => useCampaignParser());

        act(() => {
            result.current.restoreEntities();
        });

        expect(result.current.entities).toEqual([]);
    });

    it('should handle restore entities when parsed data has no entities', async () => {
        mockUploadDocument.mockResolvedValue(mockParsedData); // mockParsedData has no entities
        const mockFile = new File(['test'], 'test.md', { type: 'text/markdown' });

        const { result } = renderHook(() => useCampaignParser());

        // Process document with no entities
        await act(async () => {
            await result.current.processDocument(mockFile);
        });

        act(() => {
            result.current.restoreEntities();
        });

        expect(result.current.entities).toEqual([]);
    });
    // Entity-related tests will be added once entity types are fully stabilized
});