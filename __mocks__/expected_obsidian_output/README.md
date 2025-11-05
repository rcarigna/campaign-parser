# Expected Obsidian Export Output

This directory contains example markdown files that demonstrate the expected output when exporting entities from `session_summary_1_manual_deduped.json` using our Handlebars templates.

## Purpose

These files serve as:

- **Test fixtures** for validating the export API implementation
- **Examples** of proper Obsidian markdown structure with our templates
- **Reference material** for understanding the template system output

## Files Generated

Based on the entities extracted from Session 1 ("A Friend in Need, Part 1"):

### NPCs

- `Durnan.md` - Barkeep and proprietor of the Yawning Portal
- `Bonnie.md` - Barmaid at the Yawning Portal who befriends Cat
- `Volothamp Geddarm.md` - Merchant who hires the party to find Floon

### Locations

- `Yawning Portal.md` - Main tavern location where the session takes place
- `Skewered Dragon.md` - Tavern in Dock Ward where Floon was last seen

### Items

- `Ancestral Blade.md` - Cat's family weapon with magical properties

### Quests

- `Find his missing friend Floon.md` - Main quest given by Volo

### Session Summary

- `Session 1 - A Friend in Need Part 1.md` - Complete session recap with links

## Template Features Demonstrated

### Obsidian Compatibility

- **Frontmatter YAML** for metadata and filtering
- **Wiki-style links** using `[[Entity Name]]` syntax
- **Tags** for organization (#character, #location, #item, #quest, #session)
- **Emoji headers** for visual organization

### Campaign Integration

- **Cross-references** between related entities
- **Session tracking** with `sourceSessions` arrays
- **Quest status** and progression tracking
- **Relationship mapping** between NPCs, locations, and quests

### Handlebars Processing

- **Conditional sections** (e.g., showing class/race if present)
- **Array handling** for tags, aliases, and session references
- **Default values** for optional fields
- **Rich frontmatter** with proper YAML formatting

## Vault Organization

When exported, these files would be organized in the user's Obsidian vault structure:

```tree
Campaign Vault/
├── 02_World/
│   ├── NPCs/
│   │   ├── Durnan.md
│   │   ├── Bonnie.md
│   │   └── Volothamp Geddarm.md
│   └── Locations/
│       ├── Yawning Portal.md
│       └── Skewered Dragon.md
├── 04_QuestLines/
│   └── Find his missing friend Floon.md
├── 06_Items/
│   └── Ancestral Blade.md
└── 07_Sessions/
    └── Session 1 - A Friend in Need Part 1.md
```

## Usage in Testing

These files will be used to:

1. **Validate template processing** - Ensure Handlebars generates expected output
2. **Test ZIP generation** - Verify proper file organization and naming
3. **Verify Obsidian compatibility** - Confirm files import correctly into Obsidian vaults
4. **Validate entity relationships** - Check that cross-references link properly

## Implementation Notes

- **Markdown linting errors** in these files are expected as they follow Obsidian conventions over strict markdown rules
- **Empty fields** (like faction, appearance) are intentionally left blank as they weren't specified in the source session
- **Wiki links** use double bracket syntax that Obsidian will auto-resolve
- **Emoji headers** improve visual scanning in Obsidian's file explorer
