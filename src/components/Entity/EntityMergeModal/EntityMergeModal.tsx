'use client';

import { useState } from 'react';
import { type EntityWithId, getEntityFields } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';

type EntityMergeModalProps = {
  entities: EntityWithId[];
  onClose: () => void;
  onMerge: (
    primaryEntity: EntityWithId,
    mergedData: Record<string, unknown>
  ) => void;
};

type FieldEditState = {
  [fieldName: string]: {
    mode: 'select' | 'custom';
    customValue: string;
  };
};

export const EntityMergeModal = ({
  entities,
  onClose,
  onMerge,
}: EntityMergeModalProps) => {
  const [primaryEntityId, setPrimaryEntityId] = useState<string>(
    entities[0]?.id || ''
  );
  const [mergedFields, setMergedFields] = useState<Record<string, unknown>>({});
  const [fieldEditStates, setFieldEditStates] = useState<FieldEditState>({});

  const primaryEntity = entities.find((e) => e.id === primaryEntityId);

  // Get entity field metadata to check for enums
  const entityFields = primaryEntity ? getEntityFields(primaryEntity.kind) : [];
  const isEnumField = (fieldName: string): boolean => {
    const fieldMeta = entityFields.find((f) => f.key === fieldName);
    return fieldMeta?.type === 'select';
  };

  // Helper function to render entity details safely
  const renderEntityDetail = (
    entity: EntityWithId,
    field: string,
    label: string
  ) => {
    const value = (entity as Record<string, unknown>)[field];
    if (!value) return null;
    return (
      <span key={field} className='detail'>
        {label}: {String(value)}
      </span>
    );
  };

  // Get all unique fields across all entities
  const allFields = Array.from(
    new Set(
      entities.flatMap((entity) =>
        Object.keys(entity).filter((key) => key !== 'id')
      )
    )
  );

  // Get field values from all entities for comparison
  const getFieldValues = (fieldName: string) => {
    return entities
      .map((entity) => ({
        entityId: entity.id,
        entityTitle: entity.title,
        value: (entity as Record<string, unknown>)[fieldName],
      }))
      .filter(
        (item) =>
          item.value !== undefined && item.value !== null && item.value !== ''
      );
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setMergedFields((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFieldModeChange = (
    fieldName: string,
    mode: 'select' | 'custom'
  ) => {
    setFieldEditStates((prev) => ({
      ...prev,
      [fieldName]: {
        mode,
        customValue:
          mode === 'custom'
            ? String(
                mergedFields[fieldName] ||
                  primaryEntity?.[fieldName as keyof EntityWithId] ||
                  ''
              )
            : prev[fieldName]?.customValue || '',
      },
    }));

    // If switching to custom mode, initialize with current value
    if (mode === 'custom') {
      const currentValue =
        mergedFields[fieldName] ||
        primaryEntity?.[fieldName as keyof EntityWithId];
      if (currentValue) {
        handleFieldChange(fieldName, String(currentValue));
      }
    }
  };

  const handleCustomValueChange = (fieldName: string, value: string) => {
    setFieldEditStates((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        mode: 'custom',
        customValue: value,
      },
    }));
    handleFieldChange(fieldName, value);
  };

  const getMergedEntity = () => {
    if (!primaryEntity) return null;

    // Start with primary entity as base
    const merged = { ...primaryEntity };

    // Apply user-selected field values
    Object.keys(mergedFields).forEach((fieldName) => {
      (merged as Record<string, unknown>)[fieldName] = mergedFields[fieldName];
    });

    return merged;
  };

  const handleMerge = () => {
    const mergedEntity = getMergedEntity();
    if (mergedEntity) {
      onMerge(mergedEntity, mergedFields);
    }
  };

  if (entities.length < 2) {
    return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <div className='modal-header'>
            <h2>⚠️ Insufficient Entities</h2>
            <button className='modal-close' onClick={onClose}>
              ×
            </button>
          </div>
          <div className='modal-body'>
            <p>At least 2 entities are required for merging.</p>
          </div>
          <div className='modal-footer'>
            <button onClick={onClose} className='btn-secondary'>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='modal-content merge-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h2>🔄 Merge Duplicate Entities</h2>
          <button className='modal-close' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='modal-body'>
          <div className='merge-section'>
            <h3>1. Select Primary Entity</h3>
            <p className='help-text'>
              Choose which entity to keep as the main one. Other entities will
              be merged into it.
            </p>
            <div className='entity-selector'>
              {entities.map((entity) => (
                <label key={entity.id} className='entity-option'>
                  <input
                    type='radio'
                    name='primaryEntity'
                    value={entity.id}
                    checked={primaryEntityId === entity.id}
                    onChange={(e) => setPrimaryEntityId(e.target.value)}
                  />
                  <div className='entity-preview'>
                    <strong>{entity.title}</strong>
                    <div className='entity-details'>
                      {renderEntityDetail(entity, 'role', 'Role')}
                      {renderEntityDetail(entity, 'type', 'Type')}
                      {renderEntityDetail(entity, 'description', 'Description')}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className='merge-section'>
            <h3>2. Merge Fields</h3>
            <p className='help-text'>
              For each field, choose a value or enter a custom combination.
            </p>
            <div className='field-merger'>
              {allFields.map((fieldName) => {
                const fieldValues = getFieldValues(fieldName);

                if (fieldValues.length <= 1) return null;

                const currentValue =
                  mergedFields[fieldName] ||
                  primaryEntity?.[fieldName as keyof EntityWithId];

                const editState = fieldEditStates[fieldName] || {
                  mode: 'select',
                  customValue: '',
                };
                const isCustomMode = editState.mode === 'custom';
                const allowCustom = !isEnumField(fieldName);

                return (
                  <div key={fieldName} className='field-merge-group'>
                    <h4>{fieldName}</h4>
                    <div className='field-options'>
                      {fieldValues.map(({ entityId, entityTitle, value }) => (
                        <label
                          key={`${fieldName}-${entityId}`}
                          className='field-option'
                        >
                          <input
                            type='radio'
                            name={`field-${fieldName}`}
                            value={String(value)}
                            checked={!isCustomMode && currentValue === value}
                            onChange={() => {
                              handleFieldModeChange(fieldName, 'select');
                              handleFieldChange(fieldName, value);
                            }}
                          />
                          <div className='field-value'>
                            <strong>{String(value)}</strong>
                            <span className='source'>from {entityTitle}</span>
                          </div>
                        </label>
                      ))}
                      {allowCustom && (
                        <>
                          <label className='field-option custom-option'>
                            <input
                              type='radio'
                              name={`field-${fieldName}`}
                              checked={isCustomMode}
                              onChange={() =>
                                handleFieldModeChange(fieldName, 'custom')
                              }
                            />
                            <div className='field-value custom-value'>
                              <strong>Custom / Combined</strong>
                              <span className='source'>
                                manually edit or combine values
                              </span>
                            </div>
                          </label>
                          {isCustomMode && (
                            <div className='custom-input-container'>
                              <textarea
                                className='custom-input'
                                value={editState.customValue}
                                onChange={(e) =>
                                  handleCustomValueChange(
                                    fieldName,
                                    e.target.value
                                  )
                                }
                                placeholder={`Enter custom value for ${fieldName}...`}
                                rows={3}
                              />
                              <div className='custom-hint'>
                                💡 Tip: You can combine values from multiple
                                entities above
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='merge-section'>
            <h3>3. Preview Merged Entity</h3>
            <div className='merged-preview'>
              {primaryEntity && (
                <div className='entity-card preview'>
                  <div className='entity-header'>
                    <span className='entity-icon'>
                      {getEntityIcon(primaryEntity.kind)}
                    </span>
                    <span className='entity-type'>{primaryEntity.kind}</span>
                  </div>
                  <h4 className='entity-title'>{primaryEntity.title}</h4>
                  <div className='entity-details'>
                    {allFields.map((fieldName) => {
                      const value =
                        mergedFields[fieldName] ||
                        (primaryEntity as Record<string, unknown>)[fieldName];
                      if (
                        !value ||
                        fieldName === 'kind' ||
                        fieldName === 'title'
                      )
                        return null;

                      return (
                        <div key={fieldName} className='detail-item'>
                          <strong>{fieldName}:</strong> {String(value)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='modal-footer'>
          <button onClick={onClose} className='btn-secondary'>
            Cancel
          </button>
          <button onClick={handleMerge} className='btn-primary'>
            🔄 Merge {entities.length} Entities
          </button>
        </div>
      </div>
    </div>
  );
};
