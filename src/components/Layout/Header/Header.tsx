import { Box, Typography } from '@mui/material';

type HeaderProps = {
  title: string;
  subtitle: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <Box component='header' role='banner'>
      <Typography
        component='h1'
        className='text-3xl font-bold text-gray-900 mb-2'
      >
        {title}
      </Typography>
      <Typography className='text-gray-600 mb-8'>{subtitle}</Typography>
    </Box>
  );
};
