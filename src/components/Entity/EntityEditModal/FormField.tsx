import { FieldMetadata } from '@/lib/formGenerator';
import { EntityWithId } from '@/types';
import { FieldValues, UseFormRegister } from 'react-hook-form';

export const FormField = ({
  field,
  entity,
  register,
}: {
  field: FieldMetadata;
  entity: EntityWithId;
  register: UseFormRegister<FieldValues>;
}) => {
  const baseInputClasses =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';
  const containerClasses = 'mb-4';

  switch (field.type) {
    case 'text':
      return (
        <div className={containerClasses}>
          <label htmlFor={field.key} className={labelClasses}>
            {field.label}
            {field.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <input
            type='text'
            id={field.key}
            className={baseInputClasses}
            placeholder={field.placeholder}
            defaultValue={entity[field.key as keyof EntityWithId] as string}
            {...register(field.key)}
          />
        </div>
      );
    case 'number':
      return (
        <div className={containerClasses}>
          <label htmlFor={field.key} className={labelClasses}>
            {field.label}
            {field.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <input
            type='number'
            id={field.key}
            className={baseInputClasses}
            defaultValue={
              entity[field.key as keyof EntityWithId] as unknown as number
            }
            {...register(field.key)}
          />
        </div>
      );
    case 'boolean':
      return (
        <div className={containerClasses}>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id={field.key}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              defaultChecked={
                entity[field.key as keyof EntityWithId] as unknown as boolean
              }
              {...register(field.key)}
            />
            <label
              htmlFor={field.key}
              className='ml-2 block text-sm text-gray-900'
            >
              {field.label}
              {field.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
          </div>
        </div>
      );
    case 'select':
      return (
        <div className={containerClasses}>
          <label htmlFor={field.key} className={labelClasses}>
            {field.label}
            {field.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <select
            id={field.key}
            className={baseInputClasses}
            defaultValue={entity[field.key as keyof EntityWithId] as string}
            {...register(field.key)}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    case 'textarea':
      return (
        <div className={containerClasses}>
          <label htmlFor={field.key} className={labelClasses}>
            {field.label}
            {field.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <textarea
            id={field.key}
            rows={3}
            className={baseInputClasses}
            placeholder={field.placeholder}
            defaultValue={entity[field.key as keyof EntityWithId] as string}
            {...register(field.key)}
          />
        </div>
      );
    case 'array':
      return (
        <div className={containerClasses}>
          <label htmlFor={field.key} className={labelClasses}>
            {field.label}
            {field.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <input
            type='text'
            id={field.key}
            className={baseInputClasses}
            placeholder={field.placeholder}
            defaultValue={
              (
                entity[field.key as keyof EntityWithId] as unknown as string[]
              )?.join(', ') || ''
            }
            {...register(field.key)}
          />
          <small className='text-gray-500 text-xs mt-1'>
            Enter multiple values separated by commas.
          </small>
        </div>
      );
    default:
      return (
        <div className={containerClasses}>
          <label htmlFor={field.key} className={labelClasses}>
            {field.label}
            {field.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          <input
            type='text'
            id={field.key}
            className={baseInputClasses}
            defaultValue={String(entity[field.key as keyof EntityWithId])}
            {...register(field.key)}
          />
        </div>
      );
  }
};
