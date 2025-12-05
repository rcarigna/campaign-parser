import React from 'react';
import { FieldMergeGroup } from './FieldMergeGroup';
import { FieldMergeSectionProps } from '@/types';
import { Box, Typography } from '@mui/material';

export const FieldMergeSection: React.FC<FieldMergeSectionProps> = ({
  allFields,
  getFieldValues,
  onFieldChange,
  entityKind,
}) => {
  return (
    <Box className='merge-section'>
      <Typography variant='h3'>2. Merge Fields</Typography>
      <Typography variant='body1' className='help-text'>
        For each field, choose a value or enter a custom combination.
      </Typography>
      <Box className='field-merger'>
        {allFields.map((fieldName) => {
          const fieldValues = getFieldValues(fieldName);
          if (fieldValues.length <= 1) return null;
          return (
            <Box
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
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
