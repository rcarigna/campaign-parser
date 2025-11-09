// File validation constants
export enum AllowedMimeType {
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    DOC = 'application/msword',
    MARKDOWN = 'text/markdown',
    PLAIN_TEXT = 'text/plain', // For markdown files that may have this MIME type
}

export enum AllowedExtension {
    DOC = '.doc',
    DOCX = '.docx',
    MARKDOWN = '.md',
}

export enum DocumentType {
    WORD_DOCUMENT = 'word_document',
    MARKDOWN = 'markdown',
}

export const MAX_FILE_SIZE_KB = 10 * 1024; // 10MB in KB

// Helper arrays for runtime checks
export const ALLOWED_MIME_TYPES = Object.values(AllowedMimeType);
export const ALLOWED_EXTENSIONS = Object.values(AllowedExtension);
