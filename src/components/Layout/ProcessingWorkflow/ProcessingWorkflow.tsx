'use client';

import { FileUpload, ActionButtons } from '@/components';
import { ALLOWED_EXTENSIONS, ProcessingWorkflowProps } from '@/types';
import { Box, Typography, Button } from '@mui/material';

export const ProcessingWorkflow = ({
  selectedFile,
  loading,
  error,
  hasContent,
  onFileSelect,
  onProcess,
  onReset,
  onClearError,
  additionalLoading = false,
  additionalLoadingMessage = '',
}: ProcessingWorkflowProps) => {
  const isLoading = loading || additionalLoading;
  const loadingMessage =
    additionalLoading && additionalLoadingMessage
      ? additionalLoadingMessage
      : 'Processing document... This may take a few moments.';

  // If we have content, show reset button instead of upload
  if (hasContent) {
    return (
      <Box className='space-y-6'>
        <Box className='bg-green-50 border border-green-200 rounded-lg p-6 text-center'>
          <Box className='text-4xl mb-3'>✅</Box>
          <Typography
            variant='h3'
            className='text-lg font-semibold text-gray-800 mb-2'
          >
            Content Loaded Successfully
          </Typography>
          <Typography className='text-gray-600 text-sm mb-4'>
            Your document has been processed. You can view the extracted
            entities below.
          </Typography>
          <Button
            onClick={onReset}
            className='px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors flex items-center gap-2 mx-auto'
          >
            <Typography>🔄</Typography>
            Start Over
          </Button>
        </Box>

        {/* Error Display */}
        {error && (
          <Box className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <Box className='flex items-center'>
              <Typography className='text-red-600 font-medium'>
                ❌ Error:
              </Typography>
              <Typography className='text-red-700 ml-2'>{error}</Typography>
            </Box>
            <Button
              onClick={onClearError}
              className='mt-2 text-red-600 hover:text-red-800 text-sm underline'
            >
              Clear Error
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box className='space-y-6'>
      {/* File Upload Section */}
      <Box>
        <Typography
          variant='h3'
          className='text-xl font-semibold text-gray-800 mb-4 display-flex items-center'
        >
          📤 Upload Document
        </Typography>
        <FileUpload
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          error={error}
          allowedExtensions={ALLOWED_EXTENSIONS}
        />
      </Box>

      {/* Action Buttons */}
      {selectedFile && (
        <ActionButtons
          selectedFile={selectedFile}
          loading={loading}
          onProcess={onProcess}
          onReset={onReset}
        />
      )}

      {/* Processing Status */}
      {isLoading && (
        <Box className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <Box className='flex items-center'>
            <Box className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3'></Box>
            <Typography className='text-blue-700 font-medium'>
              {loadingMessage}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Box className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <Box className='flex items-center'>
            <Typography className='text-red-600 font-medium'>
              ❌ Error:
            </Typography>
            <Typography className='text-red-700 ml-2'>{error}</Typography>
          </Box>
          <Button
            onClick={onClearError}
            className='mt-2 text-red-600 hover:text-red-800 text-sm underline'
          >
            Clear Error
          </Button>
        </Box>
      )}
    </Box>
  );
};
