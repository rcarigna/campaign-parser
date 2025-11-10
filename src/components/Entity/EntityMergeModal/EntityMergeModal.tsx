'use client';

import { useCallback, useState } from 'react';
import { EntityKind, type EntityWithId } from '@/types';
import { PrimaryEntitySelector } from './PrimaryEntitySelector';
import { MergedEntityPreview } from './MergedEntityPreview';
import { FieldMergeSection } from './FieldMergeSection';
import { ModalHeader } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import { InsufficientEntitiesMessage } from './InsufficientEntitiesMessage';

type EntityMergeModalProps = {
  entities: EntityWithId[];
  onClose: () => void;
  onMerge: (
    primaryEntity: EntityWithId,
    mergedData: Record<string, unknown>
  ) => void;
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

  const primaryEntity = entities.find((e) => e.id === primaryEntityId);

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
    return <InsufficientEntitiesMessage onClose={handleClose} />;
  }

  return (
    <div className='modal-overlay' data-testid='modal-overlay'>
      <div
        className='modal-content merge-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          title='🔄 Merge Duplicate Entities'
          onClose={handleClose}
        />
        <div className='modal-body'>
          <div className='merge-section'>
            <PrimaryEntitySelector
              entities={entities}
              primaryEntityId={primaryEntityId}
              setPrimaryEntityId={setPrimaryEntityId}
              renderEntityDetail={renderEntityDetail}
            />
          </div>
          <FieldMergeSection
            allFields={allFields}
            getFieldValues={getFieldValues}
            onFieldChange={handleFieldChange}
            entityKind={primaryEntity?.kind || EntityKind.UNKNOWN}
          />

          <div className='merge-section'>
            <h3>3. Preview Merged Entity</h3>
            <MergedEntityPreview
              primaryEntity={primaryEntity}
              allFields={allFields}
              mergedFields={mergedFields}
            />
          </div>
          <ModalFooter
            onCancel={handleClose}
            onConfirm={handleMerge}
            confirmLabel={`🔄 Merge ${entities.length} Entities`}
          />
        </div>
      </div>
    </div>
  );
};
