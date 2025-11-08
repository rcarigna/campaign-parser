import type { FieldMetadata } from '@/lib/utils/form';

type SchemaFieldProps = {
  field: FieldMetadata;
};

export const SchemaField = ({ field }: SchemaFieldProps) => {
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
    </div>
  );
};
