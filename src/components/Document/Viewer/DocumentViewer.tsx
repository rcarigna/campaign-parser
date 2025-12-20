'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { SectionContainer, SectionTitle } from '../../Layout/CommonStyled';
import { MarkdownRenderer } from '../../MarkdownRenderer/MarkdownRenderer';
import {
  type SerializedParsedDocumentWithEntities,
  DocumentType,
  MarkdownContent,
  WordDocumentContent,
} from '@/types';

type DocumentViewerProps = {
  parsedData: SerializedParsedDocumentWithEntities;
};

const DocumentViewToggle = ({
  showRaw,
  setShowRaw,
  isMarkdown,
}: {
  showRaw: boolean;
  setShowRaw: (value: boolean) => void;
  isMarkdown: boolean;
}) => {
  const showFormattedLabel = isMarkdown ? 'Formatted' : 'Rendered';
  const showRawLabel = isMarkdown ? 'Raw Markdown' : 'Plain Text';
  return (
    <ToggleButtonGroup
      value={showRaw ? 'raw' : 'formatted'}
      exclusive
      onChange={(_, value) => {
        if (value !== null) setShowRaw(value === 'raw');
      }}
    >
      <ToggleButton value='formatted'>{showFormattedLabel}</ToggleButton>
      <ToggleButton value='raw'>{showRawLabel}</ToggleButton>
    </ToggleButtonGroup>
  );
};

export const DocumentViewer = ({ parsedData }: DocumentViewerProps) => {
  const [showRaw, setShowRaw] = useState(false);

  // Extract content based on document type
  const getDisplayContent = () => {
    if (parsedData.type === DocumentType.MARKDOWN) {
      const markdownContent = parsedData.content as MarkdownContent;
      return {
        raw: markdownContent.raw || '',
        formatted: markdownContent.raw || '',
        isMarkdown: true,
      };
    } else {
      // Word document
      const wordContent = parsedData.content as WordDocumentContent;
      return {
        raw: wordContent.text || '',
        formatted: wordContent.html || wordContent.text || '',
        isMarkdown: false,
      };
    }
  };

  const { raw, formatted, isMarkdown } = getDisplayContent();

  return (
    <SectionContainer data-testid='document-viewer' sx={{ p: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          px: 4,
          pt: 4,
        }}
      >
        <Box>
          <SectionTitle component='h3' variant='h5' sx={{ mb: 1 }}>
            📄 Document Content
          </SectionTitle>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {parsedData.filename} •{' '}
            {parsedData.type === DocumentType.MARKDOWN
              ? 'Markdown'
              : 'Word Document'}
          </Typography>
        </Box>
        <DocumentViewToggle
          showRaw={showRaw}
          setShowRaw={setShowRaw}
          isMarkdown={isMarkdown}
        />
      </Box>

      {showRaw ? (
        <Box
          component='pre'
          sx={{
            p: 4,
            fontFamily: 'monospace',
            fontSize: 14,
            bgcolor: 'background.default',
            borderRadius: 2,
            mt: 2,
            overflowX: 'auto',
          }}
        >
          {raw}
        </Box>
      ) : (
        <Box sx={{ p: 4 }}>
          {isMarkdown ? (
            <MarkdownRenderer markdown={formatted} />
          ) : (
            <Box
              sx={{
                fontFamily: 'inherit',
                fontSize: 15,
                color: 'text.primary',
                maxWidth: '100%',
              }}
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          )}
        </Box>
      )}
    </SectionContainer>
  );
};
