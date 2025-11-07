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
  switch (field.type) {
    case 'text':
      return (
        <div className='form-group'>
          <label htmlFor={field.key}>{field.label}</label>
          <input
            type='text'
            id={field.key}
            defaultValue={entity[field.key as keyof EntityWithId] as string}
            {...register(field.key)}
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
            {...register(field.key)}
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
            {...register(field.key)}
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
        <div className='form-group'>
          <label htmlFor={field.key}>{field.label}</label>
          <textarea
            id={field.key}
            defaultValue={entity[field.key as keyof EntityWithId] as string}
            {...register(field.key)}
          />
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
            {...register(field.key)}
          />
        </div>
      );
  }
};
