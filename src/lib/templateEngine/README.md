# Template Engine System

This module contains the **core template processing system** for converting campaign entities to Obsidian-compatible markdown files using Handlebars templates.

## Shared Utility Module

As a **shared utility module**, the template engine:

- Contains **pure template processing logic**
- Has **no external dependencies** (beyond Handlebars)
- Provides **stateless, deterministic functions**
- Is **safe for both client and server** environments
- Is **consumed directly by API routes** for export functionality

## Directory Structure

```text
src/lib/templateEngine/
├── README.md              # This documentation
├── index.ts              # Module exports
├── templateEngine.ts     # 🎯 Core: Template compilation & processing
├── templateEngine.test.ts # Comprehensive template tests
├── obsidian_vault_tree.txt # Vault structure reference
└── templates/             # Handlebars templates for entity types
    ├── npc.md            # NPC entity template
    ├── location.md       # Location entity template
    ├── item.md           # Item entity template
    ├── quest.md          # Quest entity template
    ├── session-summary.md # Session summary template
    └── README.md         # Template system documentation
```

## Functional API

### Core Functions

```typescript
// Initialize templates and helpers (call once)
import { initializeTemplates } from '@/lib/templateEngine';
await initializeTemplates();

// Process single entity to markdown
import { processEntity } from '@/lib/templateEngine';
const result = processEntity(entity: AnyEntity);
// Returns: { filename: string; content: string }

// Process multiple entities (bulk operation)
import { processEntities } from '@/lib/templateEngine';
const files = await processEntities(entities: AnyEntity[]);
```

### Integration with API Routes

The template engine is **consumed directly by API routes**:

```typescript
// API route handles business logic directly
// app/api/export/route.ts
import { initializeTemplates, processEntities } from '@/lib/templateEngine';

export const POST = async (request: NextRequest) => {
  await initializeTemplates();
  const processedFiles = await processEntities(entities);
  // Business logic embedded in API route (Next.js native pattern)
};
```

## Configuration

- **Vault Structure**: See `obsidian_vault_tree.txt` for target organization
- **Template Engine**: Handlebars with custom helpers for Obsidian formatting
- **Functional Design**: Pure functions, no classes or state
- **Performance**: Template caching to avoid recompilation

## Implementation Status

- ✅ **Functional template engine** - Pure functions with TypeScript
- ✅ **Handlebars templates** - All entity types with proper syntax
- ✅ **Template testing** - Comprehensive test coverage
- ✅ **API endpoint integration** - Used directly in `/api/export` route
- ✅ **Simplified architecture** - No intermediate service layer
- ⏳ **UI integration** - Export button and options dialog
