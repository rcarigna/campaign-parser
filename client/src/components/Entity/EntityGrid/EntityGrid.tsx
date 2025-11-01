import { EntityCard } from '../EntityCard';
import { type EntityWithId, EntityKind } from '../../../types/constants';

type EntityGridProps = {
  entities: EntityWithId[];
  duplicateIds: Set<string>;
  onEntityClick: (entity: EntityWithId) => void;
  isSelectionMode?: boolean;
  selectedEntityIds?: Set<string>;
  onEntitySelect?: (entityId: string, isSelected: boolean) => void;
  onEntityDiscard?: (entity: EntityWithId) => void;
};

export const EntityGrid = ({
  entities,
  duplicateIds,
  onEntityClick,
  isSelectionMode = false,
  selectedEntityIds = new Set(),
  onEntitySelect,
  onEntityDiscard,
}: EntityGridProps): JSX.Element => {
  const getMissingFields = (entity: EntityWithId): string[] => {
    const missing: string[] = [];

    switch (entity.kind) {
      case EntityKind.NPC:
        if (!entity.role) missing.push('role');
        if (!entity.faction) missing.push('faction');
        if (!entity.importance) missing.push('importance');
        break;
      case EntityKind.LOCATION:
        if (!entity.type) missing.push('type');
        if (!entity.region) missing.push('region');
        break;
      case EntityKind.ITEM:
        if (!entity.type) missing.push('type');
        if (!entity.rarity) missing.push('rarity');
        break;
      case EntityKind.QUEST:
        if (!entity.status) missing.push('status');
        if (!entity.type) missing.push('type');
        break;
    }

    return missing;
  };

  if (entities.length === 0) {
    return (
      <div className='no-results'>
        <p>No entities match the current filter.</p>
      </div>
    );
  }

  return (
    <div className='entity-grid'>
      {entities.map((entity) => {
        const isDuplicate = duplicateIds.has(entity.id);
        const missingFields = getMissingFields(entity);

        return (
          <EntityCard
            key={entity.id}
            entity={entity}
            isDuplicate={isDuplicate}
            missingFields={missingFields}
            onClick={onEntityClick}
            isSelectable={isSelectionMode}
            isSelected={selectedEntityIds.has(entity.id)}
            onSelect={
              onEntitySelect
                ? (isSelected: boolean) => onEntitySelect(entity.id, isSelected)
                : undefined
            }
            onDiscard={onEntityDiscard}
          />
        );
      })}
    </div>
  );
};
