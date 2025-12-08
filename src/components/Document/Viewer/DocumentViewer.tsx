'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
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
    <Box className='document-viewer'>
      <Box className='document-header'>
        <Box className='document-header-info'>
          <Typography variant='h3' className='document-title'>
            📄 Document Content
          </Typography>
          <Typography variant='body2' className='document-meta'>
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
        <Box component='pre' className='document-raw-content'>
          {raw}
        </Box>
      ) : (
        <Box className='document-formatted-content'>
          {isMarkdown ? (
            <MarkdownRenderer markdown={formatted} />
          ) : (
            <Box
              className='prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};
