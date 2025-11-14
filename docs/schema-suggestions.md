# Schema Suggestion Feature

## Overview

The Schema Suggestion feature allows users to propose improvements to the entity schemas (NPC, Location, Item, Quest, Player, Session Summary, Session Prep) directly from the UI. This creates a feedback loop where users can shape the schema to better fit their campaign system and use cases.

## How It Works

### 1. View Entity Schema

1. Open the application
2. Look for the entity type cards in the welcome section (with icons like 👤 for NPCs, 🗺️ for Locations, etc.)
3. Click on any entity type card to view its complete schema
4. The schema view displays:
   - All fields for that entity type
   - Field types (text, select, number, etc.)
   - Whether fields are required (marked with *)
   - Allowed values for select fields
   - Example values (placeholders)

### 2. Suggest Field Improvements

Each field in the schema has a "Suggest Edit" button that allows you to:

- **Add new options** to select fields (e.g., add "critical" to importance levels)
- **Change field types** (e.g., from text to select for better consistency)
- **Modify validation rules** (e.g., make a field required or optional)
- **Propose new fields** that would be useful for your campaign system
- **Remove fields** that aren't needed
- **Update field descriptions** to be more clear

#### How to Suggest a Field Edit

1. Click on an entity type card (e.g., NPC)
2. Find the field you want to improve in the schema view
3. Click the "Suggest Edit" button next to that field
4. A GitHub issue page opens with pre-filled information:
   - Entity type (e.g., "NPC")
   - Field name (e.g., "importance")
   - Current schema (automatically included)
   - Title formatted as "[Schema] NPC - importance"
5. Fill out the remaining details:
   - What type of change you're suggesting (add field, modify field, etc.)
   - Your proposed change
   - Why this change would be beneficial
   - Use cases that would benefit
   - Any examples or mockups
6. Submit the GitHub issue

### 3. Suggest Schema Enhancements

For broader suggestions that affect multiple fields or the overall entity structure, use the "Suggest Enhancement" button:

1. Click on an entity type card
2. Click the "Suggest Enhancement" button (top right of the schema view)
3. A GitHub issue page opens with pre-filled information:
   - Entity type
   - Title formatted as "[Schema] NPC Schema"
4. Describe your enhancement proposal
5. Submit the GitHub issue

## Use Cases

### Example 1: Add Alignment Field for NPCs (D&D)

**Scenario**: You're running a D&D campaign and want to track NPC alignments.

**Steps**:
1. Click the NPC entity card (👤)
2. Click "Suggest Enhancement"
3. Fill out:
   - **Suggestion Type**: Add new field
   - **Proposed Change**: Add "alignment" field with values: Lawful Good, Neutral Good, Chaotic Good, Lawful Neutral, True Neutral, Chaotic Neutral, Lawful Evil, Neutral Evil, Chaotic Evil
   - **Rationale**: Alignment is a core character attribute in D&D that affects roleplay and story decisions
   - **Examples**: Show how the field would be used
4. Submit

### Example 2: Expand Item Rarity Options

**Scenario**: You need more granular rarity levels for magic items.

**Steps**:
1. Click the Item entity card (⚔️)
2. Find the "rarity" field
3. Click "Suggest Edit"
4. Fill out:
   - **Suggestion Type**: Add new enum/option value
   - **Current Schema**: Shows current values (common, uncommon, rare, very_rare, legendary, artifact)
   - **Proposed Change**: Add "unique" rarity level between "legendary" and "artifact"
   - **Rationale**: Custom campaign-specific items need a rarity level
5. Submit

### Example 3: Change Quest Status to Select

**Scenario**: Free-text quest status leads to inconsistent values.

**Steps**:
1. Click the Quest entity card (🎯)
2. Find the "status" field
3. Click "Suggest Edit"
4. Fill out:
   - **Suggestion Type**: Change field type
   - **Current Schema**: Shows "status" is type "text"
   - **Proposed Change**: Change to select with values: not_started, in_progress, completed, failed, abandoned
   - **Rationale**: Standardized values make filtering and reporting easier
5. Submit

### Example 4: Add CR Range for NPCs

