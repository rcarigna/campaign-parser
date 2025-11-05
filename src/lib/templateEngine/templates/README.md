# Obsidian Export Templates

These templates define how entities are exported from the Campaign Document Parser into Obsidian-compatible markdown files. Each template uses Handlebars syntax to dynamically populate content based on the entity data.

## Available Templates

### 🧑‍🎭 NPCs (`npc.md`)

Exports NPC entities with:

- Standard D&D character information (race, class, CR)
- Faction and role associations
- Relationship tracking
- Quest connections
- Session references

### 🗺️ Locations (`location.md`)

Exports Location entities with:

- Regional organization
- Faction presence tracking
- Points of interest
- Connected NPCs and quests
- Secrets and hooks

### 💎 Items (`item.md`)

Exports Item entities with:

- D&D mechanics (rarity, attunement)
- Ownership tracking
- Mechanical effects
- Lore and origin stories
- Campaign references

### 📜 Quests (`quest.md`)

Exports Quest entities with:

- Status and progress tracking
- Quest giver and faction ties
- Step-by-step breakdown
- Consequence tracking
- Related entity links

### 📘 Session Summaries (`session-summary.md`)

Exports Session Summary entities with:

- Session metadata (date, number, arc)
- Brief and full summaries
- Consequences and foreshadowing
- Thread updates and connections

## Template Features

### Handlebars Templating

- `{{field}}` - Direct field substitution
- `{{field || 'default'}}` - Default values for optional fields
- `{{#if field}}...{{/if}}` - Conditional sections
- `{{#each array}}...{{/each}}` - Array iteration

### Obsidian Integration

- **Frontmatter**: YAML metadata for Obsidian properties
- **Tags**: Automatic tagging for organization
- **Links**: `[[Entity Name]]` wikilinks for connections
- **Dataview**: Comments for future Dataview queries

### Campaign Structure

Templates are designed to integrate with common D&D campaign organization:

- NPCs go to `02_World/NPCs/`
- Locations go to `02_World/Locations/`
- Items go to `02_World/Items/`
- Quests go to `04_QuestLines/`
- Sessions go to `01_SessionNotes/`

## Usage

The export system will:

1. Select appropriate template based on entity kind
2. Populate template with entity data using Handlebars
3. Generate clean filename from entity title
4. Package into ZIP with proper folder structure
5. Include cross-references between related entities

## Customization

Templates can be modified to match your specific:

- Frontmatter schema
- Section organization  
- Tagging system
- Linking conventions
- Dataview queries

Each template balances completeness with readability, providing rich metadata while maintaining clean markdown structure for both human reading and Obsidian processing.
