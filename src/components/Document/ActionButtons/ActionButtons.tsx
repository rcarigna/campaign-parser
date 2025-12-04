import { Button, Box } from '@mui/material';
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
    return <div className='actions'></div>;
  }

  return (
    <Box className='actions'>
      <Button onClick={handleProcess} disabled={loading} className='upload-btn'>
        {loading ? 'Parsing...' : 'Parse Document'}
      </Button>
      <Button onClick={onReset} className='reset-btn'>
        Reset
      </Button>
    </Box>
  );
};
