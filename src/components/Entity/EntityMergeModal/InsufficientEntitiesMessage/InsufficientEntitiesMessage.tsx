import React from 'react';
import { ModalHeader } from '../ModalHeader';
import { ModalFooter } from '../ModalFooter';
import { InsufficientEntitiesMessageProps } from '@/types';
import { Box, Typography } from '@mui/material';

export const InsufficientEntitiesMessage: React.FC<
  InsufficientEntitiesMessageProps
> = ({ onClose }) => (
  <Box className='modal-overlay'>
    <Box className='modal-content' onClick={(e) => e.stopPropagation()}>
      <ModalHeader title='⚠️ Insufficient Entities' onClose={onClose} />
      <Box className='modal-body'>
        <Typography variant='body1'>
          At least 2 entities are required for merging.
        </Typography>
      </Box>
      <ModalFooter
        onCancel={onClose}
        onConfirm={onClose}
        confirmLabel='Close'
        cancelLabel=''
      />
    </Box>
  </Box>
);
