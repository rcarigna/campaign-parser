import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  type EntityWithId,
  type SerializedParsedDocumentWithEntities,
} from '@/types';
import { exportEntities } from '@/client/api';
import { EntityFilters } from '../EntityFilters';
import { EntityGrid } from '../EntityGrid';
import { EntityEditModal } from '../EntityEditModal';
import { EntityMergeModal } from '../EntityMergeModal';
import { useEntityFiltering } from './hooks/useEntityFiltering';
import { useEntitySelection } from './hooks/useEntitySelection';

type EntityViewerProps = {
  entities: EntityWithId[];
  onEntityDiscard: (entityId: string) => void;
  onEntityUpdate: (updatedEntity: EntityWithId) => void;
  onEntityMerge?: (primaryEntity: EntityWithId, duplicateIds: string[]) => void;
  parsedData?: SerializedParsedDocumentWithEntities | null;
};

export const EntityViewer = ({
  entities,
  onEntityDiscard,
  onEntityUpdate,
  onEntityMerge,
  parsedData,
}: EntityViewerProps) => {
  const [selectedEntity, setSelectedEntity] = useState<EntityWithId | null>(
    null
  );
  const [view, setView] = useState<'entities' | 'json'>('entities');
  const [isExporting, setIsExporting] = useState(false);

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
    onEntityUpdate(updatedEntity);
    setSelectedEntity(null);
    toast.success(`Updated "${updatedEntity.title}"`, { duration: 3000 });
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

  const handleEntityMerge = (
    primaryEntity: EntityWithId,
    mergedData: Record<string, unknown>
  ): void => {
    if (!onEntityMerge || !selection.mergeModalEntities) return;

    // Apply merged data to primary entity
    const updatedPrimary = { ...primaryEntity, ...mergedData };

    // Get IDs of entities to remove (all selected entities except the primary)
    const duplicateIds = selection.mergeModalEntities
      .map((entity) => entity.id)
      .filter((id) => id !== primaryEntity.id);

    // Call the merge handler
    onEntityMerge(updatedPrimary, duplicateIds);

    // Clear selection and close modal
    selection.handleCancelSelection();
    selection.setMergeModalEntities(null);

    // Show success toast
    toast.success(
      `Successfully merged ${selection.mergeModalEntities.length} entities into "${primaryEntity.title}"`,
      { duration: 5000 }
    );
  };

  const handleExport = async (): Promise<void> => {
    if (entities.length === 0) {
      toast.error('No entities to export');
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading(
      `Exporting ${entities.length} entities to Obsidian format...`
    );

    try {
      const blob = await exportEntities(entities);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'obsidian-vault.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `Successfully exported ${entities.length} entities as Obsidian vault!`,
        { id: toastId, duration: 5000 }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to export entities';
      toast.error(errorMessage, { id: toastId, duration: 5000 });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='entity-viewer'>
      <div className='entity-header'>
        <div className='entity-title-row'>
          <h3>📋 Extracted Entities ({entities.length})</h3>

          <div className='header-controls'>
            {/* Export Button */}
            <button
              className='btn btn-primary export-btn'
              onClick={handleExport}
              disabled={isExporting || entities.length === 0}
              title='Export all entities to Obsidian vault format'
            >
              {isExporting ? '⏳ Exporting...' : '📦 Export to Obsidian'}
            </button>

            {/* View Toggle */}
            <div className='view-toggle'>
              <button
                className={`toggle-btn ${view === 'entities' ? 'active' : ''}`}
                onClick={() => setView('entities')}
              >
                📋 Entity View
              </button>
              <button
                className={`toggle-btn ${view === 'json' ? 'active' : ''}`}
                onClick={() => setView('json')}
              >
                📄 Raw Data
              </button>
            </div>
          </div>
        </div>

        {view === 'entities' && (
          <EntityFilters
            filterType={filtering.filterType}
            onFilterChange={filtering.setFilterType}
            showDuplicates={filtering.showDuplicates}
            onDuplicateToggle={filtering.setShowDuplicates}
            typeCounts={filtering.typeCounts}
            totalEntities={entities.length}
            totalDuplicates={filtering.duplicates.length}
          />
        )}
      </div>

      {view === 'entities' ? (
        <>
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
                data-testid='cancel-selection'
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
            onEntityClick={
              selection.isSelectionMode
                ? (entity) =>
                    selection.handleEntitySelect(
                      entity.id,
                      !selection.selectedEntityIds.has(entity.id)
                    )
                : handleEntityClick
            }
            isSelectionMode={selection.isSelectionMode}
            selectedEntityIds={selection.selectedEntityIds}
            onEntitySelect={
              selection.isSelectionMode
                ? selection.handleEntitySelect
                : undefined
            }
            onEntityDiscard={handleEntityDiscard}
          />
        </>
      ) : (
        <div className='json-output'>
          <pre>
            {JSON.stringify(
              {
                ...parsedData,
                entities: entities,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {selectedEntity && (
        <EntityEditModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onSave={handleEntitySave}
        />
      )}

      {selection.mergeModalEntities && (
        <EntityMergeModal
          entities={selection.mergeModalEntities}
          onClose={() => selection.setMergeModalEntities(null)}
          onMerge={handleEntityMerge}
        />
      )}
    </div>
  );
};
