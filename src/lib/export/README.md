# Obsidian Export System

This directory contains the complete Obsidian export system for converting campaign entities to Obsidian-compatible markdown files.

## Directory Structure

```text
src/lib/export/
├── README.md              # This documentation
├── obsidian_vault_tree.txt # Target vault structure reference
├── templates/             # Handlebars templates for entity types
│   ├── npc.md            # NPC entity template
│   ├── location.md       # Location entity template
│   ├── item.md           # Item entity template
│   ├── quest.md          # Quest entity template
│   ├── session-summary.md # Session summary template
│   └── README.md         # Template system documentation
├── exportService.ts      # Main export service (to be implemented)
├── templateEngine.ts     # Handlebars template processor (to be implemented)
└── zipGenerator.ts       # ZIP file generation utility (to be implemented)
```

## Configuration

- **Vault Structure**: See `obsidian_vault_tree.txt` for target vault organization
- **Template Engine**: Uses Handlebars for dynamic content generation
- **Output Format**: Generates ZIP file with organized folder structure matching Obsidian vault

## Usage

The export system will be accessible via:
- API endpoint: `/api/export`
- UI components: Entity selection and export options dialog
- Output: ZIP file with markdown files organized by entity type

## Implementation Status

- ✅ Template system created
- ✅ Project structure organized
- ⏳ Export service implementation
- ⏳ API endpoint creation
- ⏳ UI integration