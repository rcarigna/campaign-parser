# 🔄 Entity Deduplication System

## Overview

The Campaign Document Parser includes a sophisticated deduplication system that automatically detects potential duplicate entities and provides an intuitive interface for merging them while preserving important information.

## How Deduplication Works

### 1. Automatic Duplicate Detection

The system identifies potential duplicates using multiple criteria:

```typescript
function detectDuplicates(entities: AnyEntity[]): DuplicateGroup[] {
  const duplicateGroups = [];
  
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const similarity = calculateSimilarity(entities[i], entities[j]);
      
      if (similarity > DUPLICATE_THRESHOLD) {
        duplicateGroups.push({
          entities: [entities[i], entities[j]],
          similarity,
          reason: getSimilarityReason(entities[i], entities[j])
        });
      }
    }
  }
  
  return duplicateGroups;
}
```

### Detection Criteria

**Exact Name Matches**:

```plaintext
"Durnan" and "Durnan" → 100% match
```

**Fuzzy Name Matching**:

```plaintext
"Volothamp Geddarm" and "Volo" → 85% match (known alias)
```

**Same Type + Similar Context**:

```plaintext
Both NPCs with role "barkeep" at "Yawning Portal" → High likelihood
```

**Cross-Session Consistency**:

```plaintext
Same entity mentioned across multiple sessions with slight variations
```

## User Interface

### 1. Duplicate Indicators

Entities flagged as potential duplicates display with:

- **Red Border**: Visual indicator of duplicate status
- **Duplicate Badge**: "Duplicate" label on entity cards
- **Filter Toggle**: "Show only duplicates" option

### 2. Merge Modal Interface

When users click "Merge" on duplicate entities, the **EntityMergeModal** opens with:

#### Primary Entity Selection

```tsx
<div className="primary-selection">
  {duplicateEntities.map(entity => (
    <label key={entity.id}>
      <input 
        type="radio" 
        name="primary"
        value={entity.id}
        onChange={handlePrimarySelection}
      />
      <EntityCard entity={entity} />
    </label>
  ))}
</div>
```

#### Field-by-Field Merging

```tsx
<div className="field-merging">
  {mergeableFields.map(field => (
    <div key={field} className="field-group">
      <h4>{field}</h4>
      {duplicateEntities.map(entity => (
        <label key={`${entity.id}-${field}`}>
          <input 
            type="radio"
            name={field}
            value={entity[field]}
            onChange={(e) => handleFieldSelection(field, e.target.value)}
          />
          <span>{entity[field] || 'Not specified'}</span>
        </label>
      ))}
    </div>
  ))}
</div>
```

#### Live Preview

```tsx
<div className="merge-preview">
  <h3>Merged Entity Preview</h3>
  <EntityCard entity={previewEntity} />
  <pre>{JSON.stringify(previewEntity, null, 2)}</pre>
</div>
```

## Merge Workflow

### Step-by-Step Process

1. **Identify Duplicates**: System flags potential duplicates with red borders
2. **User Review**: User reviews flagged entities in Entity Viewer
3. **Select Duplicates**: User clicks on entities to merge
4. **Open Merge Modal**: System opens EntityMergeModal with selected entities
5. **Choose Primary**: User selects which entity to use as the base
6. **Field Selection**: User chooses the best value for each field
7. **Preview Result**: Live preview shows the merged entity
8. **Confirm Merge**: User clicks "Merge Entities" to complete
9. **Update State**: Duplicates removed, merged entity added
10. **User Feedback**: Toast notification confirms successful merge

### Example Merge Scenario

**Before Merge**:

```typescript
// Entity A (from Session 1)
{
  kind: "npc",
  title: "Durnan",  
  role: "barkeep",
  sourceSessions: [1]
}

// Entity B (from Session 3)  
{
  kind: "npc",
  title: "Durnan",
  role: "barkeep", 
  description: "Gruff ex-adventurer who runs the Yawning Portal",
  faction: "Neutral",
  sourceSessions: [3]
}
```

**After Merge**:

```typescript
{
  kind: "npc",
  title: "Durnan",
  role: "barkeep",
  description: "Gruff ex-adventurer who runs the Yawning Portal", // From Entity B
  faction: "Neutral", // From Entity B
  sourceSessions: [1, 3] // Combined from both
}
```

## Smart Merge Logic

### Automatic Field Consolidation

**Source Sessions**: Always merged

```typescript
mergedEntity.sourceSessions = [
  ...entity1.sourceSessions || [],
  ...entity2.sourceSessions || []
].sort((a, b) => a - b);
```

**Descriptions**: Longer, more detailed descriptions preferred

```typescript
if (entity1.description && entity2.description) {
  mergedEntity.description = entity1.description.length > entity2.description.length
    ? entity1.description
    : entity2.description;
}
```

**Importance Levels**: Higher importance takes precedence

