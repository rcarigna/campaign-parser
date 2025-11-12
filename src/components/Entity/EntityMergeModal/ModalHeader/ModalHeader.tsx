import React from 'react';
import { ModalHeaderProps } from '@/types';

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className='modal-header'>
    <h2>{title}</h2>
    <button className='modal-close' onClick={onClose}>
      ×
    </button>
  </div>
);
