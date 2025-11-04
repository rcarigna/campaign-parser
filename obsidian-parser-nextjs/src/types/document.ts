import { DocumentType } from './fileValidation';
import type { AnyEntity } from './campaign';

// Document parsing types
export type DocumentMetadata = {
    size: number;
    lastModified: Date;
    mimeType: string;
};

// Mammoth.js message types for Word document processing
export type MammothMessage = {
    type: 'error' | 'warning';
    message: string;
};

export type WordDocumentContent = {
    html: string;
    text: string;
    messages: MammothMessage[];
    warnings: MammothMessage[];
    errors: MammothMessage[];
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
    entities?: AnyEntity[];  // Optional: Extracted campaign entities (NPCs, locations, etc.)
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

// Enhanced API response with entities (separate from core ParsedDocument type)
// Note: This avoids circular dependencies by keeping entities separate
export type ParsedDocumentWithEntities = ParsedDocument & {
    entities?: AnyEntity[];
};

export type SerializedParsedDocumentWithEntities = SerializedParsedDocument & {
    entities?: AnyEntity[];
};