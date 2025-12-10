type FieldLabelProps = {
  htmlFor: string;
  label: string;
  required?: boolean;
};

import { Typography } from '@mui/material';

export const FieldLabel = ({ htmlFor, label, required }: FieldLabelProps) => (
  <Typography
    component='label'
    htmlFor={htmlFor}
    sx={{
      display: 'block',
      fontSize: 15,
      fontWeight: 500,
      color: 'text.primary',
      mb: 1,
    }}
  >
    {label}
    {required && <span style={{ color: '#ff5252', marginLeft: 4 }}>*</span>}
  </Typography>
);
