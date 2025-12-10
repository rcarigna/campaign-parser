'use client';

import { FileUpload, ActionButtons } from '@/components';
import { ALLOWED_EXTENSIONS, ProcessingWorkflowProps } from '@/types';
import { Box, Typography, Button } from '@mui/material';
import {
  SectionContainer,
  ThemedButton,
  SectionTitle,
  ThemedSpinner,
  FlexCenter,
} from '../CommonStyled';

// @to-do: split into single interesting components
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SectionContainer
          sx={{
            textAlign: 'center',
            bgcolor: 'success.lighter',
            borderColor: 'success.light',
            p: 6,
          }}
        >
          <Box sx={{ fontSize: 40, mb: 3 }}>✅</Box>
          <SectionTitle component='h3' variant='h5' sx={{ mb: 2 }}>
            Content Loaded Successfully
          </SectionTitle>
          <Typography sx={{ color: 'text.secondary', fontSize: '1rem', mb: 4 }}>
            Your document has been processed. You can view the extracted
            entities below.
          </Typography>
          <ThemedButton onClick={onReset}>
            <Typography component='span'>🔄</Typography>
            Start Over
          </ThemedButton>
        </SectionContainer>

        {/* Error Display */}
        {error && (
          <SectionContainer
            sx={{ bgcolor: 'error.lighter', borderColor: 'error.light', p: 4 }}
          >
            <FlexCenter sx={{ alignItems: 'center' }}>
              <Typography sx={{ color: 'error.main', fontWeight: 500 }}>
                ❌ Error:
              </Typography>
              <Typography sx={{ color: 'error.dark', ml: 2 }}>
                {error}
              </Typography>
            </FlexCenter>
            <ThemedButton
              onClick={onClearError}
              sx={{
                mt: 2,
                color: 'error.main',
                background: 'none',
                textDecoration: 'underline',
                fontSize: 14,
                fontWeight: 400,
                '&:hover': { color: 'error.dark', background: 'none' },
              }}
            >
              Clear Error
            </ThemedButton>
          </SectionContainer>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* File Upload Section */}
      <SectionContainer sx={{ textAlign: 'center', p: 6 }}>
        <SectionTitle component='h3' variant='h5' sx={{ mb: 4 }}>
          📤 Upload Document
        </SectionTitle>
        <FileUpload
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          error={error}
          allowedExtensions={ALLOWED_EXTENSIONS}
        />
      </SectionContainer>

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
        <SectionContainer
          sx={{ bgcolor: 'info.lighter', borderColor: 'info.light', p: 4 }}
        >
          <FlexCenter sx={{ alignItems: 'center' }}>
            <ThemedSpinner
              sx={{
                height: 20,
                width: 20,
                borderBottomWidth: 2,
                borderBottomColor: 'info.main',
                mr: 2,
              }}
            />
            <Typography sx={{ color: 'info.dark', fontWeight: 500 }}>
              {loadingMessage}
            </Typography>
          </FlexCenter>
        </SectionContainer>
      )}

      {/* Error Display */}
      {error && (
        <SectionContainer
          sx={{ bgcolor: 'error.lighter', borderColor: 'error.light', p: 4 }}
        >
          <FlexCenter sx={{ alignItems: 'center' }}>
            <Typography sx={{ color: 'error.main', fontWeight: 500 }}>
              ❌ Error:
            </Typography>
            <Typography sx={{ color: 'error.dark', ml: 2 }}>{error}</Typography>
          </FlexCenter>
          <Button
            onClick={onClearError}
            sx={{
              mt: 2,
              color: 'error.main',
              background: 'none',
              textDecoration: 'underline',
              fontSize: 14,
              fontWeight: 400,
              '&:hover': { color: 'error.dark', background: 'none' },
            }}
          >
            Clear Error
          </Button>
        </SectionContainer>
      )}
    </Box>
  );
};
