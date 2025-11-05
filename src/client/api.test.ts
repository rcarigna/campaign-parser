import axios from 'axios';
import { uploadDocument, exportEntities, loadDemoData } from './api';
import { type SerializedParsedDocumentWithEntities, type AnyEntity, EntityKind, DocumentType } from '@/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadDocument', () => {
        const mockFile = new File(['test content'], 'test.md', { type: 'text/markdown' });
        const mockResponse: SerializedParsedDocumentWithEntities = {
            filename: 'test.md',
            type: DocumentType.MARKDOWN,
            content: {
                raw: 'test content',
                html: '<p>test content</p>',
                text: 'test content',
                frontmatter: {},
                headings: [],
                links: [],
                images: []
            },
            entities: [],
            metadata: { size: 12345, lastModified: '2024-01-01T00:00:00Z', mimeType: 'text/markdown' }
        };

        it('should successfully upload and parse a document', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockResponse });

            const result = await uploadDocument(mockFile);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/parse',
                expect.any(FormData),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            expect(result).toEqual(mockResponse);
        });

        it('should handle axios error with response data', async () => {
            const axiosError = {
                isAxiosError: true,
                response: {
                    data: {
                        error: 'Invalid file format'
                    }
                }
            };
            mockedAxios.post.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(uploadDocument(mockFile)).rejects.toThrow('Invalid file format');
        });

        it('should handle axios error without response data', async () => {
            const axiosError = {
                isAxiosError: true,
                response: {}
            };
            mockedAxios.post.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(uploadDocument(mockFile)).rejects.toThrow('Failed to parse document');
        });

        it('should handle non-axios errors', async () => {
            const genericError = new Error('Network error');
            mockedAxios.post.mockRejectedValue(genericError);
            mockedAxios.isAxiosError.mockReturnValue(false);

            await expect(uploadDocument(mockFile)).rejects.toThrow('An unexpected error occurred');
        });
    });

    describe('loadDemoData', () => {
        const mockDemoData = {
            filename: 'session_summary_1.md',
            type: DocumentType.MARKDOWN,
            content: {
                raw: '# Test Session',
                html: '<h1>Test Session</h1>',
                text: 'Test Session',
                frontmatter: {},
                headings: [],
                links: [],
                images: []
            },
            entities: [],
            metadata: { size: 12345, lastModified: '2024-01-01T00:00:00Z', mimeType: 'text/markdown' },
            rawMarkdown: '# Test Session\n\nThis is a test.'
        };

        it('should successfully load demo data', async () => {
            mockedAxios.get.mockResolvedValue({ data: mockDemoData });

            const result = await loadDemoData();

            expect(mockedAxios.get).toHaveBeenCalledWith('/api/demo');
            expect(result).toEqual(mockDemoData);
        });

        it('should handle axios error with response data', async () => {
            const axiosError = {
                isAxiosError: true,
                response: {
                    data: {
                        error: 'Demo data not found'
                    }
                }
            };
            mockedAxios.get.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(loadDemoData()).rejects.toThrow('Demo data not found');
        });

        it('should handle axios error without response data', async () => {
            const axiosError = {
                isAxiosError: true,
                response: {}
            };
            mockedAxios.get.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(loadDemoData()).rejects.toThrow('Failed to load demo data');
        });

        it('should handle non-axios errors', async () => {
            const genericError = new Error('Network error');
            mockedAxios.get.mockRejectedValue(genericError);
            mockedAxios.isAxiosError.mockReturnValue(false);

            await expect(loadDemoData()).rejects.toThrow('An unexpected error occurred');
        });
    });

    describe('exportEntities', () => {
        const mockEntities: AnyEntity[] = [
            {
                kind: EntityKind.PLAYER,
                player_name: 'Test Player',
                title: 'Test Title',
                character_name: 'Test Character'
            }
        ];
        const mockBlob = new Blob(['test data'], { type: 'application/zip' });

        it('should successfully export entities', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockBlob });

            const result = await exportEntities(mockEntities);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/export',
                { entities: mockEntities },
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            expect(result).toEqual(mockBlob);
        });

        it('should handle axios error with response data', async () => {
            const axiosError = {
                isAxiosError: true,
                response: {
                    data: {
                        error: 'Export failed'
                    }
                }
            };
            mockedAxios.post.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(exportEntities(mockEntities)).rejects.toThrow('Export failed');
        });

        it('should handle axios error without response data', async () => {
            const axiosError = {
                isAxiosError: true,
                response: {}
            };
            mockedAxios.post.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(exportEntities(mockEntities)).rejects.toThrow('Failed to export entities');
        });

        it('should handle non-axios errors', async () => {
            const genericError = new Error('Network error');
            mockedAxios.post.mockRejectedValue(genericError);
            mockedAxios.isAxiosError.mockReturnValue(false);

            await expect(exportEntities(mockEntities)).rejects.toThrow('An unexpected error occurred');
        });

        it('should handle empty entities array', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockBlob });

            const result = await exportEntities([]);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/export',
                { entities: [] },
                expect.objectContaining({
                    responseType: 'blob'
                })
            );
            expect(result).toEqual(mockBlob);
        });
    });
});