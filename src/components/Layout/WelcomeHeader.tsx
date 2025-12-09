import { Box, Typography } from '@mui/material';
import { SectionTitle } from './CommonStyled';

export const WelcomeHeader = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      textAlign='center'
    >
      <SectionTitle component='h2' variant='h2' sx={{ mb: 4 }}>
        📜 Welcome to Campaign Parser
      </SectionTitle>
      <Typography
        sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 6 }}
      >
        Upload campaign documents (.docx, .md) or try the demo to automatically
        identify and extract entities like NPCs, locations, items, and quests,
        making it easy to manage your tabletop RPG campaigns.
      </Typography>
    </Box>
  );
};
