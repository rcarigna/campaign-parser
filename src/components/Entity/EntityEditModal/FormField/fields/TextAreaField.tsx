import { FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldLabel } from './FieldLabel';

export type TextAreaFieldProps = {
  fieldKey: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  register: UseFormRegister<FieldValues>;
};

export const TextAreaField = ({
  fieldKey,
  label,
  required,
  placeholder,
  defaultValue,
  rows = 3,
  register,
}: TextAreaFieldProps) => {
  const baseInputClasses =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';

  return (
    <div className='mb-4'>
      <FieldLabel htmlFor={fieldKey} label={label} required={required} />
      <textarea
        id={fieldKey}
        rows={rows}
        className={baseInputClasses}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(fieldKey)}
      />
    </div>
  );
};
