import { type AnyEntity, EntityKind } from '../../types/constants';

type EntityWithId = AnyEntity & {
  id: string;
  [key: string]: any;
};

type EntityCardProps = {
  entity: EntityWithId;
  isDuplicate: boolean;
  missingFields: string[];
  onClick: (entity: EntityWithId) => void;
};

export const EntityCard = ({
  entity,
  isDuplicate,
  missingFields,
  onClick,
}: EntityCardProps): JSX.Element => {
  const getEntityIcon = (kind: EntityKind): string => {
    switch (kind) {
      case EntityKind.SESSION_SUMMARY:
        return '📜';
      case EntityKind.NPC:
        return '👤';
      case EntityKind.LOCATION:
        return '🗺️';
      case EntityKind.ITEM:
        return '⚔️';
      case EntityKind.QUEST:
        return '🎯';
      case EntityKind.PLAYER:
        return '🧙';
      case EntityKind.SESSION_PREP:
        return '📋';
      default:
        return '📄';
    }
  };

  const getEntityColor = (kind: EntityKind): string => {
    switch (kind) {
      case EntityKind.SESSION_SUMMARY:
        return '#4f46e5';
      case EntityKind.NPC:
        return '#059669';
      case EntityKind.LOCATION:
        return '#dc2626';
      case EntityKind.ITEM:
        return '#d97706';
      case EntityKind.QUEST:
        return '#7c3aed';
      case EntityKind.PLAYER:
        return '#10b981';
      case EntityKind.SESSION_PREP:
        return '#6366f1';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      className={`entity-card ${isDuplicate ? 'duplicate' : ''}`}
      style={{ borderLeftColor: getEntityColor(entity.kind) }}
      onClick={() => onClick(entity)}
    >
      <div className='entity-card-header'>
        <span className='entity-icon'>{getEntityIcon(entity.kind)}</span>
        <span className='entity-type'>{entity.kind}</span>
        {isDuplicate && <span className='duplicate-badge'>DUPE</span>}
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
            Sessions: {entity.sourceSessions.join(', ')}
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
};
