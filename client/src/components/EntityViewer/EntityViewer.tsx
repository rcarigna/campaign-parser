import { useState } from 'react';
import {
  type SerializedParsedDocumentWithEntities,
  type AnyEntity,
  EntityKind,
} from '../../types/constants';
import { EntityFilters } from '../EntityFilters';
import { EntityGrid } from '../EntityGrid';
import { EntityEditModal } from '../EntityEditModal';

type EntityViewerProps = {
  parsedData: SerializedParsedDocumentWithEntities | null;
};

type EntityFilterType = 'all' | EntityKind;

type EntityWithId = AnyEntity & {
  id: string;
  [key: string]: any;
};

export const EntityViewer = ({
  parsedData,
}: EntityViewerProps): JSX.Element | null => {
  const [filterType, setFilterType] = useState<EntityFilterType>('all');
  const [selectedEntity, setSelectedEntity] = useState<EntityWithId | null>(
    null
  );
  const [showDuplicates, setShowDuplicates] = useState(false);

  if (!parsedData?.entities || parsedData.entities.length === 0) {
    return (
      <div className='entity-viewer'>
        <h3>��� Extracted Entities</h3>
        <p className='no-entities'>No entities found in this document.</p>
      </div>
    );
  }

  const entitiesWithIds: EntityWithId[] = parsedData.entities.map(
    (entity, index) => {
      const anyEntity = entity as AnyEntity;
      return {
        ...anyEntity,
        id: `${anyEntity.kind}-${index}`,
      } as EntityWithId;
    }
  );

  const filteredEntities =
    filterType === 'all'
      ? entitiesWithIds
      : entitiesWithIds.filter((entity) => entity.kind === filterType);

  const duplicateGroups = new Map<string, EntityWithId[]>();
  entitiesWithIds.forEach((entity) => {
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

  const typeCounts = entitiesWithIds.reduce((acc, entity) => {
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

  return (
    <div className='entity-viewer'>
      <div className='entity-header'>
        <h3>📋 Extracted Entities ({entitiesWithIds.length})</h3>

        <EntityFilters
          filterType={filterType}
          onFilterChange={setFilterType}
          showDuplicates={showDuplicates}
          onDuplicateToggle={setShowDuplicates}
          typeCounts={typeCounts}
          totalEntities={entitiesWithIds.length}
          totalDuplicates={duplicates.length}
        />
      </div>

      <EntityGrid
        entities={displayedEntities}
        duplicateIds={duplicateIds}
        onEntityClick={handleEntityClick}
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
