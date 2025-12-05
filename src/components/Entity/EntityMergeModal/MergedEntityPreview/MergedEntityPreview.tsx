import React from 'react';
import { MergedEntityPreviewProps } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';
import { Box, Typography } from '@mui/material';

export const MergedEntityPreview: React.FC<MergedEntityPreviewProps> = ({
  primaryEntity,
  allFields,
  mergedFields,
}) => (
  <Box className='merged-preview'>
    {primaryEntity && (
      <Box className='entity-card preview'>
        <Box className='entity-header'>
          <Box className='entity-icon'>{getEntityIcon(primaryEntity.kind)}</Box>
          <Box className='entity-type'>{primaryEntity.kind}</Box>
        </Box>
        <Typography variant='h4' className='entity-title'>
          {primaryEntity.title}
        </Typography>
        <Box className='entity-details'>
          {allFields.map((fieldName) => {
            const value =
              mergedFields[fieldName] ||
              (primaryEntity as Record<string, unknown>)[fieldName];
            if (!value || fieldName === 'kind' || fieldName === 'title')
              return null;
            return (
              <Box
                key={fieldName}
                data-testid={`preview-${fieldName}`}
                className='detail-item'
              >
                <Typography component='span'>
                  <Box component='span' fontWeight='bold' sx={{ mr: 0.5 }}>
                    {fieldName}:
                  </Box>
                  {` ${String(value)}`}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    )}
  </Box>
);
