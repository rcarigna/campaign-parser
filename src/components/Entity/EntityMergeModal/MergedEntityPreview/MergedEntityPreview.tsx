import React from 'react';
import { type EntityWithId } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';

export type MergedEntityPreviewProps = {
  primaryEntity: EntityWithId | undefined;
  allFields: string[];
  mergedFields: Record<string, unknown>;
};

export const MergedEntityPreview: React.FC<MergedEntityPreviewProps> = ({
  primaryEntity,
  allFields,
  mergedFields,
}) => (
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
            if (!value || fieldName === 'kind' || fieldName === 'title')
              return null;
            return (
              <div
                key={fieldName}
                data-testid={`preview-${fieldName}`}
                className='detail-item'
              >
                <strong>{fieldName}:</strong> {String(value)}
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
