# Types Module

> **Purpose**: Centralized type definitions, constants, and shared interfaces that provide type safety across the application.

## 🎯 What Types Do

- **Define TypeScript types** for data structures
- **Export shared constants** used throughout the app
- **Provide type safety** for API responses and component props
- **Document data shapes** and business domain models
- **Ensure consistency** across components, hooks, and services

## 📋 Type Organization Patterns

### ✅ Good Type Practices

```typescript
// Domain-specific enums with clear naming
export enum EntityKind {
    ITEM = "item",
    LOCATION = "location", 
    NPC = "npc",
    PLAYER = "player",
    QUEST = "quest",
    SESSION_PREP = "session_prep",
    SESSION_SUMMARY = "session_summary"
}

// Base types that can be extended
export type BaseEntity = {
    kind: EntityKind;
    title: string;
    sourceSessions?: number[];
};

// Specific entity types extending base with intersection
export type NPC = BaseEntity & {
    kind: EntityKind.NPC;
    role?: string;
    faction?: string;
    importance?: 'minor' | 'supporting' | 'major';
    location?: string;
    class?: string;
    race?: string;
    tags?: string[];
};

// Union types for polymorphic data
export type AnyEntity = NPC | Location | Item | Quest | SessionSummary;

// UI-specific types with clear purpose
export type EntityWithId = AnyEntity & { 
    id: string; 
    [key: string]: any; 
};
```

### ❌ What to Avoid in Types

```typescript
// ❌ Overly generic names
export type Data = any;
export type Props = { [key: string]: any };

// ❌ Inline types that should be extracted
const MyComponent = (props: { 
    entity: { id: string; title: string; data: any }; // Extract to type
    onSelect: (id: string) => void;
}) => { /* ... */ };

// ❌ Inconsistent naming patterns
export type entityType = 'npc'; // Should be EntityType
export type npcData = { /* ... */ }; // Should be NPCData
```

## 📁 Current Type Structure

### Core Types (`constants.ts`)

#### Domain Entities

```typescript
// Entity type definitions
export enum EntityKind {
    ITEM = "item",
    LOCATION = "location",
    NPC = "npc", 
    PLAYER = "player",
    QUEST = "quest",
    SESSION_PREP = "session_prep",
    SESSION_SUMMARY = "session_summary"
}

// Specific entity types
export type NPC = BaseEntity & {
    kind: EntityKind.NPC;
    role?: string;
    faction?: string;
    // ... other NPC-specific fields
};
```

#### API Types

```typescript
// Document parsing types
export type SerializedParsedDocument = {
    filename: string;
    content: MarkdownContent | WordContent;
    type: DocumentType;
    metadata: DocumentMetadata;
};

// Enhanced document with entities
export type SerializedParsedDocumentWithEntities = SerializedParsedDocument & {
    entities?: AnyEntity[];
};
```

#### UI Types

```typescript
// Component-specific types
export type EntityWithId = AnyEntity & { id: string; [key: string]: any; };

// File handling
export const ALLOWED_EXTENSIONS: readonly string[] = [
    '.md', '.markdown', '.doc', '.docx'
] as const;
```

## 🔄 Type Usage Patterns

### In Services

```typescript
// Services use domain types
export const uploadDocument = async (file: File): Promise<SerializedParsedDocumentWithEntities> => {
    // Type-safe API communication
};

export const validateEntity = (entity: AnyEntity): ValidationResult => {
    // Type-safe business logic
};
```

### In Hooks

```typescript
// Hooks use both domain and UI types
export const useCampaignParser = (): UseCampaignParserReturn => {
    const [parsedData, setParsedData] = useState<SerializedParsedDocumentWithEntities | null>(null);
    const [entities, setEntities] = useState<EntityWithId[]>([]);
    // ...
};
```

### In Components

```typescript
// Components use UI-focused types
type EntityCardProps = {
    entity: EntityWithId;
    selected: boolean;
    onSelect: (id: string) => void;
};

export const EntityCard = ({ entity, selected, onSelect }: EntityCardProps) => {
    // Type-safe component props
};
```

## 🧪 Type Testing

### Type Guards

```typescript
// Runtime type checking
export const isNPC = (entity: AnyEntity): entity is NPC => {
    return entity.kind === EntityKind.NPC;
};

export const isLocation = (entity: AnyEntity): entity is Location => {
    return entity.kind === EntityKind.LOCATION;
};

// Usage in components
if (isNPC(entity)) {
    // TypeScript knows entity is NPC here
    console.log(entity.role); // Type-safe access
}
```

### Utility Types

```typescript
// Extract common patterns
export type EntityFilter = 'all' | EntityKind;

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ValidationResult = {
    valid: boolean;
    error?: string;
};
```

## 💡 Type Guidelines

### Naming Conventions

- **Types**: PascalCase (`EntityWithId`, `ComponentProps`, `AnyEntity`)
- **Enums**: PascalCase (`EntityKind`, `DocumentType`)  
- **Constants**: UPPER_SNAKE_CASE (`ALLOWED_EXTENSIONS`, `MAX_FILE_SIZE`)

### When to Create Types

**Create types for:**

- Data structures used in multiple places
- API request/response shapes
- Component prop interfaces
- Domain models and business entities
- Shared constants and enums

**Don't create types for:**

- Single-use inline objects
- Overly generic structures
- Types that duplicate existing ones

### Type Composition

```typescript
// ✅ Compose types for flexibility
export type EntityBase = {
    id: string;
    title: string;
    created: Date;
};

export type EntityWithMetadata = EntityBase & {
    metadata: {
        lastModified: Date;
        version: number;
    };
};

// ✅ Use utility types
export type PartialEntity = Partial<AnyEntity>;
export type EntityKeys = keyof AnyEntity;
export type EntityTitle = Pick<AnyEntity, 'title'>;
```

## 🔧 Constants Organization

### Feature-based Constants

```typescript
// File handling constants
export const FILE_CONSTRAINTS = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['.md', '.docx', '.doc'] as const,
    UPLOAD_TIMEOUT: 30000, // 30 seconds
} as const;

// UI constants
export const ENTITY_COLORS = {
    npc: '#3B82F6',      // Blue
    location: '#10B981',  // Green  
    item: '#F59E0B',     // Amber
    quest: '#8B5CF6',    // Purple
} as const;
```

### Environment Types

```typescript
// Development vs production differences
export type Environment = 'development' | 'production' | 'test';

export const CONFIG = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://api.example.com'
        : 'http://localhost:3001',
} as const;
```

## 🎯 Type Safety Benefits

- ✅ **Catch errors at compile time** instead of runtime
- ✅ **IntelliSense support** in VS Code  
- ✅ **Refactoring safety** when changing data structures
- ✅ **API contract documentation** through types
- ✅ **Component interface clarity** with prop types
- ✅ **Business domain modeling** with specific entity types