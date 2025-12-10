'use client';

import MuiRootProvider from '@/components/MuiRootProvider';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const NotFound = () => {
  return (
    <MuiRootProvider>
      <Box
        minHeight='100vh'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        bgcolor='background.default'
        color='text.primary'
      >
        <Typography variant='h2' gutterBottom>
          404: Page Not Found
        </Typography>
        <Typography variant='body1' mb={4}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button component={Link} href='/' variant='contained' color='primary'>
          Go Home
        </Button>
      </Box>
    </MuiRootProvider>
  );
};

export default NotFound;
