export const ALLOWED_MIME_TYPES = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/markdown',
    'text/plain',
] as const;

export const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.md'] as const;
export const MAX_FILE_SIZE_KB = 10 * 1024; // 10MB in KB

export type ParsedDocument = {
    filename: string;
    type: 'word_document' | 'markdown';
    content: unknown;
    metadata: {
        size: number;
        lastModified: string;
        mimeType: string;
    };
};