```typescript
const importanceOrder = ['minor', 'supporting', 'major'];
const maxImportance = Math.max(
  importanceOrder.indexOf(entity1.importance || 'minor'),
  importanceOrder.indexOf(entity2.importance || 'minor')
);
mergedEntity.importance = importanceOrder[maxImportance];
```

### Conflict Resolution

When entities have conflicting information:

1. **User Choice**: Let user decide in merge modal
2. **Confidence Scoring**: Prefer data from higher-confidence extractions  
3. **Session Recency**: More recent sessions may have updated information
4. **Field Completeness**: More complete entities preferred

## State Management

### useCampaignParser Integration

```typescript
const { mergeEntities } = useCampaignParser();

const handleMergeConfirm = async (primaryEntity: AnyEntity, fieldsToMerge: Record<string, any>) => {
  try {
    const mergedEntity = {
      ...primaryEntity,
      ...fieldsToMerge,
      sourceSessions: combinedSourceSessions
    };
    
    await mergeEntities(duplicateIds, mergedEntity);
    toast.success(`Successfully merged ${duplicateIds.length} entities`);
    
  } catch (error) {
    toast.error('Failed to merge entities');
  }
};
```

### Entity Selection Hook

```typescript
const { selectedEntities, selectEntity, clearSelection } = useEntitySelection();

const handleMarkForMerge = (entity: AnyEntity) => {
  selectEntity(entity.id);
  
  // Open merge modal when multiple entities selected
  if (selectedEntities.length >= 2) {
    setShowMergeModal(true);
  }
};
```

## User Experience Features

### Visual Feedback

**Toast Notifications**:

```typescript
// Success feedback
toast.success('Successfully merged 3 duplicate NPCs');

// Error handling  
toast.error('Merge failed - please try again');

// Progress indication
toast.loading('Merging entities...');
```

**Real-time Updates**:

- Entity count updates immediately after merge
- Duplicate indicators refresh automatically  
- Filter results update dynamically

### Undo Functionality

```typescript
const [mergeHistory, setMergeHistory] = useState<MergeOperation[]>([]);

const undoLastMerge = () => {
  const lastMerge = mergeHistory[mergeHistory.length - 1];
  
  if (lastMerge) {
    // Restore original entities
    restoreEntities(lastMerge.originalEntities);
    
    // Remove merged entity
    removeEntity(lastMerge.mergedEntity.id);
    
    // Update history
    setMergeHistory(prev => prev.slice(0, -1));
    
    toast.success('Merge undone successfully');
  }
};
```

## Performance Considerations

### Efficient Duplicate Detection

```typescript
// Use memoization for expensive similarity calculations
const calculateSimilarityMemo = useMemo(() => 
  memoize((entity1: AnyEntity, entity2: AnyEntity) => {
    return calculateSimilarity(entity1, entity2);
  }), 
  [entities]
);

// Batch duplicate detection
const duplicates = useMemo(() => {
  return detectDuplicates(entities);
}, [entities]);
```

### Smart Re-rendering

```typescript  
// React Compiler optimizes this automatically, but for clarity:
const MergeModal = React.memo(({ entities, onMerge, onClose }) => {
  // Component only re-renders when entities change
  return (
    <div className="merge-modal">
      {/* Merge interface */}
    </div>
  );
});
```

## API Integration

### Merge Endpoint (Future Enhancement)

```typescript
// POST /api/entities/merge
export async function POST(request: Request) {
  const { duplicateIds, mergedEntity } = await request.json();
  
  // Validate merge operation
  const validation = validateMerge(duplicateIds, mergedEntity);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 });
  }
  
  // Perform merge
  const result = await performMerge(duplicateIds, mergedEntity);
  
  return NextResponse.json({
    success: true,
    mergedEntity: result.entity,
    removedIds: duplicateIds
  });
}
```

## Best Practices

### For Users

1. **Review Before Merging**: Check entity details carefully
2. **Use Preview**: Always review the merged entity preview  
3. **Session Context**: Consider which session has more accurate information
4. **Batch Operations**: Merge multiple duplicates in one session for efficiency

### For Developers

1. **Field Validation**: Ensure merged entities maintain data integrity
2. **Error Handling**: Provide clear feedback for failed operations
3. **Performance**: Use memoization for expensive duplicate detection
4. **Testing**: Comprehensive tests for merge scenarios

```typescript
// Example test
describe('Entity Deduplication', () => {
  it('should merge duplicate NPCs correctly', () => {
    const duplicates = [npc1, npc2];
    const merged = mergeEntities(duplicates, primaryId);
    
    expect(merged.sourceSessions).toEqual([1, 2, 3]);
    expect(merged.title).toBe(expectedTitle);
    expect(merged.description).toBe(expectedDescription);
  });
});
```

The deduplication system transforms chaotic entity lists into clean, consolidated campaign databases while preserving the full narrative history across all sessions.
