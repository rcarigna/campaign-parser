'use client';

import { useState } from 'react';
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';
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
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-xl font-semibold text-gray-800'>
            📄 Document Content
          </h3>
          <p className='text-sm text-gray-600 mt-1'>
            {parsedData.filename} •{' '}
            {parsedData.type === DocumentType.MARKDOWN
              ? 'Markdown'
              : 'Word Document'}
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => setShowRaw(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showRaw
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isMarkdown ? 'Formatted' : 'Rendered'}
          </button>
          <button
            onClick={() => setShowRaw(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showRaw
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isMarkdown ? 'Raw Markdown' : 'Plain Text'}
          </button>
        </div>
      </div>

      {showRaw ? (
        <pre className='bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm text-gray-800 whitespace-pre-wrap max-h-96 overflow-y-auto'>
          {raw}
        </pre>
      ) : (
        <div className='bg-gray-50 rounded-lg p-4 overflow-y-auto max-h-96'>
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
