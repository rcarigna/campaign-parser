import { FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldLabel } from './FieldLabel';

type ArrayFieldProps = {
  fieldKey: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string[];
  register: UseFormRegister<FieldValues>;
};

export const ArrayField = ({
  fieldKey,
  label,
  required,
  placeholder,
  defaultValue,
  register,
}: ArrayFieldProps) => {
  const baseInputClasses =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';

  return (
    <div className='mb-4'>
      <FieldLabel htmlFor={fieldKey} label={label} required={required} />
      <input
        type='text'
        id={fieldKey}
        className={baseInputClasses}
        placeholder={placeholder}
        defaultValue={defaultValue?.join(', ') || ''}
        {...register(fieldKey)}
      />
      <small className='text-gray-500 text-xs mt-1'>
        Enter multiple values separated by commas.
      </small>
    </div>
  );
};
