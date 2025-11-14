import React from 'react';
import { ModalFooterProps } from '@/types';

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onCancel,
  onConfirm,
  confirmLabel,
  cancelLabel = 'Cancel',
  disabled = false,
}) => (
  <div className='modal-footer'>
    <button onClick={onCancel} className='btn-secondary'>
      {cancelLabel}
    </button>
    <button onClick={onConfirm} className='btn-primary' disabled={disabled}>
      {confirmLabel}
    </button>
  </div>
);
