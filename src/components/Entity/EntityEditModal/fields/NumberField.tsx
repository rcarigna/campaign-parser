import { FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldLabel } from './FieldLabel';

type NumberFieldProps = {
  fieldKey: string;
  label: string;
  required?: boolean;
  defaultValue?: number;
  register: UseFormRegister<FieldValues>;
};

export const NumberField = ({
  fieldKey,
  label,
  required,
  defaultValue,
  register,
}: NumberFieldProps) => {
  const baseInputClasses =
    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';

  return (
    <div className='mb-4'>
      <FieldLabel htmlFor={fieldKey} label={label} required={required} />
      <input
        type='number'
        id={fieldKey}
        className={baseInputClasses}
        defaultValue={defaultValue}
        {...register(fieldKey)}
      />
    </div>
  );
};
