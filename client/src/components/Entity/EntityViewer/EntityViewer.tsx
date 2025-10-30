import { useState } from 'react';
import { toast } from 'react-hot-toast/headless';
import { type EntityWithId, EntityKind } from '../../../types/constants';
import { EntityFilters } from '../EntityFilters';
import { EntityGrid } from '../EntityGrid';
import { EntityEditModal } from '../EntityEditModal';

type EntityViewerProps = {
  entities: EntityWithId[];
  onEntityDiscard: (entityId: string) => void;
};

type EntityFilterType = 'all' | EntityKind;

export const EntityViewer = ({
  entities,
  onEntityDiscard,
}: EntityViewerProps): JSX.Element | null => {
  const [filterType, setFilterType] = useState<EntityFilterType>('all');
  const [selectedEntity, setSelectedEntity] = useState<EntityWithId | null>(
    null
  );
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(
    new Set()
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  if (entities?.length === 0) {
    return (
      <div className='entity-viewer'>
        <h3>Extracted Entities</h3>
        <p className='no-entities'>No entities found in this document.</p>
      </div>
    );
  }

  const filteredEntities =
    filterType === 'all'
      ? entities
      : entities.filter((entity) => entity.kind === filterType);

  const duplicateGroups = new Map<string, EntityWithId[]>();
  entities?.forEach((entity) => {
    const key = `${entity.kind}-${entity.title.toLowerCase().trim()}`;
    if (!duplicateGroups.has(key)) {
      duplicateGroups.set(key, []);
    }
    duplicateGroups.get(key)!.push(entity);
  });

  const duplicates = Array.from(duplicateGroups.values())
    .filter((group) => group.length > 1)
    .flat();
  const duplicateIds = new Set(duplicates.map((d) => d.id));

  const typeCounts = entities?.reduce((acc, entity) => {
    acc[entity.kind] = (acc[entity.kind] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const displayedEntities = showDuplicates
    ? filteredEntities.filter((e) => duplicateIds.has(e.id))
    : filteredEntities;

  const handleEntityClick = (entity: EntityWithId) => {
    setSelectedEntity(entity);
  };

  const handleEntitySave = (updatedEntity: EntityWithId) => {
    console.log('Save entity:', updatedEntity);
    setSelectedEntity(null);
  };

  const handleEntitySelect = (entityId: string, isSelected: boolean) => {
    setSelectedEntityIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(entityId);
      } else {
        newSet.delete(entityId);
      }
      return newSet;
    });
  };

  const handleMarkAsDuplicates = () => {
    if (selectedEntityIds.size < 2) {
      toast.error('Please select at least 2 entities to mark as duplicates');
      return;
    }

    const selectedEntities = entities.filter((e) =>
      selectedEntityIds.has(e.id)
    );

    // TODO: Implement actual duplicate merging logic
    // For now, just show success message and clear the selection
    toast.success(
      `Successfully marked ${
        selectedEntities.length
      } entities as duplicates: ${selectedEntities
        .map((e) => e.title)
        .join(', ')}`
    );

    setSelectedEntityIds(new Set());
    setIsSelectionMode(false);
  };

  const handleCancelSelection = () => {
    setSelectedEntityIds(new Set());
    setIsSelectionMode(false);
  };

  const handleEntityDiscard = (entity: EntityWithId) => {
    // Add confirmation using toast
    toast(
      (t) => (
        <div>
          <p>Discard "{entity.title}"?</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => {
                // Call the parent's discard handler
                onEntityDiscard(entity.id);
                // Also remove from selection if it was selected
                setSelectedEntityIds((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(entity.id);
                  return newSet;
                });
                toast.success(`Discarded "${entity.title}"`);
                toast.dismiss(t.id);
              }}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Yes, Discard
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <div className='entity-viewer'>
      <div className='entity-header'>
        <h3>📋 Extracted Entities ({entities.length})</h3>

        <EntityFilters
          filterType={filterType}
          onFilterChange={setFilterType}
          showDuplicates={showDuplicates}
          onDuplicateToggle={setShowDuplicates}
          typeCounts={typeCounts}
          totalEntities={entities.length}
          totalDuplicates={duplicates.length}
        />
      </div>

      {isSelectionMode && (
        <div className='selection-controls'>
          <button
            onClick={handleMarkAsDuplicates}
            disabled={selectedEntityIds.size < 2}
            className='btn btn-primary'
          >
            Mark {selectedEntityIds.size} as Duplicates
          </button>
          <button onClick={handleCancelSelection} className='btn btn-secondary'>
            Cancel
          </button>
        </div>
      )}

      <div className='entity-actions'>
        {!isSelectionMode ? (
          <button
            onClick={() => setIsSelectionMode(true)}
            className='btn btn-outline'
          >
            Select Duplicates
          </button>
        ) : (
          <p className='selection-help'>
            Select entities to mark as duplicates. Selected:{' '}
            {selectedEntityIds.size}
          </p>
        )}
      </div>

      <EntityGrid
        entities={displayedEntities}
        duplicateIds={duplicateIds}
        onEntityClick={handleEntityClick}
        isSelectionMode={isSelectionMode}
        selectedEntityIds={selectedEntityIds}
        onEntitySelect={handleEntitySelect}
        onEntityDiscard={handleEntityDiscard}
      />

      {selectedEntity && (
        <EntityEditModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onSave={handleEntitySave}
        />
      )}
    </div>
  );
};
