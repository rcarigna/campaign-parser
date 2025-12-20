import { ThemedButton, FlexCenter } from '../../Layout/CommonStyled';
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
      <ThemedButton onClick={onReset} color='secondary' variant='outlined'>
        Reset
      </ThemedButton>
    </FlexCenter>
  );
};
