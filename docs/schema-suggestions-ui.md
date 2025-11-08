# Schema Suggestion UI Guide

## Visual Layout

This document describes the UI changes for the schema suggestion feature.

## 1. Entity Schema View - Overview

When a user clicks on an entity type card (e.g., NPC), the schema view appears with these components:

```
┌─────────────────────────────────────────────────────────────────┐
│  [👤] NPCs Schema                                      [✕]      │
│      Field definitions and data structure                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ℹ️ Fields marked with * are required    [+ Suggest Enhancement]│
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ title                                           text      │  │
│  │ * Entity title or name                                   │  │
│  │ Example: Durnan the Wanderer                             │  │
│  │ ──────────────────────────────────────────────────────  │  │
│  │ ✏️ Suggest Edit                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ importance                                      select *  │  │
│  │ Character importance level                               │  │
│  │ Allowed values:                                          │  │
│  │  [minor] [supporting] [major]                            │  │
│  │ ──────────────────────────────────────────────────────  │  │
│  │ ✏️ Suggest Edit                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ... (more fields)                                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  3 required • 8 optional                           [Close]     │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Schema Field Component - Detailed View

Each field in the schema displays:

```
┌────────────────────────────────────────────────────────────┐
│ importance                                       select *   │
│                                                             │
│ Character importance level                                  │
│                                                             │
│ Allowed values:                                             │
│ [minor] [supporting] [major]                                │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│ ✏️ Suggest Edit                                            │
└────────────────────────────────────────────────────────────┘

Field Elements:
- Field key in blue monospace font (importance)
- Red asterisk (*) if required
- Type badge on the right (select)
- Field label/description
- Optional placeholder example
- Optional allowed values for select fields
- "Suggest Edit" button at the bottom
```

## 3. Button Styles

### Suggest Edit Button (on each field)
```
┌──────────────────┐
│ ✏️ Suggest Edit  │  ← Blue text, small font
└──────────────────┘    Hover: darker blue
```

### Suggest Enhancement Button (top of schema)
```
┌──────────────────────────┐
│ ➕ Suggest Enhancement   │  ← Blue text, bordered
└──────────────────────────┘    Hover: blue background
```

## 4. User Interaction Flow

### A. Suggesting a Field Edit

```
Step 1: User clicks entity card
   ↓
Step 2: Schema view appears
   ↓
Step 3: User finds field they want to improve
   ↓
Step 4: User clicks "Suggest Edit" button
   ↓
Step 5: New browser tab opens with GitHub issue
   - Pre-filled entity type: "NPC"
   - Pre-filled field name: "importance"
   - Pre-filled current schema details
   - Title: "[Schema] NPC - importance"
   ↓
Step 6: User completes the form and submits
```

### B. Suggesting Schema Enhancement

```
Step 1: User clicks entity card
   ↓
Step 2: Schema view appears
   ↓
Step 3: User clicks "Suggest Enhancement" button
   ↓
Step 4: New browser tab opens with GitHub issue
   - Pre-filled entity type: "NPC"
   - Title: "[Schema] NPC Schema"
   ↓
Step 5: User describes their enhancement and submits
```

## 5. Color Scheme

- **Header**: Blue gradient (from-blue-500 to-indigo-600)
- **Field Cards**: White background, gray border
- **Hover**: Blue border (border-blue-300)
- **Required Indicator**: Red asterisk (text-red-500)
- **Field Key**: Blue text with blue background (text-blue-600, bg-blue-50)
- **Type Badge**: Gray background (bg-gray-100, text-gray-700)
- **Options**: Indigo styling (bg-indigo-50, text-indigo-700)
- **Buttons**: Blue text (text-blue-600), hover darker

## 6. Responsive Design

The schema view is responsive and works well on:
- Desktop: Full width with comfortable spacing
- Tablet: Adapts to smaller screens
- Mobile: Stacks vertically, buttons remain accessible

## 7. Accessibility Features

- **Keyboard Navigation**: All buttons are keyboard accessible
- **ARIA Labels**: Buttons have descriptive aria-labels
  - "Suggest edit for [field name] field"
  - "Suggest schema enhancement"
  - "Close schema view"
- **Screen Reader Friendly**: Clear text hierarchy
- **Focus Indicators**: Visible focus states on interactive elements

## 8. Example: Complete NPC Schema View

```
╔═══════════════════════════════════════════════════════════════╗
║  👤 NPCs Schema                                        [✕]     ║
║     Field definitions and data structure                      ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ℹ️ Fields marked with * are required  [+ Suggest Enhancement]║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ title                                          text *    │ ║
║  │ Entity title or name                                    │ ║
║  │ Example: Durnan the Wanderer                            │ ║
║  │ ───────────────────────────────────────────────────────│ ║
║  │ ✏️ Suggest Edit                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ importance                                     select *  │ ║
║  │ Character importance level                              │ ║
║  │ Allowed values:                                         │ ║
║  │  [minor] [supporting] [major]                           │ ║
║  │ ───────────────────────────────────────────────────────│ ║
║  │ ✏️ Suggest Edit                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ faction                                        text      │ ║
║  │ Organization or group affiliation                       │ ║
║  │ Example: Harpers, Zhentarim, City Watch                 │ ║
║  │ ───────────────────────────────────────────────────────│ ║
║  │ ✏️ Suggest Edit                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ role                                           text      │ ║
║  │ Character role in campaign                              │ ║
║  │ Example: Quest giver, merchant, villain                 │ ║
║  │ ───────────────────────────────────────────────────────│ ║
║  │ ✏️ Suggest Edit                                         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ... (more fields)                                            ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  3 required • 8 optional                          [Close]    ║
╚═══════════════════════════════════════════════════════════════╝
```

## 9. GitHub Issue Template Preview

When user clicks "Suggest Edit" on importance field:

```
GitHub Issue Creation Page
──────────────────────────────────────────────────────────────

Title: [Schema] NPC - importance

Entity Type: NPC (Non-Player Character)              [Dropdown]

Field Name: importance                                [Text input]

Suggestion Type: [Select an option]                  [Dropdown]
  - Add new field
  - Modify existing field
  - Remove field
  - Change field type
  - Add new enum/option value
  - Change validation rules
  - Other

Current Schema/Behavior:                              [Textarea]
Field: importance
Type: select
Required: Yes
Values: minor, supporting, major

Proposed Change:                                      [Textarea]
Suggest improvements for the "importance" field

Rationale:                                            [Textarea]
(Required) Why is this change needed?

Impact Assessment:                                    [Textarea]
Would this be a breaking change?

Examples:                                             [Textarea]
Show example usage

... (more fields)

[✓] I agree to follow this project's Code of Conduct

                                              [Submit new issue]
```

## 10. Key Design Decisions

1. **Non-intrusive**: Suggestion buttons don't distract from schema viewing
2. **Contextual**: All relevant information pre-filled automatically
3. **External**: Opens in new tab, doesn't interrupt workflow
4. **Secure**: Uses `noopener,noreferrer` for external links
5. **Consistent**: Follows existing UI patterns and color scheme
6. **Accessible**: Keyboard navigation and screen reader support

## 11. Future UI Enhancements

Potential improvements:
- Inline preview of suggested changes
- Voting system to show popular suggestions
- Badge showing if field has pending suggestions
- Quick filters to see fields by type or requirement
- Expandable field details with more metadata
