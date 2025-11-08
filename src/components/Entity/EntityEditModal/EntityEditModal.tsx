import { FieldMetadata } from '@/lib/formGenerator';
import { getEntityFields, type EntityWithId } from '@/types';
import { FormField } from './FormField';
import { useForm } from 'react-hook-form';

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
  const formFields: FieldMetadata[] = getEntityFields(entity.kind);
  const { register, handleSubmit } = useForm();

  const handleSave = (data: Record<string, unknown>) => {
    const updatedEntity: EntityWithId = {
      ...entity,
      ...data,
    };
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
                Edit{' '}
                {entity.kind.charAt(0).toUpperCase() + entity.kind.slice(1)}:{' '}
                {entity.title}
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
