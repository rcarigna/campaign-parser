# Entity Merge Custom Editing Feature

## Overview
Enhanced the entity merge modal to allow users to manually edit or combine field values during the merge process, rather than being limited to selecting from existing values.

## Problem Statement
Previously, when merging duplicate entities, users could only select field values from the existing entities using radio buttons. This was limiting when users wanted to:
- Combine information from multiple entities
- Manually edit values to be more accurate
- Concatenate descriptions or other text fields

## Solution
Added a "Custom / Combined" option to each field in the merge modal that allows users to:
1. Select the custom mode via a new radio button
2. Enter or edit text in a textarea
3. Combine values from multiple entities manually

## Implementation Details

### Type Definitions
```typescript
type FieldEditState = {
  [fieldName: string]: {
    mode: 'select' | 'custom';
    customValue: string;
  };
};
```

### State Management
- `fieldEditStates`: Tracks whether each field is in 'select' or 'custom' mode
- Initializes custom value with current merged field value when switching to custom mode

### Key Functions

#### `handleFieldModeChange(fieldName: string, mode: 'select' | 'custom')`
- Switches field between select and custom mode
- Initializes custom value from current merged value or first available entity value
- Updates field edit states

#### `handleCustomValueChange(fieldName: string, value: string)`
- Updates custom text value in real-time
- Updates merged fields with custom value
- Maintains custom mode state

### UI Components

#### Radio Options
Each field merger now has:
1. Radio options for each entity's value (existing)
2. **NEW:** "Custom / Combined" radio option

#### Custom Input Container
When custom mode is selected:
- Textarea for manual editing
- Pre-filled with current merged value
- Placeholder text for guidance
- Helpful hint about combining values

### CSS Styling

#### `.custom-input-container`
- Light background (#f9fafb)
- Border and padding for visual separation
- Contains textarea and hint text

#### `.custom-input`
- Full-width textarea with minimum height
- Focus state with blue border and shadow
- Vertical resize enabled for flexibility
- Clean, readable font

#### `.custom-hint`
- Small italic text with helpful tip
- Subtle gray color (#6b7280)
- Encourages combining values from multiple entities

## User Experience

### Before
1. User sees conflicting values from multiple entities
2. User must choose one value via radio button
3. No ability to edit or combine values

### After
1. User sees conflicting values from multiple entities
2. User can choose existing value OR select "Custom / Combined"
3. When custom selected, textarea appears with current value
4. User can edit text, combine values, or write new content
5. Custom value immediately updates the merged preview

## Example Use Case

**Scenario:** Merging two NPC entities with different descriptions

**Entity 1:** "Guard at the tavern"  
**Entity 2:** "Member of the city watch"

**Previous Limitation:** User must choose one description

**New Capability:**
1. User selects "Custom / Combined" option
2. Textarea shows current value (e.g., "Guard at the tavern")
3. User edits to: "Guard at the Yawning Portal, member of the city watch"
4. Merged entity has the combined description

## Technical Notes

- All 308 tests passing
- No breaking changes to existing functionality
- Backward compatible - users can still use radio selection
- Custom values are validated same as selected values
- CSS follows existing design system patterns
- TypeScript strict mode compliant

## Files Modified

1. `src/components/Entity/EntityMergeModal/EntityMergeModal.tsx`
   - Added FieldEditState type
   - Added fieldEditStates state management
   - Added handleFieldModeChange and handleCustomValueChange functions
   - Updated JSX to include custom option and textarea

2. `src/app/globals.css`
   - Added .custom-input-container styles
   - Added .custom-input styles with focus states
   - Added .custom-hint styles

## Future Enhancements

Potential improvements:
- Add character count for long text fields
- Add markdown preview for description fields
- Add quick-combine buttons to automatically concatenate values
- Add history/undo for custom edits
- Add templates for common merge patterns

## Status

✅ **COMPLETE** - Ready for production use
- Implementation: 100%
- Testing: Verified with existing test suite
- Documentation: Complete
- Build: Successful
