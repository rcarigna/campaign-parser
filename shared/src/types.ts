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

// Document parsing types
export type DocumentMetadata = {
    size: number;
    lastModified: Date;
    mimeType: string;
};

export type WordDocumentContent = {
    html: string;
    text: string;
    messages: unknown[];
    warnings: unknown[];
    errors: unknown[];
};

export type MarkdownContent = {
    raw: string;
    html: string;
    text: string;
    frontmatter: Record<string, string>;
    headings: Heading[];
    links: Link[];
    images: Image[];
};

export type Heading = {
    level: number;
    text: string;
    id: string;
};

export type Link = {
    text: string;
    url: string;
    type: 'inline' | 'reference';
};

export type Image = {
    alt: string;
    url: string;
    title?: string;
};

export type ParsedDocument = {
    filename: string;
    type: DocumentType;
    content: WordDocumentContent | MarkdownContent;
    metadata: DocumentMetadata;
};

// API response types
export type DocumentProcessingResult = {
    success: boolean;
    data?: ParsedDocument;
    error?: string;
};

// Client-specific types for serialization
export type SerializedDocumentMetadata = {
    size: number;
    lastModified: string; // ISO string for JSON serialization
    mimeType: string;
};

export type SerializedParsedDocument = Omit<ParsedDocument, 'metadata'> & {
    metadata: SerializedDocumentMetadata;
};