'use client';

import { useState } from 'react';
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
    <div className='document-viewer'>
      <div className='document-header'>
        <div className='document-header-info'>
          <h3 className='document-title'>📄 Document Content</h3>
          <p className='document-meta'>
            {parsedData.filename} •{' '}
            {parsedData.type === DocumentType.MARKDOWN
              ? 'Markdown'
              : 'Word Document'}
          </p>
        </div>
        <div className='document-header-controls'>
          <button
            onClick={() => setShowRaw(false)}
            className={`document-toggle-btn ${!showRaw ? 'active' : ''}`}
          >
            {isMarkdown ? 'Formatted' : 'Rendered'}
          </button>
          <button
            onClick={() => setShowRaw(true)}
            className={`document-toggle-btn ${showRaw ? 'active' : ''}`}
          >
            {isMarkdown ? 'Raw Markdown' : 'Plain Text'}
          </button>
        </div>
      </div>

      {showRaw ? (
        <pre className='document-raw-content'>{raw}</pre>
      ) : (
        <div className='document-formatted-content'>
          {isMarkdown ? (
            <MarkdownRenderer markdown={formatted} />
          ) : (
            <div
              className='prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          )}
        </div>
      )}
    </div>
  );
};