**Scenario**: Track NPC challenge ratings for Pathfinder/D&D.

**Steps**:
1. Click the NPC entity card (👤)
2. Find the "CR" field (already exists but is optional text)
3. Click "Suggest Edit"
4. Fill out:
   - **Suggestion Type**: Change validation rules
   - **Proposed Change**: Make CR a select field with values 0-30, or use number field with min/max
   - **Rationale**: Standardize CR format for better sorting and filtering
5. Submit

## GitHub Issue Template

When you click a suggestion button, GitHub opens with a structured issue template that includes:

- **Entity Type**: Automatically filled (NPC, Location, Item, etc.)
- **Field Name**: Automatically filled (for field-specific suggestions)
- **Suggestion Type**: Dropdown (Add new field, Modify existing field, etc.)
- **Current Schema/Behavior**: Pre-filled with current field details
- **Proposed Change**: Your suggestion
- **Rationale**: Why this change is needed
- **Impact Assessment**: Breaking changes, template updates needed, etc.
- **Examples**: How the new schema would be used
- **Alternative Approaches**: Other ways to achieve the same goal
- **Additional Context**: Campaign system, related features, etc.

## Technical Details

### Implementation

- **No Authentication Required**: Uses public GitHub issue URLs
- **No Backend Changes**: Pure frontend integration
- **Pre-filled Context**: All relevant information automatically included
- **Security**: Uses `window.open()` with `noopener,noreferrer` flags
- **URL Encoding**: Properly handles special characters in suggestions

### File Locations

- **Issue Template**: `.github/ISSUE_TEMPLATE/schema_suggestion.yml`
- **Utility Functions**: `src/lib/utils/github.ts`
- **UI Components**:
  - `src/components/Entity/EntitySchemaView/SchemaField.tsx` - "Suggest Edit" button
  - `src/components/Entity/EntitySchemaView/EntitySchemaView.tsx` - "Suggest Enhancement" button

### Testing

- **347 total tests** (303 existing + 44 new)
- **Utility Tests**: `src/lib/utils/github.test.ts` (20 tests)
- **Component Tests**:
  - `src/components/Entity/EntitySchemaView/SchemaField.test.tsx` (11 tests)
  - `src/components/Entity/EntitySchemaView/EntitySchemaView.test.tsx` (13 tests)

## Benefits

### For Users

- **Easy Feedback**: No need to understand the codebase to suggest improvements
- **Contextual**: All entity and field information included automatically
- **Structured**: Template ensures all necessary information is provided
- **Trackable**: GitHub issues provide discussion and status tracking

### For Maintainers

- **Organized**: All schema suggestions use the same template and labels
- **Filterable**: Easy to find schema-related issues with `schema` label
- **Complete**: Users provide all context needed to evaluate the suggestion
- **Prioritizable**: Can assess impact and importance before implementation

### For the Community

- **Collaborative**: Users help shape the schema for everyone
- **Diverse**: Support multiple campaign systems (D&D, Pathfinder, custom)
- **Transparent**: All suggestions and discussions are public
- **Iterative**: Schema evolves based on real-world usage

## Future Enhancements

Potential improvements to this feature:

1. **In-app Voting**: Allow users to upvote schema suggestions
2. **Schema Versioning**: Track schema changes over time
3. **Migration Tools**: Help users update data when schema changes
4. **Custom Schemas**: Allow users to define their own entity types
5. **Schema Templates**: Pre-built schemas for different campaign systems
6. **Validation Preview**: Show how the proposed change would validate
7. **Field Statistics**: Show usage patterns to inform schema decisions

## Related Features

- **Entity Validation**: Uses Zod schemas for runtime validation
- **Form Generation**: Automatically generates forms from schemas
- **Type Safety**: TypeScript types derived from schemas
- **Template Engine**: Obsidian templates use schema structure

## Support

For questions or issues with the schema suggestion feature:

- Open a [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml)
- Start a [Discussion](https://github.com/rcarigna/campaign-parser/discussions)
- Check existing [Schema Suggestions](https://github.com/rcarigna/campaign-parser/issues?q=is%3Aissue+label%3Aschema)
