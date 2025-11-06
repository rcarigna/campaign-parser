'use client';

import { FileUpload, ActionButtons } from '@/components';
import { ALLOWED_EXTENSIONS } from '@/types';

type ProcessingWorkflowProps = {
  selectedFile: File | null;
  loading: boolean;
  error: string | null;
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
