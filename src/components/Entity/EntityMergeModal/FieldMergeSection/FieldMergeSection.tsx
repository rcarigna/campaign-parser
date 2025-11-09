import React from 'react';
import { FieldMergeGroup } from '../FieldMergeGroup';

export type FieldMergeSectionProps = {
  allFields: string[];
  getFieldValues: (
    fieldName: string
  ) => Array<{ entityId: string; entityTitle: string; value: unknown }>;
  isEnumField: (fieldName: string) => boolean;
  onFieldChange: (fieldName: string, value: unknown) => void;
};

export const FieldMergeSection: React.FC<FieldMergeSectionProps> = ({
  allFields,
  getFieldValues,
  isEnumField,
  onFieldChange,
}) => (
  <div className='merge-section'>
    <h3>2. Merge Fields</h3>
    <p className='help-text'>
      For each field, choose a value or enter a custom combination.
    </p>
    <div className='field-merger'>
      {allFields.map((fieldName) => {
        const fieldValues = getFieldValues(fieldName);
        if (fieldValues.length <= 1) return null;
        // Only allow custom if NOT an enum field
        const allowCustom = !isEnumField(fieldName);
        return (
          <div key={fieldName} className='field-merge-group'>
            <FieldMergeGroup
              fieldName={fieldName}
              fieldValues={fieldValues}
              allowCustom={allowCustom}
              onChange={(value) => onFieldChange(fieldName, value)}
            />
          </div>
        );
      })}
    </div>
  </div>
);
