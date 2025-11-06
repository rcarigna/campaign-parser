'use client';

import { FileUpload, ActionButtons } from '@/components';
import { ALLOWED_EXTENSIONS } from '@/types';

type ProcessingWorkflowProps = {
  selectedFile: File | null;
  loading: boolean;
  error: string | null;
  hasContent: boolean; // New prop to determine if content is loaded
  onFileSelect: (file: File) => void;
  onProcess: (file: File) => Promise<void>;
  onReset: () => void;
  onClearError: () => void;
  additionalLoading?: boolean;
  additionalLoadingMessage?: string;
};

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
      <div className='space-y-6'>
        <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-center'>
          <div className='text-4xl mb-3'>✅</div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Content Loaded Successfully
          </h3>
          <p className='text-gray-600 text-sm mb-4'>
            Your document has been processed. You can view the extracted
            entities below.
          </p>
          <button
            onClick={onReset}
            className='px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors flex items-center gap-2 mx-auto'
          >
            <span>🔄</span>
            Start Over
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex items-center'>
              <span className='text-red-600 font-medium'>❌ Error:</span>
              <span className='text-red-700 ml-2'>{error}</span>
            </div>
            <button
              onClick={onClearError}
              className='mt-2 text-red-600 hover:text-red-800 text-sm underline'
            >
              Clear Error
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* File Upload Section */}
      <div>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          📤 Upload Document
        </h2>
        <FileUpload
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          error={error}
          allowedExtensions={ALLOWED_EXTENSIONS}
        />
      </div>

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
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3'></div>
            <span className='text-blue-700 font-medium'>{loadingMessage}</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <span className='text-red-600 font-medium'>❌ Error:</span>
            <span className='text-red-700 ml-2'>{error}</span>
          </div>
          <button
            onClick={onClearError}
            className='mt-2 text-red-600 hover:text-red-800 text-sm underline'
          >
            Clear Error
          </button>
        </div>
      )}
    </div>
  );
};
