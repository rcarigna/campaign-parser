import { FieldMetadata } from '@/lib/formGenerator';
import { getEntityFields, type EntityWithId } from '@/types';
// import { useForm, useFieldArray } from 'react-hook-form';

type EntityEditModalProps = {
  entity: EntityWithId;
  onClose: () => void;
  onSave: (entity: EntityWithId) => void;
};

const FormField = ({
  field,
  entity,
}: {
  field: FieldMetadata;
  entity: EntityWithId;
}) => {
  switch (field.type) {
    case 'text':
      return (
        <div className='form-group'>
          <label htmlFor={field.key}>{field.label}</label>
          <input
            type='text'
            id={field.key}
            defaultValue={entity[field.key as keyof EntityWithId] as string}
          />
        </div>
      );
    case 'number':
      return (
        <div className='form-group'>
          <label htmlFor={field.key}>{field.label}</label>
          <input
            type='number'
            id={field.key}
            defaultValue={
              entity[field.key as keyof EntityWithId] as unknown as number
            }
          />
        </div>
      );
    case 'boolean':
      return (
        <div className='form-group'>
          <label htmlFor={field.key}>{field.label}</label>
          <input
            type='checkbox'
            id={field.key}
            defaultChecked={
              entity[field.key as keyof EntityWithId] as unknown as boolean
            }
          />
        </div>
      );
    case 'select':
      return (
        <div className='form-group'>
          <label htmlFor={field.key}>{field.label}</label>
          <select
            id={field.key}
            defaultValue={entity[field.key as keyof EntityWithId] as string}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    default:
      return (
        <div className='form-group'>
          <label htmlFor={field.key}>{field.label}</label>
          <input
            type='text'
            id={field.key}
            defaultValue={String(entity[field.key as keyof EntityWithId])}
          />
        </div>
      );
  }
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
  const formFields: FieldMetadata[] = getEntityFields(entity.kind);

  return (
    <div
      className='modal-overlay'
      data-testid='modal-overlay'
      onClick={onClose}
    >
      <div
        className='modal-content'
        data-testid='modal-content'
        onClick={(e) => e.stopPropagation()}
      >
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
          {formFields.map((field) => (
            <div key={field.key} className='form-group'>
              <div>
                <label htmlFor={field.key}>{field.label}</label>
                {/* <label>input type: {field.type}</label> */}
                {/* <label>
                  default value: {entity[field.key as keyof EntityWithId]}
                </label> */}
              </div>
            </div>
          ))}
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
