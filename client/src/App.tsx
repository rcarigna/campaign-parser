import { useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import { Header, FileUpload, ActionButtons, ParsedResults } from './components';

// Hooks
import { useCampaignParser, useFileManager } from './hooks';

// Constants
import { ALLOWED_EXTENSIONS } from './types/constants';

// Arrow function component as per guidelines
export const App = (): JSX.Element => {
  const fileManager = useFileManager();
  const campaignParser = useCampaignParser();

  const handleReset = useCallback((): void => {
    fileManager.clearFile();
    campaignParser.clearResults();
  }, [fileManager, campaignParser]);

  // Show file errors or processing errors, prioritizing file errors
  const displayError = fileManager.error || campaignParser.error;

  return (
    <div className='App'>
      <Header
        title='Document Parser'
        subtitle='Upload DOC/DOCX or Markdown files to see their JSON representation'
      />

      <main>
        <FileUpload
          onFileSelect={fileManager.selectFile}
          selectedFile={fileManager.selectedFile}
          error={displayError}
          allowedExtensions={ALLOWED_EXTENSIONS}
        />

        <ActionButtons
          selectedFile={fileManager.selectedFile}
          loading={campaignParser.loading}
          onProcess={campaignParser.processDocument}
          onReset={handleReset}
        />

        <ParsedResults
          parsedData={campaignParser.parsedData}
          entities={campaignParser.entities}
          onEntityDiscard={campaignParser.discardEntity}
        />
      </main>

      {/* Toast notifications */}
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};
