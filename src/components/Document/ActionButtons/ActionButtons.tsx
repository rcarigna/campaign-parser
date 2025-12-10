import { ThemedButton, FlexCenter } from '../../Layout/CommonStyled';
import { Button } from '@mui/material';
import { ActionButtonsProps } from '@/types';

export const ActionButtons = ({
  selectedFile,
  loading,
  onProcess,
  onReset,
}: ActionButtonsProps) => {
  const handleProcess = () => {
    if (selectedFile) {
      onProcess(selectedFile);
    }
  };

  if (!selectedFile) {
    return <FlexCenter />;
  }

  return (
    <FlexCenter sx={{ gap: 2, mt: 2 }}>
      <ThemedButton onClick={handleProcess} disabled={loading}>
        {loading ? 'Parsing...' : 'Parse Document'}
      </ThemedButton>
      <Button
        onClick={onReset}
        variant='outlined'
        color='secondary'
        sx={{
          px: 3,
          py: 1.5,
          borderRadius: (theme) => theme.shape.borderRadius,
          fontWeight: 500,
        }}
      >
        Reset
      </Button>
    </FlexCenter>
  );
};
