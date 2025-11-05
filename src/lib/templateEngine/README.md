# Template Engine System

This module contains the **core template processing system** for converting campaign entities to Obsidian-compatible markdown files using Handlebars templates.

## Clean Architecture Module

As a **core domain module**, the template engine:

- Contains **pure template processing logic**
- Has **no external dependencies** (beyond Handlebars)
- Provides **stateless, deterministic functions**
- Is **consumed by services layer** for export orchestration

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

### Integration with Services

The template engine is **consumed by the export service**:

```typescript
// Export service orchestrates template processing
import { exportEntities } from '@/lib/services/exportService';
const result = await exportEntities(entities);
// Uses templateEngine internally for markdown generation
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
- ✅ **Export service integration** - Services layer consumption
- ⏳ **API endpoint** - `/api/export` endpoint creation
- ⏳ **UI integration** - Export button and options dialog
