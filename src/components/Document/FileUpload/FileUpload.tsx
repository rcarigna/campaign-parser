import { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SectionContainer, FlexCenter } from '../../Layout/CommonStyled';
import { FileUploadProps } from '@/types';

export const FileUpload = ({
  onFileSelect,
  selectedFile,
  error,
  allowedExtensions,
}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent): void => {
      event.preventDefault();
      setDragOver(false);

      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <SectionContainer
      sx={{
        p: 0,
        bgcolor: dragOver ? 'action.hover' : 'background.paper',
        borderStyle: dragOver ? 'dashed' : 'solid',
        borderColor: dragOver ? 'primary.main' : 'divider',
        transition: 'all 0.2s',
      }}
    >
      <FlexCenter
        sx={{
          minHeight: 120,
          flexDirection: 'column',
          cursor: 'pointer',
          p: 3,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box component='input' type='file' role='button' id='file-input' accept={allowedExtensions.join(',')} onChange={handleFileChange} sx={{ display: 'none' }} />
        <Typography
          component='label'
          htmlFor='file-input'
          sx={{ width: '100%', cursor: 'pointer' }}
        >
          {selectedFile ? (
            <Box>
              <Typography>Selected: {selectedFile.name}</Typography>
              <Typography>
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant='body1'>
                Click to select a file or drag and drop
              </Typography>
              <Typography variant='body1'>
                Supported formats: {allowedExtensions.join(', ')}
              </Typography>
            </Box>
          )}
        </Typography>
      </FlexCenter>
      {error && (
        <Box
          sx={{ color: 'error.main', mt: 2, textAlign: 'center', fontSize: 14 }}
        >
          {error}
        </Box>
      )}
    </SectionContainer>
  );
};
