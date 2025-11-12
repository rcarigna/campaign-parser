import React from 'react';
import { FieldMergeGroup } from './FieldMergeGroup';
import { EntityKind } from '@/types';

export type FieldMergeSectionProps = {
  allFields: string[];
  getFieldValues: (
    fieldName: string
  ) => Array<{ entityId: string; entityTitle: string; value: string }>;
  onFieldChange: (fieldName: string, value: string) => void;
  entityKind: EntityKind;
};

export const FieldMergeSection: React.FC<FieldMergeSectionProps> = ({
  allFields,
  getFieldValues,
  onFieldChange,
  entityKind,
}) => {
  return (
    <div className='merge-section'>
      <h3>2. Merge Fields</h3>
      <p className='help-text'>
        For each field, choose a value or enter a custom combination.
      </p>
      <div className='field-merger'>
        {allFields.map((fieldName) => {
          const fieldValues = getFieldValues(fieldName);
          if (fieldValues.length <= 1) return null;
          return (
            <div
              key={fieldName}
              className='field-merge-group'
              data-testid={`field-merge-group-${fieldName}`}
            >
              <FieldMergeGroup
                fieldName={fieldName}
                fieldValues={fieldValues}
                entityKind={entityKind}
                onChange={(value) => onFieldChange(fieldName, value as string)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
