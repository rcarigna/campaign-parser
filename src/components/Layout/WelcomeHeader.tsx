import { Box, Typography } from '@mui/material';

export const WelcomeHeader = () => {
  return (
    <Box
      display='flex'
      flexDirection={'column'}
      alignItems={'center'}
      textAlign={'center'}
    >
      <Box className='text-6xl mb-4'>📜</Box>
      <Typography
        variant='h2'
        className='text-2xl font-semibold text-gray-800 mb-4'
      >
        Welcome to Campaign Parser
      </Typography>
      <Typography className='text-gray-600 max-w-2xl mx-auto mb-6'>
        Upload campaign documents (.docx, .md) or try the demo to automatically
        identify and extract entities like NPCs, locations, items, and quests,
        making it easy to manage your tabletop RPG campaigns.
      </Typography>
    </Box>
  );
};
