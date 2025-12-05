import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ModalHeaderProps } from '@/types';
import { Box, Typography, IconButton, Icon } from '@mui/material';

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <Box className='modal-header'>
    <Typography variant='h2'>{title}</Typography>
    <IconButton
      className='modal-close'
      onClick={onClose}
      data-testid='close-Button'
    >
      <CloseIcon />
    </IconButton>
  </Box>
);
