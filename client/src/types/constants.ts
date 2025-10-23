export enum AllowedMimeType {
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    DOC = 'application/msword',
    MARKDOWN = 'text/markdown',
    // PLAIN_TEXT = 'text/plain',
}

export enum AllowedExtension {
    DOC = '.doc',
    DOCX = '.docx',
    MARKDOWN = '.md',
}

export const MAX_FILE_SIZE_KB = 10 * 1024; // 10MB in KB

// Helper arrays for runtime checks (if needed)
export const ALLOWED_MIME_TYPES = Object.values(AllowedMimeType);
export const ALLOWED_EXTENSIONS = Object.values(AllowedExtension);

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