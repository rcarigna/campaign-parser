import { FieldValues, UseFormRegister } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';

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
}: NumberFieldProps) => (
  <MuiTextField
    id={fieldKey}
    label={label}
    required={required}
    variant='outlined'
    size='small'
    fullWidth
    type='number'
    defaultValue={defaultValue}
    {...register(fieldKey)}
    sx={{ mb: 2 }}
  />
);
