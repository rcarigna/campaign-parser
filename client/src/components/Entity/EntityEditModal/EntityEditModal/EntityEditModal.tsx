import { useState } from 'react';
import { type EntityWithId } from '../../../../types/constants';
import { getFieldsForEntityKind, isFieldRequired } from '../EntityFieldConfig';
import { FormField } from '../FormField';

type EntityEditModalProps = {
  entity: EntityWithId;
  onClose: () => void;
  onSave: (entity: EntityWithId) => void;
};

export const EntityEditModal = ({
  entity,
  onClose,
  onSave,
}: EntityEditModalProps): JSX.Element => {
  const [editedEntity, setEditedEntity] = useState<EntityWithId>({ ...entity });

  const handleFieldChange = (field: string, value: string) => {
    setEditedEntity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedEntity);
  };

  const fields = getFieldsForEntityKind(entity.kind);

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>
            Edit {entity.kind}: {entity.title}
          </h3>
          <button className='close-button' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='modal-body'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {fields.map((field) => (
              <FormField
                key={field.key}
                field={field}
                value={editedEntity[field.key]}
                onChange={handleFieldChange}
                required={isFieldRequired(entity.kind, field.key)}
              />
            ))}

            <div className='form-actions'>
              <button
                type='button'
                onClick={onClose}
                className='btn btn-secondary'
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-primary'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
