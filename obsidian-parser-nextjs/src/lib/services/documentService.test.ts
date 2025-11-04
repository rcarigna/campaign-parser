import axios from 'axios';
import { uploadDocument } from './documentService';
import { SerializedParsedDocument, DocumentType } from '@/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('documentService', () => {
    describe('uploadDocument', () => {
        const mockFile = new File(['test content'], 'test.md', { type: 'text/markdown' });
        const mockParsedDocument: SerializedParsedDocument = {
            filename: 'test.md',
            type: DocumentType.MARKDOWN,
            content: {
                raw: '# Test',
                html: '<h1>Test</h1>',
                text: 'Test',
                frontmatter: {},
                headings: [{ level: 1, text: 'Test', id: 'test' }],
                links: [],
                images: [],
            },
            metadata: { size: 1234, lastModified: new Date().toISOString(), mimeType: 'text/markdown' },
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should successfully upload and parse document', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockParsedDocument });

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
            expect(result).toEqual(mockParsedDocument);
        });

        it('should handle axios error with response data', async () => {
            const errorResponse = {
                response: {
                    data: {
                        error: 'Invalid file format'
                    }
                }
            };
            mockedAxios.post.mockRejectedValue(errorResponse);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(uploadDocument(mockFile)).rejects.toThrow('Invalid file format');
        });

        it('should handle axios error without response data', async () => {
            const errorResponse = {
                response: {
                    data: {}
                }
            };
            mockedAxios.post.mockRejectedValue(errorResponse);
            mockedAxios.isAxiosError.mockReturnValue(true);

            await expect(uploadDocument(mockFile)).rejects.toThrow('Failed to parse document');
        });

        it('should handle non-axios errors', async () => {
            const nonAxiosError = new Error('Network failure');
            mockedAxios.post.mockRejectedValue(nonAxiosError);
            mockedAxios.isAxiosError.mockReturnValue(false);

            await expect(uploadDocument(mockFile)).rejects.toThrow('An unexpected error occurred');
        });

        it('should create FormData with file', async () => {
            mockedAxios.post.mockResolvedValue({ data: mockParsedDocument });

            await uploadDocument(mockFile);

            const formDataCall = mockedAxios.post.mock.calls[0][1];
            expect(formDataCall).toBeInstanceOf(FormData);
        });
    });
});