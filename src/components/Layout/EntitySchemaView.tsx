import { EntityKind, getEntityFields } from '@/types';
import { getAllEntityMetadata } from '@/lib/utils/entity';
import { SchemaField } from './SchemaField';

type EntitySchemaViewProps = {
  entityKind: EntityKind;
  onClose: () => void;
};

export const EntitySchemaView = ({
  entityKind,
  onClose,
}: EntitySchemaViewProps) => {
  const entityTypes = getAllEntityMetadata();
  const entityMetadata = entityTypes.find((e) => e.kind === entityKind);
  const fields = getEntityFields(entityKind);
  const requiredCount = fields.filter((f) => f.required).length;
  const optionalCount = fields.filter((f) => !f.required).length;

  if (!entityMetadata) return null;

  return (
    <div className='bg-white rounded-lg border-2 border-blue-300 shadow-lg overflow-hidden'>
      {/* Schema Header */}
      <div className='bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <span className='text-3xl'>{entityMetadata.emoji}</span>
          <div>
            <h3 className='text-xl font-bold text-white'>
              {entityMetadata.label} Schema
            </h3>
            <p className='text-blue-100 text-sm'>
              Field definitions and data structure
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className='text-white hover:text-blue-100 transition-colors'
          aria-label='Close schema view'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
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

      {/* Schema Content */}
      <div className='p-6 bg-gray-50'>
        <div className='mb-4 flex items-center gap-2 text-sm text-gray-600'>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>
            Fields marked with <span className='text-red-500 font-bold'>*</span>{' '}
            are required
          </span>
        </div>

        {/* Field List */}
        <div className='space-y-3'>
          {fields.map((field) => (
            <SchemaField key={field.key} field={field} />
          ))}
        </div>
      </div>

      {/* Schema Footer */}
      <div className='bg-gray-100 px-6 py-3 border-t border-gray-200 flex items-center justify-between'>
        <div className='text-xs text-gray-500'>
          {requiredCount} required • {optionalCount} optional
        </div>
        <button
          onClick={onClose}
          className='text-sm text-blue-600 hover:text-blue-800 font-medium'
        >
          Close
        </button>
      </div>
    </div>
  );
};
