import { FieldValues, UseFormRegister } from 'react-hook-form';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';

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
}: SelectFieldProps) => (
  <FormControl fullWidth size='small' sx={{ mb: 2 }} required={required}>
    <InputLabel id={`${fieldKey}-label`}>{label}</InputLabel>
    <MuiSelect
      labelId={`${fieldKey}-label`}
      id={fieldKey}
      defaultValue={defaultValue}
      label={label}
      {...register(fieldKey)}
    >
      {options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
  </FormControl>
);
