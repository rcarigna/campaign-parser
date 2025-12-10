type FieldLabelProps = {
  htmlFor: string;
  label: string;
  required?: boolean;
};

import { Typography, Box } from '@mui/material';

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
    {required && (
      <Box component='span' sx={{ color: 'error.main', ml: 0.5 }}>
        *
      </Box>
    )}
  </Typography>
);
