import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  type EntityWithId,
  type SerializedParsedDocumentWithEntities,
} from '@/types';
import { exportEntities } from '@/client/api';
import {
  useEntityFiltering,
  UseEntityFilteringReturn,
} from './hooks/useEntityFiltering';
import {
  useEntitySelection,
  UseEntitySelectionReturn,
} from './hooks/useEntitySelection';
import { EntityViewerHeader } from './EntityViewerHeader';
import { EntityViewerEntitiesView } from './EntityViewerEntitiesView';
import { EntityViewerJsonView } from './EntityViewerJsonView';

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
  const filtering: UseEntityFilteringReturn = useEntityFiltering(entities);
  const selection: UseEntitySelectionReturn = useEntitySelection();

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
      <EntityViewerHeader
        entitiesLength={entities.length}
        isExporting={isExporting}
        onExport={handleExport}
        view={view}
        setView={setView}
        filtering={filtering}
      />

      {view === 'entities' ? (
        <EntityViewerEntitiesView
          entities={entities}
          filtering={filtering}
          selection={selection}
          handleEntityClick={handleEntityClick}
          handleEntityDiscard={handleEntityDiscard}
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
          handleEntitySave={handleEntitySave}
          handleEntityMerge={handleEntityMerge}
        />
      ) : (
        <EntityViewerJsonView entities={entities} parsedData={parsedData} />
      )}
    </div>
  );
};
