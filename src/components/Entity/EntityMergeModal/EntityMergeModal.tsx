'use client';

import { useCallback, useState } from 'react';
import { type EntityWithId, getEntityFields } from '@/types';
import { PrimaryEntitySelector } from './PrimaryEntitySelector';
import { MergedEntityPreview } from './MergedEntityPreview';
import { FieldMergeGroup } from './FieldMergeGroup';

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
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
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
      <div className='modal-overlay'>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <div className='modal-header'>
            <h2>⚠️ Insufficient Entities</h2>
            <button className='modal-close' onClick={handleClose}>
              ×
            </button>
          </div>
          <div className='modal-body'>
            <p>At least 2 entities are required for merging.</p>
          </div>
          <div className='modal-footer'>
            <button onClick={handleClose} className='btn-secondary'>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='modal-overlay' data-testid='modal-overlay'>
      <div
        className='modal-content merge-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h2>🔄 Merge Duplicate Entities</h2>
          <button className='modal-close' onClick={handleClose}>
            ×
          </button>
        </div>

        <div className='modal-body'>
          <div className='merge-section'>
            <PrimaryEntitySelector
              entities={entities}
              primaryEntityId={primaryEntityId}
              setPrimaryEntityId={setPrimaryEntityId}
              renderEntityDetail={renderEntityDetail}
            />
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
                  <FieldMergeGroup
                    fieldName={fieldName}
                    fieldValues={fieldValues}
                    currentValue={currentValue}
                    editState={editState}
                    isCustomMode={isCustomMode}
                    allowCustom={allowCustom}
                    onSelect={(value) =>
                      // handleFieldModeChange(fieldName, 'select') ||
                      handleFieldChange(fieldName, value)
                    }
                    onCustomMode={() =>
                      handleFieldModeChange(fieldName, 'custom')
                    }
                    onCustomValueChange={(value) =>
                      handleCustomValueChange(fieldName, value)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className='merge-section'>
          <h3>3. Preview Merged Entity</h3>
          <MergedEntityPreview
            primaryEntity={primaryEntity}
            allFields={allFields}
            mergedFields={mergedFields}
          />
        </div>
      </div>

      <div className='modal-footer'>
        <button onClick={handleClose} className='btn-secondary'>
          Cancel
        </button>
        <button onClick={handleMerge} className='btn-primary'>
          🔄 Merge {entities.length} Entities
        </button>
      </div>
    </div>
  );
};
