'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { loadDemoData, type DemoDataResponse } from '@/client/api';
import { Typography } from '@mui/material';
import {
  SectionContainer,
  ThemedButton,
  SectionTitle,
  ThemedSpinner,
} from '../CommonStyled';

type WelcomeSectionProps = {
  onDemoDataLoaded: (data: DemoDataResponse) => void;
};

export const WelcomeSection = ({ onDemoDataLoaded }: WelcomeSectionProps) => {
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    try {
      const demoData = await loadDemoData();
      onDemoDataLoaded(demoData);
      toast.success('Demo data loaded successfully!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load demo';
      toast.error(message);
      console.error('Demo load error:', error);
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <SectionContainer sx={{ textAlign: 'center', p: 6, mb: 6 }}>
      <SectionTitle component='h3' variant='h3'>
        🎭 Try the Demo
      </SectionTitle>
      <Typography sx={{ color: 'text.secondary', fontSize: '1rem', mb: 4 }}>
        See how the parser works with an example D&D session note that includes
        NPCs, locations, and quests.
      </Typography>
      <ThemedButton onClick={handleLoadDemo} disabled={loadingDemo}>
        {loadingDemo ? (
          <>
            <ThemedSpinner />
            Loading Demo...
          </>
        ) : (
          <>
            <Typography component='span'>🚀</Typography>
            Load Demo Session
          </>
        )}
      </ThemedButton>
    </SectionContainer>
  );
};
