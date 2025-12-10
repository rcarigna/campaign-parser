import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Checkbox, Typography, Box } from '@mui/material';

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
}: BooleanFieldProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Checkbox
      id={fieldKey}
      defaultChecked={defaultValue}
      {...register(fieldKey)}
      sx={{ mr: 1 }}
    />
    <Typography
      component='label'
      htmlFor={fieldKey}
      sx={{ fontSize: 15, color: 'text.primary', fontWeight: 500 }}
    >
      {label}
      {required && (
        <Box component='span' sx={{ color: 'error.main', ml: 0.5 }}>
          *
        </Box>
      )}
    </Typography>
  </Box>
);
