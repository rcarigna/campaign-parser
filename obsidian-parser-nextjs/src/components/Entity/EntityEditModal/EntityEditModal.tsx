import { type EntityWithId } from '@/types';

type EntityEditModalProps = {
  entity: EntityWithId;
  onClose: () => void;
  onSave: (entity: EntityWithId) => void;
};

export const EntityEditModal = ({
  entity,
  onClose,
  onSave,
}: EntityEditModalProps) => {
  const handleSave = () => {
    // TODO: Implement entity editing functionality
    onSave(entity);
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>Edit Entity: {entity.title}</h3>
          <button className='close-button' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <p>Entity editing functionality coming soon...</p>
          <p>
            <strong>Type:</strong> {entity.kind}
          </p>
          <p>
            <strong>Title:</strong> {entity.title}
          </p>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-secondary' onClick={onClose}>
            Cancel
          </button>
          <button className='btn btn-primary' onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
