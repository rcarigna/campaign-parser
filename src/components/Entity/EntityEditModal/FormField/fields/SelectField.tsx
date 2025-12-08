import { FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldLabel } from './FieldLabel';

type SelectFieldProps = {
  fieldKey: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  register: UseFormRegister<FieldValues>;
};

export const SelectField = ({
  fieldKey,
  label,
  required,
  defaultValue,
  options,
  register,
}: SelectFieldProps) => {
  const baseInputClasses =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';

  return (
    <div className='mb-4'>
      <FieldLabel htmlFor={fieldKey} label={label} required={required} />
      <select
        id={fieldKey}
        className={baseInputClasses}
        defaultValue={defaultValue}
        {...register(fieldKey)}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
