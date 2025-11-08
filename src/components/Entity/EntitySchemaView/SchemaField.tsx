import type { FieldMetadata } from '@/types';
import type { EntityKind } from '@/types';
import { generateFieldModificationIssueUrl } from '@/lib/utils/github';

type SchemaFieldProps = {
  field: FieldMetadata;
  entityKind: EntityKind;
};

export const SchemaField = ({ field, entityKind }: SchemaFieldProps) => {
  const handleSuggestEdit = () => {
    const url = generateFieldModificationIssueUrl(entityKind, field);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors select-none'>
      <div className='flex items-start justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <code className='text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded select-text'>
            {field.key}
          </code>
          {field.required && (
            <span className='text-red-500 font-bold text-lg leading-none'>
              *
            </span>
          )}
        </div>
        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700'>
          {field.type}
        </span>
      </div>

      <div className='text-sm text-gray-700 mb-2 select-text'>
        {field.label}
      </div>

      {field.placeholder && (
        <div className='text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded border-l-2 border-gray-300 select-text'>
          Example: {field.placeholder}
        </div>
      )}

      {field.options && field.options.length > 0 && (
        <div className='mt-2'>
          <div className='text-xs font-medium text-gray-600 mb-1'>
            Allowed values:
          </div>
          <div className='flex flex-wrap gap-1'>
            {field.options.map((opt) => (
              <span
                key={opt.value}
                className='inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 select-text'
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggest Edit Button */}
      <div className='mt-3 pt-3 border-t border-gray-200'>
        <button
          onClick={handleSuggestEdit}
          className='flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors'
          aria-label={`Suggest edit for ${field.key} field`}
        >
          <svg
            className='w-3.5 h-3.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
            />
          </svg>
          Suggest Edit
        </button>
      </div>
    </div>
  );
};
