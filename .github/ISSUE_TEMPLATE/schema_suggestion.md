---
name: 📝 Schema Suggestion
about: Suggest improvements or changes to entity schemas
labels: schema, enhancement, needs-triage
assignees: []
---

# Entity Type

Which entity schema would you like to suggest changes to?

- [ ] NPC (Non-Player Character)
- [ ] Location
- [ ] Item
- [ ] Quest
- [ ] Player
- [ ] Session Summary
- [ ] Session Prep
- [ ] Multiple Entity Types
- [ ] New Entity Type

## Field Name (if applicable)

If suggesting changes to a specific field, enter the field name:

**Field Name:**

## Suggestion Type

What type of change are you suggesting?

- [ ] Add new field
- [ ] Modify existing field
- [ ] Remove field
- [ ] Change field type
- [ ] Add new enum/option value
- [ ] Change validation rules
- [ ] Other

## Current Schema/Behavior

Describe the current schema or behavior (if modifying existing):

```plaintext
Current state of the schema or field:
- Field name: importance
- Type: enum
- Values: minor, supporting, major
```

## Proposed Change

Describe the change you'd like to see:

```plaintext
What should be changed:
- Add "critical" as a fourth importance level
- Or: Add new field "alignment" with values: lawful good, neutral, chaotic evil, etc.
```

## Rationale

Why is this change needed? What problem does it solve?

```plaintext
Explain why this change would be beneficial:
- Use cases that would benefit
- Problems with current schema
- How it improves the system
```

## Impact Assessment

What impact would this change have?

```plaintext
Consider:
- Would this be a breaking change for existing data?
- Does this affect templates or exports?
- Does this require UI changes?
```

## Examples

Provide examples of how the new schema would be used:

```json
{
  "kind": "npc",
  "title": "Volothamp Geddarm",
  "importance": "critical",  // New value
  "faction": "Harpers"
}
```

## Alternative Approaches

Are there other ways to achieve the same goal?

## Additional Context

Any other information that would be helpful:

- Campaign system (D&D 5e, Pathfinder, etc.)
- Related features or schemas
- Screenshots or mockups

## Code of Conduct

- [ ] I agree to follow this project's Code of Conduct
