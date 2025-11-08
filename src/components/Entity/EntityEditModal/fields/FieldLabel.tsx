type FieldLabelProps = {
  htmlFor: string;
  label: string;
  required?: boolean;
};

export const FieldLabel = ({ htmlFor, label, required }: FieldLabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className='block text-sm font-medium text-gray-700 mb-1'
    >
      {label}
      {required && <span className='text-red-500 ml-1'>*</span>}
    </label>
  );
};
