import { FieldValues, UseFormRegister } from 'react-hook-form';
import { TextField as MuiTextField, Typography } from '@mui/material';

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
}: ArrayFieldProps) => (
  <>
    <MuiTextField
      id={fieldKey}
      label={label}
      required={required}
      variant='outlined'
      size='small'
      fullWidth
      placeholder={placeholder}
      defaultValue={defaultValue?.join(', ') || ''}
      {...register(fieldKey)}
      sx={{ mb: 1 }}
    />
    <Typography variant='caption' sx={{ color: 'text.secondary', ml: 1 }}>
      Enter multiple values separated by commas.
    </Typography>
  </>
);
