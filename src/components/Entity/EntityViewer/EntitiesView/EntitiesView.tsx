import React from 'react';
import { EntityGrid } from '../../EntityGrid';
import { EntityViewerSelectionControls } from '../SelectionControls/EntityViewerSelectionControls';
import { EntityWithId } from '@/types';
import type { UseEntityFilteringReturn } from '../hooks/useEntityFiltering';
import { UseEntitySelectionReturn } from '../hooks/useEntitySelection';
import { EntityEditModal } from '../../EntityEditModal';
import { EntityMergeModal } from '../../EntityMergeModal';

type EntitiesViewProps = {
  entities: EntityWithId[];
  filtering: UseEntityFilteringReturn;
  selection: UseEntitySelectionReturn;
  handleEntityClick: (entity: EntityWithId) => void;
  handleEntityDiscard: (entity: EntityWithId) => void;
  selectedEntity: EntityWithId | null;
  setSelectedEntity: (entity: EntityWithId | null) => void;
  handleEntitySave: (updatedEntity: EntityWithId) => void;
  handleEntityMerge: (
    primaryEntity: EntityWithId,
    mergedData: Record<string, unknown>
  ) => void;
};

export const EntitiesView: React.FC<EntitiesViewProps> = ({
  entities,
  filtering,
  selection,
  handleEntityClick,
  handleEntityDiscard,
  selectedEntity,
  setSelectedEntity,
  handleEntitySave,
  handleEntityMerge,
}) => (
  <>
    <EntityViewerSelectionControls
      isSelectionMode={selection.isSelectionMode}
      selectedEntityCount={selection.selectedEntityIds.size}
      onMarkDuplicates={() => selection.handleMarkAsDuplicates(entities)}
      onCancelSelection={selection.handleCancelSelection}
      onSelectDuplicates={() => selection.setIsSelectionMode(true)}
    />
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
        selection.isSelectionMode ? selection.handleEntitySelect : undefined
      }
      onEntityDiscard={handleEntityDiscard}
    />
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
  </>
);
