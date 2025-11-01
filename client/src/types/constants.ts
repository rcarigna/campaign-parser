// Re-export all shared types and constants
export * from '@obsidian-parser/shared';

// Note: Use SerializedParsedDocument for client-side operations
// since metadata.lastModified is a string in JSON responses

// Client-specific type extensions
import { type AnyEntity } from '@obsidian-parser/shared';

export type EntityWithId = AnyEntity & {
    id: string;
    [key: string]: any;
};