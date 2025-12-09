import { Box, Typography } from '@mui/material';
import { SectionTitle } from '../CommonStyled';

type HeaderProps = {
  title: string;
  subtitle: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <Box component='header' role='banner'>
      <SectionTitle component='h1' variant='h3' sx={{ mb: 2 }}>
        {title}
      </SectionTitle>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        {subtitle}
      </Typography>
    </Box>
  );
};
