import { FieldValues, UseFormRegister } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';

type TextFieldProps = {
  fieldKey: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  register: UseFormRegister<FieldValues>;
};

export const TextField = ({
  fieldKey,
  label,
  required,
  placeholder,
  defaultValue,
  register,
}: TextFieldProps) => (
  <MuiTextField
    id={fieldKey}
    label={label}
    required={required}
    variant='outlined'
    size='small'
    fullWidth
    placeholder={placeholder}
    defaultValue={defaultValue}
    {...register(fieldKey)}
    sx={{ mb: 2 }}
  />
);
