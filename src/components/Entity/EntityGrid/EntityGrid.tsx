import { EntityCard } from '../EntityCard';
import { type EntityWithId } from '@/types';
import { getMissingFields } from '@/lib/validation/entity';

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
}: EntityGridProps) => {
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
