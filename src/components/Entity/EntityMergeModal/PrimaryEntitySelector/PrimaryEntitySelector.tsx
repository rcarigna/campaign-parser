import React from 'react';
import { PrimaryEntitySelectorProps } from '@/types';
import { getEntityIcon } from '@/lib/utils/entity';
import { Box, Typography, Radio } from '@mui/material';

export const PrimaryEntitySelector: React.FC<PrimaryEntitySelectorProps> = ({
  entities,
  primaryEntityId,
  setPrimaryEntityId,
  renderEntityDetail,
}) => (
  <Box className='merge-section'>
    <Typography variant='h3'>1. Select Primary Entity</Typography>
    <Box className='entity-selector'>
      {entities.map((entity) => (
        <Box key={entity.id} className='entity-option'>
          <Radio
            name='primary-entity'
            value={entity.id}
            checked={primaryEntityId === entity.id}
            onChange={() => setPrimaryEntityId(entity.id)}
          />
          <Box className='entity-preview'>
            <strong>
              <span className='entity-icon'>{getEntityIcon(entity.kind)}</span>
              {entity.title}
            </strong>
            <Box className='entity-details'>
              {renderEntityDetail(entity, 'role', 'Role')}
              {renderEntityDetail(entity, 'type', 'Type')}
              {renderEntityDetail(entity, 'description', 'Description')}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);
