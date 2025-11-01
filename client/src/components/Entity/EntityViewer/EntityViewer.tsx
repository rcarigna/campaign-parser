import { useState } from 'react';
import { toast } from 'react-hot-toast/headless';
import { type EntityWithId } from '../../../types/constants';
import { EntityFilters } from '../EntityFilters';
import { EntityGrid } from '../EntityGrid';
import { EntityEditModal } from '../EntityEditModal';
import { useEntityFiltering } from './hooks/useEntityFiltering';
import { useEntitySelection } from './hooks/useEntitySelection';

type EntityViewerProps = {
  entities: EntityWithId[];
  onEntityDiscard: (entityId: string) => void;
};

export const EntityViewer = ({
  entities,
  onEntityDiscard,
}: EntityViewerProps): JSX.Element | null => {
  const [selectedEntity, setSelectedEntity] = useState<EntityWithId | null>(
    null
  );

  // Custom hooks for different concerns
  const filtering = useEntityFiltering(entities);
  const selection = useEntitySelection();

  if (entities?.length === 0) {
    return (
      <div className='entity-viewer'>
        <h3>Extracted Entities</h3>
        <p className='no-entities'>No entities found in this document.</p>
      </div>
    );
  }

  const handleEntityClick = (entity: EntityWithId): void => {
    setSelectedEntity(entity);
  };

  const handleEntitySave = (updatedEntity: EntityWithId): void => {
    console.log('Save entity:', updatedEntity);
    setSelectedEntity(null);
  };

  const handleEntityDiscard = (entity: EntityWithId): void => {
    // Immediately discard the entity
    onEntityDiscard(entity.id);

    // Also remove from selection if it was selected
    selection.clearEntitySelection(entity.id);

    // Show success toast
    toast.success(`Discarded "${entity.title}" - Undo coming soon!`, {
      duration: 5000,
    });
  };

  return (
    <div className='entity-viewer'>
      <div className='entity-header'>
        <h3>📋 Extracted Entities ({entities.length})</h3>

        <EntityFilters
          filterType={filtering.filterType}
          onFilterChange={filtering.setFilterType}
          showDuplicates={filtering.showDuplicates}
          onDuplicateToggle={filtering.setShowDuplicates}
          typeCounts={filtering.typeCounts}
          totalEntities={entities.length}
          totalDuplicates={filtering.duplicates.length}
        />
      </div>

      {selection.isSelectionMode && (
        <div className='selection-controls'>
          <button
            onClick={() => selection.handleMarkAsDuplicates(entities)}
            disabled={selection.selectedEntityIds.size < 2}
            className='btn btn-primary'
          >
            Mark {selection.selectedEntityIds.size} as Duplicates
          </button>
          <button
            onClick={selection.handleCancelSelection}
            className='btn btn-secondary'
          >
            Cancel
          </button>
        </div>
      )}

      <div className='entity-actions'>
        {!selection.isSelectionMode ? (
          <button
            onClick={() => selection.setIsSelectionMode(true)}
            className='btn btn-outline'
          >
            Select Duplicates
          </button>
        ) : (
          <p className='selection-help'>
            Select entities to mark as duplicates. Selected:{' '}
            {selection.selectedEntityIds.size}
          </p>
        )}
      </div>

      <EntityGrid
        entities={filtering.filteredEntities}
        duplicateIds={filtering.duplicateIds}
        onEntityClick={handleEntityClick}
        isSelectionMode={selection.isSelectionMode}
        selectedEntityIds={selection.selectedEntityIds}
        onEntitySelect={selection.handleEntitySelect}
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
