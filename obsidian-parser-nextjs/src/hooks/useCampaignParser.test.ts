import { renderHook, act } from '@testing-library/react';
import { useCampaignParser } from './useCampaignParser';
import { uploadDocument } from '@/lib/services';
import { SerializedParsedDocument, DocumentType } from '@/types';

// Mock the uploadDocument service
jest.mock('@/lib/services', () => ({
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

    it('should clear results', () => {
        const { result } = renderHook(() => useCampaignParser());

        // Set some initial state
        act(() => {
            result.current.processDocument(new File(['test'], 'test.md'));
        });

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
    // Entity-related tests will be added once entity types are fully stabilized
});