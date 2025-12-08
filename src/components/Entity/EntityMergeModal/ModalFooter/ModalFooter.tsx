import React from 'react';
import { ModalFooterProps } from '@/types';
import { Box, Button } from '@mui/material';

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onCancel,
  onConfirm,
  confirmLabel,
  cancelLabel = 'Cancel',
  disabled = false,
}) => (
  <Box className='modal-footer'>
    <Button onClick={onCancel} className='btn-secondary'>
      {cancelLabel}
    </Button>
    <Button onClick={onConfirm} className='btn-primary' disabled={disabled}>
      {confirmLabel}
    </Button>
  </Box>
);
