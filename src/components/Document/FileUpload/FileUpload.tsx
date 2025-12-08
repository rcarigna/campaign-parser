import { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
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
    <>
      <Box
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type='file'
          role='button'
          id='file-input'
          accept={allowedExtensions.join(',')}
          onChange={handleFileChange}
          className='file-input-hidden'
        />
        <Typography
          component='label'
          htmlFor='file-input'
          className='file-input-label'
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
      </Box>

      {error && <Box className='error'>{error}</Box>}
    </>
  );
};
