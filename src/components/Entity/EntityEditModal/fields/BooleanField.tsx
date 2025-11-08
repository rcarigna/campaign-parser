import { FieldValues, UseFormRegister } from 'react-hook-form';

type BooleanFieldProps = {
  fieldKey: string;
  label: string;
  required?: boolean;
  defaultValue?: boolean;
  register: UseFormRegister<FieldValues>;
};

export const BooleanField = ({
  fieldKey,
  label,
  required,
  defaultValue,
  register,
}: BooleanFieldProps) => {
  return (
    <div className='mb-4'>
      <div className='flex items-center'>
        <input
          type='checkbox'
          id={fieldKey}
          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
          defaultChecked={defaultValue}
          {...register(fieldKey)}
        />
        <label htmlFor={fieldKey} className='ml-2 block text-sm text-gray-900'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      </div>
    </div>
  );
};
