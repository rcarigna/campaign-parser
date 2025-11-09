import React from 'react';
import { ModalHeader } from '../ModalHeader';
import { ModalFooter } from '../ModalFooter';

export type InsufficientEntitiesMessageProps = {
  onClose: () => void;
};

export const InsufficientEntitiesMessage: React.FC<
  InsufficientEntitiesMessageProps
> = ({ onClose }) => (
  <div className='modal-overlay'>
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <ModalHeader title='⚠️ Insufficient Entities' onClose={onClose} />
      <div className='modal-body'>
        <p>At least 2 entities are required for merging.</p>
      </div>
      <ModalFooter
        onCancel={onClose}
        onConfirm={onClose}
        confirmLabel='Close'
        cancelLabel=''
      />
    </div>
  </div>
);
