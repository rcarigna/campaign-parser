import { FieldMetadata } from '@/lib/utils/form';
import { getEntityFields, type EntityWithId, EntityKind } from '@/types';
import { FormField } from './FormField';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { getAllEntityMetadata } from '@/lib/utils/entity';

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
  const [entityKind, setEntityKind] = useState<EntityKind>(entity.kind);
  const formFields: FieldMetadata[] = getEntityFields(entityKind);
  const { register, handleSubmit } = useForm();
  const entityTypes = getAllEntityMetadata();

  const handleSave = (data: Record<string, unknown>) => {
    const updatedEntity = {
      ...entity,
      ...data,
      kind: entityKind, // Update the kind
    } as EntityWithId;
    console.log('Saving entity:', updatedEntity);
    onSave(updatedEntity);
  };

  return (
    <div
      className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4'
      data-testid='modal-overlay'
      onClick={onClose}
    >
      <div
        className='relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden'
        data-testid='modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(handleSave)}>
          {/* Header */}
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-900'>
                Edit Entity: {entity.title}
              </h3>
              <button
                className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
                onClick={onClose}
                aria-label='Close modal'
                data-testid='close-button'
                type='button'
              >
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className='px-6 py-4 overflow-y-auto max-h-[60vh]'>
            {/* Entity Type Selector */}
            <div className='mb-6 pb-4 border-b border-gray-200'>
              <label
                htmlFor='entity-type'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Entity Type{' '}
                {entityKind !== entity.kind && (
                  <span className='text-orange-600 text-xs ml-2'>
                    (Changed from {entity.kind})
                  </span>
                )}
              </label>
              <select
                id='entity-type'
                value={entityKind}
                onChange={(e) => setEntityKind(e.target.value as EntityKind)}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
              >
                {entityTypes.map((type) => (
                  <option key={type.kind} value={type.kind}>
                    {type.emoji} {type.label}
                  </option>
                ))}
              </select>
              {entityKind !== entity.kind && (
                <p className='mt-2 text-xs text-orange-600'>
                  ⚠️ Changing entity type will preserve existing fields where
                  possible, but some fields may be lost if they don&apos;t exist
                  in the new type.
                </p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {formFields.map((field) => (
                <div
                  key={field.key}
                  className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                >
                  <FormField
                    field={field}
                    entity={entity}
                    register={register}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className='bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-3'>
            <button
              className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
              onClick={onClose}
              type='button'
            >
              Cancel
            </button>
            <button
              className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
              type='submit'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
