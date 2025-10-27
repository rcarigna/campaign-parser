import { useState } from 'react';
import {
  type SerializedParsedDocumentWithEntities,
  type AnyEntity,
  EntityKind,
  ItemRarity,
  LocationType,
  QuestType,
  ItemType,
} from '../types/constants';

type EntityViewerProps = {
  parsedData: SerializedParsedDocumentWithEntities | null;
};

type EntityFilterType = 'all' | EntityKind;

// Extended entity type with ID for UI purposes
type EntityWithId = AnyEntity & {
  id: string;
  [key: string]: any; // Allow dynamic field access for editing
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
        <h3>📋 Extracted Entities</h3>
        <p className='no-entities'>No entities found in this document.</p>
      </div>
    );
  }

  // Add IDs to entities for easier management
  const entitiesWithIds: EntityWithId[] = parsedData.entities.map(
    (entity, index) => {
      const anyEntity = entity as AnyEntity;
      return {
        ...anyEntity,
        id: `${anyEntity.kind}-${index}`,
      } as EntityWithId;
    }
  );

  // Filter entities by type
  const filteredEntities =
    filterType === 'all'
      ? entitiesWithIds
      : entitiesWithIds.filter((entity) => entity.kind === filterType);

  // Detect potential duplicates (same title, same kind)
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

  // Get entity type counts
  const typeCounts = entitiesWithIds.reduce((acc, entity) => {
    acc[entity.kind] = (acc[entity.kind] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const displayedEntities = showDuplicates
    ? filteredEntities.filter((e) => duplicateIds.has(e.id))
    : filteredEntities;

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
  return (
    <div className='entity-viewer'>
      <div className='entity-header'>
        <h3>📋 Extracted Entities ({entitiesWithIds.length})</h3>

        {/* Filter Controls */}
        <div className='entity-controls'>
          <div className='filter-group'>
            <label htmlFor='type-filter'>Filter by type:</label>
            <select
              id='type-filter'
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as EntityFilterType)
              }
              className='filter-select'
            >
              <option value='all'>All Types ({entitiesWithIds.length})</option>
              {Object.entries(typeCounts).map(([type, count]) => (
                <option key={type} value={type}>
                  {getEntityIcon(type as EntityKind)} {type} ({count})
                </option>
              ))}
            </select>
          </div>

          <div className='toggle-group'>
            <label className='toggle-label'>
              <input
                type='checkbox'
                checked={showDuplicates}
                onChange={(e) => setShowDuplicates(e.target.checked)}
              />
              Show only duplicates ({duplicates.length})
            </label>
          </div>
        </div>
      </div>

      {/* Entity Grid */}
      <div className='entity-grid'>
        {displayedEntities.map((entity) => {
          const isDuplicate = duplicateIds.has(entity.id);
          const missingFields = getMissingFields(entity);

          return (
            <div
              key={entity.id}
              className={`entity-card ${isDuplicate ? 'duplicate' : ''}`}
              style={{ borderLeftColor: getEntityColor(entity.kind) }}
              onClick={() => setSelectedEntity(entity)}
            >
              <div className='entity-card-header'>
                <span className='entity-icon'>
                  {getEntityIcon(entity.kind)}
                </span>
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
                  <span className='missing-list'>
                    {missingFields.join(', ')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {displayedEntities.length === 0 && (
        <div className='no-results'>
          <p>No entities match the current filter.</p>
        </div>
      )}

      {/* Entity Edit Modal */}
      {selectedEntity && (
        <EntityEditModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onSave={(updatedEntity) => {
            // TODO: Implement save functionality
            console.log('Save entity:', updatedEntity);
            setSelectedEntity(null);
          }}
        />
      )}
    </div>
  );
};

// Entity Edit Modal Component
type EntityEditModalProps = {
  entity: EntityWithId;
  onClose: () => void;
  onSave: (entity: EntityWithId) => void;
};

const EntityEditModal = ({
  entity,
  onClose,
  onSave,
}: EntityEditModalProps): JSX.Element => {
  const [editedEntity, setEditedEntity] = useState<EntityWithId>({ ...entity });

  const handleFieldChange = (field: string, value: string) => {
    setEditedEntity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedEntity);
  };

  const getFieldsForType = (
    kind: EntityKind
  ): Array<{
    key: string;
    label: string;
    type: string;
    options?: string[];
  }> => {
    const baseFields = [{ key: 'title', label: 'Title', type: 'text' }];

    switch (kind) {
      case EntityKind.NPC:
        return [
          ...baseFields,
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'faction', label: 'Faction', type: 'text' },
          {
            key: 'importance',
            label: 'Importance',
            type: 'select',
            options: ['minor', 'supporting', 'major'],
          },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'class', label: 'Class', type: 'text' },
          { key: 'race', label: 'Race', type: 'text' },
        ];
      case EntityKind.LOCATION:
        return [
          ...baseFields,
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: Object.values(LocationType),
          },
          { key: 'region', label: 'Region', type: 'text' },
        ];
      case EntityKind.ITEM:
        return [
          ...baseFields,
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: Object.values(ItemType),
          },
          {
            key: 'rarity',
            label: 'Rarity',
            type: 'select',
            options: Object.values(ItemRarity),
          },
          { key: 'attunement', label: 'Requires Attunement', type: 'checkbox' },
          { key: 'owner', label: 'Owner', type: 'text' },
        ];
      case EntityKind.QUEST:
        return [
          ...baseFields,
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: ['active', 'completed', 'failed', 'available'],
          },
          {
            key: 'type',
            label: 'Type',
            type: 'select',
            options: Object.values(QuestType),
          },
          { key: 'owner', label: 'Quest Giver', type: 'text' },
          { key: 'faction', label: 'Faction', type: 'text' },
        ];
      default:
        return baseFields;
    }
  };

  const fields = getFieldsForType(entity.kind);

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>
            Edit {entity.kind}: {entity.title}
          </h3>
          <button className='close-button' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='modal-body'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {fields.map((field) => (
              <div key={field.key} className='form-group'>
                <label htmlFor={field.key}>{field.label}:</label>

                {field.type === 'text' && (
                  <input
                    id={field.key}
                    type='text'
                    value={editedEntity[field.key] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    className='form-input'
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    id={field.key}
                    value={editedEntity[field.key] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    className='form-textarea'
                    rows={3}
                  />
                )}

                {field.type === 'select' && field.options && (
                  <select
                    id={field.key}
                    value={editedEntity[field.key] || ''}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    className='form-select'
                  >
                    <option value=''>-- Select {field.label} --</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'checkbox' && (
                  <input
                    id={field.key}
                    type='checkbox'
                    checked={!!editedEntity[field.key]}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.checked.toString())
                    }
                    className='form-checkbox'
                  />
                )}
              </div>
            ))}

            <div className='form-actions'>
              <button
                type='button'
                onClick={onClose}
                className='btn btn-secondary'
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-primary'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
