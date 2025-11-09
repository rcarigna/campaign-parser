import React from 'react';

export type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className='modal-header'>
    <h2>{title}</h2>
    <button className='modal-close' onClick={onClose}>
      ×
    </button>
  </div>
);
