import { type EntityWithId } from '@/types';
import { getEntityIcon, getEntityColor } from '@/lib/utils/entity';

type EntityCardProps = {
  entity: EntityWithId;
  isDuplicate: boolean;
  missingFields: string[];
  onClick: (entity: EntityWithId) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (entityId: string, isSelected: boolean) => void;
  onDiscard?: (entity: EntityWithId) => void;
};

export const EntityCard = ({
  entity,
  isDuplicate,
  missingFields,
  onClick,
  isSelectable = false,
  isSelected = false,
  onSelect,
  onDiscard,
}: EntityCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on checkbox
    const target = e.target as HTMLElement;
    if (
      !(
        target.tagName === 'INPUT' &&
        (target as HTMLInputElement).type === 'checkbox'
      )
    ) {
      onClick(entity);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(entity.id, e.target.checked);
    }
  };

  const handleDiscardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDiscard) {
      onDiscard(entity);
    }
  };
  try {
    return (
      <div
        className={`entity-card ${isDuplicate ? 'duplicate' : ''} ${
          isSelected ? 'selected' : ''
        }`}
        style={{ borderLeftColor: getEntityColor(entity.kind) }}
        onClick={handleCardClick}
      >
        <div className='entity-card-header'>
          {isSelectable && (
            <input
              type='checkbox'
              checked={isSelected}
              onChange={handleSelectChange}
              className='entity-select-checkbox'
              data-testid={`select-checkbox-${entity.id}`}
            />
          )}
          <span className='entity-icon'>{getEntityIcon(entity.kind)}</span>
          <span className='entity-type'>{entity.kind}</span>
          {isDuplicate && <span className='duplicate-badge'>DUPE</span>}
          {onDiscard && (
            <button
              className='entity-discard-btn'
              onClick={handleDiscardClick}
              title={`Discard ${entity.title}`}
              aria-label={`Discard ${entity.title}`}
            >
              🗑️
            </button>
          )}
        </div>

        <h4 className='entity-title'>{entity.title}</h4>

        <div className='entity-details'>
          {'role' in entity && entity.role && (
            <div className='detail-item'>Role: {entity.role}</div>
          )}
          {'type' in entity && entity.type && (
            <div className='detail-item'>Type: {entity.type}</div>
          )}
          {'status' in entity && entity.status && (
            <div className='detail-item'>Status: {entity.status}</div>
          )}
          {entity.sourceSessions && (
            <div className='detail-item'>
              Sessions: {entity.sourceSessions?.join(', ')}
            </div>
          )}
        </div>

        {missingFields.length > 0 && (
          <div className='missing-fields'>
            <span className='missing-label'>Missing:</span>
            <span className='missing-list'>{missingFields.join(', ')}</span>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering EntityCard:', error);
    console.error('Entity data:', JSON.stringify(entity, null, 2));
    return null;
  }
};
