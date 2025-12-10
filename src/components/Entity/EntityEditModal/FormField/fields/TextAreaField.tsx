import { FieldValues, UseFormRegister } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';

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
}: TextAreaFieldProps) => (
  <MuiTextField
    id={fieldKey}
    required={required}
    label={label}
    variant='outlined'
    size='small'
    fullWidth
    multiline
    rows={rows}
    placeholder={placeholder}
    defaultValue={defaultValue}
    {...register(fieldKey)}
    sx={{ mb: 2 }}
  />
);
