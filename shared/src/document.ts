import { DocumentType } from './fileValidation';
// import { AnyEntity } from './campaign';

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
    // entities?: AnyEntity[];  // Optional: Extracted campaign entities (NPCs, locations, etc.)
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